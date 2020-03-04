<template>
  <div>
    <v-container fluid>
      <!-- TARJETA DE LOS DATOS DEL USUARIO -->
      <v-card class="mt-3 mx-5">
        <img class="d-block mx-auto mb-4" src="../../assets/cuenta.png" alt />
        <p
          v-if="userAuthData.premium == false"
          class="d-flex justify-content-center texto"
        >Puede cambiar su contraseña o correo de cobro paypal</p>
        <p
          v-if="userAuthData.premium == true"
          class="d-flex justify-content-center texto"
        >Puede cambiar su contraseña de toposat vector</p>
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
          <v-flex xs6 v-if="userAuthData.premium == false">
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
            @click="btnGuardarDatos()"
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
            <v-icon class="pr-1">mdi-alert-decagram</v-icon>No se pudieron actualizar los datos, intente de nuevo.
          </p>
        </div>
      </v-card>

      <!-- TARJETA DE LOS TOKENS -->

      <v-card v-if="userAuthData.premium == true" class="cardTokens mt-3 mx-5">
        <!-- Titulo de la tarjeta -->
        <div class="tituloTokenCard d-flex justify-content-center">
          <h5 class="titulo text-center d-inline">Cuentas de Usuario</h5>
          <v-chip class="chipPremium ma-2 d-inline" color="yellow" text-color="white">
            Premium
            <v-icon right>mdi-star</v-icon>
          </v-chip>
        </div>

        <!-- Spinner de carga inicial -->
        <div class="d-flex justify-content-center pt-3 pb-4">
          <v-progress-circular v-show="showSpinner" color="dark" indeterminate size="30"></v-progress-circular>
        </div>
        <div class="mx-5" v-for="(tokenValor, index) in tokenlist" :key="index.id">
          <div class="d-flex justify-content-end pr-1">
            <!-- Boton de abrir el university -->
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  class="botonListToken"
                  @click="clickOpenTaskLog(tokenlist[index].token)"
                >mdi-dock-window</v-icon>
              </template>
              <span>Abre el Task Log de esta cuenta</span>
            </v-tooltip>

            <!-- Boton de ver la cuenta del token -->
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <img
                  v-on="on"
                  class="botonListToken"
                  @click="verToken(tokenlist[index].token)"
                  src="../../assets/ver-cuenta.png"
                />
              </template>
              <span>Muestra nombre y correo de esta cuenta</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <img
                  v-on="on"
                  v-show="showQuitarBtn"
                  class="botonListToken"
                  dialog="true"
                  @click="ShowConfirmarDeleteToken(index)"
                  src="../../assets/close-circle.png"
                />
              </template>
              <span>Elimina este token</span>
            </v-tooltip>
          </div>
          <v-text-field
            :disabled="toggleInputToken"
            @change="ActivaGuardarTokensOnChange()"
            v-model="tokenValor.token"
            :label="'Token '+index"
            outlined
          ></v-text-field>
        </div>
        <div v-show="showAgregarToken">
          <p class="text-center">Agregar otra cuenta</p>
          <div class="botonListToken pb-3 d-flex justify-content-center">
            <img
              v-show="showAgregarToken"
              @click="agregarToken()"
              src="../../assets/plus-circle.png"
            />
          </div>
        </div>
        <!-- botones para guardar o editar -->
        <div class="d-flex justify-content-center pt-3">
          <v-btn
            v-show="showBotones"
            :disabled="toggleBtnEditarToken"
            @click="editarCampoTokens()"
            class="mx-3 mb-4 bg-warning"
            d-inline
          >Editar</v-btn>

          <v-btn
            v-show="showBotones"
            @click="btnGuardarTokens()"
            class="ml-4 bg-primary"
            d-inline
            :disabled="toggleBtnGuardarToken"
          >
            <span :class="spinnerStatusToken" role aria-hidden="true"></span>
            Guardar
          </v-btn>
        </div>

        <!-- mensaje de confirmación o fállo -->
        <div class="d-flex justify-content-center pt-1">
          <p d-block v-show="showSatisfactorioToken" class="text-success text-center">
            <v-icon class="pr-1">mdi-check</v-icon>La lista de cuentas se han actualizados!
          </p>
          <p d-block v-show="showFallidoToken" class="text-danger text-center">
            <v-icon class>mdi-alert-decagram</v-icon>No se pudieron actualizar las cuentas, intente de nuevo.
          </p>
        </div>

        <!-- Dialog que muestra el nombre de la cuenta -->
        <v-dialog
          v-if="CondicionDialog == 'datosCuenta'"
          v-model="dialog"
          max-width="350"
          persistent
        >
          <v-card>
            <v-card-title class="headline">Datos de esta cuenta</v-card-title>
            <v-card-text>
              Nombre:
              <span :class="spinnerStatusDialog" role aria-hidden="true"></span>
              {{nombreCuentaToken}}
            </v-card-text>
            <v-card-text>
              Correo:
              <span :class="spinnerStatusDialog" role aria-hidden="true"></span>
              {{correoCuentaToken}}
            </v-card-text>
            <v-text-field
              class="mx-3"
              @change="activaGuardarPaypal()"
              v-model="emailUserPaypal"
              label="Correo PayPal de esta cuenta"
              outlined
            ></v-text-field>
            <!-- MENSAJE de agregar un correo paypal -->
            <p
              v-show="showMensajeAddPaypal"
              class="text-danger text-center px-2"
            >Agrega un correo paypal para cobrar en esta cuenta</p>

            <!-- MENSAJE de agregar un correo paypal -->
            <p d-block v-show="showPaypalActualizado" class="text-success text-center">
              <v-icon class="pr-1">mdi-check</v-icon>El correo paypal se ha actualizado.
            </p>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                class="text-light bg-dark"
                text
                @click.stop="dialog = false"
                @click="cerrarDialog()"
              >Cerrar</v-btn>

              <v-btn
                class="bg-primary text-light"
                :disabled="toggleGuardarPaypal"
                text
                @click="GuardarPaypalDialog()"
              >
                <span :class="spinnerStatusPaypalDialog" role aria-hidden="true"></span>
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog confirmacion para eliminar token -->
        <v-dialog
          v-if="CondicionDialog == 'confirmacion'"
          v-model="dialog"
          max-width="290"
          persistent
        >
          <v-card>
            <v-card-title class="headline">Confirmación!</v-card-title>
            <v-card-text>Desea eliminar esta cuenta?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- Boton NO -->
              <v-btn color="green darken-1" text @click.stop="dialog = false">No</v-btn>
              <!-- Boton SI -->
              <v-btn
                color="green darken-1"
                text
                @click.stop="dialog = false"
                @click="quitarToken()"
              >Si</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
const electron = require("electron");
import { remote, Menu } from "electron";
let request = require("async-request");
var request2 = require("request");

export default {
  mounted() {
    this.initDatos();
  },
  data() {
    return {
      tokenlist: [],
      showAgregarToken: false,
      showSpinner: true,
      showSatisfactorio: false,
      showSatisfactorioToken: false,
      showFallido: false,
      showFallidoToken: false,
      showBotones: false,
      showQuitarBtn: false,
      showPaypalActualizado: false,
      showMensajeAddPaypal: false,
      toggleGuardarPaypal: true,
      toggleContraseña: true,
      toggleCorreoPaypal: true,
      toggleBtnGuardar: true,
      toggleBtnGuardarToken: true,
      toggleBtnEditar: false,
      toggleBtnEditarToken: false,
      toggleInputToken: true,
      jwtClickeadoActual: "",
      nombreCuentaToken: "",
      correoCuentaToken: "",
      spinnerStatus: "",
      spinnerStatusPaypalDialog: "",
      emailUserPaypal: "",
      spinnerStatusToken: "",
      CondicionDialog: "",
      spinnerStatusDialog: "spinner-border spinner-border-sm",
      indexDeleteToken: "",
      fingerPrint: "",
      dialog: false,
      show2: false,
      show3: false,
      show4: false,
      password: "Password",
      rules: {
        required: value => !!value || "Obligatorio.",
        min: v => v.length >= 6 || "Minimo 6 caracteres"
      },
      campoContraseña: "",
      campCorreoPaypal: "",
      contraseñaInicial: ""
    };
  },
  computed: {
    ...mapState(["firebaseConfig", "userAuthData"])
  },
  methods: {
    ...mapMutations(["actualizaAuthData","listaDeJwtFromListUser"]),
    //1) Ejecuciones al inicio
    initDatos() {
      this.campoContraseña = this.userAuthData.password;
      this.campCorreoPaypal = this.userAuthData.correopaypal;
      this.contraseñaInicial = this.userAuthData.password;
      console.log(this.userAuthData);
      if (this.userAuthData.premium == true) {
        this.getUserTokenList();
      }
    },
    //2) Permite que los inputs de los datos del usuario sean editables
    editarCampos() {
      this.toggleContraseña = false;
      this.toggleCorreoPaypal = false;
      this.toggleBtnGuardar = false;
      this.showSatisfactorio = false;
      this.showFallido = false;
    },

    //3)Permite editar los campos de los tokens LISTO
    editarCampoTokens() {
      this.toggleInputTokens = false;
      this.toggleInputToken = false;
      this.showAgregarToken = true;
      this.showQuitarBtn = true;
      this.showSatisfactorioToken = false;
      this.showFallidoToken = false;
    },
    //4) trae la lista de tokens y los pone en inputs LISTO
    getUserTokenList() {
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
      let db;
      db = firebase.firestore();
      firebase.auth().onAuthStateChanged(user => {
        db.collection("tokens")
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              //busca el ID del usuario para traer sus JWT
              if (doc.id == user.uid) {
                //Convierte el json que viene de la base de datos en array
                let arraySession = Object.values(doc.data());
                console.log(arraySession.length);
                for (const index in arraySession) {
                  //Envia el valor de la lista al data en json individual
                  this.tokenlist.push({ token: arraySession[index] });
                  //Cuando termine el bucle muestra y quita spiner y botones
                  let lengthSession = arraySession.length - 1;
                  if (index == lengthSession) {
                    console.log("Finalizado");
                    this.showSpinner = false;
                    this.showBotones = true;
                  }
                }
              }
            });
          })
          .catch(error => {
            console.log("Error obteniendo tokens catch promise");
            console.log(error);
          });
      });
    },
    //5) Actualiza la contraseña y/o correo de paypal LISTO
    btnGuardarDatos() {
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
    },
    //6)Guarda los tokens en la base de datos
    btnGuardarTokens() {
      this.spinnerStatusToken = "spinner-border spinner-border-sm";
      this.toggleInputToken = true;
      this.showQuitarBtn = false;
      this.showAgregarToken = false;
      this.toggleBtnGuardarToken = true;
      this.toggleBtnEditarToken = true;
      this.showFallidoToken = false;

      let tokenActualizadoList = [];
      let db;
      if (!firebase.apps.length) {
        //Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
      //Cambia el formato del json al de la lista de la base de datos
      let ListaTokensActualizada = {};
      let ListaTokenEnArrayParaBotCursos = []
      for (const index in this.tokenlist) {
        console.log(this.tokenlist[index].token);
        ListaTokensActualizada["_"+index] = this.tokenlist[index].token;
        ListaTokenEnArrayParaBotCursos.push(this.tokenlist[index].token)
      }
      //Envía a la base de datos la nueva lista de tokens
      db = firebase.firestore();
      db.collection("tokens")
        .doc(this.userAuthData.userid)
        .set(ListaTokensActualizada)
        .then(e => {
          console.log("Campos actualizados!");
          this.showSatisfactorioToken = true;
          this.toggleBtnEditarToken = false;
          this.spinnerStatusToken = "";
          this.listaDeJwtFromListUser(ListaTokenEnArrayParaBotCursos)
        })
        .catch(error => {
          console.error("Error actualizando campos: ", error);
          this.showFallidoToken = true;
          this.toggleInputToken = false;
          this.showQuitarBtn = true;
          this.showAgregarToken = true;
          this.toggleBtnGuardarToken = false;
          this.spinnerStatusToken = "";
        });
    },
    //7) quita elemento de la lista
    quitarToken() {
      this.$delete(this.tokenlist, this.indexDeleteToken);
      this.toggleBtnGuardarToken = false;
    },
    //8) agregar nuevo token LISTO
    agregarToken() {
      this.tokenlist.push({ token: "" });
      this.toggleBtnGuardarToken = false;
    },
    //9)Ver datos del token seleccionado
    async verToken(tokenJTW) {
      this.jwtClickeadoActual = tokenJTW;
      this.CondicionDialog = "datosCuenta";
      this.dialog = true;
      this.spinnerStatusDialog = "spinner-border spinner-border-sm";

      let headers = {
        authorization: tokenJTW,
        Origin: "https://www.remotasks.com",
        "user-agent":
          "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
      };

      //Url de la solicitud http
      let urlPedirTarea =
        "https://api-internal.scale.com/internal/logged_in_user";
      //Envia la solicitud para obtener los datos con libreria request
      let resp = await request(urlPedirTarea, { method: "GET", headers });
      let { firstName, lastName, email, paypalEmail } = JSON.parse(resp.body);
      this.spinnerStatusDialog = "";
      this.nombreCuentaToken = firstName + " " + lastName;
      this.correoCuentaToken = email;
      this.emailUserPaypal = paypalEmail;
      if (this.emailUserPaypal == null) {
        console.log("correo paypal null");
        this.showMensajeAddPaypal = true;
      }
    },
    //10) Cierra el dialog
    cerrarDialog() {
      this.nombreCuentaToken = "";
      this.correoCuentaToken = "";
      this.showMensajeAddPaypal = false;
      this.emailUserPaypal = "";
      this.toggleGuardarPaypal = true;
      this.showPaypalActualizado = false;
    },
    //11) abre dialog que confirma antes de eliminar
    ShowConfirmarDeleteToken(index) {
      this.CondicionDialog = "confirmacion";
      this.dialog = true;
      this.indexDeleteToken = index;
    },
    //12) activa el boton guardar del input del dialog correo paypal
    activaGuardarPaypal() {
      this.toggleGuardarPaypal = false;
    },
    //13) cambia o agrega en remotasks el correo de paypal de esa cuenta
    async GuardarPaypalDialog() {
      this.crearFingerPrint(31);
      this.spinnerStatusPaypalDialog = "spinner-border spinner-border-sm";

      //Url de la solicitud http
      console.log(this.jwtClickeadoActual);
      request2
        .post(
          {
            headers: {
              authorization: this.jwtClickeadoActual,
              Origin: "https://www.remotasks.com",
              "finger-print": "0" + this.fingerPrint,
              "content-type": "application/json",
              "user-agent":
                "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
            },
            url: "https://api-internal.scale.com/internal/worker/update",
            body: JSON.stringify({
              paypalEmail: this.emailUserPaypal,
              countryCode: "VE",
              password: ""
            })
          },
          (error, response, body) => {
            this.spinnerStatusPaypalDialog = "";
            this.toggleGuardarPaypal = true;
            this.showPaypalActualizado = true;
          }
        )
        .catch(error => {
          console.log("Salio mala la guardada de paypal");
          console.log(error);
          this.spinnerStatusPaypalDialog = "";
          this.toggleGuardarPaypal = false;
        });
    },
    //14) si cambia el valor de los inputs de tokens se activa el boton guardar
    ActivaGuardarTokensOnChange() {
      this.toggleBtnGuardarToken = false;
    },
    //15) Crea el Finger Print y lo almacena en el data.
    crearFingerPrint(length) {
      var result = "";
      var characters =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        this.fingerPrint = result;
      }
    },
    //16) Abre university
    clickOpenTaskLog(tokenJWT) {
      let parteSinJWT = tokenJWT.split(" ");
      let mainSeasson = electron.remote.getCurrentWindow();
      let sesion = mainSeasson.webContents.session;

      sesion.cookies.set(
        {
          url: "https://www.remotasks.com/",
          name: "jwt",
          value: parteSinJWT[1]
        },
        error => {
          const remote = require("electron").remote;
          const BrowserWindow = remote.BrowserWindow;
          const win = new BrowserWindow({
            show: false
          });
          win.maximize();         
          //Pone el titulo y no deja que se actualice
          win.webContents.loadURL("https://www.remotasks.com/activity");
          win.setTitle("Toposat vector");
          win.webContents.on("page-title-updated", (event, title) => {
            event.preventDefault();
            win.setTitle("Toposat vector");
          });
        }
      );
    }
  }
};
</script>

<style scoped>
.texto {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 17px;
}
.tituloTokenCard {
  position: relative;
  height: 55px;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  background-color: rgb(30, 136, 299);
  padding: 10px;
  color: white;
}
.botonListToken {
  cursor: pointer;
  margin-bottom: 5px;
  margin-right: 5px;
}
.titulo {
  position: absolute;
  margin-right: 170px;
  padding-top: 7px;
}
.chipPremium{
  position: absolute;
  right: 5px;
  top:3px;
  margin-bottom: 5px;
}
</style>