<template>
  <tr>
    <td class="number">{{ episodeNumber }}</td>
    <td>
      <img v-if="src" class="track-art" :src="src" alt="album art" />
      <img
        v-else
        class="track-art"
        src="@/assets/placeholder.jpg"
        alt="Track art"
      />
      <p class="title" @click="playEpisode">{{ episode.name }}</p>
      <button v-if="like" @click="unlikeTrack">
        <i class="fas fa-heart"></i>
      </button>
      <button v-else @click="likeTrack"><i class="far fa-heart"></i></button>
    </td>
    <td class="description">{{ episode.description.slice(0, 30) + '...' }}</td>
    <td>{{ episode.release_date.slice(0, 10) }}</td>
    <td>{{ toMinutes(parseInt(episode.duration_ms)) }}</td>
  </tr>
</template>

<script>
import { checkUserEpisodes } from '@/api/callFunctions'
export default {
  props: {
    episode: {
      type: Object,
      default(rawProps) {
        return {
          release_date: '01-03-2000',
          name: 'episode title',
          explicit: false,
          duration_ms: '333333',
          images: ['@/assets/album-placeholder.jpg'],
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          uri: '',
          id: ''
        }
      }
    },
    episodeNumber: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      src: undefined,
      like: false
    }
  },
  methods: {
    toMinutes(ms) {
      const minutes = Math.floor(ms / 60000)
      const seconds = ((ms % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    },
    toggleLike() {
      this.like = !this.like
    },
    playEpisode() {
      this.$emit(
        'playEpisode',
        this.episode.duration_ms,
        this.episode.name,
        this.episode.uri
      )
    },
    likeTrack() {
      this.toggleLike()
      this.$emit('like', this.episode.id)
    },
    unlikeTrack() {
      this.toggleLike()
      this.$emit('unlike', this.episode.id)
    }
  },
  async created() {
    if (this.episode.images[0]) {
      this.src = this.episode.images[0].url
    } else {
      this.src = undefined
    }
      this.like = await checkUserEpisodes(this.episode.id)
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

button {
  position: absolute;
  left: -20px;
  top: 10px;
  width: 50px;
  height: 50px;
  font-size: 2.5rem;
  background-color: transparent;
  border: none;
  color: aqua;
}
</style>
