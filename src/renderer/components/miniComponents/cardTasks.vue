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
          <v-card-title v-if="propJsonTask.type == 'segmentannotation'">Segmentación de imagen</v-card-title>
          <v-card-title v-if="propJsonTask.type == 'annotation'">Anotacion de cuadros 2D</v-card-title>
        </v-img>

        <!-- si la imagen es de revisor -->
        <v-img
          v-if="propJsonTask.assignmentType == 'task_attempt'"
          class="white--text align-end"
          height="200px"
          :src="propJsonTask.subtask.params.attachment"
        >
          <v-card-title
            v-if="propJsonTask.subtask.type == 'segmentannotation'"
          >Segmentación de imagen</v-card-title>
          <v-card-title v-if="propJsonTask.subtask.type == 'annotation'">Anotacion de cuadros 2D</v-card-title>
        </v-img>
      </div>

      <v-card-text class="text--primary">
        <div v-if="propJsonTask.assignmentType == 'subtask'">Trabajo clasico</div>
        <div v-if="propJsonTask.assignmentType == 'task_attempt'">Trabajo de Revisor</div>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="OpenTask()" color="blue lighten-2" text>Iniciar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
To

<script>
const electron = require('electron');
const BrowserView= electron.remote.BrowserView;

export default {
  name: "cardtasks",
  props: ["propJsonTask", "propArraySession", "propIndex"],

  data() {
    return {
      indexCard: this.propIndex
    };
  },

  methods: {
    
    //metodos aqui
    abreTarea() {
      this.$router.push({ path: "browserTask" });
    },

    // 1) Funcion que abre la tarea disponible
    OpenTask() {
      let parteSinJWT = this.propArraySession[this.indexCard].split(" ");
      let mainSeasson = electron.remote.getCurrentWindow();
      let sesion = mainSeasson.webContents.session;
      console.log(this.propArraySession);
      console.log(this.indexCard);
      sesion.cookies.set(
        {
          url: "https://www.remotasks.com/",
          name: "jwt",
          value: parteSinJWT[1]
        },
        error => {

          let view = new BrowserView();
          mainSeasson.setBrowserView(view);
          view.setBounds({ x: 0, y: 25, width: 900, height: 500 });
          view.webContents.loadURL("https://www.remotasks.com/tasks");

          /* mainSeasson.loadURL("https://www.remotasks.com/tasks");
          mainSeasson.webContents.on('did-finish-load', function() {
          mainSeasson.webContents.insertCSS('html,body{ background-color: #FF0000 !important;}')

    });*/
        }
      );
    }
  }
};
</script>

<style scoped>
</style>
