import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Register from '@/components/Register'
import Login from '@/components/Login'
import NavMenu from '@/components/NavMenu'
import Receiving from '@/components/Receiving'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/navMenu',
      name: 'navMenu',
      component: NavMenu
    },
    {
      path: '/navMenu/receiving',
      name: 'receiving',
      compoent: Receiving
    }
  ]
})
