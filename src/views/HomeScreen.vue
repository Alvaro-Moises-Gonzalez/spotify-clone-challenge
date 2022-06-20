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
        <category-card v-for="category, index in categories" :key="index" :data-index="index" :title="category.name" />
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
    })()
  },
  setup () {
    const beforeEnter = (el) => {
      el.style.visibility = 'hidden'
      el.style.transform = 'translateY(100px)'
    }

    const enter = (el, done) => {
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        onComplete: done,
        delay: el.dataset.index * 0.2
      })
    }

    return { beforeEnter, enter }
  },
  data () {
    return {
      categories: []
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
</style>
