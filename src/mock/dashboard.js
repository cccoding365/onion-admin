// Simple mock data generator for dashboard
function randInt(min, max) {
  return Math.round(min + Math.random() * (max - min))
}

function randFloat(min, max, digits = 1) {
  const v = min + Math.random() * (max - min)
  return parseFloat(v.toFixed(digits))
}

export function getSummary() {
  return [
    { key: 'users', value: randInt(800, 2400), trend: randFloat(-10, 15, 1) },
    { key: 'orders', value: randInt(200, 800), trend: randFloat(-8, 12, 1) },
    { key: 'revenue', value: randInt(30000, 120000), trend: randFloat(-5, 10, 1) },
    { key: 'conversion', value: randFloat(1.5, 6.5, 1), trend: randFloat(-2, 4, 1) },
  ]
}

export function getBarData() {
  const categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const values = categories.map(() => Math.round(200 + Math.random() * 400))
  return { categories, values }
}

export function getPieData() {
  const labels = ['Direct', 'Email', 'Ads', 'Search', 'Social']
  return labels.map((name) => ({ name, value: Math.round(100 + Math.random() * 400) }))
}

export function getLineData() {
  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`)
  const seriesA = months.map(() => Math.round(400 + Math.random() * 300))
  const seriesB = months.map(() => Math.round(300 + Math.random() * 300))
  return { months, seriesA, seriesB }
}