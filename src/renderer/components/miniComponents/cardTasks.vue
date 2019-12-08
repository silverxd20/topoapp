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
      nombreTarea: "-"
    };
  },
  mounted() {
    this.initTraeNombreDeLTareaDeIntrucciones();
    this.initComprobarDndVieneLaImg();
  },

  methods: {
    ...mapMutations(["browserId", "showBackDash", "ocultaDrawer"]),
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
          let view = new BrowserView();
          mainSeasson.setBrowserView(view);
          view.setBounds({
            x: 0,
            y: 25,
            width: boundsJson.width,
            height: heightExacto
          });
          view.webContents.loadURL("https://www.remotasks.com/tasks");
          this.browserId(view.id);
          this.showBackDash();

          //EVENTO que avisa cuando una nueva ventana es creada por link externo _blank
          view.webContents.on("new-window",
            (event, url, frameName, disposition, options) => {
              event.preventDefault();
              const win = new BrowserWindow({
                webContents: options.webContents, // use existing webContents if provided
                show: false
              });
              win.maximize();
              win.setMenu(null);
              win.once("ready-to-show", () => win.show());
              if (!options.webContents) {
                //win.loadURL(url); // existing webContents will be navigated automatically
              }
              win.webContents.loadURL(url);
              event.newGuest = win;
              //Pone el titulo y no deja que se actualice
              win.setTitle("Toposat vector");
              win.on("page-title-updated", (event, title) => {
                event.preventDefault();
                win.setTitle("Toposat vector");
              });
            }
          );

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
