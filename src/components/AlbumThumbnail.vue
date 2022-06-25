<template>
  <div class="wrapper">
    <img v-if="src" :src="src" :alt="album.name" />
    <img v-else src="@/assets/artist-placeholder.jpg" :alt="album.name" />
    <div class="album-info">
      <p class="title">{{ album.name }}</p>
      <p class="date">{{ album.release_date }}</p>
      <p class="artists">{{ album.artists.map( artist => artist.name).join(', ') }}</p>
      <p class="tracks">Total Tracks: {{ album.total_tracks }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    album: {
      type: Object,
      default(rawProps) {
        return {
          artists: ["artists1", "artist2"],
          id: '',
          name: 'album name',
          release_date: 'not today',
          total_tracks: 0,
          images: ['@/assets/album-placeholder.jpg']
        }
      }
    },
    src: {
      type: String
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  height: auto;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
}

.album-info {
  display: grid;
  grid-template: repeat(5, 0.5fr) / 1fr;
  color: white;
  font-size: 2rem;
}
img {
  width: 150px;
  height: 150px;
  border-radius: 15px;
  margin: 10px;
}

.album {
  font-size: 2.5rem;
  padding-top: 10px;
}

.date {
  font-size: 1.8rem;
}
p {
  margin-left: 5px;
}
</style>
