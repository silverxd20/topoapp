<template>
  <div class="divtodo">
    <div class="container contenedor align-items-center" id="contenedor">
      <div class="row d-flex justify-content-center align-items-center">
        <!--Mensaje-->
        <div class="">
          <img
            class="mr-5 d-flex justify-content-center"
            src="../assets/localworker.png"
          />
          <h4 class="text-light mr-5 d-flex justify-content-center">
            Haz tareas, gana dinero!
          </h4>
          <!--Imagen izquierda-->
          <img
            class="img2 d-flex justify-content-center"
            src="../assets/worker.png"
          />
        </div>

        <div class="d-inline">
          <form class="form pt-3 pl-5 pr-5 mt-3 mb-3 bg-dark">
            <!--Logo-->
            <img src="../assets/joblogo.png" class="rounded mx-auto d-block" />
            <div class="form-group">
              <label class="text-light" for="exampleInputEmail1"
                >Email address</label
              >
              <input
                v-model="valorEmail"
                type="email"
                class="form-control"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
            </div>
            <div class="form-group">
              <label class="text-light" for="exampleInputPassword1"
                >Password</label
              >
              <input
                v-model="valorPass"
                @keyup.enter="btnLogin()"
                type="password"
                class="form-control"
                placeholder="Password"
              />
            </div>

            <div class="d-flex justify-content-center">
              <button
                @click="btnLogin()"
                id="loginBtn"
                class="btn btn-success"
                type="button"
              >
                <span :class="spinner" role="status" aria-hidden="true"></span>
                Login
              </button>
            </div>
            <div class="d-flex justify-content-center">
              <label class="text-danger pt-2">{{ mensaje }}</label>
            </div>
          </form>        
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
const { remote } = require("electron");

export default {
  name: "Login",
  created() {
    this.firebaseInit();
  },
  components: { SystemInformation },
  data() {
    return {
      spinner: "",
      mensaje: "",
      valorEmail: "",
      valorPass: "",
      winPrincial: remote.getCurrentWindow(),
      firebaseConfig: {
        apiKey: "AIzaSyBx9HYfNoMzkclTydv60oqKHywN4G7vNfo",
        authDomain: "remodesktop-9b704.firebaseapp.com",
        databaseURL: "https://remodesktop-9b704.firebaseio.com",
        projectId: "remodesktop-9b704",
        storageBucket: "",
        messagingSenderId: "450738698352",
        appId: "1:450738698352:web:1bcc2c00ab77337171dcb5",
        measurementId: "G-2Q69C2TFFR"
      }
    };
  },
  methods: {

    //Inicia el app de firebase
    firebaseInit() {
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
    },

    // LOGIN
    btnLogin() {
      this.spinner = "spinner-border spinner-border-sm";

      firebase
        .auth()
        .signInWithEmailAndPassword(this.valorEmail, this.valorPass)
        .then(user => {
          if (user) {
            //Oculta el spinner
            this.spinner = "";
            this.$router.push({ path: "Dashboard" });
            console.log(user);
          }
        })
        .catch(error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode + " - " + errorMessage);
          if (errorCode == "auth/invalid-email") {
            //Si el usuario es incorrecto
            this.mensaje = "El Correo es inválido.";
            this.spinner = "";
          }

          //LISTENER DE CAMBIO DE SESSION
          firebase.auth().onAuthStateChanged(user => {
            //Si es necesario agregar algo aqui
          });

          // Validaciones del form de login.................................
          if (errorCode == "auth/network-request-failed") {
            //Si no hay internet emite este mensaje
            this.mensaje = "No tienes conexion a internet.";
            this.spinner = "";
          }

          if (errorCode == "auth/user-not-found") {
            //Si no hay internet emite este mensaje
            this.mensaje = "El Usuario no está registrado.";
            this.spinner = "";
          }

          if (errorCode == "auth/wrong-password") {
            //Si no hay internet emite este mensaje
            this.mensaje = "La contraseña es incorrecta.";

            this.spinner = "";
          }
        });
    },

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
.form {
  border-radius: 5px;
  box-shadow: 3px 6px 10px 3px;
  width: 400px;
}

.img2 {
  width: 350px;
  height: 350px;
}

.logo {
  width: 30px;
  height: 30px;
}

#loginBtn {
  width: 150px;
}

.divScreenLoad {
  height: 100%;
}

.imgSplash {
  height: 170px;
  width: 170px;
}

.divtodo {
  background-image: linear-gradient(
    to right top,
    #0043a7,
    #005dbb,
    #0075cc,
    #008edb,
    #00a6e7
  );
  height: 100%;
}

</style>
