import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import './index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPowerOff, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import FontAwesomeIcon from '@/lib/FontAwesomeIcon.vue'

library.add(faPowerOff)
library.add(faVolumeUp)

createApp(App)
  .use(store)
  .component('fa', FontAwesomeIcon)
  .mount("#app");
