<template>
    <router-view v-slot="{ Component }">
        <transition>
            <el-main>
                <component :is="Component" />
            </el-main>
        </transition>
    </router-view>
</template>
