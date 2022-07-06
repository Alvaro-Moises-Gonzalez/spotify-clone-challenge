<template>
  <user-saved-tracks>
    <template #aside>
      <user-info
        :userInfo="userInfo"
        :isPlaying="playing"
        :trackDuration="trackDuration"
        :progress="totalSeconds"
        :trackName="trackName"
      />
    </template>
    <template #tracks>
      <table>
        <tr class="table-header">
          <th class="number">#</th>
          <th class="title">Title</th>
          <th class="author">Artist</th>
          <th class="duration">Duration</th>
        </tr>
        <transition-group appear @enter="enter" @beforeEnter="beforeEnter">
          <user-track
            v-for="(track, index) in tracks"
            :key="index"
            :track="track"
            :trackNumber="index + 1"
            @playTrack="playTrack"
            :data-index="index"
            @like="like"
            @unlike="unlike"
          />
          <button v-if="next" @click="moreTracks" class="more-tracks">
            more
          </button>
        </transition-group>
      </table>
    </template>
  </user-saved-tracks>
</template>

<script>
import UserInfo from '@/components/UserInfo.vue'
import UserSavedTracks from '@/Layout/userSavedTracks.vue'
import userTrack from '@/components/userTrack.vue'
import axios from 'axios'
import {
  userData,
  userTracks,
  saveTrack,
  removeTrack
} from '@/api/callFunctions.js'
import gsap from 'gsap'
import {
  playElement,
  currentSong,
  resume,
  nextElement,
  prevElement,
  pauseElement
} from '@/api/playercontrols'
import { createBlock } from '@vue/runtime-core'
export default {
  components: {
    UserInfo,
    UserSavedTracks,
    userTrack
  },
  data() {
    return {
      userInfo: undefined,
      tracks: undefined,
      tracksUris: [],
      trackName: '',
      trackDuration: 0,
      playing: undefined,
      totalSeconds: 0,
      interval: undefined,
      config: {
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
          'Content-Type': 'application/json'
        }
      },
      next: undefined
    }
  },
  async created() {
    this.userInfo = await userData(this.config)
    const tracksData = await userTracks(this.config)
    this.tracks = tracksData.items
    this.tracksUris = tracksData.items.map((track) => track.track.uri)
    if (this.tracks.next) {
      this.mext = this.tracks.next
    } else {
      this.next = undefined
    }

    const currentTrack = await currentSong(this.config)
    this.trackName = currentTrack.item.name
    this.trackDuration = currentTrack.item.duration_ms
    this.totalSeconds = currentTrack.progress_ms
    if (currentTrack.is_playing == true) {
      this.playing = false
      this.timer()
    }
  },
  methods: {
    playTrack(position) {
      playElement(position, this.tracksUris)
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
    timer() {
      const addSeconds = () => {
        this.totalSeconds += 110
      }
      this.interval = setInterval(addSeconds, 100)
    },
    play() {
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
    },
    async nextTrack() {
      clearInterval(this.interval)
      await nextElement()
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
    prevTrack() {
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
    async moreTracks() {
      const response = await axios.get(this.next, this.config)
      const data = response.data
      if (data.next) {
        this.next = data.next
      } else {
        this.next = undefined
      }
      this.tracks = [...this.tracks, ...data.items]
      this.tracksUris = this.tracks.map((track) => track.track.uri)
    },
    pause() {
      clearInterval(this.interval)
      pauseElement()
      this.playing = true
    },
    async like(id) {
      await saveTrack(id)
    },
    async unlike(id) {
      await removeTrack(id)
    },
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
  provide() {
    return {
      play: this.play,
      nextTrack: this.nextTrack,
      prevTrack: this.prevTrack,
      pause: this.pause
    }
  }
}
</script>

<style scoped>
.table-header {
  position: sticky;
  top: 0;
  z-index: 1;
}

th {
  display: table-cell;
  color: white;
  font-size: 2rem;
  padding: 10px;
  border: none;
  border-bottom: 1px solid aqua;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2));
}
th::before {
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  filter: grayscale(100%) blur(2px);
  z-index: 0;
  opacity: 0.4;
  transition: all 0.4s;
  border-radius: 15px;
}
.number {
  width: 20px;
}
.title {
  width: 500px;
}
.duration {
  width: 200px;
}
.author {
  width: 200px;
}
</style>
