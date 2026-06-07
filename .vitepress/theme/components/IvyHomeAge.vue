<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

const { theme, frontmatter } = useData()
const route = useRoute()
const ready = ref(false)

const isHome = computed(() => {
  return route.path === '/' || frontmatter.value.layout === 'home'
})

const ageDays = computed(() => {
  const birth = theme.value.ivyBirthDate as string | undefined
  if (!birth) return null
  const start = new Date(`${birth}T00:00:00`)
  const now = new Date()
  const diff = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return diff + 1
})

onMounted(() => {
  const attach = () => {
    if (document.querySelector('.VPHomeHero .main')) {
      ready.value = true
      return
    }
    requestAnimationFrame(attach)
  }
  attach()
})
</script>

<template>
  <Teleport v-if="isHome && ready && ageDays != null" to=".VPHomeHero .main">
    <p class="ivy-home-age">
      今天是你来到世界的第 <strong>{{ ageDays }}</strong> 天 ~
    </p>
  </Teleport>
</template>
