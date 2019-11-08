import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState, createSharedMutations } from 'vuex-electron'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    toggledrawer: false,
    firebaseConfig: {
      apiKey: "AIzaSyBx9HYfNoMzkclTydv60oqKHywN4G7vNfo",
      authDomain: "remodesktop-9b704.firebaseapp.com",
      databaseURL: "https://remodesktop-9b704.firebaseio.com",
      projectId: "remodesktop-9b704",
      storageBucket: "",
      messagingSenderId: "450738698352",
      appId: "1:450738698352:web:1bcc2c00ab77337171dcb5",
      measurementId: "G-2Q69C2TFFR"
    }
  },
  
  mutations: {
    ocultaDrawer (state) {
      state.toggledrawer = false
    },
    muestraDrawer (state) {
      state.toggledrawer = true
    }
  },
  
  actions: {
    someAsyncTask ({ commit }) {
      // do something async
      commit('INCREMENT_MAIN_COUNTER')
    }
  }



  //Probar luego con los modulos por defecto a ver si logro hacerlo funcionar.
 /* modules,
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'*/
})
