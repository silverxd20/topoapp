<template>
  <div>
    <!--Barra del menu Minimizar y Cerrar-->
    <div class="d-flex justify-content-end divBarraMenu">
      <div @click="btnMinimizar()" id="divMinimizar" class="">
        <p class="MinimizarIcon text-light font-weight-bold text-center">_</p>
      </div>
      <div @click="btnCerrar()" id="Cerrar">
        <p class="text-light text-center">x</p>
      </div>
    </div>
  </div>
</template>

<script>
const { remote } = require("electron");

export default {
  name: "barraSuperior",
  data() {
    return {
      winPrincial: remote.getCurrentWindow()
    };
  },
  methods: {
    btnCerrar() {
      this.winPrincial.close();
    },

    btnMinimizar() {
      this.winPrincial.minimize();
    }
  }
};
</script>

<style scoped>
.divBarraMenu {
  height: 25px;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100;
  background-color: #424242
}

#divMinimizar {
  width: 60px;
}

#divMinimizar:hover {
  background-color: #616161;
  cursor: default;
}

#Cerrar {
  width: 60px;
  background-color: #e62f2f;
}
#Cerrar:hover {
  background-color: #d30000;
  cursor: default;
}

p:hover {
  cursor: default;
}
</style>
