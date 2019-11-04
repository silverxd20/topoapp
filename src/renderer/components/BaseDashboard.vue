<template>
  <div>
    <v-app>
      <barraSuperior></barraSuperior>
      <!--navigation-drawer-->
        <v-navigation-drawer expand-on-hover permanent dark>
          <template v-slot:prepend>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
                </v-list-item-avatar>
              </v-list-item>
  
              <v-list-item link two-line>
                <v-list-item-content>
                  <v-list-item-title class="title">Leonardo Galindo</v-list-item-title>
                  <v-list-item-subtitle>Leo@gmail.com</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon>mdi-menu-down</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </template>

          <v-divider></v-divider>

          <v-list nav dense>
            <!-- Link de Dashboard-->
            <router-link to="/Dashboard">
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-folder</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item>
            </router-link>
            <!-- Link de Entrenamiento-->
            <router-link to="/Login">
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Entrenamiento</v-list-item-title>
              </v-list-item>
            </router-link>
          </v-list>
        </v-navigation-drawer>

      <!-- contenido de la aplicacion, las vistas aqui-->
      <v-content>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>

    </v-app>
  </div>
</template>

<script>
import menuLateral from "./miniComponents/menuLateral";
import barraSuperior from "./barraSuperior/barraSuperior";
import Dashboard from "./Dashboard";

export default {
  components: {
    menuLateral,
    barraSuperior,
    Dashboard
  }
};
</script>

<style scoped>
</style>