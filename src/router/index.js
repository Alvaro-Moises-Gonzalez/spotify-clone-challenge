import { createRouter, createWebHistory } from 'vue-router'
import LandingScreen from '../views/LandingScreen.vue'
import CallbackScreen from '../views/CallbackScreen.vue'
import HomeScreen from '../views/HomeScreen.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingScreen
  },
  {
    path: '/callback',
    name: 'callback',
    component: CallbackScreen
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeScreen
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
