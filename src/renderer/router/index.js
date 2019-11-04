import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/components/Login').default
    },
    {
      path: '/Dashboard',
      name: 'dashboard',
      component: require('@/components/Dashboard').default
    },
    {
      path: '/BaseDashboard',
      name: 'basedashboard',
      component: require('@/components/BaseDashboard').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
