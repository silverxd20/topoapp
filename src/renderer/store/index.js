import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState, createSharedMutations } from 'vuex-electron'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    BackDashboard: false,  
    browserViewId:"0",
    toggledrawer: false,
    userAuthData: {
      nombre: "...",
      apellido: " ",
      email: "..."
    },
    db: "",
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
    showBackDash (state) {
      state.showBackDashboard = true
    },
    hideBackDash (state) {
      state.showBackDashboard = false
    },
    browserId (state,payload) {
      state.browserViewId = payload
    },
    ocultaDrawer (state) {
      state.toggledrawer = false
    },
    muestraDrawer (state) {
      state.toggledrawer = true
    },
    showUserAuthData(state, payload){
      state.userAuthData = payload
    }, 
    clearUserData(state){
      state.userAuthData = {
        nombre: "...",
        apellido: "",
        email: "..."
      }
    },
  },
  
  actions: {
   async getUserAuthData({commit}, payload){
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
      this.db = firebase.firestore();

      var docRef = this.db.collection("usuarios").doc(payload.uid);
      docRef.get().then((doc)=> {
      if (doc.exists) {

      commit("showUserAuthData",doc.data())
      } else {
      // doc.data() will be undefined in this case
      console.log('No hay documentos')
      }
      }).catch(function(error) {
      console.log('Error getting document:', error);
      });
      
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
