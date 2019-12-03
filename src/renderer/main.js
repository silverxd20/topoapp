import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import { remote } from 'electron'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
/* Importa vuetify, colocarlo siempre antes de new vue */
const vuetifyOptions = { }
Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
})
/* eslint-disable no-new */
new Vue({
  vuetify: new Vuetify(vuetifyOptions),
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')

//Habilita la devtool en productions

/*remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

//Habilita los shortcut en productions

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})*/