<template>
  <playlist-details-layout>
    <template #aside>
      <user-info
        :userInfo="userInfo"
        :isPlaying="playing"
        :progress="totalSeconds"
        :trackDuration="trackDuration"
        :trackName="trackName"
      />
    </template>
    <template #upper-block>
      <playlist-thumbnail
        :playlist1="playlist"
        :source="source"
        :playPlaylist="playPlaylist"
        @unfollow="unfollow"
        @follow="follow"
      />
    </template>
    <template #rows>
      <table>
        <tr class="table-header">
          <th class="number">#</th>
          <th class="title">Title</th>
          <th class="album">Album</th>
          <th class="added">Added on</th>
          <th class="duration">Duration</th>
        </tr>
        <transition-group appear @beforeEnter="beforeEnter" @enter="enter">
          <track-row
            v-for="(track, index) in tracks"
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
  </playlist-details-layout>
</template>

<script>
import PlaylistDetailsLayout from '@/Layout/PlaylistDetailsLayout.vue'
import PlaylistThumbnail from '@/components/PlaylistThumbnail.vue'
import TrackRow from '@/components/TrackRow.vue'
import UserInfo from '@/components/UserInfo.vue'
import gsap from 'gsap'
import axios from 'axios'
import { playlistEndpoints } from '@/api/endpoints'
import {
  saveTrack,
  userData,
  removeTrack,
  followPlaylist,
  unfollowPlaylist
} from '@/api/callFunctions'
import {
  resume,
  currentSong,
  nextElement,
  prevElement,
  playCollection,
  playElement,
  pauseElement
} from '@/api/playercontrols'
export default {
  components: {
    PlaylistDetailsLayout,
    PlaylistThumbnail,
    TrackRow,
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
  async created() {
    const id = this.$route.params.id

    this.userInfo = await userData(this.config)

    const playlistResponse = await axios.get(
      playlistEndpoints.getPlaylist(id),
      this.config
    )
    this.playlist = playlistResponse.data
    if (this.playlist.images) {
      this.source = this.playlist.images[0].url
    } else {
      this.source = '@/assets/album-placeholder.jpg'
    }
    const tracksArray = this.playlist.tracks.items
    this.tracks = tracksArray
    this.trackUris = tracksArray.map((track) => track.track.uri)
    if (this.playlist.tracks.next) {
      this.next = this.playlist.tracks.next
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
  data() {
    return {
      playlist: undefined,
      source: undefined,
      tracks: undefined,
      userInfo: undefined,
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
  methods: {
    async playPlaylist() {
      const uri = this.playlist.uri
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
    },
    async like(id) {
      await saveTrack(id)
    },
    async unlike(id) {
      await removeTrack(id)
    },
    async moreTracks() {
      const moreResponse = await fetch(this.next, this.config)
      const data = await moreResponse.json()
      if (data.next) {
        this.next = data.next
      } else {
        this.next = undefined
      }
      this.tracks = [...this.tracks, ...data.items]
      this.trackUris = tracksArray.map((track) => track.track.uri)
    },
    async follow(id) {
      await followPlaylist(id)
    },
    async unfollow(id) {
      await unfollowPlaylist(id)
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
  width: 400px;
}
.album {
  width: 330px;
}
.added {
  width: 320px;
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
