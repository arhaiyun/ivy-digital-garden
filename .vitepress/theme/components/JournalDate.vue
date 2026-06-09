<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

function parseDateParts(raw: unknown) {
  if (!raw) return null

  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return {
      year: raw.getFullYear(),
      month: raw.getMonth() + 1,
      day: raw.getDate(),
    }
  }

  const match = String(raw).trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}

const label = computed(() => {
  const parts = parseDateParts(frontmatter.value.date)
  if (!parts) return ''

  const text = `${parts.year}年${parts.month}月${parts.day}日`

  const ageDays = frontmatter.value.ivy_age_days
  if (ageDays == null || ageDays === '') return text

  const dayCount = Number(ageDays) + 1
  return `${text} · 出生第 ${dayCount} 天`
})
</script>

<template>
  <p v-if="label" class="journal-date">{{ label }}</p>
</template>
