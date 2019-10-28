<template>
  <div class="divtodo">
        <!--Barra del menu Minimizar y Cerrar-->
        <div class="bg-dark d-flex justify-content-end divBarraMenu">
            <div id="Minimizar" class="pb-2">
                <p class="divMinimizar text-light font-weight-bold text-center">_</p>
            </div>
            <div id="Cerrar" class="bg-danger">
                <p class="divCerrar text-light text-center">X</p>
            </div>
        </div>

        <div class="container-fluid contenedor align-items-center" id="contenedor">
            <div class="row d-flex justify-content-center align-items-center">
                <!--Mensaje-->
                <div class="">
                    <img class="mr-5 d-flex justify-content-center" src="../assets/localworker.png">
                    <h4 class="text-light mr-5 d-flex justify-content-center">Haz tareas, gana dinero!</h4>
                    <!--Imagen izquierda-->
                    <img class="img2 d-flex justify-content-center" src="../assets/worker.png">
                </div>

                <div class="d-inline">

                    <form class="form pt-3 pl-5 pr-5 mt-3 mb-3 bg-dark">
                        <!--Logo-->
                        <img src="../assets/joblogo.png" class="rounded mx-auto d-block imagenlogo">

                        <div class="form-group">
                            <label class="text-light" for="exampleInputEmail1">Email address</label>
                            <input id="email" type="email" class="form-control"
                                aria-describedby="emailHelp" placeholder="Enter email">
                        </div>
                        <div class="form-group">
                            <label class="text-light" for="exampleInputPassword1">Password</label>
                            <input id="password" type="password" class="form-control"
                                placeholder="Password">
                        </div>

                        <div class="d-flex justify-content-center">
                            <button id="loginBtn" class="btn btn-success" type="button">
                                <img id="imgcheck" aria-hidden="true" src="../assets/check.png">
                                <span id="spinner" class="" role="status" aria-hidden="true"></span>
                                Login
                            </button>
                        </div>
                        <div class="d-flex justify-content-center">
                            <label id="msj" class="text-danger pt-2"></label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'login',
    components: { SystemInformation },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>



</style>