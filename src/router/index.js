import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import SignUpView from '../views/SignUpPage.vue'
import HomeView from '../views/HomePage.vue'
import AccountActivationView from '../views/AccountActivationPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUpView
    },
    {
      path: '/activate/:token',
      name: 'Activation',
      component: AccountActivationView,
      props: true
    }
  ]
})

export default router
