<script setup>
import { useTabsStore } from "../stores/tabs";
import { useRoute, useRouter } from "vue-router";
import { watch } from "vue";
import { useI18n } from "vue-i18n";

const tabs = useTabsStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

watch(
  () => route.path,
  () => {
    tabs.addTab(route);
  },
  { immediate: true }
);

function onTabClick(name) {
  router.push(name);
}

function onTabRemove(name) {
  tabs.removeTab(name);
  if (tabs.active && tabs.active !== name) {
    router.push(tabs.active);
  }
}
</script>

<template>
  <el-tabs
    v-model="tabs.active"
    type="border-card"
    @tab-click="(pane) => onTabClick(pane.paneName)"
    @tab-remove="onTabRemove"
  >
    <el-tab-pane
      v-for="item in tabs.visited"
      :key="item.path"
      :name="item.path"
      :label="t(item.titleKey)"
      closable
    />
  </el-tabs>
</template>

<style scoped>
</style>
