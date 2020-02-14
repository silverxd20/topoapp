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
          <CursosList></CursosList>
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

  }
};
</script>

<style scoped>
</style>