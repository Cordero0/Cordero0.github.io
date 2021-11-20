import { createApp } from 'vue'
import store from './store/index.js'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { emoji } from './components/Emoji/assets/emoji.js'
import { setupI18n } from './i18n/'

const app = createApp(App)
app.config.globalProperties.emoji = emoji

app.use(router)
app.use(store)
app.use(Antd)
setupI18n(app)
app.mount('#app')

