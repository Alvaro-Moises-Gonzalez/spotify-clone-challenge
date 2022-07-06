<template>
  <layout-details>
    <template #aside>
      <user-info
        :userInfo="userInfo"
        :isPlaying="playing"
        :trackName="trackName"
        :trackDuration="trackDuration"
        :progress="totalSeconds"
      />
    </template>
    <template #upper>
      <img :src="src" alt="category" />
      <p>Category: {{ title }}</p>
    </template>
    <template #bottom>
      <transition-group appear @beforeEnter="beforeEnter" @enter="enter">
        <p v-if="items">There no are playlists for this category</p>
        <playlist-card
          v-else
          v-for="(playlist, index) in playlists"
          :key="index"
          :playlist="playlist"
        />
        <button class="load-btn" v-if="next" @click="nextLoad">
          More playlist
        </button>
      </transition-group>
    </template>
  </layout-details>
</template>

<script>
import LayoutDetails from '@/Layout/LayoutDetails.vue'
import PlaylistCard from '@/components/PlaylistCard.vue'
import UserInfo from '@/components/UserInfo.vue'
import { categoriesEndpoints, playlistEndpoints } from '@/api/endpoints'
import { userData } from '@/api/callFunctions'
import {
  currentSong,
  nextElement,
  prevElement,
  resume,
  pauseElement
} from '@/api/playercontrols'
import axios from 'axios'
import gsap from 'gsap'
export default {
  components: {
    LayoutDetails,
    PlaylistCard,
    UserInfo
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
    async nextLoad() {
      const response = await axios.get(this.next, this.config)
      const data = response.data
      if (data.playlists.next) {
        this.next = data.playlists.next
      } else {
        this.next = undefined
      }
      this.playlists = [...this.playlists, ...data.playlists.items]
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

    const categoryResponse = await axios.get(
      categoriesEndpoints.getSubcategories(this.categoryId),
      this.config
    )
    const data = categoryResponse.data
    this.src = data.icons[0].url
      ? data.icons[0].url
      : '@/assets/placeholder.jpg'
    this.title = data.name

    const playlistResponse = await axios.get(
      playlistEndpoints.getPlaylistFromCategories(this.categoryId),
      this.config
    )
    const dataPlaylist = playlistResponse.data
    if (dataPlaylist.playlists.items.length) {
      this.playlists = dataPlaylist.playlists.items
    } else {
      this.items = true
    }

    if (dataPlaylist.playlists.next) {
      this.next = dataPlaylist.playlists.next
    } else {
      this.next = undefined
    }
    const currentTrack = await currentSong(this.config)
    this.trackName = currentTrack.item.name
    this.trackDuration = currentTrack.item.duration_ms
    this.totalSeconds = currentTrack.progress_ms
    if (currentTrack.is_playing === true) {
      this.playing = false
      this.timer()
    }
  },
  data() {
    return {
      src: undefined,
      title: '',
      playlists: undefined,
      categoryId: this.$route.params.id,
      next: undefined,
      items: undefined,
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
img {
  width: 150px;
  height: 150px;
  border-radius: 15px;
  margin: 20px;
}
p {
  color: white;
  font-size: 4rem;
  align-self: center;
  justify-self: center;
  margin-left: 20px;
}

.load-btn {
  width: 100px;
  height: 100px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  border: none;
  color: white;
  font-size: 2rem;
  margin: 30px;
}
.load-btn:hover {
  outline: 2px solid aqua;
  color: aqua;
}
</style>
