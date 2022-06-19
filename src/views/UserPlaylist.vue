<template>
<layout-screen>
  <template #upper>
    <p>your collection</p>
  </template>
  <template #bottom>
    <transition-group
      appear
      @beforeEnter=beforeEnter
      @enter=enter >
      <category-card  v-for="card, index in 10" :key="index" :data-index="index"/>
    </transition-group>
  </template>
</layout-screen>
</template>

<script>
import LayoutScreen from '@/Layout/LayoutScreen.vue'
import CategoryCard from '@/components/CategoryCard.vue'
import gsap from 'gsap'
export default {
  components: {
    LayoutScreen,
    CategoryCard
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
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
p{
  color: white;
  font-size: 4rem;
  text-transform: capitalize;
  text-align: center;
  font-family: 'Great Vibes', sans-serif;
  letter-spacing: 0.5rem;
}
</style>
