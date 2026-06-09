import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import EntryMedia from './components/EntryMedia.vue'
import JournalDate from './components/JournalDate.vue'
import LyricsPlayer from '../../shared/vue/LyricsPlayer.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('LyricsPlayer', LyricsPlayer)
    app.component('EntryMedia', EntryMedia)
    app.component('JournalDate', JournalDate)
  },
} satisfies Theme
