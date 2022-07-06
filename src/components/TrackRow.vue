<template>
  <tr>
    <td>{{ trackNumber }}</td>
    <td>
      <img v-if="src" class="track-art" :src="src" alt="album art" />
      <img
        v-else
        class="track-art"
        src="@/assets/placeholder.jpg"
        alt="Track art"
      />
      <p class="title" @click="playTrack">
        {{ track.track.name }}
      </p>
      <p class="author">
        {{ `${track.track.artists.map((artist) => artist.name)}` }}
      </p>
      <button v-if="like" @click="unlikeTrack">
        <i class="fas fa-heart"></i>
      </button>
      <button  v-else @click="likeTrack"><i class="far fa-heart"></i></button>
    </td>
    <td>{{ track.track.album.name }}</td>
    <td>{{ track.added_at.slice(0, 10) }}</td>
    <td>{{ toMinutes(parseInt(track.track.duration_ms)) }}</td>
  </tr>
</template>

<script>
import { checkSavedTracks } from '@/api/callFunctions'
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
              images: ['@/assets/placeholder.jpg'],
              id: ''
            },
            artists: [{ name: 'artist name' }],
            duration_ms: '3333333',
            name: 'track name',
          }
        }
      }
    },
    trackNumber: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      src: undefined,
      like: true
    }
  },
  methods: {
    toMinutes(ms) {
      const minutes = Math.floor(ms / 60000)
      const seconds = ((ms % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    },
    playTrack() {
      this.$emit('playTrack', this.trackNumber - 1)
    },
    likeTrack() {
      this.toggleLike()
      this.$emit('like', this.track.track.id)
    },
    unlikeTrack() {
      this.toggleLike()
      this.$emit('unlike', this.track.track.id)
    },
    toggleLike() {
      this.like = !this.like
    }
  },
  async created() {
    if (this.track.track.album.images[0]) {
      this.src = this.track.track.album.images[0].url
    } else {
      this.src = undefined
    }
    this.like = await checkSavedTracks(this.track.track.id)
  }
}
</script>

<style scoped>
tr {
  display: table-row;
  color: white;
  font-size: 2rem;
  text-align: center;
  text-transform: capitalize;
}

td {
  position: relative;
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
  cursor: pointer;
}

button {
  position: absolute;
  right: 0px;
  top: 0;
  width: 50px;
  height: 50px;
  font-size: 2.5rem;
  background-color: transparent;
  border: none;
  color: aqua;
  cursor: pointer;
}
</style>
