<template>
  <div>
    <v-app>
      <v-app-bar clipped-left height="25" app dark>
        <div :class="toggleBackToDashboard">
          <v-btn
            @click="btnBackToDashboard()"
            elevation="0"
            width="10"
            height="22"
            rounded
            color="transparent"
            class="btnback d-inline"
          >
            <v-icon height="22">mdi-keyboard-backspace</v-icon>
          </v-btn>
          <p class="d-inline" pt-3>Volver</p>
        </div>
        <v-spacer></v-spacer>
        <barraSuperior></barraSuperior>
      </v-app-bar>

      <!--navigation-drawer-->
      <v-navigation-drawer
        :permanent="toggledrawer"
        app
        value
        clipped
        expand-on-hover
        dark
        mini-variant-width="50px"
      >
        <template v-slot:prepend>
          <v-list>
            <v-list-item>
              <v-list-item-avatar >
                <img src="../renderer/assets/userLocation.png" />
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item-content>
              <v-list-item-title class="pl-3">{{userAuthData.nombre+" "+userAuthData.apellido}}</v-list-item-title>
              <v-list-item-subtitle class="pl-3">{{userAuthData.email}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list>
        </template>

        <v-divider></v-divider>

        <v-list nav dense>
          <!-- Link de Dashboard-->
          <v-list-item @click="btnDashboard()" link>
            <v-list-item-icon>
              <v-icon>mdi-monitor-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Panel de Trabajo</v-list-item-title>
          </v-list-item>

          <!-- Link de Entrenamiento
          <v-list-item @click="btnVideoCursos()" link>
            <v-list-item-icon>
              <v-icon>mdi-library-video</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Entrenamiento</v-list-item-title>
          </v-list-item>-->

          <!-- Link de Preguntas frecuentes-->
          <v-list-item @click="btnPreguntasFrecuentes()" link>
            <v-list-item-icon>
              <v-icon>mdi-comment-question-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Preguntas frecuentes</v-list-item-title>
          </v-list-item>
        </v-list>

        <!-- Boton desconectarse-->
        <template v-slot:append>
          <v-list-item @click="btnSignOut()" color="blue" link>
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Desconectarse</v-list-item-title>
          </v-list-item>
        </template>
      </v-navigation-drawer>

      <!-- contenido de la aplicacion, las vistas aqui-->
      <v-content app>         
            <router-view></router-view>      
      </v-content>
    </v-app>
  </div>
</template>

<script>
import barraSuperior from "./components/barraSuperior/barraSuperior";
import { mapState, mapMutations } from "vuex";
import {ipcRenderer} from 'electron';
const electron = require("electron");
const BrowserView = electron.remote.BrowserView;

export default {
  mounted() {
    this.firebaseInit();
  },
  components: {
    barraSuperior
  },
  data() {
    return {
      toggleBackDash: false
    };
  },
  computed: {
    //Muestra el valor de drawer en el store vuex y conf firebase
    ...mapState([
      "toggleBackToDashboard",
      "toggledrawer",
      "firebaseConfig",
      "userAuthData",
      "browserViewId"
    ])
  },
  methods: {
    //Oculta el drawer desde el el store
    ...mapMutations(["ocultaDrawer","muestraDrawer", "clearUserData", "hideBackDash"]),

    //..................Funciones....................

    //1) Boton que desconecta la session del usuario
    btnSignOut() {
      firebase
        .auth()
        .signOut()
        .then(user => {
          console.log(user);
          //Oculta el drawer desde vuex
          this.ocultaDrawer();
          //Limpia los datos del usuario anterior
          this.clearUserData();
          //Envia al usuario al login
          this.$router.push({ path: "Login" });
        });
    },
    //Boton que envia hacia el dashboard
    btnBackToDashboard() {
      let view = new BrowserView.fromId(this.browserViewId);
      view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      this.hideBackDash();
      ipcRenderer.send("click-dashboard")
      this.muestraDrawer();
      this.btnDashboard();
    },
    //Boton que envia hacia el dashboard
    btnDashboard() {
      this.$router.push({ path: "Dashboard" });
    },
    //Boton que envia hacia los cursos
    /*btnVideoCursos() {
      this.$router.push({ path: "videoCursos" });
    },*/
    //Boton que envia hacia las preguntas frecuentes
    btnPreguntasFrecuentes() {
      this.$router.push({ path: "preguntasFrecuentes" });
    },
    //..................listeners....................

    //Inicializa firebase en caso de que no este iniciado.
    firebaseInit() {
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
        console.log("firebase inicializado");
      }
    }
  }
};
</script>

<style scoped>
.divBtnback{
 visibility: hidden

}
</style>
