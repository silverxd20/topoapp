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
import {mapMutations, mapState} from 'vuex';

export default {
    mounted() {
    this.firebaseInit();
    this.MonitorDeSession()
  },
    data() {
        return {
          
        }
    },
    computed: {
      //Trae la configuracion de firebase desde el store de vuex
    ...mapState(["firebaseConfig"]),
  },
  methods: {
      //Oculta y muestra el panel lateral desde el store vuex
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