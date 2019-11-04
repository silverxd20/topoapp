<template>
  <div>
    <!--Barra del menu Minimizar y Cerrar-->
    <div class="bg-dark d-flex justify-content-end divBarraMenu">
      <div @click="btnMinimizar()" id="Minimizar" class="pb-2">
        <p class="divMinimizar text-light font-weight-bold text-center">_</p>
      </div>
      <div @click="btnCerrar()" id="Cerrar" class="bg-danger">
        <p class="divCerrar text-light text-center">X</p>
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
  height: 30px;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100;
}

#Minimizar {
  width: 60px;
}

#Minimizar:hover {
  background-color: #616161;
  cursor: default;
}

#Cerrar {
  width: 60px;
  background-color: #e60101;
  padding-top: 4px;
}
#Cerrar:hover {
  background-color: #e62f2f;
  cursor: default;
}

p:hover {
  cursor: default;
}
</style>
