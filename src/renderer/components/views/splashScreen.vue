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
        <h1 class="d-inline">Iniciando Toposat vector...</h1>
        <div class="d-inline version">
        </div>
      </div>
      <div class="divElements">
        <v-progress-circular :size="40" :width="5" color="dark" indeterminate></v-progress-circular>
      </div>
      <v-container fluid grid-list-xs>
        <v-layout row wrap>
          <v-flex xs12>
            <img class="imgScreen" src="../../assets/splashEdited.png" />
          </v-flex>
        </v-layout>
      </v-container>
 
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
    ...mapMutations(["ocultaDrawer","showCursosBot", "muestraDrawer","hidePayHistory","showlistDrawer"]),
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
            let userData;
            if (user) {
              //Si ya tiene la session abierta pasa al dashboard
              userData = await this.getUserAuthData(user);
              console.log(userData);
              if(userData.premium == true){
                this.hidePayHistory()
                this.showCursosBot()
              }
              this.showlistDrawer()
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
            },3000)                
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.imgScreen {
  width: 100%;
}
.divElements {
  display: flex;
  justify-content: center;
  padding-top: 15px;
}
.imgScreen {
  margin-top: 3pc;
}
.divTotal{
  background-color: rgb(247, 247, 247)
}

</style>