import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
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
      path: '/botCursos',
      name: 'botcursos',
      component: require('@/components/views/botCursos').default
    },
    {
      path: '/Historial',
      name: 'historial',
      component: require('@/components/views/Historial').default
    },
    {
      path: '/cuentaUser',
      name: 'cuentaUser',
      component: require('@/components/views/cuentaUser').default
    },
    {
      path: '/preguntasFrecuentes',
      name: 'preguntasfrecuentes',
      component: require('@/components/views/preguntasFrecuentes').default
    },
    {
      path: '/taskWait',
      name: 'taskWait',
      component: require('@/components/miniComponents/taskWait').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
