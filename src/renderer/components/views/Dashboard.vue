<template>
  <div>
    <!-- ------------------------------Datos del dashboard--------------------------- -->
    <div class="divCompleto">
      <div class="fondoImg">
        <!--Parte de los datos-->
        <div class="container divRowDatos">
          <div class="row d-flex justify-content-center pl-5">
            <div class="col-sm-4 borde">
              <!--Tareas aprobadas-->
              <div class="divCardDatos bg-light pt-3">
                <div>
                  <img
                    class="imagenlogo d-block mx-auto p-1"
                    src="../../assets/tareasAprobadas.png"
                    alt
                  />
                </div>
                <div>
                  <h1 id="approvedTasks" class="text-center">{{aprobadas}}</h1>
                </div>
                <div>
                  <p class="text-center text-secondary font-weight-bold">Trabajos aprobados</p>
                </div>
              </div>
            </div>
            <div class="col-sm-4 borde">
              <!--Saldo-->
              <div class="divCardDatos bg-light pt-3">
                <div>
                  <img class="imagenlogo d-block mx-auto" src="../../assets/cashLogo.png" alt />
                </div>
                <div>
                  <h1 id="saldo" class="text-center">{{saldo}}</h1>
                </div>
                <div>
                  <p class="text-center text-secondary font-weight-bold">Saldo disponible</p>
                </div>
              </div>
            </div>
            <div class="col-sm-4 borde">
              <!--Tareas en revision-->
              <div class="divCardDatos bg-light pt-3">
                <div class="d-flex justify-content-center ml-5">
                  <div class="divImg">
                    <img class="imagenlogo d-inline" src="../../assets/tareasRevision.png" alt />
                  </div>
                  <!-- refresh icon y spinner -->
                  <div class="divRefresh d-inline">
                    <v-progress-circular
                      v-show="toggleSpinnerRefresh"
                      :size="15"
                      :width="2"
                      color="gray"
                      indeterminate
                    ></v-progress-circular>
                    <v-icon
                      v-show="toggleRefresh"
                      class="refresh"
                      @click="getDatosCuentas(arraySession)"
                    >mdi-refresh</v-icon>
                  </div>
                </div>
                <div>
                  <h1 id="reviewTasks" class="text-center">{{pendientes}}</h1>
                </div>
                <div>
                  <p class="text-center text-secondary font-weight-bold">Trabajos en revisión</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Oculta o muestra el mensaje y loader de las tareas -->
      <div v-show="showLoadingTasks" class="text-center divBuscandoTasks">
        <v-progress-circular color="dark" indeterminate size="40"></v-progress-circular>
        <h4>Buscando trabajos disponibles...</h4>
      </div>

      <!--Parte de las tareas-->
      <v-container class="cont-Tareas" grid-list-xs>
        <v-layout row wrap v-if="vflexSize == '2'">  
          <v-flex xs6 v-for="(tasks, index) of jsonTarea" :key="index">
            <!-- Tarjeta de las tareas de 2 celdas-->
            <cardTasks
              :propJsonTask="tasks"
              :propArraySession="arraySession"
              :propIndex="index"
            ></cardTasks>
          </v-flex>
        </v-layout>

        <v-layout row wrap v-if="vflexSize >= '3'">  
          <v-flex xs4 v-for="(tasks, index) of jsonTarea" :key="index">
            <!-- Tarjeta de las tareas de 3 celdas-->
            <cardTasks
              :propJsonTask="tasks"
              :propArraySession="arraySession"
              :propIndex="index"
            ></cardTasks>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import barraSuperior from "./../barraSuperior/barraSuperior";
import cardTasks from "./../miniComponents/cardTasks";
import { mapState } from "vuex";

let { remote } = require("electron");
const cheerio = require("cheerio");
//const request = require("request");
let request = require("async-request"),
  response;

export default {
  name: "dashboard",
  created() {
    this.firebaseInit();
    console.log("Data de usuarios")
    console.log(this.userAuthData)
  },
  components: { barraSuperior, cardTasks },
  data() {
    return {
      vflexSize: "",
      sinTareas: "no",
      toggleRefresh: false,
      toggleSpinnerRefresh: true,
      parteSinJWT: "",
      showLoadingTasks: true,
      indexRetry: "0",
      jsonTarea: [],
      ReviewTasks: "",
      pendientes: "-",
      approvedTasks: "",
      aprobadas: "-",
      forLengthJWtCuentas: "0",
      db: "",
      saldo: "-",
      saldoTotal: "0",
      aprobadasTotal: "0",
      pendientesTotal: "0",
      mainSeasson: "",
      arraySession: [],
      arraySessionParaTareasCards: [],
      sesion: ""
    };
  },
  computed: {
    ...mapState(["firebaseConfig", "userAuthData"])
  },
  methods: {
    //......................EVENT LISTENERS.......................................
    async firebaseInit() {
      console.log("User data");
      console.log(this.userAuthData);
      this.mainSeasson = remote.getCurrentWindow();
      this.sesion = this.mainSeasson.webContents.session;

      for (let index = 0; index < 1; index++) {

      try {
      if (!firebase.apps.length) {
        // Initialize Firebase
        console.log("Iniciando firebase")
          firebase.initializeApp(this.firebaseConfig);  
      }
      console.log("antes de firestore")
      this.db = firebase.firestore();

      //Listener que se ejecuta cuando el usuario esta iniciado y obtiene las tareas y saldo.
      console.log("antes de onAuthStateChanged")
      firebase.auth().onAuthStateChanged(user => {
        try {
        if (user) {
          //Solicita datos de la coleccion usuarios
            console.log("antes de pedir tokens")
          this.db
            .collection("tokens")
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                //busca el ID del usuario para traer sus JWT
                if (doc.id == user.uid) {
                  this.arraySession = Object.values(doc.data());
                 console.log(this.arraySession.length)
                 this.vflexSize = this.arraySession.length
                  //Transforma el json a Array de las cuentas JWT.
                  console.log("valor de arraySession");
                  console.log(this.arraySession);

                  // Inicia pidiendo tareas luego de obtener el JWT de la base de datos
                  this.getDatosCuentas(this.arraySession);
                  this.getAvailableTasks(this.arraySession);
                }
              });
            }).catch(error =>{
              console.log("Error obteniendo tokens catch promise")
            console.log(error)  
            });
          }
        } catch (error) {
            console.log("Error obteniendo tokens")
            console.log(error)         
        }
      });
      }catch(error){
        index = -1
            setTimeout(()=>{          
              console.log("Error en firebase init")
            }, 3000);
      }
    }

    },

    //..........................FUNCIONES...........................................

    // 1) Funcion que inicia solicitando las tareas disponibles
    async getAvailableTasks(arraySession) {
      //Muestra el mensaje y loader de buscando tareas
      this.showLoadingTasks = true;

      //Recorre el array del token de session de las cuentas
      for (let index in await arraySession) {
        //Headers de la solicitud http
        let headers = {
          authorization: arraySession[index],
          Origin: "https://www.remotasks.com",
          "user-agent":
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
        };
        //Url de la solicitud http
        let urlPedirTarea =
          "https://api-internal.scale.com/internal/v2/tasks/pending_combined?limit=1";
        this.forLengthJWtCuentas = arraySession.length - 1;

        try {
          //................................................................................
          //Envia la solicitud para obtener los datos con libreria request
          let resp = await request(urlPedirTarea, { method: "GET", headers });
          //Muestra por log el array obtenido de la solicitud
          console.log("Solicitud #: " + index);
          console.log(JSON.parse(resp.body)[0]);
          let jsonRespTarea = JSON.parse(resp.body)[0];

          if (jsonRespTarea != null) {
            //Try catch dentro de request para capturar cuando no halla tarea
            try {
              //Comprueba si la tarea es normal o de tipo revisor
              if (jsonRespTarea.assignmentType == "subtask") {

                if (jsonRespTarea.type != "lidarsegmentation") {              
                  //Es una tarea normal, se enviará al data.
                  console.log("Es una tarea clasica");
                  console.log("................................................");
                  this.jsonTarea.push(jsonRespTarea);
                  this.arraySessionParaTareasCards.push(arraySession[index]);           

                //ELSE IF interno que comprueba si hay una lidar en el panel de tasks clasicas
               } else if (jsonRespTarea.type == "lidarsegmentation") {
                  //Si alguna cuenta tiene lidar y se atraviesa en clasic, manejarlo aqui
                  console.log("Hay una lidar segmentacion atravesada en clasic");
                  this.jsonTarea.push(jsonRespTarea);
                  this.arraySessionParaTareasCards.push(arraySession[index]);
                } else {
                  //No hay lidar atravesada
                }
              } else if (jsonRespTarea.assignmentType == "course") {
                //En caso de que salga un curso aqui no manejmos
                console.log("Esto es un curso: " + jsonRespTarea.title);
                this.jsonTarea.push(jsonRespTarea);
                this.arraySessionParaTareasCards.push(arraySession[index]);
                console.log("................................................");
              } else if (jsonRespTarea.assignmentType == "task_attempt") {
                //Si el tipo de tarea es de Revisor, se enviará al data.
                console.log("Tarea de tipo revisor: " + jsonRespTarea);
                console.log("................................................");
                this.jsonTarea.push(jsonRespTarea);
                this.arraySessionParaTareasCards.push(arraySession[index]);
              }
              //Cuando termine el bucle quita el loader y el mensaje
              if (index == this.forLengthJWtCuentas) {
                this.showLoadingTasks = false;
              }
            } catch (error) {
              console.log("Error dentro de request: " + error);
              console.log("No hay tareas en una cuenta");

              this.jsonTarea.push("s");
              this.arraySessionParaTareasCards.push(arraySession[index]);
            }
          } else {
            console.log("No hay tareas en esta cuenta.");
            this.jsonTarea.push("s");
            this.arraySessionParaTareasCards.push(arraySession[index]);
            //Cuando termine el bucle quita el loader y el mensaje
              if (index == this.forLengthJWtCuentas) {
                this.showLoadingTasks = false;
              }
          }
          //................................................................................
        } catch (error) {
          //Si hay un error intenta de nuevo.
          console.log("hubo un error: " + error);
          index = index - 1;
          this.indexRetry = this.indexRetry++;
          console.log("Reintentado tarea por: " + this.indexRetry + " vez");
          //En caso de intentar 3 veces mas fallidas se sale del bucle y emite un mensaje
          if (this.indexRetry == total) {
            index = arraySession.length;
            this.indexRetry = "0";
            console.log("Se intento 3 veces y falló");
          }
        } // FIN DEL CATCH
      }
    },

    //2) Funcion que obtiene el saldo, las tareas aprobadas y pendientes
    async CalculaDatos(response, body, index, cookiejwtParametro, cookiesJWT) {
      try {
        if (response.statusCode == 200) {
          const $ = await cheerio.load(body);
          var part1 = $(".jsx-2539128144")
            .text()
            .split(" ");
          let nameCuenta = part1[2].split("!");
          console.log("Nombre de la cuenta: " + nameCuenta[0]);

          //Busca el saldo de los bonos
          let saldoBono = $(".card__earnings").text();
          console.log("Saldo de bonos: " + saldoBono);
          //...................Validaciones del array..........................

          //validando el saldo de dinero........................
          if (part1[16] == 5) {
            //no se por que razon sale 5 pero resuelve el conflicto y entrega el saldo real
            var part2 = part1[17].split("E");
            var SaldoCuenta = part2[0].split("$");
            console.log("Saldo: " + SaldoCuenta[1] + " $");
          } else {
            //Obtiene el saldo $
            var part2 = part1[16].split("E");
            var SaldoCuenta = part2[0].split("$");
            console.log("Saldo: " + SaldoCuenta[1] + " $");
          }

          //validando el total de tareas aprobadas y pendientes por que el array se mueve.

          if (part1[15] == "every") {
            //Si se mueve en el array obtiene igual las tareas aprobadas y pendientes.
            var part2 = part1[18].split("T");
            var part3 = part2[0].split("s");
            var part4 = part3[1].split("+");

            var saldoPendientes = parseInt(0);
            var saldoAprobadas = parseInt(0);
            if (part4.length == 1) {
              console.log("Tareas pendientes: " + saldoPendientes);
              console.log("Tareas Aprobadas: " + saldoAprobadas);
              console.log("................................................");
            } else if (part4.length == 2) {
              var saldoPendientes = part4[1];
              var saldoAprobadas = part4[0];
              console.log("Tareas pendientes: " + saldoPendientes);
              console.log("Tareas Aprobadas: " + saldoAprobadas);
              console.log("................................................");
            }
          } else {
            //Si no se mueve en el array obtiene las tareas aprobadas y pendientes.
            var part2 = part1[17].split("T");
            var part3 = part2[0].split("s");
            var part4 = part3[1].split("+");

            if (part4.length == 1) {
              var saldoPendientes = parseInt(0);
              var saldoAprobadas = parseInt(0);
              console.log("Tareas pendientes: " + saldoPendientes);
              console.log("Tareas Aprobadas: " + saldoAprobadas);
              console.log("................................................");
            } else if (part4.length == 2) {
              var saldoPendientes = part4[1];
              var saldoAprobadas = part4[0];
              console.log("Tareas pendientes: " + saldoPendientes);
              console.log("Tareas Aprobadas: " + saldoAprobadas);
              console.log("................................................");
            }
          }

          //..............Sumatoria del saldo de todas los datos.............
          let resta = cookiejwtParametro - 1;

          //Suma el saldo del dinero
          this.saldoTotal = parseFloat(this.saldoTotal) + parseFloat(SaldoCuenta[1]);
          if (index == resta) {
            //Coloca el porcentaje % del usuario
            let valorPorcentaje = this.userAuthData.porcentaje;
            let SaldoConPorcentaje = (this.saldoTotal * valorPorcentaje) / 100;
            //Muesta el saldo lo muestra en el sistema
            this.saldo = "$"+parseFloat(SaldoConPorcentaje).toFixed(2);
            console.log(this.saldoTotal);
          }

          //Suma las tareas aprobadas        
            this.aprobadasTotal = this.aprobadasTotal + parseInt(saldoAprobadas);           
            if (index == resta) {
              this.aprobadas = this.aprobadasTotal;
            }
          
          //Suma las tareas pendientes
            this.pendientesTotal = this.pendientesTotal + parseInt(saldoPendientes);
            if (index == resta) {
              this.pendientes = this.pendientesTotal;
              this.toggleSpinnerRefresh = false;
              this.toggleRefresh = true;
            }
        } else {
          console.log(
            "Error: " + error + " Status Code: " + response.statusCode
          );
        }
      } catch (error) {
        //Cae aqui cuando el array viene vacio o undefined
        let respCuentaUsuario = await request(
          "https://api-internal.scale.com/internal/logged_in_user",
          {
            method: "GET",
            headers: {
              authorization: cookiesJWT,
              Origin: "https://www.remotasks.com",
              "user-agent":
                "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
            }
          }
        );

        if (respCuentaUsuario.statusCode == "401") {
          console.log("El usuario perdio el token de session");
          this.jsonTarea.push("s");
        } else if (respCuentaUsuario.statusCode == "200") {
          console.log("No tiene tareas esta cuenta desde el catch");
          this.jsonTarea.push("s");
        }
      }
    },

    //2.1) Funcion que obtiene los datos del usuario, saldo, tareas pendientes y aprobadas
    async getDatosCuentas(cookiejwtParametro) {
      this.saldoTotal = parseInt("0");
      this.aprobadasTotal = parseInt("0");
      this.pendientesTotal = parseInt("0");
      this.toggleRefresh = false;
      this.toggleSpinnerRefresh = true;

      for (let indice in await cookiejwtParametro) {
        //Convierte el JWT fdsb... entrante en jwt=fdsb...
        let cookiesJWT = cookiejwtParametro[indice];
        var part1 = cookiesJWT.split(" ");
        var part2 = part1[0].toString().toLowerCase();
        var authJWT = part2 + "=" + part1[1];
        let count = 0;
        for (let index = 0; index < 1; index++) {
          try {
            //Envia la solicitud para obtener los datos
            console.log("Antes de llamar Request");
           let response = await request("https://www.remotasks.com/dashboard",
              {
                method: "GET",
                headers: {
                  Cookie: authJWT,
                  Origin: "https://www.remotasks.com",
                  "user-agent":
                    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
                }
              })
 
          //LLama la funcion que calcula y procesa los datos
            console.log("Antes de llamar a CalculaDatos");
            this.CalculaDatos(
              response,
              response.body,
              indice,
              cookiejwtParametro.length,
              cookiesJWT
            );
             
            
          } catch (error) {
            console.log("Error en la obtención de datos");
            index = -1;
            console.log(error);
          }
        }
      }
    }, // fin de la function get saldo cuentas

    // 3) Funcion que abre la tarea disponible
    OpenTask() {
      let parteSinJWT = this.arraySession[1].split(" "); // deja la cookie sin el jwt

      this.sesion.cookies.set(
        {
          url: "https://www.remotasks.com/",
          name: "jwt",
          value: parteSinJWT[1]
        },
        error => {
          this.mainSeasson.loadURL("https://www.remotasks.com/tasks");
          this.mainSeasson.webContents.on("did-finish-load", function() {
            this.mainSeasson.webContents.insertCSS(
              "html,body{ background-color: #FF0000 !important;}"
            );
          });
        }
      );
    }
  }
};
</script>

<style scoped>
.divBuscandoTasks {
  padding-top: 80px;
}

.imagenlogo {
  height: 50px;
  width: 50px;
}
.divImg {
  padding-left: 55px;
}
.divCompleto {
  height: 100%;
  width: 100%;
  background-color: #f1efeb;
}
.divRefresh {
  padding-left: 55px;
}

.imgSignOut {
  height: 25px;
  width: 25px;
}

.divCardDatos {
  border-radius: 50px 50px 50px 50px;
  box-shadow: 0px 4px 6px 0px rgb(49, 49, 49);
  height: 180px;
  width: 240px;
  position: absolute;
}
.refresh :hover {
  cursor: pointer;
}
.divRowDatos {
  position: relative;
  z-index: 1;
  height: 190px;
  padding-top: 50px;
}

.fondoImg {
  background-image: url(../../assets/fondoHombreMujerPc.jpg);
  background-size: cover;
  height: 210px;
}

.list-group-item-action {
  cursor: pointer;
}

.cont-Tareas {
  margin-top: 60px;
}
</style>
