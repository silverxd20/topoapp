<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex xs12>
          <v-card>
            <div class="bg-primary divTituloPagoPaypal">
              <p class="pl-3 pt-3 text-light textoTituloPaypal">Historial de Pagos Paypal</p>
            </div>
            <v-data-table
              :headers="titulos"
              :items="datosdepago"
              :items-per-page="5"
              class="elevation-1"
              :no-data-text="tableText"
              no-results-text="Todos tus pagos semanales se verán reflejados aquí."
            ></v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      indexPagoPaypalData: "",
      tableText: "",
      titulos: [
        { text: "Fecha (mes/dia/año)", value: "fecha" },
        { text: "Referencia Paypal", value: "transactionid" },
        { text: "Monto Pagado", value: "monto" }
      ],
      datosdepago: []
    };
  },

  mounted() {
    this.initFunction();
    this.getListHistorialPagoPaypal();
  },
  computed: {
    ...mapState(["firebaseConfig", "userAuthData"])
  },

  methods: {
    initFunction() {
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
    },

    getListHistorialPagoPaypal() {
      let db;
      db = firebase.firestore();
      for (let index = 0; index < 1; index++) {
        try{
        //Solicita todos los documentos y su data interna
        db.collection("historialpagos")
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              if (doc.id == this.userAuthData.userid) {
                this.tableText = "Cargando lista...";
                let listaPagos = Object.values(doc.data());
                let listaInvertida = listaPagos.reverse();
                for (const index in listaInvertida) {
                  console.log(listaPagos[index].confirm);
                  this.datosdepago.push(listaPagos[index].confirm);
                }
              } else {
                console.log("No existe este id");
                this.tableText =
                  "Todos tus pagos semanales se verán reflejados aquí.";
              }
            });
          });
        }catch(error){
          console.log("error trayendo lista de pagos, reintentando...")
          index = -1
        }

      }
    }
  }
};
</script>

<style scoped>
.divTituloPagoPaypal {
  height: 45px;
}
.textoTituloPaypal {
  font-size: 18px;
}
</style>