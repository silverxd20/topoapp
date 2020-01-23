<template>
  <div>
    <v-card height="400px">
      <div class="pl-3 pt-1 pb-1 bg-success text-light">
        <div class="divBarraTituloDropdown">
          <h6 class="d-inline">Cursos de: {{nombreApellido.nombre +" "+nombreApellido.apellido}}</h6>
          <div class="divBtnlistCurso d-inline">
            <v-btn :disabled="toggleBtnGetCurso" @click="clickGetListCurso()" class="bg-transparent" elevation="0" rounded>
              <v-icon>mdi-send-circle</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- Container de dropdowns -->
        <v-container fluid>
          <v-layout>
            <!-- Dropdown categoria-->
            <v-flex md6>
              <div class="dropdown">
                <button
                  :disabled="toggleBtnGetCurso"
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenu1"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >{{selectViewCategoryName}}</button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <button
                    v-for="(item, index) in items"
                    :key="index"
                    class="dropdown-item"
                    type="button"
                    @click="clickDropdownCategoria(item, index)"
                  >{{item}}</button>
                </div>
              </div>
            </v-flex>

            <!-- Dropdown Token Cuentas-->
            <v-flex md6>
              <div class="dropdown">
                <button
                  :disabled="toggleBtnGetCurso"
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenu2"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >{{selectViewCuentaName}}</button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                  <button
                    v-for="(item, index) in JwtFromListUserArray"
                    :key="index"
                    class="dropdown-item"
                    type="button"
                    @click="clickDropdownCuenta(item, index)"
                  >{{item}}</button>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
      <!-- Loader y mensaje cuando carga los cursos -->
      <div v-show="showLoaderCurso" class="d-flex justify-content-center mt-2">
        <span v-show="showLoaderCurso" class=" spinner-border spinner-border-sm mr-1" role="" aria-hidden="true"></span>
        <p v-show="showLoaderCurso" class="text-center">Cargando lista de cursos...</p>
      </div>
      <v-expansion-panels>
        <v-expansion-panel v-for="(datos, index) in ListaDeCursos" :key="index">
          <v-expansion-panel-header
            @click="clickdespliegue(index, datos, datos.workerProgress)"
            v-if="(datos.availableForWorker == true &&
                datos.taskType == selectCategoryName)"
          >
            <!--Filtra que solo salga la categoría deseada-->
            <!--Si el curso esta incompleto -->
            <p
              class="bg-warning text-light p-2"
              v-if="
                datos.workerProgress && datos.workerProgress.completed == false
              "
            >{{ datos.taskType + " - " + datos.title + " - Incompleto!" }}</p>
            <!--Si el curso esta completo -->
            <p
              v-else-if="
                datos.workerProgress && datos.workerProgress.completed == true
              "
              class="bg-success text-light p-2"
            >{{ datos.taskType + " - " + datos.title + " - Completado!" }}</p>
            <p :class="cursoPasadoBackground" v-else>{{ datos.taskType + " - " + datos.title }}</p>
          </v-expansion-panel-header>
          <!----------------------------------parte de adentro --------------------------->
          <v-expansion-panel-content>
            <!--Filtra si el curso ya fue pasado, desabilita el boton -->
            <button
              v-if="
                datos.workerProgress && datos.workerProgress.completed == true
              "
              class="btn btn-success"
              disabled
            >Pasar Curso</button>
            <button
              v-else
              @click="
                pasarCursoTeorico(
                  urlTeorico,
                  datos.name,
                  datos.sections,
                  datos.workerProgress,
                  jwtList
                )
              "
              class="btn btn-success"
            >Pasar Curso</button>
            <p v-if="datos.workerProgress">
              {{
              currentSeccion +
              "/" +
              datos.sections.length +
              " Tipo: " +
              tipoCurso
              }}
            </p>
            <p v-else>
              {{
              currentSeccion +
              "/" +
              datos.sections.length +
              " Tipo: " +
              tipoCurso
              }}
            </p>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
let request = require('async-request')
export default {
  //EL DATA
  data() {
    return {
      items: [
        "Cuadros 2d",
        "Polygon",
        "Segmentación",
        "Categorizacion",
        "Videobox"
      ],
      selectCategoryName: "",
      selectViewCategoryName: "Categoría",
      selectViewCuentaName: "Cuenta Token",
      jsonContinueCatch: [],
      cursoPasadoBackground: "",
      fingerPrint: "",
      currentSeccion: "0",
      escenario: "no",
      tipoCurso: "",
      jwtSeleccionadoParaHeader: "",
      statusList: false,
      indexActualClick: "",
      urlEscenario: "https://canary-api.scale.com/internal/training/complete/",
      urlStatus: "https://api-internal.scale.com/internal/training/status/",
      urlTeorico: "https://api-internal.scale.com/internal/courses/",
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
  mounted () {
   
  },

  computed: {
    ...mapState(["toggleBtnGetCurso","showLoaderCurso","ListaDeCursos", "jwtList","JwtFromListUser","JwtFromListUserArray", "nombreApellido"])
  },
  //LOS METODOS DEL COMPONENTE
  methods: {
    ...mapActions(["traeCursos"]),
    ...mapMutations(["disableBtnGetCursoTrue","LimpiarListaCursos","habilitaLoaderCurso"]),

    //1) maneja el click del dropdown de categoria
    clickDropdownCategoria(item, index) {
      //Filtra el nombre de la categoría
      if (item == "Cuadros 2d") {
        this.selectViewCategoryName = "Cuadros 2d";
        this.selectCategoryName = "annotation";
      } else if (item == "Polygon") {
        this.selectViewCategoryName = "Polygon";
        this.selectCategoryName = "polygonannotation";
      } else if (item == "Segmentación") {
        this.selectViewCategoryName = "Segmentación";
        this.selectCategoryName = "segmentannotation";
      } else if (item == "Categorizacion") {
        this.selectViewCategoryName = "Categorizacion";
        this.selectCategoryName = "categorization";
      } else if (item == "Videobox") {
        this.selectViewCategoryName = "Videobox";
        this.selectCategoryName = "videoboxannotation";
      }
    },
    //2) maneja el click del dropdown de las Cuentas
    clickDropdownCuenta(item, index) {

      this.jwtSeleccionadoParaHeader = item
      let indice = index +1
      this.selectViewCuentaName = "Cuenta: #"+indice
    },
    //3) Trae la lista del curso
    clickGetListCurso(){
      this.disableBtnGetCursoTrue()
      this.habilitaLoaderCurso()
      this.LimpiarListaCursos()
      this.traeCursos(this.jwtSeleccionadoParaHeader);
    },
    //4)Funcion superior que llama las funciones que tienen el codigo.
    async pasarCursoTeorico(url, nameCurso, arraySection, workerProgress, jwt) {
      //crea el fingerPrint unico
      this.crearFingerPrint(31);
      //Condicion if que pregunta si hay un progreso en el curso o no.
      if (workerProgress) {
        console.log("Tiene workerProgress");
        //Funcion que pasa el curso teorico por ahora si tiene un progreso iniciado
        this.pasarCursoTeoricoYScenario(
          url,
          nameCurso,
          arraySection,
          workerProgress,
          jwt
        );
      } else {
        console.log("No tiene workerProgress");
        //Funcion que pasa el curso teorico por ahora
        this.pasarCursoTeoricoYScenario(
          url,
          nameCurso,
          arraySection,
          workerProgress,
          jwt
        );
      }
    },
      //NO SE ESTA USANDO AUN!!
    async pasarCursoEscenario(jwt, jsonBegin, url) {
      console.log("Dentro de pasar curso de escenario");
      //console.log(jsonBegin);
      if (!firebase.apps.length) {
        // Inicializa Firebase si la instancia no se ha creado aun.
        firebase.initializeApp(this.firebaseConfig);
        console.log("Creo la instancia");
      }
      let db;
      db = firebase.firestore();
      try {
        //Solicita de la base de datos firestore los escenarios
        let respCollection = await db.collection("cursos");
        let respGet = await respCollection.get();

        respGet.forEach(async doc => {
          //busca el ID del curso y trae su payload
          let escenarioID =
            jsonBegin.course.sections[jsonBegin.currentSection].contents
              .scenarioId;
          if (doc.id == escenarioID) {
            console.log("payload del escenario");
            console.log(doc.data().title);
            //SI EXISTE EL ESCENARIO HACE LA SOLICITUD CON SU PAYLOAD
            let myHeadersEscenario = {
              method: "POST", // or 'PUT'
              headers: {
                authorization: this.jwtSeleccionadoParaHeader,
                Origin: "https://www.remotasks.com",
                "Content-Type": "application/json",
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
              },
              body: doc.data().payload
            };
            let urlScenario = doc.data().url;
            console.log(urlScenario);
            console.log(this.jwtSeleccionadoParaHeader);
            console.log(doc.data().payload);
            let respEscenario = await request(urlScenario, myHeadersEscenario);
            let jsonEscenario = await JSON.parse(respEscenario.body);
            console.log("Respuesta del Escenario");
            console.log(jsonEscenario);
            //SI PASASTE EL ESCENARIO HACE LA SOLICITUD DEL CHECK

            try {
              if (jsonEscenario) {
                let myHeaderContinue = {
                  method: "GET", // or 'PUT'
                  headers: {
                    authorization: this.jwtSeleccionadoParaHeader,
                    Origin: "https://www.remotasks.com",
                    "User-Agent":
                      "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
                  }
                };

                console.log("Haciendo solicitud Status");
                console.log(this.urlStatus + escenarioID);
                let respStatus = await request(
                  this.urlStatus + jsonEscenario.processedResponse.task_id,
                  myHeaderContinue
                );
                let jsonStatus = await JSON.parse(respStatus.body);
                console.log("Respuesta del Status");
                console.log(jsonStatus.passedBar);

                if (jsonStatus.passedBar == true) {
                  let myHeaderContinue = {
                    method: "POST", // or 'PUT'
                    headers: {
                      authorization: this.jwtSeleccionadoParaHeader,
                      Origin: "https://www.remotasks.com",
                      "finger-print": "0" + this.fingerPrint,
                      "User-Agent":
                        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
                    }
                  };

                  console.log("Continue luego del status");
                  console.log(url + jsonBegin._id + "/continue");
                  let respContinue2 = await request(
                    url + jsonBegin._id + "/continue",
                    myHeaderContinue
                  );
                  let jsonContinue2 = await JSON.parse(respContinue2.body);
                  console.log("Respuesta continue dentro de escenario");
                  console.log(jsonContinue2);
                }
              }
            } catch (error) {
              console.log("error del continue dentro de escenario: " + error);
            }
            //AQUI TERMINA LA SOLICITUD DE PASAR EL ESCENARIO
          }
        });
      } catch (error) {
        console.log("Error trayendo payload: " + error);
        toastr.warning(
          "Este escenario no existe en la base de datos.",
          "Mensaje",
          { timeOut: 4000, closeButton: true }
        );
      }
    },

    //6)ESTA FUNCION TIENE EL CODIGO QUE PASA LOS CURSOS
    async pasarCursoTeoricoYScenario(
      url,
      nameCurso,
      arraySection,
      workerProgress,
      jwt) {

      try {
        let myHeaders = {
          method: "GET", // or 'PUT'
          headers: {
            "accept":"*/*",
            "accept-language":"es,es-ES;q=0.9,en;q=0.8",
            "finger-print":"",
            authorization: this.jwtSeleccionadoParaHeader,
            origin: "https://www.remotasks.com",
            "user-agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
          }
        };
        console.log(url + nameCurso);
        let respStart = await request(url + nameCurso, myHeaders);
        var jsonStart = JSON.parse(respStart.body);

        //...................Segunda solicitud con header POST Begin..................
        let myHeaders2 = {
          method: "POST", // or 'PUT'
          headers: {
            "accept":"*/*",
            "accept-language":"es,es-ES;q=0.9,en;q=0.8",
            authorization: this.jwtSeleccionadoParaHeader,
            origin: "https://www.remotasks.com",
            "finger-print": "0" + this.fingerPrint,
            "user-agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
          }
        };
        console.log(
          "Creando solicitud begin en url:" +
            url +
            jsonStart.course._id +
            "/begin"
        );
        let respBegin = await request(url + jsonStart.course._id + "/begin", myHeaders2);
        let jsonBegin = await JSON.parse(respBegin.body);
        this.currentSeccion = jsonBegin.courseProgress.currentSection;

        //................Tercera solicitud con mismo header POST..................
        //aqui se pone en bucle hasta que termina
        for (let i = this.currentSeccion; i < arraySection.length; i++) {
          console.log("Entramos en bucle con index: " + i);
          try {
            console.log("Creando solicitud continue");
            console.log(jsonBegin);

            //------AQUI SE PREGUNTA SI EL CURSO TIENE ESCENARIO O NO--------------------
            if (
              jsonBegin.courseProgress.course.sections[
                jsonBegin.courseProgress.currentSection
              ].type == "scenario"
            ) {
              //PROCEDE A PASAR EL ESCENARIO DEL CURSO!!!
              console.log("Si hay un escenario en jsonbeing");
              await this.pasarCursoEscenario(
                jwt,
                jsonBegin.courseProgress,
                url
              );
            } else {
              try {
                console.log(url + jsonBegin.courseProgress._id + "/continue");
                let respContinue = await request(
                  url + jsonBegin.courseProgress._id + "/continue",
                  myHeaders2
                );
                let jsonContinue = await JSON.parse(respContinue.body);
                //Actualiza la seccion actual en que va el curso
                this.currentSeccion =
                  jsonContinue.courseProgress.currentSection;
                console.log(
                  "Listo: " +
                    jsonContinue.courseProgress.currentSection +
                    "/" +
                    arraySection.length
                );
                console.log(jsonContinue);
                //Guarda el json continue en el data para usarlo desde el catch
                this.jsonContinueCatch = jsonContinue;

                //CURSO LISTO Y TERMINADO Y SE CAMBIA DE COLOR Y DISABLE EL BOTON
                if (jsonContinue.courseProgress.completed == true) {
                  //actualiza la lista de los cursos
                  this.traeCursos(this.jwtSeleccionadoParaHeader);
                  //emite un Mensaje
                  toastr.info("Curso completado con exito!", "Mensaje", {
                    timeOut: 3000,
                    closeButton: true
                  });
                }
              } catch (error) {
                console.log("Llegaste a un escenario");
                //emite un Mensaje
                toastr.warning("Llegaste a un escenario", "Mensaje", {
                  timeOut: 3000,
                  closeButton: true
                });
              }
            }
          } catch (error) {
            if (
              error ==
              "SyntaxError: JSON.parse: unexpected end of data at line 1 column 1 of the JSON data"
            ) {
              //Si sale este error es por que salio un escenario
              toastr.warning(
                "Se necesita los datos del escenario para avanzar.",
                "Mensaje",
                { timeOut: 5000, closeButton: true }
              );
              // this.pasarCursoEscenario(jwt);
            }
            console.log("error en bucle: " + error + " " + i);
            i = jsonContinue.courseProgress.currentSection;
          }
        } //for

        //CATCH
      } catch (error) {
        console.log("Error en try catch primero superior: " + error);
        //PROCEDE A PASAR EL ESCENARIO DEL CURSO!!!
        // this.pasarCursoEscenario(jwt);
      }
    },

    //7)Muestra despliega la lista hacia arriba o abajo y muestra el tipo de curso
    clickdespliegue(index, userDatos, workerProgress) {
      //Si existe un progreso en el curso
      if (workerProgress) {
        if (workerProgress.completed == true) {
          //Entra aqui si el curso esta 100% completa
          this.currentSeccion = workerProgress.currentSection;
          console.log("Completo true: " + this.currentSeccion);
        } else if (workerProgress.completed == false) {
          //Entra aqui si el curso esta parcialmente completo
          this.currentSeccion = workerProgress.currentSection;
          console.log("incompleto en posición: " + this.currentSeccion);
        }
      } else if (workerProgress === undefined) {
        //No existe progreso en el curso
        console.log("No hay workerProgress");
        this.currentSeccion = "0";
      }
      //Coloca el escenario en NO cuando se da un click
      this.escenario = "no";
      if (this.statusList == false || index != this.indexActualClick) {
        userDatos.sections.forEach(element => {
          //console.log("estado antes del if: "+this.escenario)
          if (element.type == "scenario" && this.escenario == "no") {
            this.tipoCurso = "Escenario";
            //Coloca el escenario en SI cuando encuentra un scenario
            this.escenario = "si";
          } else {
            if (this.escenario == "no") {
              this.tipoCurso = "Teórico";
            }
          }
          //cambia el estado cuando se da click
          this.statusList = true;
          //Pone el index actual
          this.indexActualClick = index;
        });
      } else {
        this.statusList = false;
      }
    },

    //8)Crea el Finger Print y lo almacena en el data.
    crearFingerPrint(length) {
      var result = "";
      var characters =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        this.fingerPrint = result;
      }
    },
  }
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
.divBarraTituloDropdown{
  position:relative;
}
.divBtnlistCurso{
  position: absolute;
  right: 7px;
}
</style>
