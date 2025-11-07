<script setup>
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Fold, Expand, FullScreen } from "@element-plus/icons-vue";
import { useAppStore } from "../stores/app";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const app = useAppStore();

function go(path) {
  router.push(path);
}
</script>

<template>
  <div style="display: flex; align-items: center; gap: 12px;">
    <el-button text @click="app.toggleCollapse()">
      <el-icon>
        <component :is="app.collapsed ? Expand : Fold" />
      </el-icon>
    </el-button>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="m in route.matched"
        :key="m.path"
        :to="{ path: m.path }"
      >
        {{ t(m.meta?.titleKey || "breadcrumb.home") }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped></style>
