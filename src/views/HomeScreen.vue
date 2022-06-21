<template>
  <layout-screen>
    <template #upper>
      <p class="title">Select by Category</p>
    </template>
    <template #bottom>
      <transition-group
        appear
        @beforeEnter=beforeEnter
        @enter=enter
        >
        <category-card v-for="category, index in categories" :key="index" :data-index="index" :category="category" />
        <button class="more-categories" v-if="loadMore" @click="nextCategories" >More Categories </button>
      </transition-group>
    </template>
  </layout-screen>
</template>

<script>
import CategoryCard from '@/components/CategoryCard.vue'
import LayoutScreen from '@/Layout/LayoutScreen.vue'
import gsap from 'gsap'
import axios from 'axios'
import { categoriesEndpoints } from '@/api/endpoints'

export default {
  components: {
    CategoryCard,
    LayoutScreen
  },
  created () {
    (async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-type': 'application/json'
        }
      }
      const response = await axios.get(`${categoriesEndpoints.getCategories}?country=${localStorage.getItem('COUNTRY')}`, config)
      const data = await response.data
      this.categories = data.categories.items
      this.next = data.categories.next
      this.loadMore = true
    })()
  },
  data () {
    return {
      categories: [],
      loadMore: false,
      next: ''
    }
  },
  methods: {
    nextCategories () {
      (async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-type': 'application/json'
          }
        }

        const response = await axios.get(this.next, config)
        const data = await response.data
        this.categories = [...this.categories, ...data.categories.items]
        if (data.categories.next) {
          this.next = data.categories.next
        } else {
          this.loadMore = false
        }
      })()
    },
    beforeEnter (el) {
      el.style.opacity = 0
      el.style.transform = 'translateY(100px)'
    },
    enter (el, done) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        onComplete: done,
        delay: el.dataset.index * 0.2
      })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

.title{
  display: inline-block;
  width: 100%;
  color: white;
  text-align: center;
  background-color: rgba(0,0,0, 0.2);
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
