<template>
  <div>
    <div class="divTotal">
      <v-alert
      v-show= "toggleAlert"
      text
      prominent
      type="error"
      icon="mdi-cloud-alert"
    >
    Problemas con el internet, recuperando la conexión...
    </v-alert>
      <div class="divElements">
        <h1>Iniciando Toposat vector...</h1>
      </div>
      <div class="divElements">
        <v-progress-circular :size="40" :width="5" color="dark" indeterminate></v-progress-circular>
      </div>
      <div class="divElements">
        <img class="imgScreen" src="../../assets/toposatScreen.png" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";

export default {
  mounted() {
    this.firebaseInit();
    this.MonitorDeSession();
  },
  data() {
    return {
      toggleAlert: false
    };
  },
  computed: {
    //Trae la configuracion de firebase desde el store de vuex
    ...mapState(["firebaseConfig"])
  },
  methods: {
    //Oculta y muestra el panel lateral desde el store vuex
    ...mapMutations(["ocultaDrawer", "muestraDrawer"]),
    ...mapActions(["getUserAuthData"]),

    firebaseInit() {
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
    },

    //Listener que observa si tienes la session activa o no para redireccionar
    MonitorDeSession() {
      firebase.auth().onAuthStateChanged(async user => {
        for (let index = 0; index < 1; index++) {
          try {
            console.log(user);
            let userData;
            if (user) {
              //Si ya tiene la session abierta pasa al dashboard
              userData = await this.getUserAuthData(user);
              console.log(userData);
              this.muestraDrawer();
              this.$router.push({ path: "Dashboard"})
              console.log("Luego del push dashboard");
            } else {
              //Si no tiene ninguna session lo enví al login
              this.$router.push({ path: "Login" });
              this.ocultaDrawer();
            }
          } catch (error) {
            index = -1
            this.toggleAlert = true
            setTimeout(() =>{  
            console.log("Error ocurrido de firebase, reintentando...");       
            },1000)                
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.imgScreen {
  height: 410px;
  width: 620px;
}
.divElements {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.imgScreen {
  margin-top: 3pc;
}
</style>