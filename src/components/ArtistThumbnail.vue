<template>
  <div class="wrapper">
    <img v-if="src" :src="src" :alt="artist.name" />
    <img v-else src="@/assets/artist-placeholder.jpg" :alt="artist.name" />
    <div class="artist-info">
      <p class="artist">{{ artist.name }}</p>
      <p class="followers">{{ artist.followers.total }} followers</p>
      <p class="popularity">Rank {{ artist.popularity }} on popularity</p>
      <p class="genres">Genres: {{ artist.genres.join(', ') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artist: {
      type: Object,
      default(rawProps) {
        return {
          followers: {
            total: '333333'
          },
          genres: ['genre1', 'genre2'],
          images: ['@/assets/artist-placeholder.jpg'],
          name: 'artist generic name',
          popularty: 'not very much'
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

.artist-info {
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

.artist {
  font-size: 2.5rem;
  padding-top: 10px;
}

.followers {
  font-size: 1.8rem;
}
 p{
    margin-left: 5px;
 }
</style>
