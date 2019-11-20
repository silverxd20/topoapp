<template>
  <div>
    <v-app>
      <!--Notificar que se ha actualizado-->
      <div id="notification" v-show="toggleNotificationUpdated">
        <div class="divTopCardNotif bg-success text-light">
          <v-icon class="pl-3 mb-2 text-light d-inline">mdi-cloud-download-outline</v-icon>
          <p class="pl-1 d-inline">Nueva actualización!</p>
        </div>
        <div class="divCardNotifInfo">
          <p id="message">Para aplicar los cambios se debe reiniciar el app, desea hacerlo ahora?</p>
          <div class="divBotonesNotif">
            <v-btn @click="btnCerrarNotif()">Luego</v-btn>
            <v-btn @click="btnReiniciarApp()">Reiniciar</v-btn>
          </div>
        </div>
      </div>
      <!-- App-bar -->
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
              <v-list-item-avatar>
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
import { ipcRenderer } from "electron";
const electron = require("electron");
const BrowserView = electron.remote.BrowserView;

export default {
  mounted() {
    this.firebaseInit();
    this.PendienteDeActualizar();
  },
  components: {
    barraSuperior
  },
  data() {
    return {
      toggleNotificationUpdated: false,
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
    ...mapMutations([
      "ocultaDrawer",
      "muestraDrawer",
      "clearUserData",
      "hideBackDash"
    ]),

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
      ipcRenderer.send("click-dashboard");
      this.muestraDrawer();
      this.btnDashboard();
    },
    //Boton que envia hacia el dashboard
    btnDashboard() {
      this.$router.push({ path: "Dashboard" });
    },
    PendienteDeActualizar() {
      ipcRenderer.on("update_downloaded", () => {
        ipcRenderer.removeAllListeners("update_downloaded");
        this.toggleNotificationUpdated = true;
      });
    },
    //Oculta la notificación
    btnCerrarNotif() {
      this.toggleNotificationUpdated = false;
    },
    //Reinicia el app e instala la actualización
    btnReiniciarApp() {
      ipcRenderer.send("restart_app");
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
.divBtnback {
  visibility: hidden;
}

#notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  z-index: 3;
}
.divTopCardNotif {
  height: 25px;
  border-radius: 5px 5px 0px 0px;
}
.divCardNotifInfo {
  padding: 20px;
}
.divBotonesNotif{
  right: 3px;
}
</style>
