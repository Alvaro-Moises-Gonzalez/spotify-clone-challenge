<template>
<layout-screen>
  <template #upper>
    <p>your collection</p>
  </template>
  <template #bottom>
    <transition-group
      appear
      @beforeEnter=beforeEnter
      @enter=enter >
      <playlist-card  v-for="playlist, index in userPlaylists" :key="index" :data-index="index" :playlist="playlist"/>
    </transition-group>
  </template>
</layout-screen>
</template>

<script>
import LayoutScreen from '@/Layout/LayoutScreen.vue'
import PlaylistCard from '@/components/PlaylistCard.vue'
import axios from 'axios'
import { playlistEndpoints } from '@/api/endpoints'
import gsap from 'gsap'
export default {
  components: {
    LayoutScreen,
    PlaylistCard
  },
  data () {
    return {
      userPlaylists: []
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.opacity = 0
      el.style.transform = 'translateY(100px)'
    },
    enter (el, done) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        onComplete: done,
        delay: el.dataset.index * 0.2
      })
    }
  },
  created () {
    (async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'application/json'
        }
      }
      const response = await axios.get(`${playlistEndpoints.userPlaylists}`, config)
      const data = response.data
      this.userPlaylists = data.items
    })()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
p{
  color: white;
  font-size: 4rem;
  text-transform: capitalize;
  text-align: center;
  font-family: 'Great Vibes', sans-serif;
  letter-spacing: 0.5rem;
}
</style>
