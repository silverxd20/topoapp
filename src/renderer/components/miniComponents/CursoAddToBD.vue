<template>
  <div>
    <v-expansion-panels dark class="mb-3">
      <v-expansion-panel>
        <!-- Título del desplegable -->
        <v-expansion-panel-header @click="clickDespligue()">
          <h5 class="text-center">Añadir nuevo escenario</h5>
        </v-expansion-panel-header>
        <!-- Contenido del desplegable -->
        <v-expansion-panel-content class="pt-2">
          <v-text-field @keydown.enter="agregarCursosAlaBaseDeDatos()" @paste="pasteInputs()" v-model="modelNameCurso" label="Nombre del curso" outlined></v-text-field>
          <v-text-field @keydown.enter="agregarCursosAlaBaseDeDatos()" @paste="pasteInputs()" v-model="modelTaskId" label="Task_id" outlined></v-text-field>
          <v-text-field @keydown.enter="agregarCursosAlaBaseDeDatos()" @paste="pasteInputs()" v-model="modelDatoEscenario" label="Datos del escenario" outlined></v-text-field>
            <!-- mensaje que da si pasó el escenario o no -->
            <p v-show="ShowMsjEscenario" :class="classMsjColor">{{msjEscenario}}</p>

          <div class="d-flex justify-content-center">
            <!-- boton que agregar los datos a la BD -->
            <button
              :disabled="toogleBtnGuardar"
              @click="agregarCursosAlaBaseDeDatos()"
              class="btn btn-primary d-block"
            >
              <span
                v-show="showLoaderAgregarEscenario"
                class="spinner-border spinner-border-sm mr-1"
              ></span>
              Guardar
            </button>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getListTaskIdGuardados();
  },
  data() {
    return {
      showLoaderAgregarEscenario: false,
      ShowMsjEscenario: false,
      modelNameCurso: "",
      modelTaskId: "",
      modelDatoEscenario: "",
      msjEscenario: "",
      toogleBtnGuardar: false,
      listCursosGuardados: [],
      classMsjColor: "text-center d-block",
      firebaseConfig: {
        apiKey: "AIzaSyBx9HYfNoMzkclTydv60oqKHywN4G7vNfo",
        authDomain: "remodesktop-9b704.firebaseapp.com",
        databaseURL: "https://remodesktop-9b704.firebaseio.com",
        projectId: "remodesktop-9b704",
        storageBucket: "remodesktop-9b704.appspot.com",
        messagingSenderId: "450738698352",
        appId: "1:450738698352:web:1bcc2c00ab77337171dcb5",
        measurementId: "G-2Q69C2TFFR"
      }
    };
  },

  methods: {
    agregarCursosAlaBaseDeDatos() {
      if (!firebase.apps.length) {
        // Inicializa Firebase si la instancia no se ha creado aun.
        firebase.initializeApp(this.firebaseConfig);
        console.log("Creo la instancia");
      }

      let db;
      db = firebase.firestore();

      this.ShowMsjEscenario = false;
      this.toogleBtnGuardar = true;
      this.showLoaderAgregarEscenario = true;

      if (
        this.modelDatoEscenario != "" &&
        this.modelTaskId != "" &&
        this.modelNameCurso != ""
      ) {
        let jsonEscenario = {
          title: this.modelNameCurso,
          payload: this.modelDatoEscenario
        };

        if (this.listCursosGuardados != []) {
          console.log(this.listCursosGuardados.includes(this.modelTaskId))
          if (!this.listCursosGuardados.includes(this.modelTaskId)) {
              db.collection("cursos")
              .doc(this.modelTaskId)
              .set(jsonEscenario)
              .then(respuesta => {
                console.log(respuesta);
                this.ShowMsjEscenario = true;
                this.msjEscenario = "Escenario guardado con éxito!";
                this.toogleBtnGuardar = false;
                this.showLoaderAgregarEscenario = false;

                //Limpia todos los campos
                this.modelDatoEscenario = "";
                this.modelNameCurso = "";
                this.modelTaskId = "";
                this.listCursosGuardados = [];
                this.classMsjColor = "text-center d-block text-success"
                console.log(this.listCursosGuardados);
                //trae de nuevo la lista de cursos actualizadas
                this.getListTaskIdGuardados();
              })
              .catch(function(error) {
                console.error(error);
              });

          } else {
            this.msjEscenario = "Ya este escenario fué agregado.";
            this.classMsjColor = "text-center d-block text-danger"
            this.ShowMsjEscenario = true;
            this.toogleBtnGuardar = false;
            this.showLoaderAgregarEscenario = false;
          
          }
        } else {
          this.msjEscenario =
            "Esperando por la lista de guardada para evitar escenarios repetidos.";
            this.classMsjColor = "text-center d-block text-warning"
          this.ShowMsjEscenario = true;
          this.toogleBtnGuardar = false;
          this.showLoaderAgregarEscenario = false;
        }
      } else {
        this.ShowMsjEscenario = true;
        this.msjEscenario = "Se deben rellenar todos los campos.";
        this.classMsjColor = "text-center d-block text-warning"
        this.toogleBtnGuardar = false;
        this.showLoaderAgregarEscenario = false;
      }
    },

    getListTaskIdGuardados() {
      if (!firebase.apps.length) {
        // Inicializa Firebase si la instancia no se ha creado aun.
        firebase.initializeApp(this.firebaseConfig);
        console.log("Creo la instancia");
      }
      let db;
      db = firebase.firestore();
      //Solicita todos los documentos y su data interna
      db.collection("cursos")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.id) {
              this.listCursosGuardados.push(doc.id);
            }
          });
        });
    },

    pasteInputs(){
      this.ShowMsjEscenario = true;
      this.msjEscenario = "";
    },

    clickDespligue(){
      this.ShowMsjEscenario = false
      this.msjEscenario = ""
    }
  }
};
</script>

<style scoped>

.displayBlock{
  display: block;
}
.divListCursoTop {
  background: rgb(30, 136, 229);
}
.expansionPanel {
  background: rgb(94, 94, 94);
}
</style>