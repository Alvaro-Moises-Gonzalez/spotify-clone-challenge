<template>
  <div class="thumbnail">
    <img v-if="source" :src="source" alt="disk's Art" />
    <img v-else src="@/assets/album-placeholder.jpg" alt="cover art" />
    <div class="thumbnail-info">
      <p class="title">{{ playlist1.name }}</p>
      <p class="author">{{ playlist1.owner.display_name }}</p>
      <p class="number">{{ playlist1.tracks.total }} Tracks</p>
      <button class="play-btn" @click=playPlaylist>From the beginning</button>
      <p class="description">{{ playlist1.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playlist1: {
      type: Object,
      default(rawProps) {
        return {
          name: 'playlist name',
          images: ['@/assets/album-placeholder.jpg'],
          description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis quis iure quos repellat reiciendis, eum sit aliquid cumque hic nisi itaque nihil dolor deserunt optio porro! Reprehenderit dolorem consequuntur nam!',
          owner: {
            display_name: 'John Doe'
          },
          tracks: {
            total: 0
          }
        }
      }
    },
    source: {
      type: String
    },
    playPlaylist: {
        type: Function,
        default () {
            return console.log('playing album')
        }
    }
  }
}
</script>

<style scoped>
.thumbnail {
  height: auto;
  display: flex;
}
.thumbnail img {
  width: 150px;
  height: 150px;
  border-radius: 15px;
  margin: 20px;
}

.thumbnail-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 0.5fr 2fr;
  margin: 20px;
  color: white;
}
.title {
  grid-column: span 3;
  font-size: 3rem;
}
.author {
  font-size: 2.2rem;
}
.number {
  font-size: 2.2rem;
}
.description {
  grid-column: span 2;
  font-size: 2rem;
}

.play-btn {
    width: 100px;
    height: 45px;
    border-radius: 15px;
    background: rgba(0, 0,0, 0.6);
    border: none;
    font-size: 20px;
    color: white;
    cursor: pointer;
    font-size: 1.5rem;
}

.play-btn:hover{
    outline: 2px solid aqua;
    color: aqua;
}
</style>
