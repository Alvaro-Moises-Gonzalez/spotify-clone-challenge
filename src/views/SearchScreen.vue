<template>
  <layout-screen>
     <template #side>
      <user-info />
    </template>
    <template #upper>
      <label>
        <input type="text" placeholder="Search playlist and tracks...."/>
      <button><i class="fas fa-search"></i> </button>
    </label>
    </template>
    <template #bottom>
      <transition-group
        appear
        @beforeEnter=beforeEnter
        @enter=enter >
        <category-card v-for="card, index in 10" :key="index" :data-index="index" />
      </transition-group>
    </template>

  </layout-screen>
</template>

<script>
import LayoutScreen from '@/Layout/LayoutScreen.vue'
import UserInfo from '@/components/UserInfo.vue'
import CategoryCard from '@/components/CategoryCard.vue'
import gsap from 'gsap'

export default {
  components: {
    LayoutScreen,
    UserInfo,
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
input{
  width: 800px;
  height: 40px;
  margin: 20px 20px 20px 90px;
  border: none;
  outline: none;
  background: rgba(255,255,255, 0.2);
  border-radius: 15px;
  color: white;
  font-size: 2rem;
  padding-left: 10px;
}
::placeholder{
  color: white;
  font-size: 2rem;
  padding: 20px;
}
input[type="text"]:focus{
  outline: 1px solid aqua;
}
label button{
  width: 50px;
  height: 50px;
  font-size: 2rem;
  background: rgba(0,0,0, 0.2);
  outline: none;
  border: none;
  border-radius: 50%;
  color: white;
}
label button:hover{
  color: aqua;
  outline: 1px solid aqua;
}
.search-results{
  position: absolute;
  width: 980px;
  height: 560px;
  background: rgba(80,0,0, 0.2);
  top: 80px;
  left: 300px;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
}
</style>
