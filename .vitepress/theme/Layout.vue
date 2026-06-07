<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import IvyHomeAge from './components/IvyHomeAge.vue'

const DefaultLayout = DefaultTheme.Layout
</script>

<template>
  <div class="ivy-shell">
    <div class="ivy-clouds" aria-hidden="true">
      <div class="ivy-cloud" />
      <div class="ivy-cloud" />
      <div class="ivy-cloud" />
    </div>
    <DefaultLayout />
    <IvyHomeAge />
  </div>
</template>

<style scoped>
.ivy-shell {
  min-height: 100vh;
  position: relative;
}
</style>
