<template>
  <div>

<div class="divTotal mt-5 h-100">
  <div class="d-flex justify-content-center">
    <h1>Iniciando Toposat vector...</h1>
  </div>
  <div class=" d-flex justify-content-center">
    <v-progress-circular
      :size="40"
      :width="7"
      color="dark"
      indeterminate
    ></v-progress-circular>
  </div>
  <div class="d-flex justify-content-center mt-5 h-100 d-inline-block">
    <img class="imgScreen" src="../../assets/toposatScreen.png">
  </div>
</div>


  </div>
</template>

<script>
import {mapMutations} from 'vuex';

export default {
    mounted() {
    this.firebaseInit();
    this.MonitorDeSession()
  },
    data() {
        return {
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
        }
    },
  methods: {
      //Trae la configuracion de firebase desde el store de vuex
      ...mapMutations(["ocultaDrawer", "muestraDrawer"]),
     firebaseInit() {
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
     },

     //Listener que observa si tienes la session activa o no para redireccionar 
    MonitorDeSession() {
        
      //LISTENER DE CAMBIO DE SESSION
      firebase.auth().onAuthStateChanged((user)=> {
        if (user) {
        //Si ya tiene la session abierta pasa al dashboard
          this.$router.push({ path: "Dashboard"})
          this.muestraDrawer()
        } else {
        //Si no tiene ninguna session lo enví al login    
         this.$router.push({ path: "Login"})
         this.ocultaDrawer()
        }
      });
    }
  }
};
</script>

<style scoped>

.imgScreen{
  height: 410px;
  width: 620px;
  
}
</style>