<template>
  <div>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <CursoAddToBD></CursoAddToBD>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <CursosList :jwtList="tokensJwtLista"></CursosList>
        </v-flex>
      </v-layout>
      
    </v-container>
  </div>
</template>

<script>
import CursosList from "../miniComponents/CursosList";
import CursoAddToBD from '../miniComponents/CursoAddToBD';
import { mapState } from "vuex";
export default {
  components: {
    CursosList,
    CursoAddToBD
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