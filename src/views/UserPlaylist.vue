<template>
  <layout-screen>
    <template #aside>
      <user-info
        :userInfo="userInfo"
        :isPlaying="playing"
        :trackDuration="trackDuration"
        :trackName="currentTrack"
        :progress="totalSeconds"
      />
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
import {
  playlistEndpoints,
  userEndpoints,
  playerEndpoints
} from '@/api/endpoints'
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
      userInfo: undefined,
      currentTrack: '',
      trackDuration: 0,
      playing: true,
      totalSeconds: 0,
      interval: undefined
    }
  },
  watch: {
    async totalSeconds(oldVal) {
      if (oldVal >= this.trackDuration) {
        clearInterval(this.interval)
        setTimeout(async () => {
          const config = {
            headers: {
              Authorization:
                'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
              'Content-Type': 'application/json'
            }
          }
          const currentResponse = await axios.get(
            playerEndpoints.currentlyPlaying,
            config
          )
          const currentData = currentResponse.data
          this.currentTrack = currentData.item.name
          this.trackDuration = currentData.item.duration_ms
          this.totalSeconds = 0
          this.totalSeconds = currentData.progress_ms
          this.playing = false
          this.timer()
        }, 1000)
      }
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
    },
    timer() {
      const addSeconds = () => {
        this.totalSeconds += 110
      }
      this.interval = setInterval(addSeconds, 100)
    },
    async prevTrack() {
      clearInterval(this.interval)
      await fetch(playerEndpoints.skiptoPrevius, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        }
      })
      setTimeout(async () => {
        const currentResponse = await axios.get(
          playerEndpoints.currentlyPlaying,
          {
            headers: {
              Authorization:
                'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
              'Content-Type': 'application/json'
            }
          }
        )
        const currentData = currentResponse.data
        this.currentTrack = currentData.item.name
        this.trackDuration = currentData.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentData.progress_ms
        this.playing = false
        this.timer()
      }, 3000)
    },
    async nextTrack() {
      clearInterval(this.interval)
      const config = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          clear_preloaded: 'true',
          play: 'false'
        })
      }
      await fetch(playerEndpoints.skipToNext, config)
      setTimeout(async () => {
        const currentResponse = await axios.get(
          playerEndpoints.currentlyPlaying,
          config
        )
        const currentData = currentResponse.data
        this.currentTrack = currentData.item.name
        this.trackDuration = currentData.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentData.progress_ms
        this.playing = false
        this.timer()
      }, 3000)
    },
    async pause() {
      const config = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        }
      }
      await fetch(playerEndpoints.pausePlayback, config)
      this.playing = true
      clearInterval(this.interval)
    },
    async play() {
      const config = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'application/json'
        }
      }
      await fetch(playerEndpoints.startResumePlayback, config)
      this.playing = false
      setTimeout(async () => {
        const currentResponse = await axios.get(
          playerEndpoints.currentlyPlaying,
          config
        )
        const currentData = currentResponse.data
        this.currentTrack = currentData.item.name
        this.trackDuration = currentData.item.duration_ms
        this.totalSeconds = currentData.progress_ms
        this.playing = false
        this.timer()
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

    const currentResponse = await axios.get(
      playerEndpoints.currentlyPlaying,
      config
    )
    const currentData = currentResponse.data
    this.currentTrack = currentData.item.name
    this.trackDuration = currentData.item.duration_ms
    this.totalSeconds = currentData.progress_ms
    if (currentData.is_playing == true) {
      this.playing = false
      this.timer()
    }
  },
  provide() {
    return {
      nextTrack: this.nextTrack,
      prevTrack: this.prevTrack,
      pause: this.pause,
      play: this.play
    }
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
