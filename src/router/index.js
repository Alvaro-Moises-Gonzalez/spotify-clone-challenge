import { createRouter, createWebHistory } from 'vue-router'
import LandingScreen from '../views/LandingScreen.vue'
import CallbackScreen from '../views/CallbackScreen.vue'
import HomeScreen from '../views/HomeScreen.vue'
import SearchScreen from '@/views/SearchScreen.vue'
import UserPlaylist from '@/views/UserPlaylist.vue'
import CategoryDetails from '@/views/CategoryDetails.vue'
import PlaylistScreen from '@/views/PlaylistScreen.vue'
import ArtistDetails from '@/views/ArtistDetails'

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
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchScreen
  },
  {
    path: '/playlist',
    name: 'playlist',
    component: UserPlaylist
  },
  {
    path: '/category-details/:id',
    name: 'category details',
    component: CategoryDetails
  },
  {
    path: '/playlist-details/:id',
    name: 'playlist details',
    component: PlaylistScreen
  },
  {
    path: '/artist-details/:id',
    name: 'artist details',
    component: ArtistDetails
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
