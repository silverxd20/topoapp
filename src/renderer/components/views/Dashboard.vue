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
        <v-layout row wrap v-if="vflexSize == '1'">
          <v-flex xs12 v-for="(tasks, index) of jsonTarea" :key="index">
            <!-- Tarjeta de las tareas de 1 celda-->
            <cardTasks :propJsonTask="tasks" :propArraySession="arraySession" :propIndex="index"></cardTasks>
          </v-flex>
        </v-layout>

        <v-layout row wrap v-if="vflexSize == '2'">
          <v-flex xs6 v-for="(tasks, index) of jsonTarea" :key="index">
            <!-- Tarjeta de las tareas de 2 celdas-->
            <cardTasks :propJsonTask="tasks" :propArraySession="arraySession" :propIndex="index"></cardTasks>
          </v-flex>
        </v-layout>

        <v-layout row wrap v-if="vflexSize >= '3'">
          <v-flex xs4 v-for="(tasks, index) of jsonTarea" :key="index">
            <!-- Tarjeta de las tareas de 3 celdas-->
            <cardTasks :propJsonTask="tasks" :propArraySession="arraySession" :propIndex="index"></cardTasks>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import barraSuperior from "./../barraSuperior/barraSuperior";
import cardTasks from "./../miniComponents/cardTasks";
import { mapState, mapMutations, mapActions } from "vuex";

let { remote } = require("electron");
const cheerio = require("cheerio");
//const request = require("request");
let request = require("async-request");

export default {
  name: "dashboard",
  created() {
    this.firebaseInit();
    this.traerCategoriasDesdeBd();
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
      indicefinish: 0,
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

    ...mapMutations(["listaDeJwtFromListUser"]),
    ...mapActions(["traerCategoriasDesdeBd"]),
    //......................EVENT LISTENERS.......................................
    async firebaseInit() {
      this.mainSeasson = remote.getCurrentWindow();
      this.sesion = this.mainSeasson.webContents.session;

      for (let index = 0; index < 1; index++) {
        try {
          if (!firebase.apps.length) {
            // Initialize Firebase
            firebase.initializeApp(this.firebaseConfig);
          }
          this.db = firebase.firestore();

          //Listener que se ejecuta cuando el usuario esta iniciado y obtiene las tareas y saldo.
          firebase.auth().onAuthStateChanged(user => {
            try {
              if (user) {
                //Solicita datos de la coleccion usuarios
                this.db
                  .collection("tokens")
                  .get()
                  .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                      //busca el ID del usuario para traer sus JWT
                      if (doc.id == user.uid) {
                        this.arraySession = Object.values(doc.data());
                        this.vflexSize = this.arraySession.length;
                        //Transforma el json a Array de las cuentas JWT.
                        console.log("valor de arraySession");
                        console.log(this.arraySession);
                        this.listaDeJwtFromListUser(this.arraySession)

                        // Inicia pidiendo tareas luego de obtener el JWT de la base de datos
                        this.getDatosCuentas(this.arraySession);
                        this.getAvailableTasks(this.arraySession);
                      }
                    });
                  })
                  .catch(error => {
                    console.log("Error obteniendo tokens catch promise");
                    console.log(error);
                  });
              }
            } catch (error) {
              console.log("Error obteniendo tokens");
              console.log(error);
            }
          });
        } catch (error) {
          index = -1;
          setTimeout(() => {
            console.log("Error en firebase init");
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
                  this.jsonTarea.push(jsonRespTarea);
                  this.arraySessionParaTareasCards.push(arraySession[index]);

                  //ELSE IF interno que comprueba si hay una lidar en el panel de tasks clasicas
                } else if (jsonRespTarea.type == "lidarsegmentation") {
                  //Si alguna cuenta tiene lidar y se atraviesa en clasic, manejarlo aqui
                  console.log(
                    "Hay una lidar segmentacion atravesada en clasic"
                  );
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
              } else if (jsonRespTarea.assignmentType == "task_attempt") {
                //Si el tipo de tarea es de Revisor, se enviará al data.
                console.log("Tarea de tipo revisor");
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
              if(this.userAuthData.premium == true){
                this.jsonTarea.push("s");
              }else{
                this.jsonTarea.push("n");
              }
              this.arraySessionParaTareasCards.push(arraySession[index]);
            }
          } else {
            console.log("No hay tareas en esta cuenta.");
            if(this.userAuthData.premium == true){
                this.jsonTarea.push("s");
              }else{
                this.jsonTarea.push("n");
              }
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

    //2) Funcion que obtiene los datos del usuario, saldo, tareas pendientes y aprobadas
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
            //Envia la solicitud para obtener los datos
            let respuesta = request(
              "https://www.remotasks.com/dashboard",
              {
                method: "GET",
                headers: {
                  Cookie: authJWT,
                  Origin: "https://www.remotasks.com",
                  "user-agent":
                    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
                }
              }
            ).then(datos =>{

            //LLama la funcion que calcula y procesa los datos
            this.CalculaDatos(
              datos,
              datos.body,
              indice,
              cookiejwtParametro.length,
              cookiesJWT
            );
            }).catch(error =>{
              console.log("Error en la obtención de datos");
            index = -1;
            console.log(error);
            })
        }
      }
    }, // fin de la function get saldo cuentas

    //2.1) Funcion que calcula el saldo, las tareas aprobadas y pendientes
    async CalculaDatos(response, body, index, cookiejwtParametro, cookiesJWT) {
      try {
        const $ = await cheerio.load(body);
        //obtiene el array de dnd vienen los datos de tareas normales y saldo
        var part1 = $(".jsx-877672546").text().split(" ");
          //obtiene el array de dnd vienen los datos de tareas de revisor
        var part2review = $(".item__content").text();

        /*Pregunta si part1 viene null pq cuando hay una tarea nueva
        que no tiene ni 1 solo curso no se muestran los datos de tareas
        ni saldo, cuando eso ocurre entonces se va al Else */
        if (part1[1] != null) {
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
            if(SaldoCuenta[1] == null || SaldoCuenta == undefined){
              SaldoCuenta[1] = 0
            }else{
              console.log("Saldo: " + SaldoCuenta[1] + " $");
            }
          } else {
            //Obtiene el saldo $
            var part2 = part1[16].split("E");
            var SaldoCuenta = part2[0].split("$");
            if(SaldoCuenta[1] == null || SaldoCuenta == undefined){
              SaldoCuenta[1] = 0
            }else{
              console.log("Saldo: " + SaldoCuenta[1] + " $");
            }
          }

          //validando el total de tareas aprobadas y pendientes por que el array se mueve.

          if (part1[15] == "every") {
            //Si se mueve en el array obtiene igual las tareas aprobadas y pendientes.

            //Obtiene valor de tareas Normales
            var part2 = part1[18].split("T");
            var part3 = part2[0].split("s");
            var part4 = part3[1].split("+");

            //Obtiene valor de tareas de revisor
            var parte2 = part1[19].split("T");
            var parte3 = parte2[0].split("s");
            var parte4 = parte3[1].split("+");

            //Pone el valor de las tareas en 0
            var saldoPendientes = parseInt(0);
            var saldoAprobadas = parseInt(0);
            var saldoPendientesRevisor = parseInt(0);
            var saldoAprobadasRevisor = parseInt(0);

            //Normal
            if (part4.length == 2) {
              var saldoPendientes = part4[1];
              var saldoAprobadas = part4[0];
              console.log(saldoPendientesRevisor);
              console.log("Tareas pendientes: " + saldoPendientes);
              console.log("Tareas Aprobadas: " + saldoAprobadas);
              console.log("................................................");
            }

            //Revisor
            if (parte4.length == 2) {
              var saldoPendientesRevisor = parte4[1];
              var saldoAprobadasRevisor = parte4[0];
              console.log(saldoPendientesRevisor);
              console.log(
                "Tareas pendientes Revisor: " + saldoPendientesRevisor
              );
              console.log("Tareas Aprobadas Revisor: " + saldoAprobadasRevisor);
              console.log("................................................");
            }
          } else {
            //Si no se mueve en el array obtiene las tareas aprobadas y pendientes.

            //Obtiene valor de tareas Normales
            var part2 = part1[17].split("T");
            var part3 = part2[0].split("s");
            var part4 = part3[1].split("+");

            //Obtiene valor de tareas de revisor
            var parte2 = part1[18].split("T");
            var parte3 = parte2[0].split("s");
            var parte4 = parte3[1].split("+");

            //Pone el valor de las tareas en 0
            var saldoPendientes = parseInt(0);
            var saldoAprobadas = parseInt(0);
            var saldoPendientesRevisor = parseInt(0);
            var saldoAprobadasRevisor = parseInt(0);

            //Normal
            if (part4.length == 2) {
              var saldoPendientes = part4[1];
              var saldoAprobadas = part4[0];
              console.log(saldoPendientesRevisor);
              console.log("Tareas pendientes: " + saldoPendientes);
              console.log("Tareas Aprobadas: " + saldoAprobadas);
              console.log("................................................");
            }

            //Revisor
            if (parte4.length == 2) {
              var saldoPendientesRevisor = parte4[1];
              var saldoAprobadasRevisor = parte4[0];
              console.log(saldoPendientesRevisor);
              console.log(
                "Tareas pendientes Revisor: " + saldoPendientesRevisor
              );
              console.log("Tareas Aprobadas Revisor: " + saldoAprobadasRevisor);
              console.log("................................................");
            }
          }

          //..............Sumatoria del saldo de todas los datos.............
          let resta = cookiejwtParametro;
          this.indicefinish = this.indicefinish +1

          //Suma el saldo del dinero
          this.saldoTotal =
            parseFloat(this.saldoTotal) + parseFloat(SaldoCuenta[1]);
          if (this.indicefinish == resta) {
            //Coloca el porcentaje % del usuario
            let valorPorcentaje = this.userAuthData.porcentaje;
            let SaldoConPorcentaje = (this.saldoTotal * valorPorcentaje) / 100;
            //Muesta el saldo lo muestra en el sistema
            this.saldo = "$" + parseFloat(SaldoConPorcentaje).toFixed(2);
            console.log(this.saldoTotal);
          }
          //Suma las tareas aprobadas
          this.aprobadasTotal =
            this.aprobadasTotal +
            parseInt(saldoAprobadas) +
            parseInt(saldoAprobadasRevisor);
          if (this.indicefinish == resta) {
            this.aprobadas = this.aprobadasTotal;
          }

          //Suma las tareas pendientes
          this.pendientesTotal =
            this.pendientesTotal +
            parseInt(saldoPendientes) +
            parseInt(saldoPendientesRevisor);
          if (this.indicefinish == resta) {
            this.pendientes = this.pendientesTotal;
            this.toggleSpinnerRefresh = false;
            this.toggleRefresh = true;
          }
        
        } else {
          
          //Entra aqui cuando hay una cuenta totalmente nueva
           let resta = cookiejwtParametro;
           this.indicefinish = this.indicefinish +1

          //Suma el saldo del dinero
          this.saldoTotal = parseFloat(this.saldoTotal) + parseFloat(0);
          if (this.indicefinish == resta) {
            //Coloca el porcentaje % del usuario
            let valorPorcentaje = this.userAuthData.porcentaje;
            let SaldoConPorcentaje = (this.saldoTotal * valorPorcentaje) / 100;
            //Muesta el saldo lo muestra en el sistema
            this.saldo = "$" + parseFloat(SaldoConPorcentaje).toFixed(2);
            console.log(this.saldoTotal);
          }

          //Suma las tareas aprobadas
          this.aprobadasTotal = this.aprobadasTotal + parseInt(0)
          if (this.indicefinish == resta) {
            this.aprobadas = this.aprobadasTotal;
          }

          //Suma las tareas pendientes
          this.pendientesTotal = this.pendientesTotal + parseInt(0) 
          if (this.indicefinish == resta) {
            this.pendientes = this.pendientesTotal;
            this.toggleSpinnerRefresh = false;
            this.toggleRefresh = true;
          }
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
        console.log(respCuentaUsuario);
        if (respCuentaUsuario.statusCode == "401") {
          console.log("El usuario perdio el token de session");
        }
      }
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
