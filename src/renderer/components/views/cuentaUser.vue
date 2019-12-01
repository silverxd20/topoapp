<template>
  <div>
    <v-container fluid>
      <!-- TARJETA DE LOS DATOS DEL USUARIO -->
      <v-card class="mt-3 mx-5">
        <img class="d-block mx-auto mb-4" src="/src/renderer/assets/cuenta.png" alt />
        <p
          class="d-flex justify-content-center texto"
        >Puede cambiar su contraseña o correo de cobro paypal</p>
        <v-layout class="d-flex justify-content-center">
          <v-flex xs6>
            <v-text-field
              :disabled="toggleContraseña"
              class="ml-5 mr-2 input-group--focused"
              label="Contraseña"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              @click:append="show2 = !show2"
              :type="show2 ? 'text' : 'password'"
              v-model="campoContraseña"
              prepend-inner-icon="mdi-textbox-password"
              outlined
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              :disabled="toggleCorreoPaypal"
              class="mr-5 ml-2"
              label="Correo Paypal"
              v-model="campCorreoPaypal"
              prepend-inner-icon="mdi-email"
              outlined
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-flex class="d-flex justify-content-center">
          <v-btn
            :disabled="toggleBtnEditar"
            @click="editarCampos()"
            class="mx-3 mb-4 bg-warning"
            d-inline
          >Editar</v-btn>

          <v-btn
            @click="btnGuardar()"
            class="ml-4 bg-primary"
            d-inline
            :disabled="toggleBtnGuardar"
          >
            <span :class="spinnerStatus" role aria-hidden="true"></span>
            Guardar
          </v-btn>
        </v-flex>
        <div class="d-flex justify-content-center mt-1">
          <p d-block v-show="showSatisfactorio" class="text-success text-center">
            <v-icon class="pr-1">mdi-check</v-icon>Los datos han sido actualizados!
          </p>
          <p d-block v-show="showFallido" class="text-danger text-center">
            <v-icon class="pr-1">mdi-alert-decagram</v-icon>No se pudieron actualizarlos datos, intente de nuevo.
          </p>
        </div>
      </v-card>

      <!-- TARJETA DE LOS TOKENS -->
    </v-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  created() {
    this.initDatos();
  },
  data() {
    return {
      showSatisfactorio: false,
      showFallido: false,
      spinnerStatus: "",
      show2: false,
      show3: false,
      show4: false,
      password: "Password",
      rules: {
        required: value => !!value || "Obligatorio.",
        min: v => v.length >= 6 || "Minimo 6 caracteres"
      },
      toggleContraseña: true,
      toggleCorreoPaypal: true,
      toggleBtnGuardar: true,
      toggleBtnEditar: false,
      campoContraseña: "",
      campCorreoPaypal: "",
      contraseñaInicial: ""
    };
  },
  computed: {
    ...mapState(["firebaseConfig", "userAuthData"])
  },
  methods: {
    ...mapMutations(["actualizaAuthData"]),

    initDatos() {
      this.campoContraseña = this.userAuthData.password;
      this.campCorreoPaypal = this.userAuthData.correopaypal;
      this.contraseñaInicial = this.userAuthData.password;
    },
    editarCampos() {
      this.toggleContraseña = false;
      this.toggleCorreoPaypal = false;
      this.toggleBtnGuardar = false;
      this.showSatisfactorio = false;
      this.showFallido = false;
    },
    btnGuardar() {
      this.spinnerStatus = "spinner-border spinner-border-sm";
      this.toggleBtnGuardar = true;
      this.toggleBtnEditar = true;
      this.toggleCorreoPaypal = true;
      this.toggleContraseña = true;
      let db;
      if (!firebase.apps.length) {
        //Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
      db = firebase.firestore();
      let UID = this.userAuthData.userid;
      var newPassword = this.campoContraseña;

      db.collection("usuarios")
        .doc(UID)
        .set({
          userid: UID,
          email: this.userAuthData.email,
          password: this.campoContraseña,
          nombre: this.userAuthData.nombre,
          apellido: this.userAuthData.apellido,
          activo: this.userAuthData.activo,
          premium: this.userAuthData.premium,
          porcentaje: this.userAuthData.porcentaje,
          correopaypal: this.campCorreoPaypal
        })
        .then(e => {
          console.log("Datos actualizados!");
          if (this.contraseñaInicial != this.campoContraseña) {
            //Nos relogeamos para poder tener una authenticacion fresca
            for (let index = 0; index < 1; index++) {
              firebase
                .auth()
                .signInWithEmailAndPassword(
                  this.userAuthData.email,
                  this.userAuthData.password
                )
                .then(user => {
                  console.log("Usuario Relogeado con éxito");
                  //Si el login es exitoso procede a cambiar la contraseña
                  for (let index = 0; index < 1; index++) {
                    console.log("Cambiando la contaseña");
                    firebase
                      .auth()
                      .currentUser.updatePassword(newPassword)
                      .then(() => {
                        this.spinnerStatus = "";
                        this.toggleBtnGuardar = false;
                        this.toggleContraseña = true;
                        this.toggleCorreoPaypal = true;
                        this.toggleBtnGuardar = true;
                        this.show2 = false;
                        this.showSatisfactorio = true;
                        this.toggleBtnEditar = false;
                        this.actualizaAuthData({
                          userid: UID,
                          email: this.userAuthData.email,
                          password: this.campoContraseña,
                          nombre: this.userAuthData.nombre,
                          apellido: this.userAuthData.apellido,
                          activo: this.userAuthData.activo,
                          premium: this.userAuthData.premium,
                          porcentaje: this.userAuthData.porcentaje,
                          correopaypal: this.campCorreoPaypal
                        });
                        console.log("Contraseña actualizada!");
                      })
                      .catch(error => {
                        console.log("Error actualizando la contraseña");
                        console.log(error);
                        index = -1;
                      });
                  }
                })
                .catch(error => {
                  console.log("Error Reautenticando el usuario");
                  console.log(error);
                  index = -1;
                });
            }
          } else {
            console.log("datos actualizados sin cambiar la contraseña");
            this.spinnerStatus = "";
            this.toggleBtnGuardar = false;
            this.toggleContraseña = true;
            this.toggleCorreoPaypal = true;
            this.toggleBtnGuardar = true;
            this.show2 = false;
            this.showSatisfactorio = true;
            this.toggleBtnEditar = false;
            this.actualizaAuthData({
              userid: UID,
              email: this.userAuthData.email,
              password: this.campoContraseña,
              nombre: this.userAuthData.nombre,
              apellido: this.userAuthData.apellido,
              activo: this.userAuthData.activo,
              premium: this.userAuthData.premium,
              porcentaje: this.userAuthData.porcentaje,
              correopaypal: this.campCorreoPaypal
            });
          }
        })
        .catch(error => {
          console.error(
            "Error actualizando los datos de usuario en la BD: ",
            error
          );
          //Reactiva el boton y oculta el spinner
          this.spinnerStatus = "";
          this.toggleBtnGuardar = false;
          this.showFallido = true;
          this.toggleBtnGuardar = false;
        });
    }
  }
};
</script>

<style scoped>
.texto {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 17px;
}
</style>