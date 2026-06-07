import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LyricsPlayer from '../../shared/vue/LyricsPlayer.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('LyricsPlayer', LyricsPlayer)
  },
} satisfies Theme
