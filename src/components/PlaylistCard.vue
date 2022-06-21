<template>
    <div class="card-container" >
        <img v-if="src" class="playlist-image" :src="src" alt="Playlist image"/>
        <img v-else class="playlist-image" src="@/assets/album-placeholder.jpg" alt="Playlist image"/>
        <div class="info-container">
          <p class="title">{{ playlist.name }}</p>
          <p class="owner">Owner: <strong>{{ playlist.owner.display_name }}</strong></p>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    playlist: {
      type: Object,
      default (rawProps) {
        return {
          name: '',
          images: ['@/assets/placeholder.jpg'],
          owner: {
            name: ''
          },
          id: ''
        }
      }
    }
  },
  data () {
    return {
      id: this.playlist.id,
      src: undefined
    }
  },
  methods: {
    goToDetails () {
      this.$router.push({ path: '/playlist/details/:id', params: { id: this.id } })
    }
  },
  created () {
    if (this.playlist.images[0]) {
      this.src = this.playlist.images[0].url
    } else {
      this.src = false
    }
  }
}
</script>

<style scoped>
.card-container {
    display: flex;
    min-width: 280px;
    height: auto;
    border-radius: 15px;
    margin: 20px;
    background-size: contain;
    position: relative;
    justify-content: center;
    align-content: center;
    flex-direction: column;
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
  outline: 3px solid rgb(0, 217, 255);
  opacity: 1;
  z-index: -1;
}

.playlist-image{
  width: 180px;
  height: 180px;
  place-self: center;
  margin: 10px;
  border-radius: 15px;
}

.info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  color: white;
  font-size: 2rem;
}

.info-container .title {
  max-width: 200px;
  text-align: center;
  font-size: 2.3rem;
}

.info-container .owner {
  max-width: 200px;
  text-overflow: '...';
  text-align: center;
  margin: 10px 0;
}

</style>
