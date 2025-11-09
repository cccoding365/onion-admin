<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'
import { useNotificationsStore } from '../stores/notifications'
import { getSummary, getBarData, getPieData, getLineData } from '../mock/dashboard'
import NumberCard from '../components/NumberCard.vue'
import { Bell } from '@element-plus/icons-vue'

const { t } = useI18n({ useScope: 'global' })
const app = useAppStore()
const noti = useNotificationsStore()

const summary = ref(getSummary())

// 从通知模块获取仪表盘类型的当前或最近消息
const dashboardText = computed(() => {
  const cur = noti.currentDashboard?.content
  if (cur && cur.trim()) return cur
  const texts = (noti.items || [])
    .filter((n) => n.type === 'dashboard')
    .map((n) => n.content)
    .filter(Boolean)
  return texts.length ? texts.join('   •   ') : ''
})

const strategy = computed(() => noti.dashboardStrategy)
const showDashboardNotice = ref(true)
let autoCloseTimer = null

function resetDashboardNotice() {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  if (!noti.dashboardEnabled || !dashboardText.value) {
    showDashboardNotice.value = false
    return
  }
  if (strategy.value === 'autoClose') {
    showDashboardNotice.value = true
    const ms = noti.dashboardAutoCloseMs || 10000
    autoCloseTimer = setTimeout(() => {
      showDashboardNotice.value = false
    }, ms)
  } else {
    showDashboardNotice.value = true
  }
}

watch([() => noti.dashboardEnabled, strategy, dashboardText], resetDashboardNotice, { immediate: true })
onBeforeUnmount(() => {
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
})

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
    <!-- 消息通知栏（位于 summary-row 上方） -->
    <el-card v-if="noti.dashboardEnabled && showDashboardNotice && dashboardText" class="notice-card" shadow="never">
      <template v-if="strategy === 'marquee'">
        <div class="notice-marquee">
          <span class="marquee-track">{{ dashboardText }}</span>
          <span class="marquee-track marquee-copy">{{ dashboardText }}</span>
        </div>
      </template>
      <template v-else>
        <div class="notice-static">{{ dashboardText }}</div>
      </template>
    </el-card>

    <el-row :gutter="16" class="summary-row">
      <el-col :span="6" v-for="item in summary" :key="item.key">
        <NumberCard
          :title="t(`dashboard.${item.key}`)"
          :value="item.value"
          :trend="item.trend"
          :prefix="item.key==='revenue' ? '$' : ''"
          :suffix="item.key==='conversion' ? '%' : ''"
          :decimals="item.key==='conversion' ? 1 : 0"
          :icon="
            item.key==='users' ? 'User' :
            item.key==='orders' ? 'Goods' :
            item.key==='revenue' ? 'Money' :
            'DataAnalysis'
          "
          :iconColor="app.primaryColor"
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
.notice-card {
  padding: 0;
}
.notice-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.notice-marquee {
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}
.marquee-track {
  display: inline-block;
  padding-right: 50%;
  animation: marquee 18s linear infinite;
}
.notice-marquee:hover .marquee-track {
  animation-play-state: paused;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
.chart {
  width: 100%;
  height: 300px;
}
</style>