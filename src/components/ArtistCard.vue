<template>
    <div class="card-container" @click=goToArtistDetail>
        <img v-if="src" :src="src" :alt="artist.name" />
        <img v-else src="@/assets/artist-placeholder.jpg" :alt="artist.name" />
        <p><strong>{{ artist.name }}</strong></p>
    </div>
</template>

<script>
export default {
  props: {
    artist: {
      type: Object,
      default (rawProps) {
        return {
            name: '',
            id: '',
            images: ['@/assets/album-placeholdder.jpg']
        }
      }
    }
  },
  data () {
    return {
        src: undefined
    }
  },
  created () {
    if (this.artist.images[0]) {
        this.src = this.artist.images[0].url
    } else {
        this.src = undefined
    }
  },
  methods: {
    goToArtistDetail () {
        this.$router.push({ name: 'artist details', params: { id: this.artist.id}})
    }
  }
}
</script>

<style scoped>
.card-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 1fr;
    width: 280px;
    height: 230px;
    border-radius: 15px;
    margin: 20px;
    background-size: contain;
    position: relative;
   place-items: center center;
}

.card-container::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-image: linear-gradient(rgba(0,0,0, 0.8), rgba(0,0,0, 0.2)), url("@/assets/category.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  filter: grayscale(100%) blur(2px);
  z-index: 0;
  opacity: 0.4;
  transition: all 0.4s;
  border-radius: 15px;
}

.card-container:hover::before {
  cursor: pointer;
  filter: none;
  outline: 3px solid rgb(247, 0, 255);
  opacity: 1;
  z-index: -1;
}

.card-container p {
    display: block;
    text-align: center;
    font-size: 2rem;
    color: white;
    text-transform: capitalize;
    cursor: pointer;
    padding-right: 50px;
    letter-spacing: 0.2rem;
    margin-left: 35px;
}

img {
    width: 180px;
    height: 180px;
    margin-top: 10px;
    border-radius: 15px;
}
</style>
