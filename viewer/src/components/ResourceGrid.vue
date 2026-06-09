<script setup>
import { resolveSitePath } from '../lib/site-path.js'

const props = defineProps({
  entries: { type: Array, required: true },
})

const TYPE_ICON = {
  journal: '记',
  milestone: '程',
  health: '健',
  family: '家',
  creative: '创',
  wish: '愿',
  playlist: '歌',
}

function stickerLabel(entry) {
  if (entry.assets?.length) return entry.assets[0].caption || entry.title
  return entry.title
}

function stickerTone(entry) {
  const map = {
    playlist: 'lav',
    journal: 'peach',
    milestone: 'mint',
    default: 'lemon',
  }
  return map[entry.type] || map.default
}
</script>

<template>
  <div class="sticker-grid">
    <a
      v-for="entry in entries"
      :key="entry.id"
      class="sticker"
      :class="stickerTone(entry)"
      :href="resolveSitePath(entry.link)"
    >
      <div class="icon">{{ TYPE_ICON[entry.type] || '✦' }}</div>
      <small>{{ stickerLabel(entry) }}</small>
    </a>
  </div>
</template>

<style scoped>
.sticker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.sticker {
  background: #fff;
  border-radius: 20px;
  padding: 18px 14px;
  text-align: center;
  border: 2px dashed var(--ivy-mint);
  transition: transform 0.2s;
  text-decoration: none;
  color: inherit;
}

.sticker:hover {
  transform: rotate(3deg);
}

.sticker.peach { border-color: var(--ivy-peach); }
.sticker.lav { border-color: var(--ivy-lav); }
.sticker.mint { border-color: var(--ivy-mint); }
.sticker.lemon { border-color: var(--ivy-lemon); }

.icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 10px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-family: var(--ivy-display);
  font-size: 1.2rem;
  color: #fff;
  background: linear-gradient(135deg, var(--ivy-peach), var(--ivy-lav));
}

.sticker small {
  font-size: 11px;
  color: var(--ivy-muted);
  display: block;
  line-height: 1.4;
}

@media (max-width: 600px) {
  .sticker-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
