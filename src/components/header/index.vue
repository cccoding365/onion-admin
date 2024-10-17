<template>
    <el-header class="flex items-center justify-end gap-3 border-b">
        <el-image class="w-[30px] h-[30px] mr-auto" src="/favicon.svg"></el-image>
        <div class="hidden md:block">
            <el-button circle icon="Search" @click="dialogVisible = true" />
            <el-button circle icon="Message" />
            <el-button circle icon="FullScreen" @click="toggleFullScreen" />
            <el-button circle icon="Setting" @click="drawer = true" />
        </div>
        <el-dropdown trigger="click" placement="bottom-end">
            <el-avatar :size="40" :src="avatarUrl" />
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item icon="User">个人信息</el-dropdown-item>
                    <el-dropdown-item icon="Switch">切换身份</el-dropdown-item>
                    <el-dropdown-item>
                        <RouterLink to="/login">
                            <el-button icon="SwitchButton" type="danger" plain>退出登录</el-button>
                        </RouterLink>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </el-header>
    <el-dialog v-model="dialogVisible" title="搜索" width="500">
        <el-input v-model="searchValue" placeholder="请输入搜索内容" prefix-icon="Search" />
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
            </div>
        </template>
    </el-dialog>
    <el-drawer v-model="drawer" title="全局配置" :with-header="true">
        <span>Hi there!</span>
    </el-drawer>
</template>

<script setup lang="ts">
import avatarUrl from "@/assets/avatar.png";
import { useFullscreen } from "@vueuse/core";
const dialogVisible = ref(false);
const searchValue = ref("");
const drawer = ref(false);

const { toggle: toggleFullScreen } = useFullscreen();
</script>
