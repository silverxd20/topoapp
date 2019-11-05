<template>
  <div>
    <v-app>
      <v-app-bar clipped-left height="25" app dark>
        <v-spacer></v-spacer>
        <barraSuperior></barraSuperior>
      </v-app-bar>

      <!--navigation-drawer-->
      <v-navigation-drawer
        :permanent="Drawer"
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
                <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item link two-line>
              <v-list-item-content>
                <v-list-item-title>Leonardo Galindo</v-list-item-title>
                <v-list-item-subtitle>Leo@gmail.com</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>

        <v-divider></v-divider>

        <v-list nav dense>
          <!-- Link de Dashboard-->
          <v-list-item @click="btnDashboard()" link>
            <v-list-item-icon>
              <v-icon>mdi-monitor-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>

          <!-- Link de Entrenamiento-->
          <v-list-item @click="btnVideoCursos()" link>
            <v-list-item-icon>
              <v-icon>mdi-library-video</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Entrenamiento</v-list-item-title>
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
import {mapState} from 'vuex';

export default {
  mounted() {
    this.firebaseInit();
  },
  components: {
    barraSuperior
  },
  data() {
    return {
      Drawer: true,
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
    };
  },
  computed: {
        //Muestra el valor de drawer en el store vuex
    ...mapState(["toggledrawer"])
  },
  methods: {

    //..................Funciones....................

    //1) Boton que desconecta la session del usuario
    btnSignOut() {
      firebase
        .auth()
        .signOut()
        .then(user => {
          console.log(user);
          //Envia al usuario al login
          this.$router.push({ path: "Login" });
          this.toogleDrawer = false;
        });
    },

    //Boton que envia hacia el dashboard
    btnDashboard() {
      this.$router.push({ path: "Dashboard" });
    },
    //Boton que envia hacia los cursos
    btnVideoCursos() {
      this.$router.push({ path: "videoCursos" });
    },
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

<style>
/* CSS */
</style>
