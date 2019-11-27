<template>
  <div class="divtodo">
    <div class="container contenedor align-items-center" id="contenedor">
      <div class="row d-flex justify-content-center align-items-center">
        <!--Mensaje-->
        <div class="mr-5">
          <h1 class="topo d-flex justify-content-center">𝐓𝐨𝐩𝐨𝐬𝐚𝐭 𝐯𝐞𝐜𝐭𝐨𝐫</h1>
          <h4 class="text-light mr-5 d-flex justify-content-center">Haz tareas, gana dinero!</h4>
          <!--Imagen izquierda-->
          <img class="img2 d-flex justify-content-center fluid" src="../../assets/worker.png" />
        </div>

        <div class="d-inline">
          <form class="form pt-3 pl-5 pr-5 mt-3 mb-3 bg-dark">
            <!--Logo-->
            <img src="../../assets/joblogo.png" class="rounded mx-auto d-block fluid" />
            <div class="form-group">
              <label class="text-light" for="exampleInputEmail1">Email address</label>
              <input
                v-model="valorEmail"
                type="email"
                class="form-control"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
            </div>
            <div class="form-group">
              <label class="text-light" for="exampleInputPassword1">Password</label>
              <input
                v-model="valorPass"
                @keyup.enter="btnLogin()"
                type="password"
                class="form-control"
                placeholder="Password"
              />
            </div>

            <div class="d-flex justify-content-center">
              <button @click="btnLogin()" id="loginBtn" class="btn btn-success" type="button">
                <span :class="spinner" role="status" aria-hidden="true"></span>
                Login
              </button>
            </div>
            <div >
              <label class="text-danger pt-2 d-flex justify-content-center">{{ mensaje }}</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
const { remote } = require("electron");

export default {
  name: "Login",
  created() {
    this.firebaseInit();
  },
  data() {
    return {
      spinner: "",
      mensaje: "",
      valorEmail: "",
      valorPass: "",
      winPrincial: remote.getCurrentWindow()
    };
  },
  computed: {
    ...mapState(["firebaseConfig"])
  },
  methods: {
    // muestra el panel lateral desde el store vuex
    ...mapMutations(["muestraDrawer"]),
    //Traer las funciones de actions en el store
    ...mapActions(["getUserAuthData"]),

    //Inicia el app de firebase
    firebaseInit() {
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
    },

    // LOGIN
    async btnLogin() {
      this.spinner = "spinner-border spinner-border-sm";
      try {
      let fireResp = await firebase
        .auth()
        .signInWithEmailAndPassword(this.valorEmail, this.valorPass);
      
        for (let index = 0; index < 1; index++) {
          console.log(fireResp.user);
          try {
            if (fireResp.user) {
              //Oculta el spinner
              console.log("dentro de try catch antes de getUserAuthData")
              let userData = await this.getUserAuthData(fireResp.user);
              console.log("Luego del getUserAuthData")
              this.muestraDrawer();
              this.$router.push({ path: "Dashboard" });
              this.spinner = "";
              console.log("Luego del push dashboard");
            }
          } catch (error) {            
            index = -1
            setTimeout(()=>{          
              console.log("Conexión de internet lenta, Reintentando...")
              this.mensaje = "Conexión de internet lenta, Reconectando...";
            }, 3000);
          }
        }
      } catch (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.log(errorCode + " - " + errorMessage);
        if (errorCode == "auth/invalid-email") {
          //Si el usuario es incorrecto
          this.mensaje = "El Correo es inválido.";
          this.spinner = "";
        }

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
      }
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
.topo {
  font-size: 60px;
  color: rgb(66, 66, 66);
}
</style>
