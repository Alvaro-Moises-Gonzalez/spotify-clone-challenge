<template>
  <playlist-details-layout>
    <template #aside>
        <user-info :userInfo="userInfo" />
    </template>
    <template #upper-block>
      <playlist-thumbnail :playlist1="playlist" :source="source" />
    </template>
    <template #rows>
      <track-row
        v-for="(track, index) in tracks"
        :key="index"
        :data-index="index"
        :track="track"
        :trackNumber="index + 1"
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
import { playlistEndpoints, userEndpoints } from '@/api/endpoints'
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
    const playlistData = playlistResponse.data
    this.playlist = playlistData
    console.log(playlistData.tracks.items)
    if (playlistData.images) {
      this.source = playlistData.images[0].url
    } else {
      this.source = '@/assets/album-placeholder.jpg'
    }
    const tracksArray = playlistData.tracks.items
    this.tracks = tracksArray
  },
  data() {
    return {
      playlist: undefined,
      source: undefined,
      tracks: undefined,
      userInfo: undefined
    }
  }
}
</script>

<style scoped></style>
