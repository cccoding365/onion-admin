<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'
import { getSummary, getBarData, getPieData, getLineData } from '../mock/dashboard'
import NumberCard from '../components/NumberCard.vue'

const { t } = useI18n({ useScope: 'global' })
const app = useAppStore()

const summary = ref(getSummary())

const barRef = ref(null)
const pieRef = ref(null)
const lineRef = ref(null)

let barChart, pieChart, lineChart

function initBar() {
  const { categories, values } = getBarData()
  barChart = echarts.init(barRef.value)
  barChart.setOption({
    tooltip: {},
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: values }],
  })
}

function initPie() {
  const data = getPieData()
  pieChart = echarts.init(pieRef.value)
  pieChart.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data,
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
      },
    ],
  })
}

function initLine() {
  const { months, seriesA, seriesB } = getLineData()
  lineChart = echarts.init(lineRef.value)
  lineChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['A', 'B'] },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: 'A', type: 'line', data: seriesA, smooth: true },
      { name: 'B', type: 'line', data: seriesB, smooth: true },
    ],
  })
}

function resizeAll() {
  barChart?.resize()
  pieChart?.resize()
  lineChart?.resize()
}

onMounted(() => {
  initBar()
  initPie()
  initLine()
  window.addEventListener('resize', resizeAll)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeAll)
  barChart?.dispose()
  pieChart?.dispose()
  lineChart?.dispose()
})

watch(
  () => app.isDark,
  () => {
    // simple refresh to adapt container sizes in dark mode toggle
    resizeAll()
  }
)
</script>

<template>
  <div class="dashboard">
    <el-row :gutter="16" class="summary-row">
      <el-col :span="6" v-for="item in summary" :key="item.key">
        <NumberCard
          :title="t(`dashboard.${item.key}`)"
          :value="item.value"
          :trend="item.trend"
          :prefix="item.key==='revenue' ? '$' : ''"
          :suffix="item.key==='conversion' ? '%' : ''"
          :decimals="item.key==='conversion' ? 1 : 0"
        />
      </el-col>
    </el-row>

    <el-row :gutter="16" class="charts-row">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>{{ t('dashboard.barTitle') }}</span>
          </template>
          <div ref="barRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>{{ t('dashboard.pieTitle') }}</span>
          </template>
          <div ref="pieRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>{{ t('dashboard.lineTitle') }}</span>
          </template>
          <div ref="lineRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.chart {
  width: 100%;
  height: 300px;
}
</style>