<template>
  <div>
    <v-card dark height="400px">
      <div class="divListCursoTop pl-3 pt-1 pb-1 text-light">
        <div class="divBarraTituloDropdown">
          <h6 class="d-inline">
            Nombre de cuenta seleccionada: {{nameAccountSelected}}
            <span
              :class="spinnerNameToken"
              role
              aria-hidden="true"
            ></span>
          </h6>
          <div class="divBtnlistCurso d-inline">
            <v-btn
              :disabled="toggleBtnGetCurso"
              @click="clickGetListCurso()"
              class="bg-transparent"
              elevation="0"
              rounded
            >
              <v-icon>mdi-send-circle</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- Container de dropdowns -->
        <v-container fluid>
          <v-layout>
            <!-- Dropdown categoria-->
            <v-flex md2>
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
            <v-flex md10>
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
        <span
          v-show="showLoaderCurso"
          class="spinner-border spinner-border-sm mr-1"
          role
          aria-hidden="true"
        ></span>
        <p class="text-center text-light">{{msjLoadingCurso}}</p>
      </div>
      
      <v-expansion-panels>
        <v-expansion-panel v-for="(datos, index) in ListaDeCursos" :key="index">
          <v-expansion-panel-header
            @click="clickdespliegue(index, datos, datos.sections, datos.workerProgress, $event)"
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
            <!-- Texto que da mensajes sobre el avance del curso -->
            <p class="text-center">Toca el boton para iniciar.</p>
            <!--Filtra si el curso ya fue pasado, desabilita el boton -->
            <div class="d-flex justify-content-center">
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
                  JwtFromListUserArray,
                  $event,
                  datos.taskType
                )
              "
              class="btn btn-success"
            >
              <span class role aria-hidden="true"></span>
              Pasar Curso
            </button>
            <!--Boton que abre el escenario -->
            <button
              :disabled="true"
              @click="OpenEscenarioInBot($event,datos)"
              class="btn btn-primary ml-2"
            >Abrir Escenario</button>
            </div>

            <!--Parrafo vacio inicial donde va el tipo de curso y la seccion actual-->
            <p class="text-center"></p>

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
let request = require("async-request");
let requestNormal = require("request");
var rp = require("request-promise");
const electron = require("electron");
import { remote } from "electron";
const cheerio = require("cheerio");
export default {
  //EL DATA
  data() {
    return {
      items: [
        "Cuadros 2D",
        "Polygon",
        "Segmentación",
        "Categorizacion",
        "Video Box",
        "Video Polygon",
        "Point Annotation",
        "Cuboide 3D"
      ],
      selectCategoryName: "",
      selectViewCategoryName: "Categoría",
      selectViewCuentaName: "Cuenta Token",
      jsonContinueCatch: [],
      UrlCursoEscenario: "",
      urlCurso: "https://www.remotasks.com/course?id=",
      eventDesplegableClick: "",
      spinnerNameToken: "",
      spinnerPasarCurso: "",
      nameAccountSelected: " -",
      cursoPasadoBackground: "",
      jwtClickeadoActual: "",
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
  mounted() {},
  computed: {
    ...mapState([
      "toggleBtnGetCurso",
      "msjLoadingCurso",
      "showLoaderCurso",
      "ListaDeCursos",
      "nombreApellido",
      "JwtFromListUserArray"
    ])
  },
  //LOS METODOS DEL COMPONENTE
  methods: {
    ...mapActions(["traeCursos"]),
    ...mapMutations([
      "disableBtnGetCursoTrue",
      "LimpiarListaCursos",
      "habilitaLoaderCurso"
    ]),

    //1) maneja el click del dropdown de categoria
    clickDropdownCategoria(item, index) {
      //Filtra el nombre de la categoría
      if (item == "Cuadros 2D") {
        this.selectViewCategoryName = "Cuadros 2D";
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
      } else if (item == "Video Box") {
        this.selectViewCategoryName = "Video Box";
        this.selectCategoryName = "videoboxannotation";
      } else if (item == "Point Annotation") {
        this.selectViewCategoryName = "Point Annotation";
        this.selectCategoryName = "pointannotation";
      } else if (item == "Video Polygon") {
        this.selectViewCategoryName = "Video Polygon";
        this.selectCategoryName = "videopolygonannotation";
      } else if (item == "Cuboide 3D") {
        this.selectViewCategoryName = "Cuboide 3D";
        this.selectCategoryName = "cuboidannotation";
      }
    },
    //2) maneja el click del dropdown de las Cuentas
    clickDropdownCuenta(item, index) {
      this.jwtSeleccionadoParaHeader = item;
      let indice = index + 1;
      this.selectViewCuentaName = "Cuenta: #" + indice;
      this.getAccountName(item);
    },
    //3) Trae la lista del curso
    clickGetListCurso() {
      this.disableBtnGetCursoTrue();
      this.habilitaLoaderCurso();
      this.LimpiarListaCursos();
      this.traeCursos(this.jwtSeleccionadoParaHeader);
    },

    // Cuando se da click en el expanded y está incompleto/amarillo
    ponerExpanedEnAmarillo(arraySection) {
      //Depende donde de click en el expand pone la misma clase para cambiar
      //el color luego de completado o impleto el curso en el mismo sitio
      if (this.eventDesplegableClick.target.tagName == "BUTTON") {
        let classDeStatusCursoColor = (this.eventDesplegableClick.toElement.childNodes[0].className =
          "bg-warning text-light p-2");
      } else {
        let classDeStatusCursoColor = (this.eventDesplegableClick.toElement.offsetParent.childNodes[0].className =
          "bg-warning text-light p-2");
      }
      //Habilita el boton para abrir el escenario
      this.eventBtnPasarCurso.target.nextSibling.nextElementSibling.disabled = false;

      if(arraySection){
      //Pone la última posición donde chocó con el escenario mientra pasaba el curso
      console.log(
        (this.eventBtnPasarCurso.target.nextSibling.nextSibling.nextElementSibling.innerText =
          this.currentSeccion+"/"+arraySection.length+" Tipo: "+this.tipoCurso)
      );
    }
    },
    // Cuando se da click en el expanded y está completo/verde
    ponerExpanedEnVerde(arraySection) {
      //Depende donde de click en el expand pone la misma clase para cambiar
      //el color luego de completado o impleto el curso en el mismo sitio
      if (this.eventDesplegableClick.target.tagName == "BUTTON") {
        let classDeStatusCursoColor = (this.eventDesplegableClick.toElement.childNodes[0].className =
          "bg-success text-light p-2");
      } else {
        let classDeStatusCursoColor = (this.eventDesplegableClick.toElement.offsetParent.childNodes[0].className =
          "bg-success text-light p-2");
      }
      //Deshabilita el boton para abrir el escenario
      this.eventBtnPasarCurso.target.nextSibling.nextElementSibling.disabled = true;
      //Coloca el mensaje que se completó el curso
      this.eventBtnPasarCurso.path[2].childNodes["0"].innerText = "Curso completado con éxito!"
    },
    //4)Funcion superior que llama las funciones que tienen el codigo.
    async pasarCursoTeorico(
      url,
      nameCurso,
      arraySection,
      workerProgress,
      jwt,
      event
     ) {
     // this.spinnerPasarCurso = "spinner-border spinner-border-sm mr-1";
      //Coloca el event del boton clickead
      this.eventBtnPasarCurso = event;
      console.log(this.eventBtnPasarCurso);
      this.eventBtnPasarCurso.toElement.childNodes[0].className =
        "spinner-border spinner-border-sm mr-1";
      //Colocamos el boton de pasar curso en disabled
      this.eventBtnPasarCurso.target.disabled = true;
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
          jwt,
          event
        );
      }
    },

    // PASA EL ESCENARIO DE UN CURSO SI EXISTE EN LA BASE DE DATOS
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
        console.log(respGet)
        let escenarioID = "";
        let forEachAwait = await respGet.forEach(async doc => {
          //busca el ID del curso y trae su payload
          escenarioID = jsonBegin.course.sections[this.currentSeccion].contents.scenarioId;
          console.log(escenarioID)
          if (doc.id == escenarioID) {
            this.eventBtnPasarCurso.path[2].childNodes["0"].innerText = "Escenario encontrado, trayendo sus datos..."
            console.log("Titulo del escenario");
            console.log(doc.data().title);
            this.docData = doc.data();
            this.existeEscenario = true;
          }
        });

        if (this.existeEscenario == true) {
          //Traemos el Url complete del escenario para pasarlo............................
          let JwtSplitedPart = this.jwtSeleccionadoParaHeader.split(" ");
          let jwtMinuscula = JwtSplitedPart[0];
          let jwtForCookie =
            jwtMinuscula.toLowerCase() + "=" + JwtSplitedPart[1];
          console.log(jwtForCookie);
          let url =
            "https://www.remotasks.com/training?trainingId=" + escenarioID;
          let headers = {
            cookie: jwtForCookie,
            Origin: "https://www.remotasks.com",
            "user-agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3904.87 Safari/537.36"
          };
          let respText = await request(url, { method: "GET", headers });
          console.log(respText.body)
          let $ = await cheerio.load(respText.body);
          console.log($)
          let jsonTraining = $("script")[2].children[0].data;
          console.log(jsonTraining)
          let idPasarEscenario = JSON.parse(jsonTraining).props.pageInitialProps
            .trainingAttempt;
          console.log(idPasarEscenario);
          this.UrlEscenarioComplete =
            "https://api-internal.scale.com/internal/training/complete/" +
            idPasarEscenario +
            "?grader_version=1";
          console.log(this.UrlEscenarioComplete);

          //....................................................................................
          console.log("Pasando el escenario...");
          this.eventBtnPasarCurso.path[2].childNodes["0"].innerText = "Pasando el escenario..."
          let payloadEscenario = this.docData.payload;
          //SI EXISTE EL ESCENARIO HACE LA SOLICITUD CON SU PAYLOAD
          let myHeadersEscenario = {
            method: "POST", // or 'PUT'
            url: this.UrlEscenarioComplete,
            headers: {
              "Content-Type": "application/json",
              authorization: this.jwtSeleccionadoParaHeader,
              Origin: "https://www.remotasks.com",
              "Content-Type": "application/json",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
            },
            body: payloadEscenario
          };
          //Hace la solicitud de pasar el escenario.
          let respJsonEscenarioComplete = await rp(myHeadersEscenario);
          console.log(
            "passedSpeedBar: " +
              JSON.parse(respJsonEscenarioComplete).passedSpeedBar
          );
          console.log(
            "passedAccuracyBar: " +
              JSON.parse(respJsonEscenarioComplete).passedAccuracyBar
          );
          console.log(
            "passedSpeedBar: " +
              JSON.parse(respJsonEscenarioComplete).passedSpeedBar
          );
          this.existeEscenario = false;

        }else{
          //EN caso de que no halla escenario en la BD cae aquí
          console.log("Este escenario NO esta en la base de datos")
          this.eventBtnPasarCurso.path[2].childNodes["0"].innerText = "Este escenario no está registrado aun."
          this.eventBtnPasarCurso.target.disabled = false;
          this.eventBtnPasarCurso.toElement.childNodes[0].className = "";
          this.EjecutaContinue = false
          this.ponerExpanedEnAmarillo()
        }

      } catch (error) {
        console.log("Error trayendo payload: " + error);
        //Habilita el boton para abrir el escenario
      this.eventBtnPasarCurso.target.disabled = false;
      this.eventBtnPasarCurso.toElement.childNodes[0].className = "";
      this.ponerExpanedEnAmarillo()
      }
    },

    // ESTA FUNCION TIENE EL CODIGO QUE PASA LOS CURSOS
    async pasarCursoTeoricoYScenario(
      url,
      nameCurso,
      arraySection,
      workerProgress,
      jwt,
      event
      ) {
       //Pone permite que se ejecute el continue 
      this.EjecutaContinue = true
      //Deshabilita el boton para abrir el escenario
      this.eventBtnPasarCurso.target.nextSibling.nextElementSibling.disabled = true;
      //Pone al iniciar el url del curso que se está pasando.
      this.UrlCursoEscenario = this.urlCurso + nameCurso;
      this.eventBtnPasarCurso.path[2].childNodes["0"].innerText = "Iniciando el curso."
      try {
        let myHeaders = {
          method: "GET", // or 'PUT'
          headers: {
            accept: "*/*",
            "accept-language": "es,es-ES;q=0.9,en;q=0.8",
            "finger-print": "",
            authorization: this.jwtSeleccionadoParaHeader,
            origin: "https://www.remotasks.com",
            "user-agent":
              "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
          }
        };
        console.log(url + nameCurso);
        let respStart = await request(url + nameCurso, myHeaders);
        var jsonStart = JSON.parse(respStart.body);
        console.log("Json Start:");
        console.log(jsonStart);

        //...................Segunda solicitud con header POST Begin..................
        let myHeaders2 = {
          method: "POST", // or 'PUT'
          headers: {
            accept: "*/*",
            "accept-language": "es,es-ES;q=0.9,en;q=0.8",
            authorization: this.jwtSeleccionadoParaHeader,
            origin: "https://www.remotasks.com",
            "finger-print": "0" + this.fingerPrint,
            "user-agent":
              "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
          }
        };
        this.UrlCursoBegin = url + jsonStart.course._id + "/begin";
        console.log("Creando solicitud begin en url:" + this.UrlCursoBegin);
        let respBegin = await request(
          url + jsonStart.course._id + "/begin",
          myHeaders2
        );
        let jsonBegin = await JSON.parse(respBegin.body);
        this.currentSeccion = jsonBegin.courseProgress.currentSection;

        //................Tercera solicitud con mismo header POST..................
        //aqui se pone en bucle hasta que termina

        for (let i = this.currentSeccion; i < arraySection.length; i++) {
          console.log("Entramos en bucle con index: " + i);
          try {
            console.log("json del Begin")
            console.log(jsonBegin);

            //------AQUI SE PREGUNTA SI EL CURSO TIENE ESCENARIO O NO--------------------
            console.log("Tipo: "+jsonBegin.courseProgress.course.sections[this.currentSeccion].type)
            if (
              jsonBegin.courseProgress.course.sections[this.currentSeccion]
                .type == "scenario"
             ){
               //PROCEDE A PASAR EL ESCENARIO DEL CURSO!!!
              console.log("HAY UN ESCENARIO en jsonbeing!!");
              await this.pasarCursoEscenario(jwt, jsonBegin.courseProgress, url);
              console.log("Me ejecuté despues de terminar la funcion de pasar el escenario");
            }

            //SE EJECUTA EL CONTINUE SIEMPRE
            if(this.EjecutaContinue == true){
            console.log("Creando solicitud continue");
            this.eventBtnPasarCurso.path[2].childNodes["0"].innerText = "Ejecutando el boton continue..."
            try {
              console.log(url + jsonBegin.courseProgress._id + "/continue");
              let respContinue = await request(
                url + jsonBegin.courseProgress._id + "/continue",
                myHeaders2
              );
              let jsonContinue = await JSON.parse(respContinue.body);
              //Actualiza la seccion actual en que va el curso
              this.currentSeccion = jsonContinue.courseProgress.currentSection;
                   console.log(jsonContinue);
                 //CURSO LISTO Y TERMINADO Y SE CAMBIA DE COLOR Y DISABLE EL BOTON
                 if (jsonContinue.courseProgress.completed == true) {
                   //actualiza la lista de los cursos
                   this.traeCursos(this.jwtSeleccionadoParaHeader);
                   //Pone el fondo de verde para simbolizar completo.
                   this.ponerExpanedEnVerde(arraySection);
                   this.eventBtnPasarCurso.toElement.childNodes[0].className = "";
                 }

              //Coloca la posicion actual al texto de cada curso independiente
               setTimeout(() => {                 
                 this.eventBtnPasarCurso.target.offsetParent.childNodes[2].childNodes["0"].childNodes[4].innerText =
                 this.currentSeccion+"/"+arraySection.length+" Tipo: "+this.tipoCurso
               }, 300);

            } catch (error) {
              console.log("Llegaste a un escenario");
              console.log(error);
              if (jsonContinue.courseProgress.completed == true) {
                this.eventBtnPasarCurso.target.disabled = true;
              } else {
                console.log("Iniciando funcion de pasar escenario en catch");
                this.eventBtnPasarCurso.target.disabled = false;
                //Pone el fondo de amarillo para simbolizar incompleto.
                this.ponerExpanedEnAmarillo(arraySection);
              }
              this.eventBtnPasarCurso.toElement.childNodes[0].className = "";
            }
          }
          } catch (error) {
            //Tambien aqui es cuando sale un escenario
            this.ponerExpanedEnAmarillo(arraySection);
            this.eventBtnPasarCurso.target.disabled = false;
            this.eventBtnPasarCurso.toElement.childNodes[0].className = "";
            console.log("error en bucle: " + error + " " + i);
          }
        } //for

        //CATCH
      } catch (error) {
        console.log("Error en try catch primero superior: " + error);
        //PROCEDE A PASAR EL ESCENARIO DEL CURSO!!!
        // this.pasarCursoEscenario(jwt);
      }
     },

      setTextInDesplegable(event, arraySection, workerProgress){
      setTimeout(() => {
        if (event.target.tagName == "P") {
          //CUANDO EL DESPLIEGUE DA CLICK EN TEXTO
          console.log("click en titulo p");

          if (event.target.className == "bg-warning text-light p-2") {
            console.log("El escenario está incompleto.");
            event.path[2].childNodes[2].childNodes["0"].childNodes[4].innerText =
            workerProgress.currentSection+"/"+arraySection.length+" Tipo: "+this.tipoCurso

          } else if (event.target.className == "bg-success text-light p-2") {
            console.log("El escenario está completo.");
            if(workerProgress){
            event.path[2].childNodes[2].childNodes["0"].childNodes["0"].innerText = "Curso completado con éxito!";
            event.path[2].childNodes[2].childNodes["0"].childNodes[4].innerText =
            workerProgress.currentSection+"/"+arraySection.length+" Tipo: "+this.tipoCurso
            }else{
              console.log("Ya no hay workerprogress en curso completado.")
            }
          } else if (event.target.className == "") {
            console.log("Aun no hay escenario iniciado");
            event.path[2].childNodes[2].childNodes["0"].childNodes[4].innerText =
            "0/"+arraySection.length+" Tipo: "+this.tipoCurso
          }
        } else if (event.target.tagName == "BUTTON") {
          //CUANDO EL DESPLIEGUE DA CLICK EN ESPACIO VACIO
          console.log("click en espacio vacío");

          if (
            event.target.childNodes["0"].className ==
            "bg-warning text-light p-2"
          ) {
            console.log("El escenario está incompleto.");
            event.path[1].childNodes[2].childNodes["0"].lastElementChild.innerText =
            workerProgress.currentSection+"/"+arraySection.length+" Tipo: "+this.tipoCurso
          } else if (
            event.target.childNodes["0"].className ==
            "bg-success text-light p-2"
          ) {
            console.log("El escenario está completo.");
            if(workerProgress){
            event.path[1].childNodes[2].childNodes["0"].firstChild.innerText = "Curso completado con éxito!";
            event.path[1].childNodes[2].childNodes["0"].lastElementChild.innerText =
            workerProgress.currentSection+"/"+arraySection.length+" Tipo: "+this.tipoCurso
            }else{
              console.log("Ya no hay workerprogress en curso completado.")
            }

          } else if (event.target.childNodes["0"].className == "") {
            console.log("Aun no hay escenario iniciado");
            event.path[1].childNodes[2].childNodes["0"].lastElementChild.innerText =
            "0/"+arraySection.length+" Tipo: "+this.tipoCurso
          }
          
        } else if (event.target.tagName == "I") {
          //CUANDO EL DESPLIEGUE DA CLICK EN LA FLECHITA
          console.log("click en flechita");  

          if (
            event.path[2].childNodes["0"].className ==
            "bg-warning text-light p-2"
          ) {
            console.log("El escenario está incompleto.");
            event.path[3].childNodes[2].childNodes["0"].childNodes[4].innerText =
            workerProgress.currentSection+"/"+arraySection.length+" Tipo: "+this.tipoCurso

          } else if (
            event.path[2].childNodes["0"].className ==
            "bg-success text-light p-2"
          ) {
            console.log("El escenario está completo.");
            if(workerProgress){
            event.path[3].children[1].childNodes["0"].firstChild.innerText = "Curso completado con éxito!";
            event.path[3].childNodes[2].childNodes["0"].childNodes[4].innerText =
            workerProgress.currentSection+"/"+arraySection.length+" Tipo: "+this.tipoCurso
            }else{
              console.log("Ya no hay workerprogress en curso completado.")
            }
            
          } else if (event.path[2].childNodes["0"].className == "") {
            console.log("Aun no hay escenario iniciado");
            event.path[3].childNodes[2].childNodes["0"].childNodes[4].innerText =
            "0/"+arraySection.length+" Tipo: "+this.tipoCurso
          }
        }
      }, 300);
    },

    // captura el event del texto de la current section del curso
    GetEventCurrentSection(event) {
      this.eventCurrentSeccion = event;
      console.log(event);
    },

    // Boton que abre el escenario en el bot de cursos
    OpenEscenarioInBot(event, jsonTaskData) {
      console.log(event);
      let parteSinJWT = this.jwtSeleccionadoParaHeader.split(" ");
      let mainSeasson = electron.remote.getCurrentWindow();
      let sesion = mainSeasson.webContents.session;
      sesion.cookies.set(
        {
          url: "https://www.remotasks.com/",
          name: "jwt",
          value: parteSinJWT[1]
        },
        error => {
          //const remote = require("electron").remote;
          const BrowserWindow = remote.BrowserWindow;
          const win = new BrowserWindow({
            show: false
          });
          win.maximize();
          win.webContents.loadURL(this.UrlCursoEscenario);
          //Cambia el título
          win.setTitle("Toposat vector");
          win.on("page-title-updated", (event, title)=>{
            event.preventDefault()
            win.setTitle("Toposat vector");
          })
          win.webContents.on("dom-ready", e => {
            win.webContents.insertCSS(".course-top{display: none !important;}");
            win.webContents.insertCSS(
              ".course-page.jsx-3824627926{background-color: rgb(96, 96, 96) !important;}"
            );
          });
        }
      );
    },
    // funcion que muestra el boton cuando se da click en expanded amarillo
    showBtnScenarioOnClickExpanded() {
      let Intervalo = setInterval(() => {
        if (
          this.eventDesplegableClick.target.offsetParent.firstElementChild
            .className == "bg-warning text-light p-2"
        ) {
          this.eventDesplegableClick.target.offsetParent.offsetParent.childNodes[2].childNodes[
            "0"
          ].childNodes[2].disabled = false;
          clearInterval(Intervalo);
        } else if (
          this.eventDesplegableClick.target.className ==
          "bg-warning text-light p-2"
        ) {
          console.log("Cayó en click sobre las letras");
          clearInterval(Intervalo);
          // this.eventDesplegableClick.target.offsetParent.childNodes[2].childNodes["0"].firstElementChild.disabled = false
        } else if (
          this.eventDesplegableClick.target.firstChild.className ==
          "bg-warning text-light p-2"
        ) {
          console.log("Cayó en el espacio vacío");
          this.eventDesplegableClick.target.offsetParent.lastElementChild.firstElementChild.firstElementChild.nextElementSibling.disabled = false;
          clearInterval(Intervalo);
        }
      }, 400);
    },

     //7)Muestra despliega la lista hacia arriba o abajo y muestra el tipo de curso
    clickdespliegue(index, TaskDatos, arraySection, workerProgress, event) {

      //...........Primero dice si curso es de escenario o teorico .................
      this.escenario = "no";
      if (this.statusList == false || index != this.indexActualClick) {
        TaskDatos.sections.forEach(element => {
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

      //...............Ahora muestra el estado y msj de los botones y textos.................
      let tituloCurso = "";
      //Coloca el event del click desplegable
      this.eventDesplegableClick = event;
      console.log(event);

      tituloCurso = this.eventDesplegableClick.target.innerText;
      this.setTextInDesplegable(event, arraySection, workerProgress)
      //Si existe un progreso en el curso
      if (workerProgress) {
        if (workerProgress.completed == true) {
          //Entra aqui si el curso esta 100% completa y guarda la posicion actual
         this.currentSeccion = workerProgress.currentSection;

        } else if (workerProgress.completed == false) {
          //Entra aqui si el curso esta incompleto
          this.currentSeccion = workerProgress.currentSection;
          this.UrlCursoEscenario = this.urlCurso + TaskDatos.name;
          console.log(this.UrlCursoEscenario);
        }
      } else if (workerProgress === undefined) {
          this.currentSeccion = "0";
      }      
    },

    //Crea el Finger Print y lo almacena en el data.
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
    //Obtiene el nombre del token seleccionado
    async getAccountName(tokenJTWSelected) {
      this.jwtClickeadoActual = tokenJTWSelected;
      this.CondicionDialog = "datosCuenta";
      this.dialog = true;
      this.nameAccountSelected = "";
      this.spinnerNameToken = "spinner-border spinner-border-sm";

      let headers = {
        authorization: tokenJTWSelected,
        Origin: "https://www.remotasks.com",
        "user-agent":
          "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
      };

      //Url de la solicitud http
      let urlPedirTarea =
        "https://api-internal.scale.com/internal/logged_in_user";
      //Envia la solicitud para obtener los datos con libreria request
      let resp = await request(urlPedirTarea, { method: "GET", headers });
      let { firstName, lastName } = JSON.parse(resp.body);
      this.spinnerNameToken = "";
      this.nameAccountSelected = firstName + " " + lastName;
    }
  }
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
.divBarraTituloDropdown {
  position: relative;
}
.divBtnlistCurso {
  position: absolute;
  right: 7px;
}
.divListCursoTop {
  background: rgb(30, 136, 229);
}
.expansionPanel {
  background: rgb(94, 94, 94);
}
</style>
