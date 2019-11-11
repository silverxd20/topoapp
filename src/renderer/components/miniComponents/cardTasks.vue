<template>
  <div>
    <v-card class="mx-auto" max-width="300" py-3>
      <div>
      <v-img
        class="white--text align-end"
        height="200px"
        :src="propJsonTask.params.attachment"
      >
        <v-card-title v-if="propJsonTask.type == 'segmentannotation'">Segmentación de imagen</v-card-title>
        <v-card-title v-if="propJsonTask.type == 'annotation'">Anotacion de cuadros 2D</v-card-title>
      </v-img>
      </div>

      <v-card-text class="text--primary">
        <div v-if="propJsonTask.project.name">{{propJsonTask.project.name}}</div>
        <div v-else>Tarea de Revisor</div>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="OpenTask()" color="blue lighten-2" text>
          Iniciar
        </v-btn>

      </v-card-actions>
    </v-card>
  </div>
</template>
To

<script>
let { remote } = require("electron");

export default {
    name:"cardtasks",
    props:["propJsonTask","propArraySession","propIndex"],
    data() {
        return {
            indexCard: this.propIndex
        }
    },
    
    methods: {
        //metodos aqui
        abreTarea(){
          this.$router.push({path: "browserTask"})
        },

        // 1) Funcion que abre la tarea disponible
    OpenTask() {
      let parteSinJWT = this.propArraySession[this.indexCard].split(" ");
      let mainSeasson = remote.getCurrentWindow();
      let sesion = mainSeasson.webContents.session;
      console.log(this.propArraySession)
      console.log(this.indexCard)
      sesion.cookies.set(
        {
          url: "https://www.remotasks.com/",
          name: "jwt",
          value: parteSinJWT[1]
        },
        error => {
         
          mainSeasson.loadURL("https://www.remotasks.com/tasks");
          mainSeasson.webContents.on('did-finish-load', function() {
          mainSeasson.webContents.insertCSS('html,body{ background-color: #FF0000 !important;}')

    });
        }
      );
    }
    },
};
</script>

<style scoped>

</style>
