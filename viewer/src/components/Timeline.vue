<script setup>
defineProps({
  entries: { type: Array, required: true },
})

const dots = ['peach', 'lav', 'mint']
</script>

<template>
  <div class="dot-line">
    <div v-if="entries.length === 0" class="empty">还没有记录，去写一篇吧 ~</div>
    <div v-for="(entry, index) in entries" :key="entry.id" class="dot-event">
      <div class="dot" :class="dots[index % dots.length]" />
      <div>
        <a :href="entry.link"><strong>{{ entry.title }}</strong></a>
        <div class="meta">{{ entry.date }}<span v-if="entry.scene"> · {{ entry.scene }}</span></div>
        <p v-if="entry.summary">{{ entry.summary }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dot-line {
  padding-left: 8px;
}

.dot-event {
  display: flex;
  gap: 14px;
  padding: 14px 0;
}

.dot-line .dot-event:not(:last-child) {
  border-left: 3px dotted var(--ivy-peach);
  margin-left: 7px;
  padding-left: 20px;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px var(--ivy-peach);
}

.dot.peach { background: var(--ivy-peach); }
.dot.lav { background: var(--ivy-lav); box-shadow: 0 0 0 2px var(--ivy-lav); }
.dot.mint { background: var(--ivy-mint); box-shadow: 0 0 0 2px var(--ivy-mint); }

.dot-event strong {
  font-family: var(--ivy-display);
  font-size: 1.05rem;
  color: var(--ivy-ink);
}

.meta {
  font-size: 13px;
  color: var(--ivy-muted);
  margin-top: 2px;
}

.dot-event p {
  font-size: 13px;
  color: var(--ivy-muted);
  margin: 6px 0 0;
  line-height: 1.6;
}

.empty {
  text-align: center;
  padding: 32px;
  background: #fff;
  border-radius: 24px;
  color: var(--ivy-muted);
}
</style>
