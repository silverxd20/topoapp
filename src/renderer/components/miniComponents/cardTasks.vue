<template>
  <div>
    <v-card class="mx-auto" max-width="300" py-3>
      <div>
        <!-- si la imagen es de tarea normal -->
        <v-img
          v-if="propJsonTask.assignmentType == 'subtask'"
          class="white--text align-end"
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
          class="white--text align-end"
          height="200px"
          :src="propJsonTask.subtask.params.attachment"
        >
          <div class="divCategory">
            <v-card-title v-if="propJsonTask.type == 'segmentannotation' || propJsonTask.taskType == 'segmentannotation'">Segmentación de imagen</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'annotation' || propJsonTask.taskType == 'annotation'">Anotación de cuadros 2D</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'categorization' || propJsonTask.taskType == 'categorization'">Categorización</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'videoboxannotation' || propJsonTask.taskType == 'videoboxannotation'">Anotación de videobox 2D</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'polygonannotation' || propJsonTask.taskType == 'polygonannotation'">Anotación de poligones</v-card-title>
            <v-card-title v-if="propJsonTask.type == 'cuboidannotation' || propJsonTask.taskType == 'cuboidannotation'">Anotación de Cubos 3D</v-card-title>
          </div>
        </v-img>
      </div>

      <v-card-text class="text--primary">
        <div v-if="propJsonTask.assignmentType == 'subtask'">Trabajo normal</div>
        <div v-if="propJsonTask.assignmentType == 'task_attempt'">Trabajo de Revisor</div>
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
    ...mapMutations(["browserId", "showBackDash","ocultaDrawer"]),
    //metodos aqui
    abreTarea() {
      this.$router.push({ path: "browserTask" });
    },

    // 1) Funcion que abre la tarea disponible
    OpenTask() {
      let parteSinJWT = this.propArraySession[this.indexCard].split(" ");
      let mainSeasson = electron.remote.getCurrentWindow();
      let sesion = mainSeasson.webContents.session;
      this.ocultaDrawer()
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

          view.webContents.on("did-start-loading", () => {
            //mainSeasson.insertCSS('html,body{ overflow: hidden !important; }');
            //view.webContents.insertCSS('html,body{ background-color: #FF0000 !important;}')
          });
        }
      );
    }
  }
};
</script>

<style scoped>
.divCategory {
  background-image: linear-gradient(rgba(255, 0, 0, 0), rgb(23, 26, 26));
}
</style>
