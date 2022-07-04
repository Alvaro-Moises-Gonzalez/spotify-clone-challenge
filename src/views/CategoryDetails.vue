<template>
  <layout-details>
    <template #aside>
      <user-info :userInfo="userInfo" :isPlaying="playing" :trackName="currentTrack" :trackDuration="trackDuration" :progress="totalSeconds" />
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
import {
  categoriesEndpoints,
  playlistEndpoints,
  userEndpoints,
  playerEndpoints
} from '@/api/endpoints'
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
    nextLoad() {
      ;(async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-Type': 'application/json'
          }
        }
        const response = await axios.get(this.next, config)
        const data = response.data
        if (data.playlists.next) {
          this.next = data.playlists.next
        } else {
          this.next = undefined
        }
        this.playlists = [...this.playlists, ...data.playlists.items]
      })()
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
    const categoryResponse = await axios.get(
      categoriesEndpoints.getSubcategories(this.categoryId),
      config
    )
    const data = categoryResponse.data
    this.src = data.icons[0].url
      ? data.icons[0].url
      : '@/assets/placeholder.jpg'
    this.title = data.name

    const playlistResponse = await axios.get(
      playlistEndpoints.getPlaylistFromCategories(this.categoryId),
      config
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
  data() {
    return {
      src: undefined,
      title: '',
      playlists: undefined,
      categoryId: this.$route.params.id,
      next: undefined,
      items: undefined,
      userInfo: undefined,
      currentTrack: '',
      trackDuration: 0,
      playing: true,
      totalSeconds: 0,
      interval: undefined
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
