<template>
  <album-detail-layout>
    <template #aside>
      <user-info :userInfo="userInfo" />
    </template>
    <template #upper>
      <album-thumbnail :album="album" :src="src" :playAlbum="playAlbum" />
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
            @playTrack=playTrack
          />
        </transition-group>
      </table>
    </template>
  </album-detail-layout>
</template>

<script>
import AlbumThumbnail from '@/components/AlbumThumbnail.vue'
import AlbumDetailLayout from '@/Layout/AlbumDetailLayout.vue'
import userInfo from '@/components/UserInfo.vue'
import AlbumTrackRow from '@/components/AlbumTrackRow.vue'
import axios from 'axios'
import { userEndpoints, albumsEndpoints, playerEndpoints } from '@/api/endpoints'
import gsap from 'gsap'

export default {
  components: {
    userInfo,
    AlbumThumbnail,
    AlbumDetailLayout,
    AlbumTrackRow
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
    async playAlbum () {
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
    },
    async playTrack (number) {
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
    }
  },
  data() {
    return {
      albumTracks: undefined,
      userInfo: undefined,
      album: undefined,
      src: undefined,
      trackUris: undefined
    }
  },
  async created() {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
        'Content-Type': 'application/json'
      }
    }

    const id = this.$route.params.id
    const userInfo = await axios.get(userEndpoints.currentUser, config)
    this.userInfo = userInfo.data

    const albumResponse = await axios.get(albumsEndpoints.getAlbum(id), config)
    this.album = albumResponse.data
    this.src = albumResponse.data.images[0].url || undefined

    const tracks = await axios.get(albumsEndpoints.getAlbumTracks(id), config)
    this.albumTracks = tracks.data.items
    this.trackUris = this.albumTracks.map ( track => track.uri)
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
</style>
