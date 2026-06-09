<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const label = computed(() => {
  const raw = frontmatter.value.date as string | undefined
  if (!raw) return ''

  const [year, month, day] = raw.split('-').map(Number)
  const text = `${year}年${month}月${day}日`

  const ageDays = frontmatter.value.ivy_age_days
  if (ageDays == null || ageDays === '') return text

  const dayCount = Number(ageDays) + 1
  return `${text} · 出生第 ${dayCount} 天`
})
</script>

<template>
  <p v-if="label" class="journal-date">{{ label }}</p>
</template>
