<script setup>
import { computed } from 'vue'

const props = defineProps({
  entries: { type: Array, required: true },
})

const TYPE_LABEL = {
  journal: '日记',
  milestone: '里程碑',
  health: '健康',
  family: '家族',
  creative: '作品',
  wish: '愿望',
}

const groups = computed(() => {
  const map = new Map()
  for (const entry of props.entries) {
    const key = entry.date?.slice(0, 7) || '未知'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(entry)
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
})
</script>

<template>
  <section class="timeline">
    <div v-if="entries.length === 0" class="empty">当前筛选下没有条目。</div>
    <div v-for="[month, monthEntries] in groups" :key="month" class="month">
      <h2>{{ month }}</h2>
      <article v-for="entry in monthEntries" :key="entry.id" class="item">
        <div class="meta">
          <span class="date">{{ entry.date }}</span>
          <span class="type">{{ TYPE_LABEL[entry.type] || entry.type }}</span>
        </div>
        <div class="body">
          <h3>
            <a :href="entry.link">{{ entry.title }}</a>
          </h3>
          <p>{{ entry.summary || '暂无摘要' }}</p>
          <div class="assets">
            <span v-for="asset in entry.assets" :key="asset.path" class="chip" :class="asset.kind">
              {{ asset.kind }} · {{ asset.caption || asset.id }}
            </span>
            <span v-if="!entry.assets?.length" class="chip muted">纯文字</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.timeline {
  display: grid;
  gap: 28px;
}

.month h2 {
  margin: 0 0 14px;
  color: var(--brand);
}

.item {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 18px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date {
  font-weight: 700;
}

.type {
  display: inline-flex;
  align-self: flex-start;
  background: var(--brand-soft);
  color: var(--brand);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.body h3 {
  margin: 0 0 8px;
}

.body p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.assets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.chip {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef2f0;
}

.chip.photo { background: #e7f2ec; color: #35624d; }
.chip.video { background: #ececf8; color: #454c9a; }
.chip.audio { background: #f8f0e7; color: #8a6435; }
.chip.muted { background: #f1f1f1; color: #777; }

.empty {
  padding: 24px;
  background: var(--panel);
  border-radius: 16px;
  color: var(--muted);
}

@media (max-width: 720px) {
  .item {
    grid-template-columns: 1fr;
  }
}
</style>
