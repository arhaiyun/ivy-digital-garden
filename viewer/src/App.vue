<script setup>
import { computed, onMounted, ref } from 'vue'
import StatsPanel from './components/StatsPanel.vue'
import Timeline from './components/Timeline.vue'
import ResourceGrid from './components/ResourceGrid.vue'

const catalog = ref(null)
const error = ref('')
const activeTab = ref('timeline')
const kindFilter = ref('all')
const typeFilter = ref('all')

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}catalog.json`)
    if (!response.ok) throw new Error(`无法加载 catalog.json (${response.status})`)
    catalog.value = await response.json()
  } catch (err) {
    error.value = err.message
  }
})

const entries = computed(() => catalog.value?.entries || [])
const stats = computed(() => catalog.value?.stats || {})
const profile = computed(() => catalog.value?.profile || {})

const filteredEntries = computed(() => {
  return entries.value.filter((entry) => {
    if (typeFilter.value !== 'all' && entry.type !== typeFilter.value) return false
    if (kindFilter.value === 'all') return true
    return entry.assets?.some((asset) => asset.kind === kindFilter.value)
  })
})

const flatAssets = computed(() => {
  const items = []
  for (const entry of filteredEntries.value) {
    for (const asset of entry.assets || []) {
      items.push({ ...asset, entry })
    }
  }
  return items
})
</script>

<template>
  <div class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">Ivy 的数字花园</p>
        <h1>资源总览</h1>
        <p class="subtitle">
          时间轴、媒体墙与统计 — 把文字、照片、视频、音频放在同一视野里。
        </p>
      </div>
      <div class="hero-actions">
        <a href="/">返回文档站</a>
        <span v-if="profile.birth_date" class="badge">出生 {{ profile.birth_date }}</span>
      </div>
    </header>

    <p v-if="error" class="error">{{ error }}</p>

    <template v-else-if="catalog">
      <StatsPanel :stats="stats" :entries="entries" />

      <section class="toolbar">
        <div class="tabs">
          <button :class="{ active: activeTab === 'timeline' }" @click="activeTab = 'timeline'">时间轴</button>
          <button :class="{ active: activeTab === 'resources' }" @click="activeTab = 'resources'">资源墙</button>
        </div>
        <div class="filters">
          <select v-model="typeFilter">
            <option value="all">全部栏目</option>
            <option value="journal">日记</option>
            <option value="milestone">里程碑</option>
            <option value="health">健康</option>
            <option value="family">家族</option>
            <option value="creative">作品</option>
            <option value="wish">愿望</option>
          </select>
          <select v-model="kindFilter">
            <option value="all">全部媒体</option>
            <option value="photo">照片</option>
            <option value="video">视频</option>
            <option value="audio">音频</option>
          </select>
        </div>
      </section>

      <Timeline v-if="activeTab === 'timeline'" :entries="filteredEntries" />
      <ResourceGrid v-else :assets="flatAssets" />
    </template>

    <p v-else class="loading">正在加载资源目录…</p>
  </div>
</template>

<style scoped>
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 20px 64px;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--brand);
  font-size: 14px;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  font-size: clamp(32px, 5vw, 48px);
}

.subtitle {
  margin: 12px 0 0;
  color: var(--muted);
  max-width: 620px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.badge {
  background: var(--brand-soft);
  color: var(--brand);
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin: 24px 0;
  flex-wrap: wrap;
}

.tabs,
.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tabs button,
.filters select {
  border: 1px solid var(--line);
  background: var(--panel);
  color: var(--text);
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
}

.tabs button.active {
  background: var(--brand);
  border-color: var(--brand);
  color: white;
}

.error,
.loading {
  color: var(--muted);
  padding: 24px;
  background: var(--panel);
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.error {
  color: #9a3b3b;
}

@media (max-width: 720px) {
  .hero {
    flex-direction: column;
  }

  .hero-actions {
    align-items: flex-start;
  }
}
</style>
