<template>
  <div>
    <h1>Cargando Toposat vector... {{firebaseConfig}}</h1>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
    created() {
    this.firebaseInit();
    this.MonitorDeSession()
  },
    data() {
        return {
            
        }
    },
  methods: {
      ...mapState(["firebaseConfig"]),
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
        } else {
        //Si no tiene ninguna session lo enví al login    
         this.$router.push({ path: "Login"})
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>