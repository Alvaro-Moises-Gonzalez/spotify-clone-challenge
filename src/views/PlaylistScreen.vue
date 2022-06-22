<template>
  <playlist-details-layout>
    <template #upper-block>
      <playlist-thumbnail :playlist="playlist" :source="source" />
    </template>
    <template #rows>
      <track-row
        v-for="(track, index) in 74"
        :key="index"
        :data-index="index"
      />
    </template>
  </playlist-details-layout>
</template>

<script>
import PlaylistDetailsLayout from '@/Layout/PlaylistDetailsLayout.vue'
import PlaylistThumbnail from '@/components/PlaylistThumbnail.vue'
import TrackRow from '@/components/TrackRow.vue'
import axios from 'axios'
import { playlistEndpoints } from '@/api/endpoints'
export default {
  components: {
    PlaylistDetailsLayout,
    PlaylistThumbnail,
    TrackRow
  },
  async created () {
    const id = this.$route.params.id
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
        'Content-Type': 'application/json'
      }
    }
    const playlistResponse = await axios.get(
      playlistEndpoints.getPlaylist(id),
      config
    )
    const playlistData = playlistResponse.data
    this.playlist = playlistData
    console.log(playlistData)
    console.log(playlistData.images[0])
    if (playlistData.images[0]) {
      this.source = playlistData.images[0].url
    } else {
      this.source = '@/assets/album-placeholder.jpg'
    }
  },
  data () {
    return {
      playlist: undefined,
      source: undefined
    }
  }
}
</script>

<style scoped></style>
