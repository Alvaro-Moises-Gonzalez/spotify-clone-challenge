<template>
  <tr>
    <td>{{ trackNumber }}</td>
    <td>
      <p class="title">{{ track.name }}</p>
      <p class="author">
        {{ `${track.artists.map((artist) => artist.name).join(', ')}` }}
      </p>
    </td>
    <td>{{ toMinutes(parseInt(track.duration_ms)) }}</td>
  </tr>
</template>

<script>
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
    }
  },
  created() {
    console.log(this.$props)
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
