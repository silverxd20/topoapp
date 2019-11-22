<template>
  <div>
    <v-card class="cardTasks mx-auto" max-width="300">
      <div>
        <!-- si la imagen es de tarea normal -->
        <div
          v-if="propJsonTask.assignmentType == 'subtask'"
          class="divImage"
          :style="{'background-image': 'url('+propJsonTask.params.attachment+')'}">

          <!-- chips superior -->
          <div class="d-flex justify-content-end">
            <v-chip class="ma-2" color="primary" text-color="white">
            Categoría
            <v-icon right>mdi-tag</v-icon>
          </v-chip>
          </div>

          <v-card-title class="divCategory">
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'segmentannotation'"
            >Segmentación de imagen</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'annotation'"
            >Anotación de cuadros 2D</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'categorization'"
            >Categorización</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'videoboxannotation'"
            >Anotación de videobox</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'polygonannotation'"
            >Anotación de poligones</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'cuboidannotation'"
            >Anotación de Cubos 3D</v-card-title>
          </v-card-title>
        </div>

        <!-- si la imagen es de revisor -->
        <div
          v-if="propJsonTask.assignmentType == 'task_attempt'"
          class="divImage"
          :style="{'background-image': 'url('+propJsonTask.subtask.attachmentS3Downloads[0].s3URL+')'}">

          <!-- chips superior -->
          <div class="d-flex justify-content-end">
            <v-chip class="ma-2" color="yellow" text-color="white">
            Revisor
            <v-icon right>mdi-star</v-icon>
          </v-chip>
          </div>

          <v-card-title class="divCategory">
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'segmentannotation'"
            >Segmentación de imagen</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'annotation'"
            >Anotación de cuadros 2D</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'categorization'"
            >Categorización</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'videoboxannotation'"
            >Anotación de videobox</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'polygonannotation'"
            >Anotación de poligones</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.type == 'cuboidannotation'"
            >Anotación de Cubos 3D</v-card-title>
          </v-card-title>
        </div>

        <!-- si la imagen es un curso -->
        <div
          v-if="propJsonTask.assignmentType == 'course'"
          class="divImage"
          :style="{'background-image': 'url(src/renderer/assets/curso.jpg)'}">

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
              class="text-light"
              v-if="propJsonTask.taskType == 'segmentannotation'"
            >Segmentación de imagen</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.taskType == 'annotation'"
            >Anotación de cuadros 2D</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.taskType == 'categorization'"
            >Categorización</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.taskType == 'videoboxannotation'"
            >Anotación de videobox</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.taskType == 'polygonannotation'"
            >Anotación de poligones</v-card-title>
            <v-card-title
              class="text-light"
              v-if="propJsonTask.taskType == 'cuboidannotation'"
            >Anotación de Cubos 3D</v-card-title>
          </v-card-title>
        </div>

        <!-- si no hay tareas disponibles -->
        <div
          v-if="propJsonTask[0] == 's'"
          class="divImageNoTask"
          :style="{'background-image': 'url(src/renderer/assets/noTasks.png)'}"
        >
          <v-card-title class="divCategory">
            <v-card-title class="text-light">Sin tareas disponibles</v-card-title>
          </v-card-title>
        </div>
      </div>

      <v-card-text class="text--primary">
        <div
          v-if="propJsonTask[0] == 's'"
        >Por ahora no hay trabajos en esta categoría, por favor revise luego.</div>
        <div v-if="propJsonTask.assignmentType == 'subtask'">Trabajo normal</div>
        <div v-if="propJsonTask.assignmentType == 'task_attempt'">Trabajo de Revisor</div>
        <div v-if="propJsonTask.assignmentType == 'course'">{{propJsonTask.title}}</div>
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
const { ipcRenderer } = require("electron");
const electron = require("electron");
const BrowserView = electron.remote.BrowserView;

export default {
  name: "cardtasks",
  props: ["propJsonTask", "propArraySession", "propIndex"],

  data() {
    return {
      indexCard: this.propIndex,
      desabilitado: true
    };
  },
  mounted() {
    this.initest();
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

          let urlPart1;
          //obtiene el url de ls instrucciones
          if (this.propJsonTask.subtask) {
            urlPart1 = this.propJsonTask.subtask.instruction.split('"');
          } else {
            urlPart1 = this.propJsonTask.instruction.split('"');
          }

          let urlInstrucciones = urlPart1[1];
          ipcRenderer.send("show-instrucciones", urlInstrucciones);
        }
      );
    },
    initest() {
      console.log("propJsonTask");
      console.log(this.propJsonTask[0]);
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
  position: absolute;
  bottom: 1px;
  width: 100%;
  height: 40px;
  background-image: linear-gradient(rgba(255, 0, 0, 0), rgb(23, 26, 26));
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
