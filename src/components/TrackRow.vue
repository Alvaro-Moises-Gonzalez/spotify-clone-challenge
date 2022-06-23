<template>
  <tr>
    <td>{{ trackNumber }}</td>
    <td>
      <img
        v-if="true"
        class="track-art"
        :src="track.track.album.images[0].url"
        alt="album art"
      />
      <img
        v-else
        class="track-art"
        src="@/assets/placeholder.jpg"
        alt="Track art"
      />
      <p class="title">{{ track.track.name }}</p>
      <p class="author">
        {{ `${track.track.artists.map((artist) => artist.name)}` }}
      </p>
    </td>
    <td>{{ track.track.album.name }}</td>
    <td>{{ track.added_at.slice(0, 10) }}</td>
    <td>{{ toMinutes(parseInt(track.track.duration_ms)) }}</td>
  </tr>
</template>

<script>
export default {
  props: {
    track: {
      type: Object,
      default(rawProps) {
        return {
          added_at: 'fecha',
          track: {
            album: {
              name: 'album name',
              images: [{ url: '@/assets/album-placeholder.jpg' }]
            },
            artists: [{ name: 'artist name' }],
            duration_ms: '3333333',
            name: 'track name'
          }
        }
      }
    },
    trackNumber: {
      type: Number,
      default: 1
    }
  },
  methods: {
    toMinutes(ms) {
      const minutes = Math.floor(ms / 60000)
      const seconds = ((ms % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    }
  }
}
</script>

<style>
tr {
  display: table-row;
  color: white;
  font-size: 2rem;
  text-align: center;
  text-transform: capitalize;
}

.author {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
}

.track-art {
  width: 50px;
  height: 50px;
  float: left;
  margin: 5px;
  border-radius: 15px;
}
.title {
  font-size: 2rem;
}
</style>
