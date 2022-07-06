<template>
  <tr >
    <td>{{ trackNumber }}</td>
    <td>
      <p class="title" @click="play">{{ track.name }}</p>
      <p class="author">
        {{ `${track.artists.map((artist) => artist.name).join(', ')}` }}
      </p>
      <button v-if="like" @click="unlikeTrack">
        <i class="fas fa-heart"></i>
      </button>
      <button v-else @click="likeTrack"><i class="far fa-heart"></i></button>
    </td>
    <td>{{ toMinutes(parseInt(track.duration_ms)) }}</td>
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
          artists: ['artist1', 'artist2'],
          duration_ms: '33333',
          name: 'Track name',
          id: ''
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
    },
    play() {
      this.$emit('playTrack', this.trackNumber - 1)
    },
     likeTrack() {
      this.toggleLike()
      this.$emit('like', this.track.id)
    },
    unlikeTrack() {
      this.toggleLike()
      this.$emit('unlike', this.track.id)
    },
    toggleLike() {
      this.like = !this.like
    }
  },
  data () {
    return {
        like: false
    }
  },
  async created () {
    this.like = await checkSavedTracks(this.track.id)
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
  cursor: pointer;
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
td {
  position: relative;
}

button {
  position: absolute;
  right: 0px;
  top: -10px;
  width: 50px;
  height: 50px;
  font-size: 2.5rem;
  background-color: transparent;
  border: none;
  color: aqua;
}
</style>
