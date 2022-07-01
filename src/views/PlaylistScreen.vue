<template>
  <playlist-details-layout>
    <template #aside>
      <user-info :userInfo="userInfo" />
    </template>
    <template #upper-block>
      <playlist-thumbnail
        :playlist1="playlist"
        :source="source"
        :playPlaylist="playPlaylist"
      />
    </template>
    <template #rows>
      <track-row
        v-for="(track, index) in tracks"
        :key="index"
        :data-index="index"
        :track="track"
        :trackNumber="index + 1"
        @playTrack="playTrack"
      />
    </template>
  </playlist-details-layout>
</template>

<script>
import PlaylistDetailsLayout from '@/Layout/PlaylistDetailsLayout.vue'
import PlaylistThumbnail from '@/components/PlaylistThumbnail.vue'
import TrackRow from '@/components/TrackRow.vue'
import UserInfo from '@/components/UserInfo.vue'
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
    this.trackUris = tracksArray.map( track => track.track.uri)
  },
  data() {
    return {
      playlist: undefined,
      source: undefined,
      tracks: undefined,
      userInfo: undefined,
      trackUris: undefined
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
    },
    async playTrack (number) {
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
    }
  }
}
</script>

<style scoped></style>
