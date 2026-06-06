<script setup>
const props = defineProps({
  assets: { type: Array, required: true },
})

const KIND_LABEL = {
  photo: '照片',
  video: '视频',
  audio: '音频',
}
</script>

<template>
  <section class="grid-wrap">
    <div v-if="assets.length === 0" class="empty">当前筛选下没有媒体资源。</div>
    <div v-else class="grid">
      <article v-for="asset in assets" :key="`${asset.entry.id}-${asset.path}`" class="card">
        <div class="preview" :class="asset.kind">
          <img v-if="asset.kind === 'photo' && asset.exists" :src="asset.url" :alt="asset.caption" />
          <div v-else class="placeholder">
            <span>{{ KIND_LABEL[asset.kind] || asset.kind }}</span>
            <small v-if="!asset.exists">文件待导入</small>
          </div>
        </div>
        <div class="info">
          <h3>{{ asset.caption || asset.id }}</h3>
          <p>
            <a :href="asset.entry.link">{{ asset.entry.title }}</a>
            · {{ asset.entry.date }}
          </p>
          <video v-if="asset.kind === 'video' && asset.exists" controls :src="asset.url"></video>
          <audio v-if="asset.kind === 'audio' && asset.exists" controls :src="asset.url"></audio>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.preview {
  aspect-ratio: 4 / 3;
  background: #edf3f0;
  display: grid;
  place-items: center;
}

.preview img,
.preview video,
.info video,
.info audio {
  width: 100%;
  display: block;
}

.preview img {
  height: 100%;
  object-fit: cover;
}

.placeholder {
  text-align: center;
  color: var(--muted);
}

.placeholder span {
  display: block;
  font-size: 18px;
  font-weight: 700;
}

.info {
  padding: 14px 16px 16px;
}

.info h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.info p {
  margin: 0 0 10px;
  color: var(--muted);
  font-size: 13px;
}

.empty {
  padding: 24px;
  background: var(--panel);
  border-radius: 16px;
  color: var(--muted);
}
</style>
