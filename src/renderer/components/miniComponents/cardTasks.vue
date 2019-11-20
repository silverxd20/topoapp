<template>
  <div>
    <v-card class="mx-auto" max-width="300">
      <div>
        <!-- si la imagen es de tarea normal -->
        <v-img
          v-if="propJsonTask.assignmentType == 'subtask'"
          class="divImgCard white--text align-end"
          height="200px"
          :src="propJsonTask.params.attachment"
        >
          <div class="divCategory">
            <v-card-title v-if="propJsonTask.type == 'segmentannotation'">Segmentación de imagen</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'annotation'">Anotacion de cuadros 2D</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'categorization'">Categorización</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'videoboxannotation'">Anotacion de videobox 2D</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'polygonannotation'">Anotacion de poligones</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'cuboidannotation'">Anotación de Cubos 3D</v-card-title>
          </div>
        </v-img>

        <!-- si la imagen es de revisor -->
        <v-img
          v-if="propJsonTask.assignmentType == 'task_attempt'"
          class="divImgCard white--text align-end"
          height="200px"
          :src="propJsonTask.subtask.attachmentS3Downloads[0].s3URL"
        >
          <div class="divCategory">
            <v-card-title
              v-if="propJsonTask.type == 'segmentannotation' || propJsonTask.taskType == 'segmentannotation'"
            >Segmentación de imagen</v-card-title>
            <v-card-title
              v-if="propJsonTask.type == 'annotation' || propJsonTask.taskType == 'annotation'"
            >Anotación de cuadros 2D</v-card-title>
            <v-card-title
              v-if="propJsonTask.type == 'categorization' || propJsonTask.taskType == 'categorization'"
            >Categorización</v-card-title>
            <v-card-title
              v-if="propJsonTask.type == 'videoboxannotation' || propJsonTask.taskType == 'videoboxannotation'"
            >Anotación de videobox 2D</v-card-title>
            <v-card-title
              v-if="propJsonTask.type == 'polygonannotation' || propJsonTask.taskType == 'polygonannotation'"
            >Anotación de poligones</v-card-title>
            <v-card-title
              v-if="propJsonTask.type == 'cuboidannotation' || propJsonTask.taskType == 'cuboidannotation'"
            >Anotación de Cubos 3D</v-card-title>
          </div>
        </v-img>

        <!-- si la imagen es un curso -->
        <v-img
          pa-2
          v-if="propJsonTask.assignmentType == 'course'"
          class="divImgCard white--text align-end"
          height="200px"
          src="src\renderer\assets\curso.jpg"
        >
          <div class="divCategory">
            <v-card-title v-if="propJsonTask.type == 'segmentannotation'">Segmentación de imagen</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'annotation'">Anotacion de cuadros 2D</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'categorization'">Categorización</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'videoboxannotation'">Anotacion de videobox 2D</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'polygonannotation'">Anotacion de poligones</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'cuboidannotation'">Anotación de Cubos 3D</v-card-title>
          </div>
        </v-img>
      </div>

      <v-card-text class="text--primary">
        <div v-if="propJsonTask.assignmentType == 'subtask'">Trabajo normal</div>
        <div v-if="propJsonTask.assignmentType == 'task_attempt'">Trabajo de Revisor</div>
        <div v-if="propJsonTask.assignmentType == 'course'">{{"Curso: "+propJsonTask.title}}</div>
      </v-card-text>

      <v-card-actions>
        <v-btn elevation="1" @click="OpenTask()" color="blue darken-2" text>Iniciar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
To

<script>
import { mapMutations } from "vuex";
const { ipcRenderer } = require('electron')
const electron = require("electron");
const BrowserView = electron.remote.BrowserView;

export default {
  name: "cardtasks",
  props: ["propJsonTask", "propArraySession", "propIndex"],

  data() {
    return {
      indexCard: this.propIndex
    };
  },

  methods: {
    ...mapMutations(["browserId", "showBackDash", "ocultaDrawer"]),
    //metodos aqui
 
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

          let urlPart1
          //obtiene el url de ls instrucciones
          if (this.propJsonTask.subtask) {
            urlPart1 = this.propJsonTask.subtask.instruction.split('"')
          }else{
            urlPart1 = this.propJsonTask.instruction.split('"')         
          }

          let urlInstrucciones = urlPart1[1]
          ipcRenderer.send("show-instrucciones", urlInstrucciones)
        }
      );
    },

    openInstructions() {
      let win = new BrowserWindow({
        show: false,
        frame: false,
        useContentSize: true
      });
      win.maximize();
      win.show();
      win.webContents.loadURL("https://www.google.com/");

      win.webContents.on("did-finish-load", () => {
        console.log("Finalizó la carga del sitio");
        view.webContents.insertCSS(
          "html,body{ background-color: #FF0000 !important;}"
        );
      });

      win.on("closed", () => {
        win = null;
      });
    }
  }
};
</script>

<style scoped>
.divCategory {
  background-image: linear-gradient(rgba(255, 0, 0, 0), rgb(23, 26, 26));
}
.divImgCard{
  border-radius: 5px 5px 0px 0px;
}
</style>
