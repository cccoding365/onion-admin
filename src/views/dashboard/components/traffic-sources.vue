<template>
    <el-card>
        <v-chart class="h-[400px] w-[600px]" :option="option" />
    </el-card>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);
provide(THEME_KEY, "light");

const option = ref({
    title: {
        text: "流量来源",
        left: "center"
    },
    tooltip: {
        trigger: "item",
        formatter: "{b} : {c} ({d}%)"
    },
    legend: {
        orient: "vertical",
        left: "right",
        data: ["直接访问", "邮箱推送", "广告推荐", "视频广告", "搜索引擎"]
    },
    series: [
        {
            name: "流量来源",
            type: "pie",
            radius: "60%",
            center: ["50%", "60%"],
            data: [
                { value: 335, name: "直接访问" },
                { value: 310, name: "邮箱推送" },
                { value: 234, name: "广告推荐" },
                { value: 135, name: "视频广告" },
                { value: 1548, name: "搜索引擎" }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                }
            }
        }
    ]
});
</script>
