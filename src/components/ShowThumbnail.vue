<template>
  <div class="wrapper">
    <img v-if="src" :src="src" :alt="show.name" />
    <img v-else src="@/assets/album-placeholder.jpg" :alt="show.name" />
    <button class="heart" v-if="follow" @click="unfollowShow">
      <i class="fas fa-heart"></i>
    </button>
    <button class="heart" v-else @click="followShow">
      <i class="far fa-heart"></i>
    </button>
    <div class="show-info">
      <p class="publisher">{{ show.publisher }}</p>
      <p :v-if="show.explicit">Explicit Content</p>
      <p :v-if="show.copyrights">{{ show.copyrights.join(', ') }}</p>
      <p>{{ show.description }}</p>
      <p>Total epísodes: {{ show.total_episodes }}</p>
      <button class="play-btn" @click="playShow">From the beginning</button>
    </div>
  </div>
</template>

<script>
import { checkUserSavedShow } from '@/api/callFunctions'
export default {
  props: {
    show: {
      type: Object,
      default(rawProps) {
        return {
          copyrights: [],
          explicit: false,
          description: '',
          name: '',
          total_episodes: 0,
          publisher: ''
        }
      }
    },
    src: {
      type: String
    },
    playShow: {
      type: Function,
      default() {
        return console.log('playing show')
      }
    }
  },
  data() {
    return {
      follow: false
    }
  },
  methods: {
    toggleFollow() {
      this.follow = !this.follow
    },
    followShow() {
      this.toggleFollow()
      this.$emit('follow', this.show.id)
    },
    unfollowShow() {
      this.toggleFollow()
      this.$emit('unfollow', this.show.id)
    }
  },
  async created () {
    setTimeout(async()=> {
        this.follow = await checkUserSavedShow(this.show.id)
    }, 2000)
    console.log(this.follow)
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  height: auto;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  position: relative;
}

.show-info {
  display: grid;
  grid-template: auto / 1fr;
  color: white;
  font-size: 2rem;
}
img {
  width: 150px;
  height: 150px;
  border-radius: 15px;
  margin: 10px;
}

.publisher {
  font-size: 2.5rem;
  margin-top: 10px;
}

.date {
  font-size: 1.8rem;
}
p {
  margin-left: 5px;
}
.play-btn {
  width: 200px;
  height: 30px;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
}

.play-btn:hover {
  outline: 2px solid aqua;
  color: aqua;
}

.heart {
  position: absolute;
  left: 10%;
  top: 45%;
  width: 80px;
  height: 80px;
  font-size: 4rem;
  background-color: transparent;
  border: none;
  color: rgb(38, 255, 0);
  cursor: pointer;
}
</style>
