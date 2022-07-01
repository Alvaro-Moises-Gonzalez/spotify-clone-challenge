<template>
  <artits-detail-layout>
    <template #aside>
      <user-info :userInfo="userInfo" />
    </template>
    <template #upper>
      <artist-thumbnail :artist="artist" :src="src" />
    </template>
    <template #bottom>
      <transition-group appear @beforeEnter="beforeEnter" @enter="enter">
        <album-card
          v-for="(album, index) in albums"
          :key="index"
          :data-index="index"
          :album="album"
        />
        <button v-if="next" @click="getMoreAlbums">get more albums</button>
      </transition-group>
    </template>
  </artits-detail-layout>
</template>

<script>
import ArtitsDetailLayout from '@/Layout/ArtistDetailLayout.vue'
import UserInfo from '@/components/UserInfo.vue'
import ArtistThumbnail from '@/components/ArtistThumbnail.vue'
import AlbumCard from '@/components/AlbumCard.vue'
import axios from 'axios'
import { userEndpoints, artistEndpoints } from '@/api/endpoints'
import { config } from '@/api/config'
import gsap from 'gsap'
export default {
  components: {
    ArtitsDetailLayout,
    UserInfo,
    ArtistThumbnail,
    AlbumCard
  },
  data() {
    return {
      userInfo: undefined,
      artist: undefined,
      src: undefined,
      albums: [],
      next: undefined
    }
  },
  methods: {
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
    async getMoreAlbums() {
        const MoreAlbums = await axios.get(this.next, config)
        this.albums = [...this.albums, ...MoreAlbums.data.items]
        if (MoreAlbums.data.next) {
          this.next = MoreAlbums.data.next
        } else {
          this.next = undefined
        }
    }
  },
  async created() {
    const id = this.$route.params.id
     const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
        'Content-Type': 'application/json'
      }
    }
    const userResponse = await axios.get(userEndpoints.currentUser, config)
    this.userInfo = userResponse.data

    const artistResponse = await axios.get(
      artistEndpoints.getArtist(id),
      config
    )
    this.artist = artistResponse.data
    this.src = artistResponse.data.images[0]
      ? artistResponse.data.images[0].url
      : undefined

    const artistAlbumsResponse = await axios.get(
      `${artistEndpoints.getArtistsAlbums(id)}?include_groups=album`,
      config
    )
    this.albums = artistAlbumsResponse.data.items
    console.log(artistAlbumsResponse.data.items)
    if (artistAlbumsResponse.data.next) {
      this.next = artistAlbumsResponse.data.next
    }
  }
}
</script>

<style scoped>
p {
  color: white;
  font-size: 25rem;
}

button {
  width: 10vw;
  height: 10vh;
  color: white;
  font-size: 2rem;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  margin: 20px;
  border-radius: 15px;
}
button:hover {
  outline: aqua;
  color: aqua;
}
</style>
