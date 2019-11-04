<template>
  <div>
    <v-card class="mx-auto" max-width="300" py-3>
      <v-img
        class="white--text align-end"
        height="200px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      >
        <v-card-title>Polygon</v-card-title>
      </v-img>

      <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>

      <v-card-text class="text--primary">
        <div>{{tituloTask}}</div>

        <div>{{description}}</div>
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
    props:["tituloTask","categoria", "description"],
    data() {
        return {
            
        }
    },

    props: [],
    
    methods: {
        //metodos aqui
    },
};
</script>

<style lang="scss" scoped></style>
