import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import EntryMedia from './components/EntryMedia.vue'
import LyricsPlayer from '../../shared/vue/LyricsPlayer.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('LyricsPlayer', LyricsPlayer)
    app.component('EntryMedia', EntryMedia)
  },
} satisfies Theme
