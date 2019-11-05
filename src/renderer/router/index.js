import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'splashscreen',
      component: require('@/components/splashScreen').default
    },
    {
      path: '/Login',
      name: 'login',
      component: require('@/components/Login').default
    },
    {
      path: '/Dashboard',
      name: 'dashboard',
      component: require('@/components/Dashboard').default
    },
    {
      path: '/videoCursos',
      name: 'videocursos',
      component: require('@/components/videoCursos').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
