<template>
  <layout-details>
    <template #upper>
      <img :src="src"  alt="category"/>
      <p>Category: {{ title }}</p>
    </template>
    <template #bottom>
      <transition-group
      appear
      @beforeEnter=beforeEnter
      @enter=enter >
        <p v-if="items">There no are playlists for this category</p>
        <playlist-card v-else v-for="playlist, index in playlists" :key="index" :playlist="playlist" />
        <button class="load-btn" v-if="loadMore" @click=nextLoad > More playlist</button>
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
    },
    nextLoad () {
      (async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-Type': 'application/json'
          }
        }
        const response = await axios.get(this.next, config)
        const data = response.data
        if (data.playlists.next) {
          this.next = data.playlists.next
        } else {
          this.loadMore = false
        }
        this.playlists = [...this.playlists, ...data.playlists.items]
      })()
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
        this.loadMore = true
      } else {
        this.items = true
      }

    if (dataPlaylist.playlists.next) {
        this.next = dataPlaylist.playlists.next
    } else {
        this.loadMore = false
    }
    })()
  },
  data () {
    return {
      src: undefined,
      title: '',
      playlists: undefined,
      categoryId: this.$route.params.id,
      next: undefined,
      items: undefined,
      loadMore: false
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
  margin-left: 20px;
}

.load-btn {
  width: 100px;
  height: 100px;
  background: rgba(0,0,0, 0.4);
  border-radius: 15px;
  border: none;
  color: white;
  font-size: 2rem;
  margin: 30px;
}
.load-btn:hover {
  outline: 2px solid aqua;
  color: aqua;
}
</style>
