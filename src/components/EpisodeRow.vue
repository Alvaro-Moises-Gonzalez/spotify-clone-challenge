<template>
  <tr @click=playEpisode>
    <td>{{ episodeNumber }}</td>
    <td>
      <img v-if="src" class="track-art" :src="src" alt="album art" />
      <img
        v-else
        class="track-art"
        src="@/assets/placeholder.jpg"
        alt="Track art"
      />
      <p class="title">{{ episode.name }}</p>
    </td>
    <td class="description">{{ episode.description.slice(0, 30) + '...' }}</td>
    <td>{{ episode.release_date.slice(0, 10) }}</td>
    <td>{{ toMinutes(parseInt(episode.duration_ms)) }}</td>
  </tr>
</template>

<script>
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
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
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
      src: undefined
    }
  },
  methods: {
    toMinutes(ms) {
      const minutes = Math.floor(ms / 60000)
      const seconds = ((ms % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    },
    playEpisode () {
        this.$emit('playEpisode', this.episodeNumber - 1)
    }
  },
  created() {
    if (this.episode.images[0]) {
      this.src = this.episode.images[0].url
    } else {
      this.src = undefined
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
  cursor: pointer;
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
