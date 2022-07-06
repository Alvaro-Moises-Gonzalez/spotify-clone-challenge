<template>
  <layout-screen>
    <template #aside>
      <user-info
        :userInfo="userInfo"
        :isPlaying="playing"
        :trackDuration="trackDuration"
        :progress="totalSeconds"
        :trackName="trackName"
      />
    </template>
    <template #upper>
      <p class="title">Select by Category</p>
    </template>
    <template #bottom>
      <transition-group appear @beforeEnter="beforeEnter" @enter="enter">
        <category-card
          v-for="(category, index) in categories"
          :key="index"
          :data-index="index"
          :category="category"
        />
        <button class="more-categories" v-if="next" @click="nextCategories">
          More Categories
        </button>
      </transition-group>
    </template>
  </layout-screen>
</template>

<script>
import CategoryCard from '@/components/CategoryCard.vue'
import LayoutScreen from '@/Layout/LayoutScreen.vue'
import UserInfo from '@/components/UserInfo.vue'
import gsap from 'gsap'
import axios from 'axios'
import { userData, categories } from '@/api/callFunctions'
import {
  resume,
  nextElement,
  prevElement,
  pauseElement,
  currentSong
} from '@/api/playercontrols'

export default {
  components: {
    CategoryCard,
    LayoutScreen,
    UserInfo
  },
  watch: {
    async totalSeconds(oldVal) {
      if (oldVal >= this.trackDuration) {
        clearInterval(this.interval)
        setTimeout(async () => {
          const currentData = currentSong(this.config)
          this.currentTrack = currentData.item.name
          this.trackDuration = currentData.item.duration_ms
          this.totalSeconds = 0
          this.totalSeconds = currentData.progress_ms
          this.playing = false
          this.timer()
        }, 1000)
      }
    }
  },
  async created() {
    const userInfoResponse = await userData(this.config)
    this.userInfo = userInfoResponse
    localStorage.setItem('COUNTRY', userInfoResponse.country)
    localStorage.setItem('USER_ID', userInfoResponse.id)

    const categoryData = await categories(this.config)
    this.categories = categoryData.categories.items
    if (categoryData.categories.next) {
      this.next = categoryData.categories.next
    } else {
      this.next = undefined
    }

    setTimeout(async () => {
      const currentTrack = await currentSong(this.config)
      this.trackName = currentTrack.item.name || ''
      this.trackDuration = currentTrack.item.duration_ms
      this.totalSeconds = currentTrack.progress_ms
      if (currentTrack.is_playing == true) {
        this.playing = false
        this.timer()
      }
    }, 3000)
  },
  data() {
    return {
      categories: [],
      next: undefined,
      userInfo: undefined,
      trackName: '',
      trackDuration: 0,
      playing: true,
      totalSeconds: 0,
      interval: undefined,
      config: {
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
          'Content-Type': 'application/json'
        }
      }
    }
  },
  methods: {
    async nextCategories() {
      const response = await axios.get(this.next, this.config)
      const data = await response.data
      this.categories = [...this.categories, ...data.categories.items]
      if (data.categories.next) {
        this.next = data.categories.next
      } else {
        this.next = undefined
      }
    },
    beforeEnter(el) {
      el.style.opacity = 0
      el.style.transform = 'translateY(100px)'
    },
    enter(el, done) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        onComplete: done,
        delay: el.dataset.index * 0.2
      })
    },
    timer() {
      const addSeconds = () => {
        this.totalSeconds += 110
      }
      this.interval = setInterval(addSeconds, 100)
    },
    play() {
      resume()
      this.playing = false
      setTimeout(async () => {
        const currentTrack = await currentSong(this.config)
        this.currentTrack = currentTrack.item.name
        this.trackDuration = currentTrack.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentTrack.progress_ms
        this.playing = false
        this.timer()
      })
    },
    nextTrack() {
      clearInterval(this.interval)
      nextElement()
      this.playing = false
      setTimeout(async () => {
        const currentTrack = await currentSong(this.config)
        this.currentTrack = currentTrack.item.name
        this.trackDuration = currentTrack.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentTrack.progress_ms
        this.timer()
      }, 3000)
    },
    prevTrack() {
      clearInterval(this.interval)
      prevElement()
      this.playing = false
      setTimeout(async () => {
        const currentTrack = await currentSong(this.config)
        this.currentTrack = currentTrack.item.name
        this.trackDuration = currentTrack.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentTrack.progress_ms
        this.timer()
      }, 3000)
    },
    pause() {
      clearInterval(this.interval)
      pauseElement()
      this.playing = true
    }
  },
  watch: {
    async totalSeconds(oldVal) {
      if (oldVal >= this.trackDuration) {
        clearInterval(this.interval)
        setTimeout(async () => {
          const currentTrack = await currentSong(this.config)
          this.currentTrack = currentTrack.item.name
          this.trackDuration = currentTrack.item.duration_ms
          this.totalSeconds = 0
          this.totalSeconds = currentTrack.progress_ms
          this.playing = false
          this.timer()
        }, 1000)
      }
    }
  },
  provide() {
    return {
      play: this.play,
      nextTrack: this.nextTrack,
      prevTrack: this.prevTrack,
      pause: this.pause
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

.title {
  display: inline-block;
  width: 100%;
  color: white;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 4rem;
  font-family: 'Great Vibes', sans-serif;
  letter-spacing: 0.5rem;
  padding: 10px;
  border-radius: 15px;
}

.more-categories {
  width: 250px;
  height: 230px;
  border-radius: 15px;
  margin: 20px;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: white;
  font-size: 2rem;
}
.more-categories:hover {
  color: aqua;
  outline: 2px solid aqua;
}
</style>
