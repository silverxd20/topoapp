import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    toggleBackToDashboard: "divBtnback d-inline",
    browserViewId: "0",
    toggledrawer: false,
    showTraductor: "divBtnback d-inline",
    showHistorialPagos: true,
    userAuthData: "",
    ListPagosPaypal: [],
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
    showPayHistory(state){
      state.showHistorialPagos = true;
    },
    hidePayHistory(state){
      state.showHistorialPagos = false;
    },
    showTranslate(state){
      state.showTraductor = "divBtnbackON d-inline";
    },
    hideTranslate(state){
      state.showTraductor = "divBtnback d-inline";
    },
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
      console.log("Antes: "+state.toggledrawer)
      state.toggledrawer = false;
      console.log("Despues: "+state.toggledrawer)
    },
    muestraDrawer(state) {
      state.toggledrawer = true;
    },
    showUserAuthData(state, payload) {
      state.userAuthData = payload;
      console.log("Datos de usuarios metidos al store");
    },
    actualizaAuthData(state, payload){
      state.userAuthData = payload
    },
    clearUserData(state) {
      state.userAuthData = {
        nombre: "...",
        apellido: "",
        email: "..."
      };
    },
    setListaPaypal(state,payload){
      let listapago = Object.value(payload)
      let listaInvertida = listapago.reverse();
                
                for (const index in listaInvertida) {
                  state.ListPagosPaypal.push(payload[index].confirm);
                }
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
    },

    getListPagoPaypal({ commit },payload){
      let db;
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
      db = firebase.firestore();
      for (let index = 0; index < 1; index++) {
        try{

        //Solicita todos los documentos y su data interna
        db.collection("historialpagos")
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              console.log(payload.userid)
              if (doc.id == payload.userid) {
                this.tableText = "Cargando lista...";
                commit("setListaPaypal", doc.data())
              } else {
                console.log("No existe este id");
                this.tableText =
                  "Todos tus pagos semanales se verán reflejados aquí.";
              }
            });
          });
        }catch(error){
          console.log("error trayendo lista de pagos, reintentando...")
          index = -1
        }

      }
    }
  }

});
