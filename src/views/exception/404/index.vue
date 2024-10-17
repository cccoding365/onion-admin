<template>
    <div class="flex flex-col justify-center items-center h-full">
        <el-image class="w-1/4" :src="_404Url" />
        <el-button class="mt-5" type="primary" @click="onBack">返回</el-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import _404Url from "@/assets/404.svg";
const router = useRouter();
const onBack = () => {
    router.back();
};
</script>
