import Vue from "vue";
import Vuex from "vuex";
import { createPersistedState, createSharedMutations } from "vuex-electron";
import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    toggleBackToDashboard: "divBtnback d-inline",
    browserViewId: "0",
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
    showBackDash(state) {
      //Aplica otro nombre a la clase deje de ocultar y muestre el back to dashboard
      state.toggleBackToDashboard = "divBtnbackON";
    },
    hideBackDash(state) {
      //Aplica el nombre de la clase correcto para que oculte el back to dashboard
      state.toggleBackToDashboard = "divBtnback d-inline";
    },
    browserId(state, payload) {
      state.browserViewId = payload;
    },
    ocultaDrawer(state) {
      state.toggledrawer = false;
    },
    muestraDrawer(state) {
      state.toggledrawer = true;
    },
    showUserAuthData(state, payload) {
      state.userAuthData = payload;
      console.log("Datos de usuarios metidos al store");
    },
    clearUserData(state) {
      state.userAuthData = {
        nombre: "...",
        apellido: "",
        email: "..."
      };
    }
  },

  actions: {
    getUserAuthData({ commit }, payload) {
      let db;
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
      db = firebase.firestore();
      return db.collection("usuarios")
        .doc(payload.uid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            //Envia la funcion al mutation y luego la retorna
           commit("showUserAuthData",doc.data())
            return doc.data();
          } else {
            return Promise.reject("No hay usuario");
          }
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
});
