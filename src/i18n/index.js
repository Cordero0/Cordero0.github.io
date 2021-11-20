import { createI18n } from 'vue-i18n';
import zh from './config/zh';
import en from './config/en';
import store from '@/store/index.js';


const localeData = {
  legacy: false,
  locale: store.state.language || 'zh_CN',
  messages: {
    'zh_CN': zh,
    'en_US': en,
  }
}

export function setupI18n(app) {
  const i18n = createI18n(localeData);
  app.use(i18n);
}
