<script setup>
defineProps({
  entries: { type: Array, required: true },
})
</script>

<template>
  <div class="candy-list">
    <div v-if="entries.length === 0" class="empty">还没有歌单，用 playlist 模板添加一首吧 ~</div>
    <a
      v-for="entry in entries"
      :key="entry.id"
      class="candy-item"
      :href="entry.link"
    >
      <div class="candy-icon">♫</div>
      <div>
        <strong>{{ entry.title }}</strong>
        <div class="meta">
          <span v-if="entry.artist">{{ entry.artist }}</span>
          <span v-if="entry.ivy_age_months != null"> · {{ entry.ivy_age_months }}月龄</span>
          <span v-if="entry.scene"> · {{ entry.scene }}</span>
        </div>
        <div v-if="entry.assets?.length" class="local-tag">本地音频</div>
      </div>
    </a>
  </div>
</template>

<style scoped>
.candy-list {
  display: grid;
  gap: 12px;
}

.candy-item {
  display: flex;
  gap: 14px;
  align-items: center;
  background: #fff;
  border-radius: 24px;
  padding: 16px 18px;
  border: 2px solid var(--ivy-peach);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}

.candy-item:hover {
  transform: rotate(-1deg) scale(1.01);
  box-shadow: 0 12px 28px rgba(232, 135, 154, 0.15);
}

.candy-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--ivy-lav), var(--ivy-peach));
  display: grid;
  place-items: center;
  font-size: 22px;
  color: #fff;
  flex-shrink: 0;
}

.candy-item strong {
  font-family: var(--ivy-display);
  font-size: 1.05rem;
}

.meta {
  font-size: 13px;
  color: var(--ivy-muted);
  margin-top: 4px;
}

.local-tag {
  display: inline-block;
  margin-top: 8px;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--ivy-mint);
  color: var(--ivy-ink);
}

.empty {
  text-align: center;
  padding: 32px;
  background: #fff;
  border-radius: 24px;
  color: var(--ivy-muted);
}
</style>
