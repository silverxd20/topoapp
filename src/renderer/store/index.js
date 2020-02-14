import Vue from "vue";
import Vuex from "vuex";
let request = require("request");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    toggleBackToDashboard: "divBtnback d-inline",
    browserViewId: "0",
    permanentDrawer: true,
    toggledrawer: "0px",
    showBotCursos: false,
    widthDrawer: "256px",
    showTraductor: "divBtnback d-inline",
    showHistorialPagos: true,
    userAuthData: "",
    showListDrawer: true,
    ListPagosPaypal: [],
    ListaDeCursos: [],
    jwtList: [],
    toggleBtnGetCurso: false,
    showLoaderCurso: false,
    msjLoadingCurso: "Seleccione una categoría, la cuenta y presione el boton para iniciar.",
    JwtFromListUserJson: {},
    JwtFromListUserArray: [],
    nombreApellido: {
      nombre: "-",
      apellido: "",
      categoria: "Categoría",
      cuenta: "Cuenta"
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
    showCursosBot(state){
      state.showBotCursos = true;
    },
    hideCursosBot(state){
      state.showBotCursos = false;
    },
    showlistDrawer(state){
      state.showListDrawer = true;
    },
    hidelistDrawer(state){
      state.showListDrawer = false;
    },
    showlistDrawer(state){
      state.showListDrawer = true;
    },
    hidelistDrawer(state){
      state.showListDrawer = false;
    },
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
      //state.widthDrawer = "0px";
      state.toggledrawer = "0px";
    },
    muestraDrawer(state) {
      state.permanentDrawer = true;
      state.toggledrawer = "50px";
      state.widthDrawer = "256px";
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
    },

    //Parte del bot de cursos
    llenarCursos(state, payload) {
      state.ListaDeCursos = payload.Cursos;
      state.jwtList = payload.Jwt;
      state.showLoaderCurso = false;
      state.msjLoadingCurso = "";
      state.toggleBtnGetCurso = false;
    },
    disableBtnGetCursoTrue(state) {
      state.toggleBtnGetCurso = true;
    },
    disableBtnGetCursoFalse(state) {
      state.toggleBtnGetCurso = false;
    },
    habilitaLoaderCurso(state) {
      state.msjLoadingCurso = "Cargando lista de cursos...";
      state.showLoaderCurso = true;
    },
    deshabilitaLoaderCurso(state) {
      state.msjLoadingCurso = "";
      state.showLoaderCurso = false;
    },

    LimpiarListaCursos(state) {
      state.ListaDeCursos = [];
    },

    nombreApellidoUser(state, payload) {
      state.nombreApellido = payload;
    },

    listaDeJwtFromListUser(state, payload) {
      state.JwtFromListUserJson = payload;
      state.JwtFromListUserArray = Object.values(payload);
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
    },

    //Trae los cursos de la cuenta de los usuarios va en vuex
    async traeCursos({ commit }, jwtSelected) {
      let myHeaders = {
        url: "https://api-internal.scale.com/internal/courses/available",
        method: "GET", // or 'POST'
        referrerPolicy: "no-referrer",
        headers: {
          accept: "*/*",
          "accept-language": "es,es-ES;q=0.9,en;q=0.8",
          "finger-print": "",
          authorization: jwtSelected,
          "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
        }
      };

      try {
        request(myHeaders, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            console.log(json);
            console.log(response);
            //Crea un payload con los parametros
            let payload = { Jwt: jwtSelected, Cursos: json.courses };

            //Hace commit a mutation enviando multiparametro en payload
            commit("llenarCursos", payload);
          } else if (response.statusCode == 403) {
            console.log(response);
            commit("deshabilitaLoaderCurso");
            commit("disableBtnGetCursoFalse");
            toastr.error("El usuario está Baneado.", "Mensaje", {
              timeOut: 4000,
              closeButton: true
            });
          }
        });
      } catch (error) {
        commit("disableBtnGetCursoFalse");
        commit("deshabilitaLoaderCurso");
        console.log("Error trayendo cursos: " + error);
      }
    }
  }

});
