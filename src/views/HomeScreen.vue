<template>
  <layout-screen>
    <template #side>
      <user-info />
    </template>
    <template #upper>
      <p class="title">Select by Category</p>
    </template>
    <template #bottom>
      <transition-group
        appear
        @beforeEnter=beforeEnter
        @enter=enter
        >
        <category-card v-for="category, index in categories" :key="index" :data-index="index" :title="category.title" />
      </transition-group>
    </template>
  </layout-screen>
</template>

<script>
import CategoryCard from '@/components/CategoryCard.vue'
import UserInfo from '@/components/UserInfo.vue'
import LayoutScreen from '@/Layout/LayoutScreen.vue'
import gsap from 'gsap'

export default {
  components: {
    CategoryCard,
    UserInfo,
    LayoutScreen
  },
  created () {
    console.log(localStorage.getItem('ACCESS_TOKEN'))
  },
  setup () {
    const beforeEnter = (el) => {
      el.style.opacity = 0
      el.style.transform = 'translateY(100px)'
    }

    const enter = (el, done) => {
      gsap.to(el, {
        opacity: 1,
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
      categories: [
        {
          title: 'salsa'
        },
        {
          title: 'rock'
        },
        {
          title: 'cumbia'
        },
        {
          title: 'salsa'
        },
        {
          title: 'rock'
        },
        {
          title: 'cumbia'
        },
        {
          title: 'salsa'
        },
        {
          title: 'rock'
        },
        {
          title: 'cumbia'
        },
        {
          title: 'salsa'
        },
        {
          title: 'rock'
        },
        {
          title: 'cumbia'
        }
      ]
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
