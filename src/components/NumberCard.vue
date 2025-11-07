<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { CountUp } from 'countup.js'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  decimals: { type: Number, default: 0 },
  trend: { type: Number, default: 0 },
})

const numRef = ref(null)
let cu

function renderCount(end) {
  if (!numRef.value) return
  const options = {
    decimalPlaces: props.decimals,
    duration: 1.2,
    separator: ',',
  }
  if (!cu) {
    cu = new CountUp(numRef.value, end, options)
  } else {
    cu.update(end)
  }
  if (!cu.error) cu.start()
}

onMounted(() => {
  renderCount(props.value)
})

watch(
  () => props.value,
  (val) => {
    renderCount(val)
  }
)

onBeforeUnmount(() => {
  cu = null
})
</script>

<template>
  <el-card shadow="hover" class="summary-card">
    <div class="summary-title">{{ title }}</div>
    <div class="summary-value">
      <span class="prefix" v-if="prefix">{{ prefix }}</span>
      <span ref="numRef"></span>
      <span class="suffix" v-if="suffix">{{ suffix }}</span>
    </div>
    <div class="summary-trend" :class="{ up: trend>=0, down: trend<0 }">
      {{ trend >= 0 ? '+' : '' }}{{ trend }}%
    </div>
  </el-card>
  
</template>

<style scoped>
.summary-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 100px;
}
.summary-title {
  color: #909399;
  font-size: 14px;
}
.summary-value {
  font-size: 24px;
  font-weight: 600;
}
.summary-trend {
  font-size: 12px;
}
.summary-trend.up { color: #67C23A; }
.summary-trend.down { color: #F56C6C; }
</style>