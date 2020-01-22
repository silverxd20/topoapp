<template>
<div class="divFondo">
  <v-row justify="center">
      <div class="divPreguntas">
          <img class=" mx-auto d-block imgPregunta" src="../../assets/preguntas.png" alt="">
          <h2 class="d-flex justify-content-center text-light">Preguntas frecuentes</h2>
      </div>
      <v-container>
    <v-expansion-panels  popout>
        <!-- Pregunta 1 -->
      <v-expansion-panel >
        <v-expansion-panel-header class="font-weight-bold">Que es Toposat vector?</v-expansion-panel-header>
        <v-expansion-panel-content class="px-3">
            Somos un sistema digital en el cual se editan imagenes para el entrenamiento de inteligencia artificial.
        </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Pregunta 2 -->
        <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-bold">Como funciona el pago de tareas?</v-expansion-panel-header>
        <v-expansion-panel-content>
            Todas las tareas tienen un pago diferente, el valor del mismo depende de la precision y calidad de tu trabajo.
            Una vez realices la taréa y sea entregada, ésta pasa por un proceso de revision para verificar y corregir si tienes errores,
            ya pasado todo este proceso, se determinará el valor de la misma y se agregará a tu saldo disponible.
        </v-expansion-panel-content>
      </v-expansion-panel>
    
      <!-- Pregunta 3 
        <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-bold">Que es la fecha de corte?</v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>-->

      <!-- Pregunta 4 -->
        <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-bold">Cual es el dia de cobro y por donde?</v-expansion-panel-header>
        <v-expansion-panel-content>
           El método de pago es a travez de PayPal, se harán todos los sabados durante el transcurso de la mañana, se abonará el saldo que tenga disponible en su panel pricipal hasta la fecha de corte.
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
</v-container>
  </v-row>
</div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>

.divPreguntas{
     background-image: linear-gradient(to right top,#0043a7,#005dbb,#0075cc,#008edb,#00a6e7);
     height: 250px;
     width: 100%;
     padding-top: 40px;
}

.imgPregunta{
    height: 120px;
    width: 120px
}

.divFondo{
background-color: rgb(250, 250, 250)
}
</style>