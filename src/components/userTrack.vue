<template>
  <tr >
    <td>{{ trackNumber }}</td>
    <td>
      <p class="title" @click="playTrack">{{ track.track.name }}</p>
      <button v-if="like" @click="unlikeTrack">
        <i class="fas fa-heart"></i>
      </button>
      <button v-else @click="likeTrack"><i class="far fa-heart"></i></button>
    </td>
    <td>{{ track.track.artists.map((artist) => artist.name).join(', ') }}</td>
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
          track: {
            name: '',
            duration_ms: 0,
            artists: [{ name: '' }]
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
    unlikeTrack () {
        this.toggleLike()
        this.$emit('unlike', this.track.track.id)
    },
    likeTrack() {
        this.toggleLike()
        this.$emit('like', this.track.track.id)
    },
    toggleLike () {
        this.like = !this.like
    }
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
    display: table-cell;
    position: relative;
    height: 50px;
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
  cursor: pointer;
}
</style>
