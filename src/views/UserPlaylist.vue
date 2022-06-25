<template>
  <layout-screen>
    <template #aside>
      <user-info :userInfo="userInfo" />
    </template>
    <template #upper>
      <p>your collection</p>
    </template>
    <template #bottom>
      <transition-group appear @beforeEnter="beforeEnter" @enter="enter">
        <playlist-card
          v-for="(playlist, index) in userPlaylists"
          :key="index"
          :data-index="index"
          :playlist="playlist"
        />
      </transition-group>
    </template>
  </layout-screen>
</template>

<script>
import LayoutScreen from '@/Layout/LayoutScreen.vue'
import PlaylistCard from '@/components/PlaylistCard.vue'
import UserInfo from '@/components/UserInfo.vue'
import axios from 'axios'
import { playlistEndpoints, userEndpoints } from '@/api/endpoints'
import { config } from '@/api/config'
import gsap from 'gsap'
export default {
  components: {
    LayoutScreen,
    PlaylistCard,
    UserInfo
  },
  data() {
    return {
      userPlaylists: [],
      userInfo: undefined
    }
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0
      el.style.transform = 'translateY(100px)'
    },
    enter(el, done) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        onComplete: done,
        delay: el.dataset.index * 0.2
      })
    }
  },
  async created() {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-type': 'application/json'
        }
    }
    const userInfoResponse = await axios.get(userEndpoints.currentUser, config)
    this.userInfo = userInfoResponse.data
    const playlistResponse = await axios.get(
      playlistEndpoints.userPlaylists,
      config
    )
    const playlistData = playlistResponse.data
    this.userPlaylists = playlistData.items
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
p {
  color: white;
  font-size: 4rem;
  text-transform: capitalize;
  text-align: center;
  font-family: 'Great Vibes', sans-serif;
  letter-spacing: 0.5rem;
}
</style>
