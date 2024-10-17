<template>
    <el-card>
        <v-chart class="h-[400px] w-[600px]" :option="option" />
    </el-card>
</template>

<script setup>
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, TitleComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart, { THEME_KEY } from "vue-echarts";

use([GridComponent, BarChart, CanvasRenderer, TitleComponent, TooltipComponent]);
provide(THEME_KEY, "light");

const option = ref({
    title: {
        text: "周访问量",
        left: "center"
    },
    tooltip: {
        trigger: "item",
        formatter: "{b} : {c}"
    },
    xAxis: {
        type: "category",
        data: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    },
    yAxis: {
        type: "value"
    },
    series: [
        {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar"
        }
    ]
});
</script>
