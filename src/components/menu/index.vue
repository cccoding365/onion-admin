<template>
    <el-menu
        class="flex-shrink-0 w-[220px] h-full"
        active-text-color="#77d55d"
        background-color="#000c17"
        text-color="#fff"
        :router="false"
        :collapse="isCollapse"
        @select="handleSelect"
    >
        <el-scrollbar>
            <el-menu-item index="/dashboard">
                <el-icon><DataLine /></el-icon>
                <template #title>全局总览</template>
            </el-menu-item>
            <el-sub-menu index="/component">
                <template #title>
                    <el-icon><ElementPlus /></el-icon>
                    <span>组件封装</span>
                </template>
                <el-menu-item-group>
                    <template #title><span>基础</span></template>
                    <el-menu-item index="/component/button">按钮</el-menu-item>
                    <el-menu-item index="/component/input">输入框</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="进阶">
                    <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                    <template #title><span>item four</span></template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="/form">
                <el-icon><Document /></el-icon>
                <template #title>信息表单</template>
            </el-menu-item>
            <el-menu-item index="/list">
                <el-icon><Tickets /></el-icon>
                <template #title>数据表格</template>
            </el-menu-item>
            <el-sub-menu index="/custom-directives">
                <template #title>
                    <el-icon><MagicStick /></el-icon>
                    <span>自定义指令</span>
                </template>
                <el-menu-item index="/custom-directives/debounce">防抖</el-menu-item>
                <el-menu-item index="/custom-directives/throttle">节流</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/exception">
                <template #title>
                    <el-icon><Warning /></el-icon>
                    <span>异常页面</span>
                </template>
                <el-menu-item index="/exception/404"> 404 </el-menu-item>
                <el-menu-item index="/exception/500"> 500 </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/special-layout">
                <template #title>
                    <el-icon><Grid /></el-icon>
                    <span>特殊布局</span>
                </template>
                <el-menu-item index="/special-layout/flex">弹性布局</el-menu-item>
                <el-menu-item index="/special-layout/grid">网格布局</el-menu-item>
                <el-menu-item index="/special-layout/waterfall">瀑布流</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/external-link">
                <template #title>
                    <el-icon><Link /></el-icon>
                    <span>外部链接</span>
                </template>
                <el-menu-item index="/external-link/embedded-page">
                    内嵌页面
                </el-menu-item>
                <el-menu-item index="/external-link/external-page">
                    外部页面
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/information">
                <el-icon><InfoFilled /></el-icon>
                <template #title>关于项目</template>
            </el-menu-item>
        </el-scrollbar>
        <el-button
            class="absolute left-full top-1/2 -translate-y-1/2 -translate-x-1/2 z-[99]"
            circle
            type="success"
            :icon="isCollapse ? 'Expand' : 'Fold'"
            @click="isCollapse = !isCollapse"
        ></el-button>
    </el-menu>
</template>

<script setup lang="ts">
const router = useRouter();
const isCollapse = ref(false);

const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
    router.push(key);
};
</script>
