import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(far, fab, fas)

dom.watch()

createApp(App).use(router).mount('#app')
