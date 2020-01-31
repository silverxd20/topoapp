<template>
  <div>
    <v-container>
      <CursosList :jwtList="tokensJwtLista"></CursosList>
    </v-container>
  </div>
</template>

<script>
import CursosList from "../miniComponents/CursosList";
import { mapState } from "vuex";
export default {
  components: {
    CursosList
  },
  mounted() {
    this.traerTokensJWT(this.userAuthData.userid);
  },
  data() {
      return {
          tokensJwtLista: []
      }
  },
  computed: {
    ...mapState(["firebaseConfig", "userAuthData"])
  },
  methods: {
    //Trae los tokens de la cuenta de los usuarios
    traerTokensJWT(DocumentId) {
      let db;
      let data;
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
      db = firebase.firestore();
      var docRef = db.collection("tokens").doc(DocumentId);
      docRef
        .get()
        .then((doc)=> {
          if (doc.exists) {
 
            this.tokensJwtLista = Object.values(doc.data());
            console.log(this.tokensJwtLista)
        } else {
            // doc.data() will be undefined in this case
            console.log("No hay documentos");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    }
  }
};
</script>

<style scoped>
</style>