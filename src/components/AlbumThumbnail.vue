<template>
  <div class="wrapper">
    <img v-if="src" :src="src" :alt="album.name" />
    <img v-else src="@/assets/artist-placeholder.jpg" :alt="album.name" />
    <div class="album-info">
      <p class="title">{{ album.name }}</p>
      <p class="date"> Release: {{ album.release_date }}</p>
      <p class="artists">{{ album.artists.map( artist => artist.name).join(', ') }}</p>
      <p class="tracks">Total Tracks: {{ album.total_tracks }}</p>
      <button v-if="isPlayingAlbum" class="play-btn" @click=playAlbum><i class="fas fa-play"></i></button>
      <button v-else class="play-btn"><i class="fas fa-pause"></i></button>
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
    },
    playAlbum: {
        type: Function,
        default () {
            return console.log('click')
        }
    }
  },
  data () {
    return {
        isPlayingAlbum: true
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
  grid-template: repeat(6, 0.5fr) / 1fr;
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

.play-btn {
    width: 50px;
    height: 45px;
    margin-top: 2px;
    border-radius: 15px;
    background: rgb(50, 240, 29);
    border: none;
    font-size: 20px;
    color: white;
    cursor: pointer;
}
</style>
