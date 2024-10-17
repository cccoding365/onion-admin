<template>
    <el-space direction="vertical" alignment="normal">
        <el-card header="基础用法">
            <div class="mb-4">
                <el-button v-for="button in buttons" :key="button.text" :type="button.type">
                    {{ button.text }}
                </el-button>
            </div>
            <div class="mb-4">
                <el-button plain v-for="button in buttons" :key="button.text" :type="button.type">
                    {{ button.text }}
                </el-button>
            </div>
            <div class="mb-4">
                <el-button v-for="button in buttons" :key="button.text" :type="button.type" text bg>
                    {{ button.text }}
                </el-button>
            </div>
            <div class="mb-4">
                <el-button round v-for="button in buttons" :key="button.text" :type="button.type">
                    {{ button.text }}
                </el-button>
            </div>
            <div class="mb-4">
                <el-button v-for="button in buttons" :key="button.text" :type="button.type" link>
                    {{ button.text }}
                </el-button>
            </div>
            <div class="mb-4">
                <el-button v-for="button in buttons" :key="button.text" :icon="button.icon" :type="button.type" />
            </div>
            <div>
                <el-button circle v-for="button in buttons" :key="button.text" :icon="button.icon" :type="button.type" />
            </div>
        </el-card>
        <el-card header="禁用状态">
            <div class="mb-4">
                <el-button disabled v-for="button in buttons" :key="button.text" :type="button.type">
                    {{ button.text }}
                </el-button>
            </div>
            <div class="mb-4">
                <el-button disabled plain v-for="button in buttons" :key="button.text" :type="button.type">
                    {{ button.text }}
                </el-button>
            </div>
            <div class="mb-4">
                <el-button disabled v-for="button in buttons" :key="button.text" :type="button.type" text bg>
                    {{ button.text }}
                </el-button>
            </div>
            <div class="mb-4">
                <el-button disabled round v-for="button in buttons" :key="button.text" :type="button.type">
                    {{ button.text }}
                </el-button>
            </div>
            <div class="mb-4">
                <el-button disabled v-for="button in buttons" :key="button.text" :type="button.type" link>
                    {{ button.text }}
                </el-button>
            </div>
            <div class="mb-4">
                <el-button disabled v-for="button in buttons" :key="button.text" :icon="button.icon" :type="button.type" />
            </div>
            <div>
                <el-button disabled circle v-for="button in buttons" :key="button.text" :icon="button.icon" :type="button.type" />
            </div>
        </el-card>
        <el-card header="图标、按钮组、加载中">
            <div class="mb-4">
                <el-button type="primary" icon="Edit" />
                <el-button type="primary" icon="Share" />
                <el-button type="primary" icon="Delete" />
                <el-button type="primary" icon="Search">Search</el-button>
                <el-button type="primary">
                    Upload<el-icon class="el-icon--right"><Upload /></el-icon>
                </el-button>
                &nbsp;
                <el-button-group>
                    <el-button type="primary" icon="ArrowLeft">Previous Page</el-button>
                    <el-button type="primary">
                        Next Page<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                    </el-button>
                </el-button-group>
                <el-button-group class="ml-4">
                    <el-button type="primary" icon="Edit" />
                    <el-button type="primary" icon="Share" />
                    <el-button type="primary" icon="Delete" />
                </el-button-group>
                &nbsp;
                <el-button type="primary" loading>Loading</el-button>
                <el-button type="primary" loading-icon="Eleme" loading>Loading</el-button>
            </div>
        </el-card>
    </el-space>
</template>

<script lang="ts" setup>
const buttons = [
    { type: "", text: "Default", icon: "Search" },
    { type: "primary", text: "Primary", icon: "Edit" },
    { type: "success", text: "Success", icon: "Check" },
    { type: "info", text: "Info", icon: "Message" },
    { type: "warning", text: "Warning", icon: "Star" },
    { type: "danger", text: "Danger", icon: "Delete" }
] as const;
</script>
