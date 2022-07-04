<template>
  <playlist-details-layout>
    <template #aside>
      <user-info
        :userInfo="userInfo"
        :isPlaying="playing"
        :progress="totalSeconds"
        :trackDuration="trackDuration"
        :trackName="currentTrack"
      />
    </template>
    <template #upper-block>
      <playlist-thumbnail
        :playlist1="playlist"
        :source="source"
        :playPlaylist="playPlaylist"
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
          />
        </transition-group>
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
import {
  playlistEndpoints,
  userEndpoints,
  playerEndpoints
} from '@/api/endpoints'
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
  async created() {
    const id = this.$route.params.id
    const config = {
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
        'Content-Type': 'application/json'
      }
    }
    const userInfoRespónse = await axios.get(userEndpoints.currentUser, config)
    this.userInfo = userInfoRespónse.data

    const playlistResponse = await axios.get(
      playlistEndpoints.getPlaylist(id),
      config
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
      playlist: undefined,
      source: undefined,
      tracks: undefined,
      userInfo: undefined,
      trackUris: undefined,
      currentTrack: '',
      trackDuration: 0,
      playing: true,
      totalSeconds: 0,
      interval: undefined
    }
  },
  methods: {
    async playPlaylist() {
      const uri = this.playlist.uri
      const config = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context_uri: `${uri}`,
          offset: {
            position: '0'
          },
          position_ms: '0'
        })
      }
      await fetch(playerEndpoints.startResumePlayback, config)
      clearInterval(this.interval)
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
      }, 2000)
    },
    async playTrack(number) {
      const config = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: this.trackUris,
          offset: {
            position: `${number}`
          },
          position_ms: '0'
        })
      }
      await fetch(playerEndpoints.startResumePlayback, config)
      clearInterval(this.interval)
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
      const config = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN')
        },
        body: JSON.stringify({
          context_uri: `${uri}`,
          offset: {
            position: '0'
          },
          position_ms: '0'
        })
      }
      await fetch(playerEndpoints.startResumePlayback, config)
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
      }, 2000)
    },
    async playTrack(number) {
      const config = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN')
        },
        body: JSON.stringify({
          uris: this.trackUris,
          offset: {
            position: `${number}`
          },
          position_ms: '0'
        })
      }

      await fetch(playerEndpoints.startResumePlayback, config)

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
</style>
