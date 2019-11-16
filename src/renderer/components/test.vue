<template>
  <div>
    <p>Mensaje</p>
    <button @click="testSincronia()">Probar</button>
  </div>
</template>

<script>
const request = require("request");
import { mapState } from "vuex";

export default {
  created() {},
  computed: {
    ...mapState(["firebaseConfig"])
  },

  data() {
    return {};
  },
  methods: {
  async testSincronia() {
      console.log("antes de ejecutar");
     let resp = await this.getValues();
      console.log("luego de resolver la solicitud");
      console.log(resp)
    },

    getValues() {
      let db
         if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
      db = firebase.firestore();
      return db.collection("usuarios")
        .doc("sbJnlIOehvg0yCnUyyBhzcUiSoI3")
        .get()
        .then(function(doc) {
          if (doc.exists) {
            console.log("Dato desde la funcion")
            return doc.data();
          }else{

            return Promise.reject("No hay usuario");
          }
        });
    }
  }
};
</script>

<style scoped>
.vuebar-element {
  height: 250px;
  width: 100%;
  max-width: 500px;
  background: #59b82c;
}

.vb > .vb-dragger {
  z-index: 5;
  width: 12px;
  right: 0;
}

.vb > .vb-dragger > .vb-dragger-styler {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: rotate3d(0, 0, 0, 0);
  transform: rotate3d(0, 0, 0, 0);
  -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out,
    height 100ms ease-out;
  transition: background-color 100ms ease-out, margin 100ms ease-out,
    height 100ms ease-out;
  background-color: #e3fc001a;
  margin: 5px 5px 5px 0;
  border-radius: 20px;
  height: calc(100% - 10px);
  display: block;
}

.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(2, 35, 94, 0.3);
}

.vb > .vb-dragger:hover > .vb-dragger-styler {
  background-color: rgba(48, 121, 244, 0.5);
  margin: 0px;
  height: 100%;
}

.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(48, 121, 244, 0.5);
  margin: 0px;
  height: 100%;
}

.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(48, 121, 244, 0.5);
}
</style>