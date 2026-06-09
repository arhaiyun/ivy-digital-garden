<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

type Asset = {
  kind?: string
  path?: string
  caption?: string
}

const { frontmatter } = useData()

const assets = computed(() => {
  const list = (frontmatter.value.assets || []) as Asset[]
  return list.map((asset) => ({
    ...asset,
    url: toPublicUrl(asset.path || ''),
  })).filter((asset) => asset.url)
})

function toPublicUrl(path: string) {
  return `/${path.replace(/^media\//, '')}`
}
</script>

<template>
  <div v-if="assets.length" class="entry-media">
    <figure v-for="(asset, index) in assets" :key="`${asset.path}-${index}`" class="entry-media-item">
      <img v-if="asset.kind === 'photo'" :src="asset.url" :alt="asset.caption || ''" loading="lazy" />
      <video v-else-if="asset.kind === 'video'" controls :src="asset.url" />
      <audio v-else-if="asset.kind === 'audio'" controls :src="asset.url" />
      <figcaption v-if="asset.caption">{{ asset.caption }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.entry-media {
  display: grid;
  gap: 16px;
  margin: 16px 0;
}

.entry-media-item {
  margin: 0;
}

.entry-media-item img,
.entry-media-item video {
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(232, 135, 154, 0.12);
}

.entry-media-item figcaption {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: var(--ivy-muted, #8a7f96);
}
</style>
