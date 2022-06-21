<template>
  <layout-details>
    <template #upper>
      <img :src="src"  alt="category"/>
      <p>Title: {{ title }}</p>
    </template>
    <template #bottom>
      <transition-group
      appear
      @beforeEnter=beforeEnter
      @enter=enter >
        <p v-if="items">There no are playlists for this category</p>
        <playlist-card v-else v-for="playlist, index in playlists" :key="index" :playlist="playlist" />
      </transition-group>
    </template>
  </layout-details>
</template>

<script>
import LayoutDetails from '@/Layout/LayoutDetails.vue'
import PlaylistCard from '@/components/PlaylistCard.vue'
import { categoriesEndpoints, playlistEndpoints } from '@/api/endpoints'
import axios from 'axios'
import gsap from 'gsap'
export default {
  components: {
    LayoutDetails,
    PlaylistCard
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
      const categoryResponse = await axios.get(categoriesEndpoints.getSubcategories(this.categoryId), config)
      const data = categoryResponse.data
      this.src = data.icons[0].url ? data.icons[0].url : '@/assets/placeholder.jpg'
      this.title = data.name

      const playlistResponse = await axios.get(playlistEndpoints.getPlaylistFromCategories(this.categoryId), config)
      const dataPlaylist = playlistResponse.data
      if (dataPlaylist.playlists.items.length) {
        this.playlists = dataPlaylist.playlists.items
      } else {
        this.items = true
      }
      this.next = dataPlaylist.next
    })()
  },
  data () {
    return {
      src: undefined,
      title: '',
      playlists: undefined,
      categoryId: this.$route.params.id,
      next: undefined,
      items: undefined
    }
  }
}
</script>

<style scoped>
img {
  width: 150px;
  height: 150px;
  border-radius: 15px;
  margin: 20px;
}
p {
  color: white;
  font-size: 4rem;
  align-self: center;
  justify-self: center;
}
</style>
