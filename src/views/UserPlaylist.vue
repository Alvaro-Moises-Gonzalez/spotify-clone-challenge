<template>
  <layout-screen>
    <template #aside>
      <user-info
        :userInfo="userInfo"
        :isPlaying="playing"
        :trackDuration="trackDuration"
        :trackName="trackName"
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
import { userData, playlists } from '@/api/callFunctions'
import {
  resume,
  nextElement,
  prevElement,
  pauseElement,
  currentSong
} from '@/api/playercontrols'
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
      trackName: '',
      trackDuration: 0,
      playing: true,
      totalSeconds: 0,
      interval: undefined,
      config: {
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
          'Content-Type': 'application/json'
        }
      }
    }
  },
  watch: {
    async totalSeconds(oldVal) {
      if (oldVal >= this.trackDuration) {
        clearInterval(this.interval)
        setTimeout(async () => {
          const currentTrack = await currentSong(this.config)
          this.trackName = currentTrack.item.name
          this.trackDuration = currentTrack.item.duration_ms
          this.totalSeconds = 0
          this.totalSeconds = currentTrack.progress_ms
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
      prevElement()
      this.playing = false
      setTimeout(async () => {
        const currentTrack = await currentSong(this.config)
        this.trackName = currentTrack.item.name
        this.trackDuration = currentTrack.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentTrack.progress_ms
        this.timer()
      }, 3000)
    },
    async nextTrack() {
      clearInterval(this.interval)
      nextElement()
      this.playing = false
      setTimeout(async () => {
        const currentTrack = await currentSong(this.config)
        this.trackName = currentTrack.item.name
        this.trackDuration = currentTrack.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentTrack.progress_ms
        this.timer()
      }, 3000)
    },
    async pause() {
      clearInterval(this.interval)
      pauseElement()
      this.playing = true
    },
    async play() {
      resume()
      this.playing = false
      setTimeout(async () => {
        const currentTrack = await currentSong(this.config)
        this.trackName = currentTrack.item.name
        this.trackDuration = currentTrack.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentTrack.progress_ms
        this.playing = false
        this.timer()
      })
    }
  },
  async created() {
    this.userInfo = await userData(this.config)

    const playlistData = await playlists(this.config)
    this.userPlaylists = playlistData.items

    const currentTrack = await currentSong(this.config)
    this.trackName = currentTrack.item.name
    this.trackDuration = currentTrack.item.duration_ms
    this.totalSeconds = currentTrack.progress_ms
    if (currentTrack.is_playing == true) {
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
