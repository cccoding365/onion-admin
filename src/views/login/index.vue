<template>
    <div class="flex justify-center items-center bg-[#0399b0] inset-0 fixed p-3">
        <el-card>
            <el-image class="max-w-xs" :src="logoUrl" />
            <el-form :model="form" label-width="auto">
                <el-form-item>
                    <el-input prefix-icon="User" v-model="form.account" />
                </el-form-item>
                <el-form-item>
                    <el-input type="password" show-password prefix-icon="Lock" v-model="form.password" />
                </el-form-item>
                <el-form-item>
                    <el-button class="w-full" size="large" type="primary" @click="onSubmit">登录/注册</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";

import logoUrl from "@/assets/logo-white.png";

const form = reactive({
    account: "admin",
    password: "admin"
});

const router = useRouter();

const onSubmit = () => {
    router.push({ path: "/" });
    ElMessage({
        message: "登录成功",
        type: "success"
    });
};
</script>
