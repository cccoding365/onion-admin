<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import dayjs from 'dayjs'
import { Male, Female, UserFilled } from '@element-plus/icons-vue'

const { t } = useI18n({ useScope: "global" });
const user = useUserStore();

const nickname = ref(
  user.currentUser?.nickname || user.currentUser?.username || ""
);
const avatar = ref(user.currentUser?.avatar || "");
const age = ref(typeof user.currentUser?.age === 'number' ? user.currentUser.age : 18);
const gender = ref(user.currentUser?.gender || 'other');

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

function onAvatarFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    avatar.value = reader.result;
  };
  reader.readAsDataURL(file);
}

function saveProfile() {
  try {
    if (age.value < 0 || age.value > 120) {
      ElMessage.error(t('common.invalidAgeRange'))
      return
    }
    user.updateProfile({ nickname: nickname.value, avatar: avatar.value, age: age.value, gender: gender.value });
    ElMessage.success(t("profile.saved"));
  } catch (e) {
    ElMessage.error(e?.message || String(e));
  }
}

function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.error(t("profile.passwordMismatch"));
    return;
  }
  try {
    user.changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    ElMessage.success(t("profile.passwordChanged"));
  } catch (e) {
    ElMessage.error(e?.message || String(e));
  }
}
</script>

<template>
  <div
    style="display: flex; flex-direction: column; gap: 24px; flex-wrap: wrap"
  >
    <el-card style="flex: 1; min-width: 280px">
      <template #header>
        <span>{{ t("profile.basic") }}</span>
      </template>
      <el-form label-position="top">
        <el-form-item :label="t('profile.avatar')">
          <div style="display: flex;flex-direction: column; align-items: start; gap: 12px">
            <el-avatar :size="64" :src="avatar || undefined">
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
            <el-input
              v-model="avatar"
              :placeholder="t('profile.avatarPlaceholder')"
            />
            <input type="file" accept="image/*" @change="onAvatarFile" />
          </div>
        </el-form-item>
        <el-form-item :label="t('profile.nickname')">
          <el-input v-model="nickname" />
        </el-form-item>
        <el-form-item :label="t('profile.age')">
          <el-input-number v-model="age" :min="0" :max="120" />
        </el-form-item>
        <el-form-item :label="t('profile.gender')">
          <el-select v-model="gender" style="width:160px;">
            <el-option value="male">
              <div style="display:flex;align-items:center;gap:6px;">
                <el-icon><Male /></el-icon>{{ t('common.genderMale') }}
              </div>
            </el-option>
            <el-option value="female">
              <div style="display:flex;align-items:center;gap:6px;">
                <el-icon><Female /></el-icon>{{ t('common.genderFemale') }}
              </div>
            </el-option>
            <el-option value="other">
              <div style="display:flex;align-items:center;gap:6px;">
                <el-icon><UserFilled /></el-icon>{{ t('common.genderOther') }}
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="saveProfile">{{
          t("profile.save")
        }}</el-button>
      </el-form>
    </el-card>

    <el-card style="flex: 1; min-width: 280px">
      <template #header>
        <span>{{ t("profile.security") }}</span>
      </template>
      <el-form label-position="top">
        <el-form-item :label="t('profile.currentPassword')">
          <el-input
            v-model="currentPassword"
            type="password"
            autocomplete="current-password"
          />
        </el-form-item>
        <el-form-item :label="t('profile.newPassword')">
          <el-input
            v-model="newPassword"
            type="password"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item :label="t('profile.confirmPassword')">
          <el-input
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-button type="primary" @click="changePassword">{{
          t("profile.changePassword")
        }}</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped></style>
