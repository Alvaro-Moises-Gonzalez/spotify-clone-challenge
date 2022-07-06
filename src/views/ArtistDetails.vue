<template>
  <artits-detail-layout>
    <template #aside>
      <user-info
        :userInfo="userInfo"
        :isPlaying="playing"
        :trackDuration="trackDuration"
        :progress="totalSeconds"
        :trackName="trackName"
      />
    </template>
    <template #upper>
      <artist-thumbnail :artist="artist" :src="src" />
    </template>
    <template #bottom>
      <transition-group appear @beforeEnter="beforeEnter" @enter="enter">
        <album-card
          v-for="(album, index) in albums"
          :key="index"
          :data-index="index"
          :album="album"
        />
        <button v-if="next" @click="getMoreAlbums">get more albums</button>
      </transition-group>
    </template>
  </artits-detail-layout>
</template>

<script>
import ArtitsDetailLayout from '@/Layout/ArtistDetailLayout.vue'
import UserInfo from '@/components/UserInfo.vue'
import ArtistThumbnail from '@/components/ArtistThumbnail.vue'
import AlbumCard from '@/components/AlbumCard.vue'
import axios from 'axios'
import { artistEndpoints, playerEndpoints } from '@/api/endpoints'
import {
  resume,
  nextElement,
  prevElement,
  pauseElement,
  currentSong
} from '@/api/playercontrols.js'
import { userData } from '@/api/callFunctions'
import gsap from 'gsap'
export default {
  components: {
    ArtitsDetailLayout,
    UserInfo,
    ArtistThumbnail,
    AlbumCard
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
  data() {
    return {
      userInfo: undefined,
      artist: undefined,
      src: undefined,
      albums: [],
      next: undefined,
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
    async getMoreAlbums() {
      const MoreAlbums = await axios.get(this.next, this.config)
      this.albums = [...this.albums, ...MoreAlbums.data.items]
      if (MoreAlbums.data.next) {
        this.next = MoreAlbums.data.next
      } else {
        this.next = undefined
      }
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
    const id = this.$route.params.id

    this.userInfo = await userData(this.config)

    const artistResponse = await axios.get(
      artistEndpoints.getArtist(id),
      this.config
    )
    this.artist = artistResponse.data
    this.src = artistResponse.data.images[0]
      ? artistResponse.data.images[0].url
      : undefined

    const artistAlbumsResponse = await axios.get(
      `${artistEndpoints.getArtistsAlbums(id)}?include_groups=album`,
      this.config
    )
    this.albums = artistAlbumsResponse.data.items
    if (artistAlbumsResponse.data.next) {
      this.next = artistAlbumsResponse.data.next
    }
    const currentResponse = await axios.get(
      playerEndpoints.currentlyPlaying,
      this.config
    )
    const currentData = currentResponse.data
    this.trackName = currentData.item.name
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
p {
  color: white;
  font-size: 25rem;
}

button {
  width: 10vw;
  height: 10vh;
  color: white;
  font-size: 2rem;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  margin: 20px;
  border-radius: 15px;
}
button:hover {
  outline: aqua;
  color: aqua;
}
</style>
