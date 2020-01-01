<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex xs12>
          <v-card>
            <div class="bg-primary divTituloPagoTrabajos">
              <p class="pl-3 pt-3 text-light textoTituloTrabajos">Historial de trabajos</p>
            </div>
            <v-data-table
              :headers="titulos"
              :items="datosdetrabajos"
              :items-per-page="5"
              class="elevation-1"
              :no-data-text="tableText"
              no-results-text="Todos los trabajos enviados los podras ver aqui."
            ></v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
const request = require("request");

export default {
      mounted() {
    this.initFunctions();
    this.getListHistorialTrabajos();
  },
  data() {
      return {
          tableText: "Todos los trabajos enviados los podras ver aqui.",
          titulos: [
        { text: "Categoría", value: "categoria" },
        { text: "Nombre del trabajo", value: "nombre" },
        { text: "Enviado", value: "enviado" },
        { text: "Revisado", value: "revisado" },
        { text: "Estado", value: "estado" },
        { text: "Pago", value: "pago" },
      ],
      datosdetrabajos: []
      }
  },
  computed: {
    ...mapState(["firebaseConfig", "userAuthData"])
  },
  methods: {
     initFunctions(){
        if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
    },

    //Trae la list de todo el task log
    getListHistorialTrabajos(){

    },
  },
    
};
</script>

<style scoped>

.divTituloPagoTrabajos {
  height: 45px;
}
.textoTituloTrabajos {
  font-size: 18px;
}
</style>