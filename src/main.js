import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

// 생성한 뷰 라우터 받아오기
import { router } from './router/index.js'

loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
