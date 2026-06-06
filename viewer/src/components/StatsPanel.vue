<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: { type: Object, required: true },
  entries: { type: Array, required: true },
})

const cards = computed(() => [
  { label: '记忆条目', value: props.stats.entries || 0 },
  { label: '照片', value: props.stats.byKind?.photo || 0 },
  { label: '视频', value: props.stats.byKind?.video || 0 },
  { label: '音频', value: props.stats.byKind?.audio || 0 },
])

const typeRows = computed(() => Object.entries(props.stats.byType || {}))
</script>

<template>
  <section class="stats">
    <div class="cards">
      <article v-for="card in cards" :key="card.label" class="card">
        <p>{{ card.label }}</p>
        <strong>{{ card.value }}</strong>
      </article>
    </div>
    <aside class="panel">
      <h2>栏目分布</h2>
      <ul>
        <li v-for="[type, count] in typeRows" :key="type">
          <span>{{ type }}</span>
          <strong>{{ count }}</strong>
        </li>
      </ul>
      <p class="meta">更新于 {{ new Date(stats.updatedAt).toLocaleString('zh-CN') }}</p>
      <p v-if="stats.missingAssets" class="warn">有 {{ stats.missingAssets }} 个媒体路径待补齐文件</p>
    </aside>
  </section>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.card,
.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: var(--shadow);
}

.card {
  padding: 18px;
}

.card p {
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 14px;
}

.card strong {
  font-size: 32px;
  color: var(--brand);
}

.panel {
  padding: 20px;
}

.panel h2 {
  margin: 0 0 12px;
  font-size: 18px;
}

.panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.panel li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
}

.meta,
.warn {
  margin: 14px 0 0;
  font-size: 13px;
  color: var(--muted);
}

.warn {
  color: #9a3b3b;
}

@media (max-width: 900px) {
  .stats {
    grid-template-columns: 1fr;
  }

  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
