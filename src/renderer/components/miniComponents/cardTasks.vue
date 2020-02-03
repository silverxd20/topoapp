<template>
  <div>
    <v-card class="cardTasks mx-auto mt-3" max-width="300">
      <div>
        <!-- si la imagen es de tarea normal -->
        <div
          v-if="propJsonTask.assignmentType == 'subtask' && propJsonTask.type != 'lidarsegmentation'"
          class="divImage"
          :style="{'background-image': 'url('+UrlImageTask+')'}"
        >
          <!-- chips superior -->
          <div class="d-flex justify-content-end">
            <v-chip class="ma-2" color="primary" text-color="white">
              Trabajo Normal
              <v-icon right>mdi-tag</v-icon>
            </v-chip>
          </div>

          <v-card-title class="divCategory">
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.type == 'segmentannotation'"
            >Segmentación de imagen</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.type == 'annotation'"
            >Anotación de cuadros 2D</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.type == 'categorization'"
            >Categorización</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.type == 'videoboxannotation'"
            >Anotación de videobox</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.type == 'polygonannotation'"
            >Anotación de poligones</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.type == 'cuboidannotation'"
            >Anotación de Cubos 3D</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.Type == 'lidarsegmentation'"
            >Segmentación Lidar</v-card-title>
          </v-card-title>
        </div>

        <!-- si la Tarea es de una lidar atravesada en clasic -->
        <div
          v-if="propJsonTask.type == 'lidarsegmentation'"
          class="divImage"
          :style="{'background-image': 'url('+UrlImageTask+')'}"
        >
          <!-- chips superior -->
          <div class="d-flex justify-content-end">
            <v-chip class="ma-2" color="primary" text-color="white">
              Lidar atravesado en classic
              <v-icon right>mdi-tag</v-icon>
            </v-chip>
          </div>

          <v-card-title class="divCategory">
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.type == 'lidarsegmentation'"
            >Segmentación Lidar</v-card-title>
          </v-card-title>
        </div>

        <!-- si la imagen es de revisor -->
        <div
          v-if="propJsonTask.assignmentType == 'task_attempt'"
          class="divImage"
          :style="{'background-image': 'url('+UrlImageTask+')'}"
        >
          <!-- chips superior -->
          <div class="d-flex justify-content-end">
            <v-chip class="ma-2" color="yellow" text-color="white">
              Trabajo de Revisor
              <v-icon right>mdi-star</v-icon>
            </v-chip>
          </div>

          <v-card-title class="divCategory">
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'segmentannotation'"
            >Segmentación de imagen</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'annotation'"
            >Anotación de cuadros 2D</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'categorization'"
            >Categorización</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'videoboxannotation'"
            >Anotación de videobox</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'polygonannotation'"
            >Anotación de poligones</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'cuboidannotation'"
            >Anotación de Cubos 3D</v-card-title>
          </v-card-title>
          <v-card-title
            class="textoCategory"
            v-if="propJsonTask.taskType == 'lidarsegmentation'"
          >Segmentación Lidar</v-card-title>
        </div>

        <!-- si la imagen es un curso -->
        <div
          v-if="propJsonTask.assignmentType == 'course'"
          class="divImage"
          style="background-image: url('https://firebasestorage.googleapis.com/v0/b/remodesktop-9b704.appspot.com/o/curso.jpg?alt=media&token=46194c0c-6d76-4b1f-a1bd-ee90926ca8e6');"
        >
          <!-- chips superior -->
          <div class="d-flex justify-content-end">
            <v-chip class="ma-2" color="teal" text-color="white">
              Curso
              <v-icon right>mdi-book-open-page-variant</v-icon>
            </v-chip>
          </div>

          <!-- texto nombre de la categoría -->
          <v-card-title class="divCategory">
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'segmentannotation'"
            >Segmentación de imagen</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'annotation'"
            >Anotación de cuadros 2D</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'categorization'"
            >Categorización</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'videoboxannotation'"
            >Anotación de videobox</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'polygonannotation'"
            >Anotación de poligones</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'cuboidannotation'"
            >Anotación de Cubos 3D</v-card-title>
            <v-card-title
              class="textoCategory"
              v-if="propJsonTask.taskType == 'lidarsegmentation'"
            >Segmentación Lidar</v-card-title>
          </v-card-title>
        </div>

        <!-- si no hay tareas disponibles -->
        <div
          v-if="propJsonTask[0] == 's'"
          class="divImageNoTask"
          style="background-image: url('https://firebasestorage.googleapis.com/v0/b/remodesktop-9b704.appspot.com/o/noTasks.png?alt=media&token=7f41d0b3-934f-42ed-9711-33106b15dd31')"
        >
          <v-card-title class="divCategory">
            <v-card-title class="text-light textoCategory">Sin tareas disponibles</v-card-title>
          </v-card-title>
        </div>
      </div>

      <v-card-text class="text--primary">
        <div
          v-if="propJsonTask[0] == 's'"
        >Por ahora no hay trabajos en esta categoría, por favor revise luego.</div>
        <div v-if="propJsonTask.assignmentType == 'subtask'">{{nombreTarea}}</div>
        <div v-if="propJsonTask.assignmentType == 'task_attempt'">{{nombreTarea}}</div>
        <div v-if="propJsonTask.assignmentType == 'course'">{{propJsonTask.title}}</div>
        <div v-if="propJsonTask.type == 'lidarsegmentation'">{{propJsonTask.project.name}}</div>
      </v-card-text>

      <v-card-actions class="d-flex justify-content-center">
        <v-btn
          v-if="propJsonTask[0] == 's'"
          :disabled="desabilitado"
          elevation="2"
          @click="OpenTask()"
          color="blue darken-2"
          text
        >Iniciar</v-btn>
        <v-btn
          v-if="propJsonTask.assignmentType"
          elevation="2"
          @click="OpenTask()"
          color="blue darken-2"
          text
        >Iniciar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
To

<script>
import { mapMutations } from "vuex";
const https = require("https");
const fs = require("fs");
const { ipcRenderer } = require("electron");
const electron = require("electron");
const cheerio = require("cheerio");
let request = require("request");
const BrowserView = electron.remote.BrowserView;

export default {
  name: "cardtasks",
  props: ["propJsonTask", "propArraySession", "propIndex"],

  data() {
    return {
      indexCard: this.propIndex,
      desabilitado: true,
      UrlImageTask: "",
      nombreTarea: "-",
      TaskIniciada: true,
    };
  },
  mounted() {
    this.initTraeNombreDeLTareaDeIntrucciones();
    this.initComprobarDndVieneLaImg();
  },

  methods: {
    ...mapMutations(["browserId", "showBackDash", "ocultaDrawer","showTranslate"]),
    //metodos aqui

    async initTraeNombreDeLTareaDeIntrucciones() {
      //Hace un split para obtener el url de la instrucciones
      let urlArrayParte1;
      if (this.propJsonTask.assignmentType == "task_attempt") {
        urlArrayParte1 = this.propJsonTask.subtask.instruction.split('"');
      } else if (this.propJsonTask.assignmentType == "subtask") {
        urlArrayParte1 = this.propJsonTask.instruction.split('"');
      } else if (this.propJsonTask.assignmentType == "course") {
        //No hagas nada si es un curso
      }

      if (urlArrayParte1) {
        let linkInstrucciones = urlArrayParte1[1];
        if (linkInstrucciones == "height:800px; width:100%") {
          linkInstrucciones = urlArrayParte1[3];
        }
        let respuesta1 = await fetch(linkInstrucciones);
        let textResp = await respuesta1.text();
        const $ = cheerio.load(textResp);
        let tareaName = $("span").text().split("I");
        this.nombreTarea = tareaName[0];
        console.log(this.nombreTarea);
      }
    },

    initComprobarDndVieneLaImg() {
      try {
        //Si el trabajo es de revisor
        if (this.propJsonTask.assignmentType == "task_attempt") {
          if (this.propJsonTask.subtask.attachmentS3Downloads) {
            this.UrlImageTask = this.propJsonTask.subtask.attachmentS3Downloads[0].s3URL;
          } else {
            console.log(
              "No hay propJsonTask.attachmentS3Downloads en tarea de revisor"
            );
            this.UrlImageTask = this.propJsonTask.subtask.params.attachment;
          }
        }

        //Si el trabajo es normal
        if (
          this.propJsonTask.assignmentType == "subtask" &&
          this.propJsonTask.type != "lidarsegmentation"
        ) {
          if (this.propJsonTask.attachmentS3Downloads) {
            this.UrlImageTask = this.propJsonTask.attachmentS3Downloads[0].s3URL;
          } else {
            console.log(
              "No hay propJsonTask.attachmentS3Downloads en tarea normal"
            );
            this.UrlImageTask = this.propJsonTask.params.attachment;
          }
        }
        // es un curso no hagas nada
        if (this.propJsonTask.assignmentType == "course") {
          //Cae aqui cuando es un curso pero no hagas nada!
        }

        //Si el trabajo es Lidar atravesado en clasic
        if (
          this.propJsonTask.assignmentType == "subtask" &&
          this.propJsonTask.type == "lidarsegmentation"
        ) {
          this.UrlImageTask = this.propJsonTask.params.lidar_metadata[0].images[0].imageUrl;
        }
      } catch (error) {
        console.log("Error trayendo imagen");
        console.log(error);

        //Cae aqui cuando no es una tarea de revisor
      }
    },

    // 1) Funcion que abre la tarea disponible
    OpenTask() {
      let parteSinJWT = this.propArraySession[this.indexCard].split(" ");
      let mainSeasson = electron.remote.getCurrentWindow();
      let sesion = mainSeasson.webContents.session;
      this.ocultaDrawer();
      this.$router.push({ path: "taskWait" });

      sesion.cookies.set(
        {
          url: "https://www.remotasks.com/",
          name: "jwt",
          value: parteSinJWT[1]
        },
        error => {
          let boundsJson = mainSeasson.getContentBounds();
          let heightExacto = boundsJson.height - 25;
          let view
          
          if (this.TaskIniciada == true) {
            console.log("fue normal: "+ view)
            view = new BrowserView();            
            mainSeasson.setBrowserView(view);            
            view.webContents.loadURL("https://www.remotasks.com/tasks");
                  
          //view.webContents.openDevTools()
          this.browserId(view.id);
          this.showBackDash();
          view.setBounds({
            x: 0,
            y: 25,
            width: boundsJson.width,
            height: heightExacto
          });          
          this.TaskIniciada = false
          //Si es un curso muestra el boton de traducir
          if (this.propJsonTask.assignmentType == "course") {
            this.showTranslate()
          }
          }else{
            console.log("ya no es null entro en else")
          view.setBounds({
            x: 0,
            y: 25,
            width: boundsJson.width,
            height: heightExacto
          });
          view.webContents.loadURL("https://www.remotasks.com/tasks");
          //view.webContents.openDevTools()
          //this.browserId(view.id);
          console.log("tipo: "+this.propJsonTask.assignmentType)
          //Si es un curso muestra el boton de traducir
          if (this.propJsonTask.assignmentType == "course") {
            this.showTranslate()
          }
          this.showBackDash();
          }
          

          //Evento que avisa cuando el dom esta listo
          view.webContents.on("dom-ready", e => {
            /* fs.readFile(__dirname + "/test.css", "utf-8", function(
                error,
                data
              ) {
                if (!error) {
                  var formatedData = data.replace(/\s{2,10}/g, " ").trim();
                  view.webContents.insertCSS(formatedData);
                }
              });*/

            //En la tarea cuando sale que te pueden banear quita un boton de allí
            view.webContents.insertCSS(
              "a:nth-child(2){display: none !important;}"
            );
            //Estilo de la parte cuando SI tiene tareas
            view.webContents.insertCSS(
              ".full-screen-instructions{display: flex !important; justify-content: center !important;}"
            );
            view.webContents.insertCSS(
              ".instructions__wrapper{flex-grow: 0 !important;}"
            );
            view.webContents.insertCSS(
              ".instructions__body{display: none !important;}"
            );
            view.webContents.insertCSS(
              ".instructions__title{text-indent: -9999px !important; line-height: 0 !important;}"
            );
            view.webContents.insertCSS(
              ".instructions__title.jsx-400793135{background-color: rgb(255, 255, 255) !important;}"
            );
            view.webContents.insertCSS(
              ".instructions__title::after{content: 'Por favor lea y consulte las instrucciones siempre que hallan dudas, tendrá mayor precision y logrará un mejor desempeño en el trabajo.' !important; font-size: large;  color: rgb(19, 19, 19); text-indent: 0; display: block; line-height: initial; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif !important;}"
            );
            view.webContents.insertCSS(
              ".wootric-question{display: none !important;}"
            );

            //Estilo de la parte cuando NO tiene tareas
            view.webContents.insertCSS(
              ".fullscreen-card::after{content: 'Vuelve al panel para buscar nuevos trabajos disponibles' !important;}"
            );
            view.webContents.insertCSS(
              ".fullscreen-card::after{font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif !important;"
            );
            view.webContents.insertCSS(
              ".fullscreen-card::after{font-size: x-large !important;}"
            );
            view.webContents.insertCSS(
              ".jsx-2687182512{display: none !important;}"
            );

            //Estilos del curso atravesado en tasks
            view.webContents.insertCSS(
              ".queue-course-title{background-image: linear-gradient(94.21deg, rgb(0, 109, 199) -4.77%, rgb(0, 109, 199) -4.76%, rgb(0, 109, 199) 69.18%, rgb(0, 109, 199) 105.5%) !important;}"
            );
            view.webContents.insertCSS(
              ".course-header.jsx-431219561{background-image: linear-gradient(94.21deg, rgb(0, 109, 199) -4.77%, rgb(0, 109, 199) -4.76%, rgb(0, 109, 199) 69.18%, rgb(0, 109, 199) 105.5%) !important;}"
            );
            view.webContents.insertCSS(
              ".course-header.jsx-431219561{background-image: linear-gradient(94.21deg, rgb(0, 109, 199) -4.77%, rgb(0, 109, 199) -4.76%, rgb(0, 109, 199) 69.18%, rgb(0, 109, 199) 105.5%) !important;}"
            );
            view.webContents.insertCSS(
              ".course-page.jsx-3824627926{background-color: rgb(96, 96, 96) !important;}"
            );
            view.webContents.insertCSS(
              ".continue.jsx-2209961743{background-color: rgb(0, 109, 199) !important;}"
            );
            view.webContents.insertCSS(
              ".jsx-1709700039{background-color: ghostwhite !important;}"
            );
            view.webContents.insertCSS(
              ".choice.jsx-927790731:hover{background-color: rgb(0, 109, 199) !important;}"
            );
            view.webContents.insertCSS(
              ".choice.jsx-927790731:hover{color: white !important;}"
            );
            view.webContents.insertCSS(
              ".segment.jsx-104292899.segment.halfFilled.jsx-104292899{border-radius: 15px !important;}"
            );
            view.webContents.insertCSS(
              ".segment.filled.jsx-104292899{border-radius: 15px !important;}"
            );
            view.webContents.insertCSS(
              ".remoBlue.jsx-1809695030{background-color: white !important;}"
            );
            view.webContents.insertCSS(
              ".remoBlue.jsx-1809695030{color: black !important;}"
            );
            //Cambio de posicion del titulo curso
            view.webContents.insertCSS(
              ".course-header.jsx-431219561{display: block !important;}"
            );
            view.webContents.insertCSS(
              ".course-header.jsx-431219561{text-align: center !important;}"
            );
            view.webContents.insertCSS(
              ".course-title.jsx-431219561{margin-bottom: 10px !important;}"
            );
            view.webContents.insertCSS(
              ".course-title.jsx-431219561{font-size: 23 !important;}"
            );
            //Cambio de posicion del progress bar curso
            view.webContents.insertCSS(
              ".course-progress.jsx-431219561{display: flex !important;}"
            );
            view.webContents.insertCSS(
              ".course-progress.jsx-431219561{justify-content: center !important;}"
            );
            //Color del texto "Correct"
            view.webContents.insertCSS(
              ".jsx-3857101166{color: white !important;}"
            );
            //Cambio texto de mensaje en scenario
            view.webContents.insertCSS(
              ".message.jsx-433961312{color: white !important;}"
            );
            view.webContents.insertCSS(
              ".btn-clear.jsx-437056394{display: none !important;}"
            );
            view.webContents.insertCSS(
              ".queue-course-title.jsx-437056394{font-size: 20 !important;}"
            );
            view.webContents.insertCSS(
              "svg.svg-inline--fa.fa-caret-left.fa-w-6.fa-null.fa-rotate-null.fa-pull-null{display: none !important;}"
            );
            view.webContents.insertCSS(
              "svg.svg-inline--fa.fa-caret-right.fa-w-6.fa-null.fa-rotate-null.fa-pull-null{display: none !important;}"
            );
            //Quita el boton donde dice remotasks en skip
            view.webContents.insertCSS(
              ".jsx-2180323840.reason__category:nth-child(1){display: none !important;}"
            );
            //Quita los botones al final del curso de startTasks y reviewCourse
            view.webContents.insertCSS(
              ".course-summary__actions.jsx-3176796611{visivility: hidden !important;}"
            );
          });
          
          let urlPart1;
          //obtiene el url de ls instrucciones
          if (this.propJsonTask.subtask) {
            urlPart1 = this.propJsonTask.subtask.instruction.split('"');
          } else {
            urlPart1 = this.propJsonTask.instruction.split('"');
          }

          let urlInstrucciones = urlPart1[1];
          if (urlInstrucciones == "height:800px; width:100%") {
            urlInstrucciones = urlPart1[3];
          }
          console.log("Instrucciones");
          console.log(urlInstrucciones);
          if (urlInstrucciones != null) {
            //Si hay instrucciones entonces las abre
            ipcRenderer.send("show-instrucciones", urlInstrucciones);
          }
        }
      );
    }
  }
};
</script>

<style scoped>
.divCategory {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 40px;
  background-image: linear-gradient(rgba(255, 0, 0, 0), rgb(23, 26, 26));
}
.textoCategory {
  position: absolute;
  color: white;
}
.divImgCard {
  border-radius: 5px 5px 0px 0px;
}
.cardTasks {
  border-radius: 12px;
}
.divImage {
  position: relative;
  border-radius: 4px 4px 0px 0px;
  height: 200px;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.divImageNoTask {
  position: relative;
  border-radius: 4px 4px 0px 0px;
  height: 200px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
