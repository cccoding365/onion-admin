<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import Sidebar from "../components/Sidebar.vue";
import TopNav from "../components/TopNav.vue";
import Breadcrumb from "../components/Breadcrumb.vue";
import Tabs from "../components/Tabs.vue";
import { useAppStore } from "../stores/app";
import { useUserStore } from "../stores/user";
import { useNotificationsStore } from "../stores/notifications";
import { useRoute } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { useI18n } from "vue-i18n";
import { ElNotification } from "element-plus";
const { t, locale } = useI18n({ useScope: "global" });

const app = useAppStore();
const user = useUserStore();
const noti = useNotificationsStore();
const route = useRoute();
const localeMap = { "zh-CN": zhCn, en };

let lastVisibility = document.visibilityState;
function handleVisibilityChange() {
  const current = document.visibilityState;
  // 仅在从 hidden/paused 返回到 visible 时触发
  if (current === "visible" && lastVisibility !== "visible") {
    try {
      if (user.token && noti.globalReturnNotifyEnabled) {
        const username =
          user.currentUser?.nickname || user.currentUser?.username || "";
        ElNotification({
          message: t("notify.returnBackMessage", { username }),
          position: "bottom-right",
          type: "success",
          duration: 3500,
        });
      }
    } catch (e) {
      console.warn("Return-back notification failed:", e);
    }
  }
  lastVisibility = current;
}

onMounted(() => {
  lastVisibility = document.visibilityState;
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<template>
  <el-config-provider :locale="localeMap[app.locale]">
    <el-container class="app-layout">
      <el-aside :width="app.collapsed ? '64px' : '200px'" class="sidebar">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 100%;
            "
          >
            <Breadcrumb />
            <TopNav />
          </div>
        </el-header>
        <!-- <Tabs /> -->
        <el-main>
          <RouterView />
        </el-main>
        <!-- <el-footer>
          <div class="footer-content">
            <span>{{ t('footer.copyright') }}</span>
          </div>
        </el-footer> -->
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<style scoped>
/* 可在此处追加局部样式 */
.app-layout { height: 100vh; }
.sidebar {
  overflow-y: auto;
  overflow-x: hidden;
  /* 隐藏滚动条但保留滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.sidebar::-webkit-scrollbar {
  width: 0 !important; /* Chrome/Safari */
  height: 0 !important;
}
.el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}
</style>
