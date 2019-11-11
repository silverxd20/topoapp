<template>
  <div>
    <h1>En test</h1>
    <h2>{{toggledrawer}}</h2>
    <button @click="pruebaWebFrame()"> Aplicar cosas</button>
  </div>
</template>

<script>
const { webFrame, webContents, remote } = require('electron')
import axios from "axios";
const request = require("request");
import {mapState} from 'vuex';

export default {
  created() {
    this.pruebaWebFrame()
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

      pruebaWebFrame(){
       
       // webFrame.insertText("Hola q ase")
       webFrame.setZoomFactor(2)
      }
  }
};
</script>

<style lang="scss" scoped>
</style>