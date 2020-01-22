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
          <!-- Parte del volver al panel de trabajo -->
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
          <p class="d-inline pt-4">Volver</p>
          <!-- Parte del Zoom -->
          <p class="ml-3 pt-3 d-inline">|</p>
          <v-btn
            @click="btnZoomMenos()"
            elevation="0"
            width="5"
            height="20"
            class="bg-dark d-inline ml-3 mb-1 mt-1"
          >-</v-btn>
          <v-btn
            @click="btnZoomMas()"
            elevation="0"
            width="5"
            height="20"
            class="bg-dark d-inline ml-2 mb-1 mt-1"
          >+</v-btn>
          <v-badge color="grey" overlap>
            <template v-slot:badge>
              <span v-if="zoomActual != 0">{{porcentajeZoom}}</span>
            </template>
            <p class="ml-5 pt-3 mr-2 d-inline">Zoom</p>
          </v-badge>

          <p class="mx-2 pt-3 d-inline">|</p>
          <!--Boton Actualizar -->
          <!-- refresh icon y spinner -->
          <div class="divRefresh d-inline">
            <v-progress-circular v-show="false" :size="15" :width="2" color="gray" indeterminate></v-progress-circular>

            <!-- Boton actualizar -->
            <v-btn elevation="0" width="10" height="22" rounded color="transparent">
              <v-icon height="5px" class="refresh mb-2" @click="btnActualizarWeb()">mdi-refresh</v-icon>
            </v-btn>
          </div>
          <!-- texto actualizar -->
          <p class="pt-4 ml-2 d-inline">Actualizar</p>

          <div class="d-inline">
          <div :class="showTraductor">
          <p class="mx-2 pt-3 d-inline">|</p>
            <!-- Boton Traducir -->
            <div class="d-inline">
              <v-btn
                elevation="0"
                width="10"
                height="22"
                @click="btnAddTraductor()"
                rounded
                color="transparent"
                class="d-inline"
              >
                <v-icon
                  height="5px"
                  class="refresh mb-2"
                >mdi-google-translate</v-icon>
              </v-btn>
            </div>

            <!-- Texto Traducir -->
            <div class="d-inline">
              <p class="pt-4 ml-2 d-inline">Traducir</p>
            </div>
          </div>
          </div>
        </div>
        <!-- div que cierra si es visible o no los menus del app bar-->
        <!-- <div class="pt-4" id="google_translate_element"></div>-->
        <v-spacer></v-spacer>
        <barraSuperior></barraSuperior>
      </v-app-bar>

      <!--navigation-drawer-->
      <v-navigation-drawer
        :permanent="permanentDrawer"
        :miniVariantWidth="toggledrawer"
        :width="widthDrawer"
        app
        value
        clipped
        expand-on-hover
        dark
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

        <v-list v-show="showListDrawer" nav dense>
          <!-- Link de Dashboard-->
          <v-list-item @click="btnDashboard()" link>
            <v-list-item-icon>
              <v-icon>mdi-monitor-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Panel de Trabajo</v-list-item-title>
          </v-list-item>

          <v-list-item v-show="showHistorialPagos" @click="btnHistorial()" link>
            <v-list-item-icon>
              <v-icon>mdi-history</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Historial de Pagos</v-list-item-title>
          </v-list-item>

          <!--Link de Cuenta de usuario-->
          <v-list-item @click="btnCuentaUser()" link>
            <v-list-item-icon>
              <v-icon>mdi-account-card-details-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Cuenta de usuario</v-list-item-title>
          </v-list-item>

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
import { setInterval } from "timers";
const fs = require("fs");
const electron = require("electron");
const BrowserView = electron.remote.BrowserView;
const cheerio = require("cheerio");
const request = require("request");

export default {
  mounted() {
    this.firebaseInit();
    this.PendienteDeActualizar();
    //this.poneOcultaDrawer = this.toggledrawer;
  },
  components: {
    barraSuperior
  },
  data() {
    return {
      toggleNotificationUpdated: false,
      toggleBackDash: true,
      zoomActual: 0,
      porcentajeZoom: "",
      poneOcultaDrawer: false
    };
  },

  updated() {

    console.log("hubo cambios");
  },
  computed: {
    //Muestra el valor de drawer en el store vuex y conf firebase
    ...mapState([
      "toggleBackToDashboard",
      "toggledrawer",
      "permanentDrawer",
      "firebaseConfig",
      "userAuthData",
      "browserViewId",
      "showTraductor",
      "showHistorialPagos",
      "widthDrawer",
      "showListDrawer"
    ])
  },
  methods: {
    //Oculta el drawer desde el el store
    ...mapMutations([
      "hidelistDrawer",
      "ocultaDrawer",
      "muestraDrawer",
      "clearUserData",
      "hideBackDash",
      "hideTranslate",
      "showPayHistory"
    ]),

    //..................Funciones....................

    //1) Boton que desconecta la session del usuario
    btnSignOut() {
      firebase
        .auth()
        .signOut()
        .then(user => {
          console.log(user);
          this.hidelistDrawer()
          //Pone en true el historial de pagos
          this.showPayHistory()
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
      this.hideTranslate();
      ipcRenderer.send("click-dashboard");
      this.muestraDrawer();
      this.btnDashboard();
    },
    //Boton que actualiza la página
    btnActualizarWeb() {
      let view = new BrowserView.fromId(this.browserViewId);
      view.webContents.reload();
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
    //Boton de Zoom menos
    btnZoomMenos() {
      let view = new BrowserView.fromId(this.browserViewId);
      this.zoomActual = view.webContents.getZoomLevel();
      console.log(this.zoomActual);
      let zoomSumado = this.zoomActual - 0.25;
      view.webContents.setZoomLevel(zoomSumado);
      let llevarAporcentaje = zoomSumado * 100;
      this.porcentajeZoom = llevarAporcentaje + "%";
      console.log("Zoom despues de restar: " + this.porcentajeZoom);
      console.log((this.zoomActual = zoomSumado));
    },
    //Boton de Zoom más
    btnZoomMas() {
      let view = new BrowserView.fromId(this.browserViewId);
      this.zoomActual = view.webContents.getZoomLevel();
      console.log(this.zoomActual);
      let zoomSumado = this.zoomActual + 0.25;
      view.webContents.setZoomLevel(zoomSumado);
      let llevarAporcentaje = zoomSumado * 100;
      this.porcentajeZoom = llevarAporcentaje + "%";
      console.log("Zoom despues de sumar: " + this.porcentajeZoom);
      console.log((this.zoomActual = zoomSumado));
    },
    //Boton que envia hacia los cursos
    btnHistorial() {
      this.$router.push({ path: "Historial" });
    },
    //Boton que envia hacia las preguntas frecuentes
    btnPreguntasFrecuentes() {
      this.$router.push({ path: "preguntasFrecuentes" });
    },
    btnCuentaUser() {
      this.$router.push({ path: "cuentaUser" });
    },

    btnAddTraductor() {
      let view = new BrowserView.fromId(this.browserViewId);
      request.get(
        {
          url:
            "https://firebasestorage.googleapis.com/v0/b/adminstore-c7c8c.appspot.com/o/TraductorWeb.js?alt=media&token=45cd8aa4-0623-447b-bb75-f26daea6e069"
        },
        (error, response, body) => {
          console.log(body);
          view.webContents.executeJavaScript(body);
        }
      );
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
.divBotonesNotif {
  right: 3px;
}
.btnMenosMas {
  background-color: rgb(97, 97, 97) (65, 58, 58);
}
</style>
