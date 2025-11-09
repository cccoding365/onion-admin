<script setup>
import { useAppStore } from "../stores/app";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import { FullScreen, Sunny, Moon } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessageBox } from "element-plus";

const app = useAppStore();
const user = useUserStore();
const router = useRouter();
const color = ref(app.primaryColor);
// 使用全局 i18n 作用域，保证切换语言立即影响所有组件
const { t, locale } = useI18n({ useScope: "global" });

watch(color, (val) => app.setPrimaryColor(val));

async function logout() {
  try {
    await ElMessageBox.confirm(
      "确认要退出登录吗？",
      "提示",
      {
        type: "warning",
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        closeOnClickModal: true,
      }
    );
    user.logout();
    router.push("/auth");
  } catch (e) {
    // 用户取消，不做处理
  }
}
</script>

<template>
  <div class="header-actions">
    <el-color-picker
      v-model="color"
      show-alpha
      :predefine="['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />

    <el-select
      v-model="app.locale"
      style="width: 120px"
      @change="
        (val) => {
          app.setLocale(val);
          locale.value = val;
        }
      "
    >
      <el-option label="中文" value="zh-CN" />
      <el-option label="English" value="en" />
    </el-select>

    <div class="header-right">
      <el-tooltip
        :content="app.isDark ? t('actions.dark') : t('actions.light')"
        placement="bottom"
      >
        <el-button
          text
          circle
          aria-label="toggle theme"
          @click="app.toggleDark()"
        >
          <el-icon>
            <component :is="app.isDark ? Moon : Sunny" />
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-button text circle aria-label="toggle fullscreen" @click="app.toggleFullscreen">
        <el-icon><FullScreen /></el-icon>
      </el-button>

      <template v-if="user.token">
        <el-divider direction="vertical" />
        <el-dropdown>
          <span
            class="el-dropdown-link"
            style="display: flex; align-items: center; gap: 8px"
          >
            <el-avatar :size="28" :src="user.currentUser?.avatar || undefined">
              {{
                (
                  user.currentUser?.nickname ||
                  user.currentUser?.username ||
                  "U"
                )
                  .slice(0, 1)
                  .toUpperCase()
              }}
            </el-avatar>
            <span>{{
              user.currentUser?.nickname || user.currentUser?.username
            }}</span>
            <el-tag size="small" type="info">{{
              user.currentUser?.role
            }}</el-tag>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/profile')">{{
                t("profile.title")
              }}</el-dropdown-item>
              <el-dropdown-item @click="logout">{{
                t("auth.logout")
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else>
        <el-divider direction="vertical" />
        <el-button type="primary" text @click="router.push('/auth')">{{
          t("auth.login")
        }}</el-button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
