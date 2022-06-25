<template>
  <div class="wrapper">
    <user-info  :userInfo="userInfo"/>
    <div class="blocks-container">
      <div class="upper-block">
        <slot name="upper-block"></slot>
      </div>
      <div class="down-block">
        <transition-group
          tag="table"
          appear
          @beforeEnter=beforeEnter
          @enter=enter >
          <tr class="table-header">
            <th class="number"> # </th>
            <th class="title"> Title </th>
            <th class="album"> Album </th>
            <th class="added"> Added on </th>
            <th class="duration"> Duration </th>
          </tr>
          <slot name="rows"></slot>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import UserInfo from '@/components/UserInfo.vue'
import axios from 'axios'
import { userEndpoints } from '@/api/endpoints'
import gsap from 'gsap'

export default {
  components: {
    UserInfo
  },
  data () {
    return {
      userInfo: undefined
    }
  },
  methods: {
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
  },
  created () {
    (async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'application/json'
        }
      }
      const response = await axios.get(userEndpoints.currentUser, config)
      const data = await response.data
      this.userInfo = data
      localStorage.setItem('COUNTRY', data.country)
    })()
  }
}
</script>

<style scoped>
.wrapper {
  background: linear-gradient(rgba(0,0,0, 0.8), rgba(0,0,0, 0.4)), url('@/assets/background-playlist.jpg');
  background-size: cover;
  display: flex;
}
.blocks-container {
  width: 80%;
  height: auto;
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px
}

.upper-block{
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
}

.down-block {
  background: rgba(0,0,0, 0.2);
  border-radius: 15px;
  max-height: 57vh;
  overflow-y: scroll;
  position: relative;
}
.table-header {
  position: sticky;
  top: 0;
  z-index: 1;
}

th {
  display: table-cell;
  color: white;
  font-size: 2rem;
  padding: 10px;
  border: none;
  border-bottom: 1px solid aqua;
  background: linear-gradient(rgba(0,0,0, 0.8), rgba(0,0,0, 0.2))
}
th::before{
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  filter: grayscale(100%) blur(2px);
  z-index: 0;
  opacity: 0.4;
  transition: all 0.4s;
  border-radius: 15px;
}
.number{
  width: 20px;
}
.title {
  width: 400px;
}
.album {
  width: 330px;
}
.added {
  width: 320px;
}
</style>
