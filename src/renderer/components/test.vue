<template>
  <div>
    <h1>En test</h1>
    <h2>{{toggledrawer}}</h2>
  </div>
</template>

<script>
import axios from "axios";
const request = require("request");
import {mapState} from 'vuex';

export default {
  created() {
    //this.getTasks();
  },
  data() {
    return {
      jsonTarea: []
    }
  },
  computed: {
    ...mapState(["toggledrawer"]),
  },
  methods: {


testStore(){
      console.log(this.toggledrawer)
    }

   /* async getTasks() {
      //Envia la solicitud para obtener los datos
      let resp = await request(
        {
          url:
            "https://api-internal.scale.com/internal/v2/tasks/pending_combined?limit=1",
          headers: {
            authorization:
              "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNzQ5OTYwZC03ZThiLTQ1MGYtODQxMS02NTE2MzJlNWJhMDIiLCJpYXQiOjE1NzI3Mzk5MzcsImV4cCI6MTU4ODI5MTkzN30._7I6Jpt01IG42Bcpq-E9CTOtICImCDzDIEY0VdDYUUw"
          }
        },
        (error, response, body) => {
         //Muestra por log el array obtenido de la solicitud
          console.log("Respuesta de la solicitud que obtiene las tareas");     
          console.log(JSON.parse(body)[0]);

          let jsonRespTarea = JSON.parse(body)[0]
          //Comprueba si la tarea es normal o de tipo revisor
          if (jsonRespTarea.assignmentType === "subtask") {
            //Es una tarea normal, se enviará al data.
            console.log("Es una tarea clasica")
            this.jsonTarea.push(jsonRespTarea)
            console.log(this.jsonTarea)

            //IF interno que comprueba si hay una lidar en el panel de tasks clasicas
            if (jsonRespTarea.type === "lidarsegmentation") {
              //Si alguna cuenta tiene lidar y se atraviesa en clasic, manejarlo aqui
              console.log("Hay una lidar segmentacion atravesada en clasic")
            } else {
              //No hay lidar atravesada
            }

          } else if (jsonRespTarea.assignmentType == "course") {
            //En caso de que salga un curso aqui no manejmos
            console.log("Esto es un curso: " + jsonRespTarea.title);

          } else if (jsonRespTarea.assignmentType == "task_attempt"){
            //Si el tipo de tarea es de Revisor, se enviará al data.
            console.log("Tarea de tipo revisor: " + jsonRespTarea);
            this.jsonTarea.push(jsonRespTarea.subtask)
            console.log(this.jsonTarea)
          }
        }
      );
    },*/
  
  }
};
</script>

<style lang="scss" scoped>
</style>