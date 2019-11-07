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

      <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>

      <v-card-text class="text--primary">
        <div v-if="propJsonTask.project.name">{{propJsonTask.project.name}}</div>
        <div v-else>Tarea de Revisor</div>
      </v-card-text>

      <v-card-actions>
        <v-btn color="blue lighten-2" text>
          Iniciar
        </v-btn>

      </v-card-actions>
    </v-card>
  </div>
</template>
To

<script>
export default {
    name:"cardtasks",
    props:["propJsonTask"],
    data() {
        return {
            
        }
    },
    
    methods: {
        //metodos aqui
    },
};
</script>

<style scoped>

</style>
