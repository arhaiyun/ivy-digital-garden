<script setup>
import LyricsPlayer from '../../../shared/vue/LyricsPlayer.vue'
import { resolveSitePath } from '../lib/site-path.js'

defineProps({
  entries: { type: Array, required: true },
})

function audioUrl(entry) {
  const asset = entry.assets?.find((a) => a.kind === 'audio' || a.kind === 'video')
  return asset?.url ? resolveSitePath(asset.url) : ''
}

function lyricsUrl(entry) {
  return entry.lyrics ? resolveSitePath(entry.lyrics) : ''
}
</script>

<template>
  <div class="candy-list">
    <div v-if="entries.length === 0" class="empty">还没有歌单，用 playlist 模板添加一首吧 ~</div>
    <article v-for="entry in entries" :key="entry.id" class="candy-item">
      <div class="candy-head">
        <div class="candy-icon">♫</div>
        <div>
          <a :href="resolveSitePath(entry.link)"><strong>{{ entry.title }}</strong></a>
          <div class="meta">
            <span v-if="entry.artist">{{ entry.artist }}</span>
            <span v-if="entry.ivy_age_months != null"> · {{ entry.ivy_age_months }}月龄</span>
            <span v-if="entry.scene"> · {{ entry.scene }}</span>
          </div>
        </div>
      </div>
      <LyricsPlayer
        v-if="audioUrl(entry) && lyricsUrl(entry)"
        :audio="audioUrl(entry)"
        :lrc="lyricsUrl(entry)"
        :title="entry.title"
        :artist="entry.artist"
      />
      <a v-else class="doc-link" :href="resolveSitePath(entry.link)">打开歌单页 →</a>
    </article>
  </div>
</template>

<style scoped>
.candy-list {
  display: grid;
  gap: 16px;
}

.candy-item {
  background: #fff;
  border-radius: 24px;
  padding: 16px 18px;
  border: 2px solid var(--ivy-peach);
  box-shadow: 0 12px 28px rgba(232, 135, 154, 0.08);
}

.candy-head {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 12px;
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
  color: var(--ivy-ink);
}

.meta {
  font-size: 13px;
  color: var(--ivy-muted);
  margin-top: 4px;
}

.doc-link {
  font-size: 13px;
  font-family: var(--ivy-display);
}

.empty {
  text-align: center;
  padding: 32px;
  background: #fff;
  border-radius: 24px;
  color: var(--ivy-muted);
}
</style>
