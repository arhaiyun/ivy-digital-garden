<script setup>
import { computed, onMounted, ref } from 'vue'
import Timeline from './components/Timeline.vue'
import Playlist from './components/Playlist.vue'
import ResourceGrid from './components/ResourceGrid.vue'
import { resolveSitePath } from './lib/site-path.js'

const catalog = ref(null)
const error = ref('')
const activeTab = ref('home')

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

const ageDays = computed(() => {
  const birth = profile.value.birth_date
  if (!birth) return null
  const start = new Date(`${birth}T00:00:00`)
  const now = new Date()
  return Math.floor((now - start) / 86400000) + 1
})

const pills = computed(() => [
  { value: stats.value.byKind?.photo || 0, label: '张照片', tone: 'peach' },
  { value: stats.value.byKind?.audio || entries.value.filter((e) => e.type === 'playlist').length, label: '首歌', tone: 'mint' },
  { value: stats.value.entries || 0, label: '条记忆', tone: 'lav' },
  { value: ageDays.value != null ? Math.floor(ageDays.value / 30) : '—', label: '个月啦', tone: 'lemon' },
])

const playlistEntries = computed(() => entries.value.filter((e) => e.type === 'playlist'))
</script>

<template>
  <div class="clouds" aria-hidden="true">
    <div class="cloud" />
    <div class="cloud" />
    <div class="cloud" />
  </div>

  <div class="app">
    <header>
      <h1>Ivy 糖果云朵</h1>
      <p>软萌 pastel · 像糖果一样甜的成长记录</p>
      <div class="nav-chips">
        <button :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">首页</button>
        <button :class="{ active: activeTab === 'timeline' }" @click="activeTab = 'timeline'">时间轴</button>
        <button :class="{ active: activeTab === 'playlist' }" @click="activeTab = 'playlist'">歌单</button>
        <button :class="{ active: activeTab === 'stickers' }" @click="activeTab = 'stickers'">贴纸墙</button>
      </div>
    </header>

    <p v-if="error" class="notice error">{{ error }}</p>
    <p v-else-if="!catalog" class="notice">正在加载…</p>

    <template v-else>
      <section v-show="activeTab === 'home'" class="screen active">
        <div class="hero-card">
          <div class="balloons" aria-hidden="true">
            <div class="balloon" />
            <div class="balloon" />
            <div class="balloon" />
          </div>
          <h2>Hi Ivy ~</h2>
          <p v-if="ageDays != null" class="hero-sub">
            今天是你来到世界的第 <strong>{{ ageDays }}</strong> 天
          </p>
          <p v-else class="hero-sub">欢迎来到 Ivy 的资源总览</p>
          <a class="doc-link" :href="resolveSitePath('/')">← 返回文档站</a>
        </div>
        <div class="pill-grid">
          <div v-for="pill in pills" :key="pill.label" class="pill" :class="pill.tone">
            <b>{{ pill.value }}</b>
            <span>{{ pill.label }}</span>
          </div>
        </div>
      </section>

      <section v-show="activeTab === 'timeline'" class="screen">
        <Timeline :entries="entries" />
      </section>

      <section v-show="activeTab === 'playlist'" class="screen">
        <Playlist :entries="playlistEntries" />
      </section>

      <section v-show="activeTab === 'stickers'" class="screen">
        <ResourceGrid :entries="entries" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.clouds {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.cloud {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.55;
  animation: ivy-drift 20s ease-in-out infinite alternate;
}

.cloud:nth-child(1) {
  width: 280px;
  height: 140px;
  background: var(--ivy-peach);
  top: -40px;
  left: -60px;
}

.cloud:nth-child(2) {
  width: 220px;
  height: 120px;
  background: var(--ivy-lav);
  top: 20%;
  right: -40px;
  animation-delay: -5s;
}

.cloud:nth-child(3) {
  width: 200px;
  height: 100px;
  background: var(--ivy-mint);
  bottom: 10%;
  left: 20%;
  animation-delay: -10s;
}

.app {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px 16px 100px;
  position: relative;
  z-index: 1;
}

header {
  text-align: center;
  margin-bottom: 24px;
}

header h1 {
  font-family: var(--ivy-display);
  font-size: clamp(2.2rem, 7vw, 3.2rem);
  background: linear-gradient(90deg, #e8879a, #b8a0e8, #7ecdb8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

header > p {
  color: var(--ivy-muted);
  margin-top: 8px;
  font-size: 15px;
}

.nav-chips {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.nav-chips button {
  border: none;
  font-family: var(--ivy-display);
  font-size: 15px;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 18px;
  transition: 0.25s;
  background: #fff;
  color: var(--ivy-muted);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.04);
}

.nav-chips button.active {
  background: var(--ivy-peach);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #f0a8b8;
}

.screen {
  animation: ivy-bounce-in 0.45s ease;
}

.hero-card {
  background: #fff;
  border-radius: 32px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 16px 40px rgba(232, 135, 154, 0.12);
  border: 4px solid var(--ivy-lemon);
  margin-bottom: 18px;
}

.balloons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.balloon {
  width: 44px;
  height: 54px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: ivy-float 3s ease-in-out infinite;
}

.balloon:nth-child(1) {
  background: var(--ivy-peach);
}

.balloon:nth-child(2) {
  background: var(--ivy-lav);
  animation-delay: 0.5s;
}

.balloon:nth-child(3) {
  background: var(--ivy-mint);
  animation-delay: 1s;
}

.hero-card h2 {
  font-family: var(--ivy-display);
  font-size: 1.6rem;
  color: var(--ivy-ink);
  margin: 0;
}

.hero-sub {
  margin-top: 8px;
  color: var(--ivy-muted);
}

.doc-link {
  display: inline-block;
  margin-top: 14px;
  font-size: 13px;
  font-family: var(--ivy-display);
}

.pill-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.pill {
  border-radius: 24px;
  padding: 20px;
  color: var(--ivy-ink);
  border: 3px solid #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.pill.peach { background: var(--ivy-peach); }
.pill.mint { background: var(--ivy-mint); }
.pill.lav { background: var(--ivy-lav); }
.pill.lemon { background: var(--ivy-lemon); }

.pill b {
  font-family: var(--ivy-display);
  font-size: 2rem;
  display: block;
}

.pill span {
  font-size: 13px;
  opacity: 0.75;
}

.notice {
  text-align: center;
  padding: 24px;
  background: #fff;
  border-radius: 20px;
  color: var(--ivy-muted);
}

.notice.error {
  color: #c45d75;
}
</style>
