import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/splashscreen',
      name: 'splashscreen',
      component: require('@/components/views/splashScreen').default
    },
    {
      path: '/Login',
      name: 'login',
      component: require('@/components/views/Login').default
    },
    {
      path: '/Dashboard',
      name: 'dashboard',
      component: require('@/components/views/Dashboard').default
    },
    {
      path: '/videoCursos',
      name: 'videocursos',
      component: require('@/components/views/videoCursos').default
    },
    {
      path: '/preguntasFrecuentes',
      name: 'preguntasfrecuentes',
      component: require('@/components/views/preguntasFrecuentes').default
    },
    {
      path: '/',
      name: 'test',
      component: require('@/components/test').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
