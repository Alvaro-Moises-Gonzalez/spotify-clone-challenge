<template>
  <keep-alive>
    <album-detail-layout>
      <template #aside>
        <user-info
          :userInfo="userInfo"
          :trackName="trackName"
          :trackDuration="trackDuration"
          :progress="totalSeconds"
          :isPlaying="playing"
        />
      </template>
      <template #upper>
        <album-thumbnail
          :album="album"
          :src="src"
          :playAlbum="playAlbum"
          @follow="follow"
          @unfollow="unfollow"
        />
      </template>
      <template #bottom>
        <table>
          <tr class="table-header">
            <th class="number">#</th>
            <th class="title">Title</th>
            <th class="duration">Duration</th>
          </tr>
          <transition-group appear @enter="enter" @beforeEnter="beforeEnter">
            <album-track-row
              v-for="(track, index) in albumTracks"
              :key="index"
              :data-index="index"
              :track="track"
              :trackNumber="index + 1"
              @playTrack="playTrack"
              @like="like"
              @unlike="unlike"
            />
          </transition-group>
          <button v-if="next" @click="moreTracks" class="more-tracks">
            more
          </button>
        </table>
      </template>
    </album-detail-layout>
  </keep-alive>
</template>

<script>
import AlbumThumbnail from '@/components/AlbumThumbnail.vue'
import AlbumDetailLayout from '@/Layout/AlbumDetailLayout.vue'
import userInfo from '@/components/UserInfo.vue'
import AlbumTrackRow from '@/components/AlbumTrackRow.vue'
import axios from 'axios'
import { albumsEndpoints, playerEndpoints } from '@/api/endpoints'
import {
  followAlbum,
  saveTrack,
  unfollowAlbum,
  userData
} from '@/api/callFunctions'
import {
  resume,
  nextElement,
  prevElement,
  playElement,
  playCollection,
  currentSong,
  pauseElement
} from '@/api/playercontrols'
import gsap from 'gsap'

export default {
  components: {
    userInfo,
    AlbumThumbnail,
    AlbumDetailLayout,
    AlbumTrackRow
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
          this.trackName = currentData.item.name
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
    async playAlbum() {
      const uri = this.album.uri
      clearInterval(this.interval)
      playCollection(uri)
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
    async playTrack(number) {
      clearInterval(this.interval)
      playElement(number, this.trackUris)
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
    },
    async moreTracks() {
      const moreResponse = await fetch(this.next, this.config)
      const data = await moreResponse.json()
      if (data.next) {
        this.next = data.next
      } else {
        this.next = undefined
      }
      this.albumTracks = [...this.albumTracks, ...data.items]
      this.trackUris = this.albumTracks.map((track) => track.uri)
    },
    async follow(id) {
      await followAlbum(id)
    },
    async unfollow(id) {
      await unfollowAlbum(id)
    },
    async like(id) {
      await saveTrack(id)
    },
    async unlike(id) {
      await removeTrack(id)
    }
  },
  data() {
    return {
      albumTracks: undefined,
      userInfo: undefined,
      album: undefined,
      src: undefined,
      trackUris: undefined,
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
      },
      next: undefined
    }
  },
  async created() {
    const id = this.$route.params.id
    this.userInfo = await userData(this.config)

    const albumResponse = await axios.get(
      albumsEndpoints.getAlbum(id),
      this.config
    )
    this.album = albumResponse.data
    this.src = albumResponse.data.images[0].url || undefined

    const tracks = await axios.get(
      albumsEndpoints.getAlbumTracks(id),
      this.config
    )
    this.albumTracks = tracks.data.items
    if (tracks.data.next) {
      this.next = tracks.data.next
    } else {
      this.next = undefined
    }
    this.trackUris = this.albumTracks.map((track) => track.uri)

    const currentTrack = await currentSong(this.config)
    this.trackName = currentTrack.item.name
    this.trackDuration = currentTrack.item.duration_ms
    this.totalSeconds = currentTrack.progress_ms
    if (currentTrack.is_playing === true) {
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
  width: 400px;
}
.more-tracks {
  width: 100px;
  height: 60px;
  border: none;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 2rem;
  border-radius: 15px;
  margin: 10px;
}

.more-tracks:hover {
  outline: 2px solid aqua;
  color: aqua;
}
</style>
