<template>
  <div>
    <!--Barra Superior Minimizar y Cerrar-->
    <barraSuperior></barraSuperior>
    <!--Menú lateral-->
    <menuLateral></menuLateral>
  
  </div>
</template>

<script>
import barraSuperior from "./barraSuperior/barraSuperior";
import menuLateral from './miniComponents/menuLateral';
let { remote } = require("electron");
const cheerio = require("cheerio");
const request = require("request");

export default {
  name: "dashboard",
  created() {
    this.firebaseInit();
  },
  components: { barraSuperior,menuLateral },
  data() {
    return {
      ReviewTasks: "-",
      approvedTasks: "-",
      saldo: "-",
      loader: "spinner-border spinner-border-sm",
      db: "",
      idnum: "0",
      headersGetTasks: null,
      node: "",
      saldoTotal: "",
      aprobadasTotal: "",
      pendientesTotal: "",
      mainSeasson: "",
      arraySession: [],
      sesion: "",
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
    firebaseInit() {
      this.mainSeasson = remote.getCurrentWindow();
      this.sesion = this.mainSeasson.webContents.session;
      if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
      }
      this.db = firebase.firestore();

      //Listener que se ejecuta cuando el usuario esta iniciado y obtiene las tareas y saldo.
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          //Solicita datos de la coleccion usuarios
          this.db
            .collection("tokens")
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                //busca el ID del usuario para traer sus JWT
                if (doc.id == user.uid) {
                 
                  this.arraySession = Object.values(doc.data())
                  //Transforma el json a Array de las cuentas JWT.
                  console.log("valor de arraySession")
                  console.log(this.arraySession)

                  // Inicia pidiendo tareas luego de obtener el JWT de la base de datos
                  this.getAvailableTasks(this.arraySession);
                  this.getDatosCuentas(this.arraySession);
                }
              });
            });
        }
      });
    },

    btnSignOut() {
      firebase
        .auth()
        .signOut()
        .then(user => {
          //Envia al usuario al login
          this.$router.push({ path: "Login" });
        });
    },
    //......................EVENT LISTENERS.......................................

    //Evento que permite hacer click en la lista y obtener su numero de ID
    listaHtml(e) {
      var visitorId;
      if (e.target && e.target.nodeName == "LI") {
        visitorId = e.target.id;

        //Abre la tarea
        OpenTask(visitorId);
      }
    },

    // Evento Listener del boton actualizar
    btnActualizar(e) {
      //createBrowserWindow();
      listaHtml.innerHTML = "";
      idnum = 0;
      node.id = idnum;
      btnActualizar.disabled = true;
      btnActualizar.innerHTML = "Cargando tareas...";
      this.getAvailableTasks(arraySession);
    },
    //..........................FUNCIONES...........................................

    // 1) Funcion que inicia solicitando las tareas disponibles
    async getAvailableTasks(arraySession) {
      //Activa el loader
      this.loader = "spinner-border spinner-border-sm";
  
      //Recorre el array del token de session de las cuentas
      for (let index = 0; index < arraySession.length; index++) {

        console.log("Array seassion")
      console.log(arraySession[index])
       let headersGetTasks = {
          method: "GET",
          mode: 'no-cors',
          headers: { 
            authorization: arraySession[index],
            origin:"https://www.remotasks.com" }
        };

        var total = arraySession.length - 1;

        try {
          //Fetch que pregunta por las tareas disponibles
          let resp = await fetch("https://api-internal.scale.com/internal/v2/tasks/pending_combined?limit=1", headersGetTasks);
          let json = await resp.json();
          console.log("Respuesta de la solicitud");
          console.log(json);
          //Comprueba si la tarea es normal o de tipo revisor
          if (json[0].assignmentType === "subtask") {
            //Comprueba si no se atraviesa un lidar en el panel de tasks clasicas
            if (json[0].type === "lidarsegmentation") {
              this.addToList(
                json[0].type + " atravesada en classic: " + json[0].project.name
              );
              //Detiene el loader
              this.stopLoader(index, total);
            } else {
              this.addToList(json[0].type);
              //Detiene el loader
              this.stopLoader(index, total);
            }
          }else if(json[0].assignmentType == "course"){

            //En caso de que salga un curso aqui no manejmos
            console.log("Esto es un curso: "+json[0].tittle)
          } else {
            //Si el tipo de tarea es de Revisor
            this.addToList(
              "Revisor: " +
                json[0].taskType +
                " - " +
                json[0].subtask.project.name
            );

            //Detiene el loader
            this.stopLoader(index, total);
          }
        } catch (error) {
          
          console.log("hubo un error: " + error);
        }
      }
    },

    //2) Funcion que obtiene los datos del usuario, saldo, tareas pendientes y aprobadas
    getDatosCuentas(cookiejwtParametro) {
      this.saldoTotal = parseFloat("0");
      this.aprobadasTotal = parseInt("0");
      this.pendientesTotal = parseInt("0");

      for (let index = 0; index < cookiejwtParametro.length; index++) {
        //Convierte el JWT fdsb... entrante en jwt=fdsb...
        let cookies = cookiejwtParametro[index];
        var part1 = cookies.split(" ");
        var part2 = part1[0].toString().toLowerCase();
        var authJWT = part2 + "=" + part1[1];
        let cookieRequest = request.cookie(authJWT);

        //Envia la solicitud para obtener los datos
        request(
          {
            url: "https://www.remotasks.com/dashboard",
            headers: { Cookie: cookieRequest }
          },
          function(error, response, body) {
            if (!error && response.statusCode == 200) {
              const $ = cheerio.load(body);
              var part1 = $(".jsx-2539128144")
                .text()
                .split(" ");

              //...................Validaciones del array..........................

              //validando el saldo de dinero........................
              if (part1[16] == 5) {
                //no se por que razon sale 5 pero resuelve el conflicto y entrega el saldo real
                var part2 = part1[17].split("E");
                console.log(part2);
                var SaldoCuenta = part2[0].split("$");
                console.log(SaldoCuenta);
              } else {
                //Obtiene el saldo $
                console.log(part1[16]);
                var part2 = part1[16].split("E");
                console.log(part2);
                var SaldoCuenta = part2[0].split("$");
                console.log(SaldoCuenta);
              }

              //validando el total de tareas aprobadas y pendientes por que el array se mueve.

              if (part1[15] == "every") {
                //Si se mueve en el array obtiene igual las tareas aprobadas y pendientes.
                var part2 = part1[18].split("T");
                var part3 = part2[0].split("s");
                var part4 = part3[1].split("+");

                if (part4[1] == null) {
                  var saldoPendientes = parseInt(0);
                  var saldoAprobadas = parseInt(0);
                } else {
                  var saldoPendientes = part4[1];
                  var saldoAprobadas = part4[0];
                }
              } else {
                //Si no se mueve en el array obtiene las tareas aprobadas y pendientes.
                var part2 = part1[17].split("T");
                var part3 = part2[0].split("s");
                var part4 = part3[1].split("+");

                if (part4[1] == null) {
                  var saldoPendientes = parseInt(0);
                  var saldoAprobadas = parseInt(0);
                } else {
                  var saldoPendientes = part4[1];
                  var saldoAprobadas = part4[0];
                }
              }

              //..............Sumatoria del saldo de todas los datos.............

              //Suma el saldo del dinero
              if (this.saldoTotal == 0) {
                this.saldoTotal = parseFloat(SaldoCuenta[1]);
                console.log(this.saldoTotal);
              } else {
                this.saldoTotal = this.saldoTotal + parseFloat(SaldoCuenta[1]);
                console.log(this.saldoTotal);

                //Muesta el saldo lo muestra en el sistema
                this.saldo = "$" + this.saldoTotal;
                console.log(this.saldo);
              }

              //Suma las tareas aprobadas
              if (this.aprobadasTotal == 0) {
                this.aprobadasTotal = parseInt(saldoAprobadas);
                this.approvedTasks = "" + this.aprobadasTotal;
                console.log(this.approvedTasks);
              } else {
                this.aprobadasTotal =
                  this.aprobadasTotal + parseInt(saldoAprobadas);
                this.approvedTasks = "" + this.aprobadasTotal;
                console.log(this.approvedTasks);
              }

              //Suma las tareas pendientes
              if (this.pendientesTotal == 0) {
                this.pendientesTotal = parseInt(saldoPendientes);
              } else {
                this.pendientesTotal =
                  this.pendientesTotal + parseInt(saldoPendientes);
                this.ReviewTasks = "" + this.pendientesTotal;
                console.log(this.ReviewTasks);
              }
            }
          }
        );
      }
    }, // fin de la function get saldo cuentas

    // 3) Funcion que agrega un elemento a la lista de tareas
    addToList(params) {
      node = document.createElement("LI");
      node.id = idnum++;
      node.className = "list-group-item list-group-item-action";
      var textnode = document.createTextNode(idnum + ". " + params);
      node.appendChild(textnode);
      listaHtml.appendChild(node);
    },

    // 4) Funcion que abre la tarea disponible
    OpenTask(valueCookieParametro) {
      let parteSinJWT = arraySession[valueCookieParametro].split(" "); // deja la cookie sin el jwt

      this.sesion.cookies.set(
        {
          url: "https://www.remotasks.com/",
          name: "jwt",
          value: parteSinJWT[1]
        },
        error => {
          mainSeasson.loadURL("https://www.remotasks.com/tasks");
        }
      );
    },

    // 5) Funcion que detiene el loader
    stopLoader(index, total) {
      if (index == total) {
        //detiene el loader
        loader.className = "";
        btnActualizar.innerHTML = "Actualizar";
        btnActualizar.disabled = false;
      }
    }
  }
};
</script>

<style scoped>
.imagenlogo {
  height: 50px;
  width: 50px;
}
.divCompleto {
  height: 100%;
  width: 100%;
}

.imgSignOut {
  height: 25px;
  width: 25px;
}

.divCardDatos {
  border-radius: 12px 12px 12px 12px;
  box-shadow: 0px 4px 6px 0px rgb(49, 49, 49);
  height: 180px;
  width: 250px;
  position: absolute;
}

.divRowDatos {
  position: relative;
  z-index: 1;
  height: 220px;
}

.fondoImg {
  background-image: url(../assets/fondoHombreMujerPc.jpg);
  background-size: cover;
}

::-webkit-scrollbar {
  background-color: #616161;
  width: 0.8em;
}

::-webkit-scrollbar-thumb:window-inactive,
::-webkit-scrollbar-thumb {
  background: rgb(48, 48, 48);
}
.list-group-item-action {
  cursor: pointer;
}
</style>
