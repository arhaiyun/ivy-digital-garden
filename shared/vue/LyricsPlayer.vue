<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { findActiveLineIndex, parseLrc } from '../lyrics/parse-lrc.mjs'

const props = defineProps({
  audio: { type: String, required: true },
  lrc: { type: String, default: '' },
  title: { type: String, default: '' },
  artist: { type: String, default: '' },
  offset: { type: [Number, String], default: 0 },
})

const audioRef = ref(null)
const lyricsRef = ref(null)
const lines = ref([])
const activeIndex = ref(-1)
const loading = ref(false)
const error = ref('')

let rafId = 0

async function loadLrc() {
  if (!props.lrc) return
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(props.lrc)
    if (!response.ok) throw new Error(`歌词加载失败 (${response.status})`)
    lines.value = parseLrc(await response.text(), props.offset)
  } catch (err) {
    error.value = err.message
    lines.value = []
  } finally {
    loading.value = false
  }
}

function tick() {
  const audio = audioRef.value
  if (!audio || audio.paused) return
  const idx = findActiveLineIndex(lines.value, audio.currentTime)
  if (idx !== activeIndex.value) {
    activeIndex.value = idx
    scrollToActive()
  }
  rafId = requestAnimationFrame(tick)
}

function startTrack() {
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(tick)
}

function stopTrack() {
  cancelAnimationFrame(rafId)
}

function onTimeUpdate() {
  const idx = findActiveLineIndex(lines.value, audioRef.value?.currentTime ?? 0)
  if (idx !== activeIndex.value) {
    activeIndex.value = idx
    scrollToActive()
  }
}

function scrollToActive() {
  const container = lyricsRef.value
  const el = container?.querySelector('.lyric-line.active')
  if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
}

function seekTo(time) {
  const audio = audioRef.value
  if (!audio) return
  audio.currentTime = time
  void audio.play()
}

onMounted(() => {
  loadLrc()
})

onUnmounted(() => {
  stopTrack()
})

watch(() => [props.lrc, props.offset], loadLrc)
</script>

<template>
  <div class="lyrics-player">
    <div v-if="title || artist" class="player-head">
      <strong v-if="title">{{ title }}</strong>
      <span v-if="artist">{{ artist }}</span>
    </div>

    <audio
      ref="audioRef"
      class="player-audio"
      controls
      :src="audio"
      preload="metadata"
      @play="startTrack"
      @pause="stopTrack"
      @ended="stopTrack"
      @timeupdate="onTimeUpdate"
      @seeked="onTimeUpdate"
    />

    <div v-if="loading" class="player-hint">歌词加载中…</div>
    <div v-else-if="error" class="player-hint error">{{ error }}</div>
    <div v-else-if="lines.length" ref="lyricsRef" class="lyrics-panel">
      <button
        v-for="(line, index) in lines"
        :key="`${line.time}-${index}`"
        type="button"
        class="lyric-line"
        :class="{ active: index === activeIndex, past: index < activeIndex }"
        @click="seekTo(line.time)"
      >
        {{ line.text }}
      </button>
    </div>
    <div v-else class="player-hint">暂无歌词</div>
  </div>
</template>

<style scoped>
.lyrics-player {
  margin: 16px 0;
  padding: 20px;
  border-radius: 24px;
  background: linear-gradient(180deg, #fff 0%, #fff9fc 100%);
  border: 2px solid rgba(255, 200, 212, 0.45);
  box-shadow: 0 12px 32px rgba(232, 135, 154, 0.1);
}

.player-head {
  text-align: center;
  margin-bottom: 12px;
}

.player-head strong {
  display: block;
  font-family: var(--ivy-display, "Baloo 2", cursive);
  font-size: 1.2rem;
  color: var(--ivy-ink, #4a3f55);
}

.player-head span {
  font-size: 13px;
  color: var(--ivy-muted, #8a7f96);
}

.player-audio {
  width: 100%;
  margin-bottom: 14px;
}

.lyrics-panel {
  max-height: 280px;
  overflow-y: auto;
  padding: 8px 4px;
  scroll-behavior: smooth;
}

.lyric-line {
  display: block;
  width: 100%;
  border: none;
  background: transparent;
  text-align: center;
  padding: 10px 12px;
  margin: 4px 0;
  border-radius: 14px;
  font-family: var(--ivy-body, "Nunito", sans-serif);
  font-size: 15px;
  line-height: 1.6;
  color: var(--ivy-muted, #8a7f96);
  cursor: pointer;
  transition: color 0.25s, transform 0.25s, background 0.25s;
}

.lyric-line.past {
  opacity: 0.55;
}

.lyric-line.active {
  color: var(--ivy-peach-deep, #e8879a);
  background: rgba(255, 232, 240, 0.65);
  font-size: 17px;
  font-weight: 700;
  transform: scale(1.02);
}

.lyric-line:hover {
  background: rgba(221, 208, 255, 0.35);
}

.player-hint {
  text-align: center;
  color: var(--ivy-muted, #8a7f96);
  font-size: 14px;
  padding: 12px 0;
}

.player-hint.error {
  color: #c45d75;
}
</style>
