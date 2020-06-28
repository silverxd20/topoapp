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
          <v-text-field
            @keydown.enter="agregarCursosAlaBaseDeDatos()"
            @paste="pasteInputs()"
            v-model="modelNameCurso"
            label="Nombre del curso"
            outlined
          ></v-text-field>
          <v-text-field
            @keydown.enter="agregarCursosAlaBaseDeDatos()"
            @paste="pasteInputs()"
            v-model="modelTaskId"
            label="Task_id"
            outlined
          ></v-text-field>
          <v-text-field
            @keydown.enter="agregarCursosAlaBaseDeDatos()"
            @paste="pasteInputs()"
            v-model="modelDatoEscenario"
            label="Datos del escenario"
            outlined
          ></v-text-field>
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

          <!--AQUI SE AGREGA LAS CATEGORÍAS EN LA BASE DE DATOS -->
          <!-- <hr class="mt-5" />

          <div class="d-flex justify-content-center mb-7 mt-7">
            <h5>Agregar Categoria</h5>
          </div> -->

          <!-- Los campos de textos de categorías -->
          <!-- <div class="d-flex justify-content-center">
            <v-text-field
            @keydown.enter="AddNewCategoryToList()"
            :disabled="toogleCampoCategory"
              v-model="modelNameCategoryMio"
              class="mr-5"
              label="Nombre visual de la categoria"
              outlined
            ></v-text-field>
            <v-text-field
            @keydown.enter="AddNewCategoryToList()"
            :disabled="toogleCampoCategory"
              v-model="modelNameCategoryOficialRemo"
              class="ml-5"
              label="Nombre de la categoría oficial"
              outlined
            ></v-text-field> 
          </div>-->

          <!-- <div class="d-flex justify-content-center">
            <p :class="colorMsjCategory">{{mensajeSuccessErrorListCategory}}</p>
          </div> -->

          <!-- boton que agregar la categoría a la BD -->
          <!-- <div class="d-flex justify-content-center">
            <button
              :disabled="toogleBtnGuardarCategory"
              @click="AddNewCategoryToList()"
              class="btn btn-success d-block"
            >
              <span
                v-show="showLoaderAgregarCategoria"
                class="spinner-border spinner-border-sm mr-1"
              ></span>
              Guardar
            </button>
          </div> -->
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  mounted() {
    this.getListTaskIdGuardados();
    console.log("Lista desde CursoAddToBD:");
    console.log(this.ListaDeCategorias);
  },
  data() {
    return {
      showLoaderAgregarEscenario: false,
      showLoaderAgregarCategoria: false,
      ShowMsjEscenario: false,
      colorMsjCategory: "mt-2 mb-2",
      modelNameCurso: "",
      modelTaskId: "",
      modelDatoEscenario: "",
      modelNameCategoryMio: "",
      modelNameCategoryOficialRemo: "",
      msjEscenario: "",
      mensajeSuccessErrorListCategory: "",
      toogleBtnGuardar: false,
      toogleBtnGuardarCategory: false,
      toogleCampoCategory: false,
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

  computed: {
    ...mapState(["ListaDeCategorias"])
  },

  methods: {
    ...mapMutations(["setCategoryList"]),
    AddNewCategoryToList() {
      this.showLoaderAgregarCategoria = true;
      this.toogleBtnGuardarCategory = true;
      this.toogleCampoCategory = true;

      if (!firebase.apps.length) {
        // Inicializa Firebase si la instancia no se ha creado aun.
        firebase.initializeApp(this.firebaseConfig);
        console.log("Creo la instancia");
      }

      let db;
      db = firebase.firestore();
      
      //Filtro, si los campos estan vacíos no deja enviar, de lo contrario si.
      if (this.modelNameCategoryMio == "" || this.modelNameCategoryOficialRemo == "") {
        this.colorMsjCategory = "text-warning mt-2 mb-2";
        this.mensajeSuccessErrorListCategory = "Llene los campos antes de guardar.";
        this.showLoaderAgregarCategoria = false;
        this.toogleBtnGuardarCategory = false;
        this.toogleCampoCategory = false;

      } else {

      this.colorMsjCategory = "mt-2 mb-2";
      this.mensajeSuccessErrorListCategory = "Guardando la nueva categoría por favor espere...";

        var NewCategoryLocalList = this.ListaDeCategorias;
        var jsonAddNewCategorias = {
        namemio: this.modelNameCategoryMio,
        nameremo: this.modelNameCategoryOficialRemo
      };

      // recorre la lista actual y agrega la nueva al json local
      Object.keys(NewCategoryLocalList).forEach(key => {
        NewCategoryLocalList[this.modelNameCategoryOficialRemo] = jsonAddNewCategorias;
      });

      console.log("Nueva lista desde CursoAddToBD");
      console.log(NewCategoryLocalList);

        //Agregamos la nueva categoría a la base de datos
        db.collection("categorias")
          .doc("todas")
          .set(NewCategoryLocalList)
          .then(respuesta => {
            //Envia al Store la nueva lista de categorias
            this.setCategoryList(NewCategoryLocalList);
            this.colorMsjCategory = "text-success mt-2 mb-2";
            this.mensajeSuccessErrorListCategory = "Se agregó con exito a la base de datos.";
            this.showLoaderAgregarCategoria = false;
            this.modelNameCategoryMio = ""
            this.modelNameCategoryOficialRemo = ""
            this.toogleBtnGuardarCategory = false;
            this.toogleCampoCategory = false;
          })
          .catch(error => {
            console.log("No se pudo guardar la nueva categoría");
            console.log(error);
            this.colorMsjCategory = "text-danger mt-2 mb-2";
            this.mensajeSuccessErrorListCategory = "No se pudo guardar, intente de nuevo.";
            this.showLoaderAgregarCategoria = false;
            this.toogleBtnGuardarCategory = false;
            this.toogleCampoCategory = false;
          });
      }
    },

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
          console.log(this.listCursosGuardados.includes(this.modelTaskId));
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
                this.classMsjColor = "text-center d-block text-success";
                console.log(this.listCursosGuardados);
                //trae de nuevo la lista de cursos actualizadas
                this.getListTaskIdGuardados();
              })
              .catch(function(error) {
                console.error(error);
              });
          } else {
            this.msjEscenario = "Ya este escenario fué agregado.";
            this.classMsjColor = "text-center d-block text-danger";
            this.ShowMsjEscenario = true;
            this.toogleBtnGuardar = false;
            this.showLoaderAgregarEscenario = false;
          }
        } else {
          this.msjEscenario =
            "Esperando por la lista de guardada para evitar escenarios repetidos.";
          this.classMsjColor = "text-center d-block text-warning";
          this.ShowMsjEscenario = true;
          this.toogleBtnGuardar = false;
          this.showLoaderAgregarEscenario = false;
        }
      } else {
        this.ShowMsjEscenario = true;
        this.msjEscenario = "Se deben rellenar todos los campos.";
        this.classMsjColor = "text-center d-block text-warning";
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

    pasteInputs() {
      this.ShowMsjEscenario = true;
      this.msjEscenario = "";
    },

    clickDespligue() {
      this.ShowMsjEscenario = false;
      this.msjEscenario = "";
    }
  }
};
</script>

<style scoped>
.displayBlock {
  display: block;
}
.divListCursoTop {
  background: rgb(30, 136, 229);
}
.expansionPanel {
  background: rgb(94, 94, 94);
}
</style>