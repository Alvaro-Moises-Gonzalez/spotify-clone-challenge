<template>
  <layout-screen>
    <template #upper>
      <label>
        <input type="text" placeholder="Search playlist, tracks and more...." v-model="value"/>
      <button @click=fetchSearch ><i class="fas fa-search"></i></button>
    </label>
    </template>
    <template #bottom>
      <transition-group
        appear
        @beforeEnter=beforeEnter
        @enter=enter >
        <artist-card v-for="card,index in artists" :key="index" :title="card.name" />
        <album-card v-for="card,index in albums" :key="index" :title="card.name" />
        <track-card v-for="card,index in tracks" :key="index" :track='card' />
        <playlist-card v-for="card,index in playlists" :key="index" :title="card.name" />
        <show-card v-for="card,index in shows" :key="index" :title="card.name" />
        <episode-card v-for="card,index in episodes" :key="index" :title="card.name" />
      </transition-group>
    </template>
  </layout-screen>
</template>

<script>
import LayoutScreen from '@/Layout/LayoutScreen.vue'
import ArtistCard from '@/components/ArtistCard.vue'
import AlbumCard from '@/components/AlbumCard.vue'
import TrackCard from '@/components/TrackCard.vue'
import PlaylistCard from '@/components/PlaylistCard.vue'
import ShowCard from '@/components/ShowCard.vue'
import EpisodeCard from '@/components/EpisodeCard.vue'
import gsap from 'gsap'
import { searchEndpoint } from '@/api/endpoints'
import axios from 'axios'

export default {
  components: {
    LayoutScreen,
    ArtistCard,
    AlbumCard,
    TrackCard,
    PlaylistCard,
    ShowCard,
    EpisodeCard
  },
  data () {
    return {
      value: '',
      albums: [],
      artists: [],
      tracks: [],
      espisodes: [],
      playlists: [],
      shows: []
    }
  },
  methods: {
    fetchSearch () {
      (async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-Type': 'application/json'
          }
        }
        const response = await axios.get(`${searchEndpoint(this.value, 'track,artist,playlist,show,album,episode')}&country=${localStorage.getItem('COUNTRY')}`, config)
        const data = response.data
        this.playlists = data.playlists.items
        this.artists = data.artists.items
        this.tracks = data.tracks.items
        this.albums = data.albums.items
        this.episodes = data.episodes.items
        this.shows = data.shows.items
        // console.log(data.albums.items)
        this.value = ''
      })()
    }
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
