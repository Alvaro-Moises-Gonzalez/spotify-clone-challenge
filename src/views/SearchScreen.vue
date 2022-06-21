<template>
  <layout-screen>
    <template #upper>
      <label>
        <input type="text" placeholder="Search playlist, tracks and more...." v-model="value"/>
        <select value="artist" @change=change($event)>
          <option value="artist">Artist</option>
          <option value="track">Track</option>
          <option value="album">Album</option>
          <option value="show">Show</option>
          <option value="playlist">Playlist</option>
          <option value="episode">Episode</option>
        </select>
      <button @click=fetchSearch ><i class="fas fa-search"></i></button>
    </label>
    </template>
    <template #bottom>
      <transition-group
        appear
        @beforeEnter=beforeEnter
        @enter=enter >
        <artist-card v-for="card,index in artists" :key="index" :title="card.name" />
        <album-card v-for="album,index in albums" :key="index" :album="album" />
        <track-card v-for="card,index in tracks" :key="index" :track='card' />
        <playlist-card v-for="playlist,index in playlists" :key="index" :playlist="playlist" />
        <show-card v-for="show,index in shows" :key="index" :show="show" />
        <episode-card v-for="card,index in episodes" :key="index" :title="card.name" />
        <button class="load-more" v-if="loadMoreArtist" @click="nextArtist">More Artists</button>
        <button class="load-more" v-if="loadMoreTracks" @click="nextTrack">More Tracks</button>
        <button class="load-more" v-if="loadMoreAlbums" @click="nextAlbum">More Albums</button>
        <button class="load-more" v-if="loadMorePlaylist" @click="nextPlaylist">More Playlist</button>
        <button class="load-more" v-if="loadMoreShows" @click="nextShow">More Shows</button>
        <button class="load-more" v-if="loadMoreEpisodes" @click="nextEpisode">More Episodes</button>
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
      episodes: [],
      playlists: [],
      shows: [],
      selected: 'artist',
      loadMoreArtist: false,
      loadMoreTracks: false,
      loadMoreAlbums: false,
      loadMorePlaylist: false,
      loadMoreShows: false,
      loadMoreEpisodes: false,
      nextArtists: '',
      nextAlbums: '',
      nextTracks: '',
      nextShows: '',
      nextPlaylists: '',
      nextEpisodes: ''
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
        const response = await axios.get(`${searchEndpoint(this.value, this.selected)}&country=${localStorage.getItem('COUNTRY')}`, config)
        const data = response.data
        if (data.playlists) {
          this.playlists = data.playlists.items
          this.nextPlaylists = data.playlists.next

          this.loadMorePlaylist = true
          this.loadMoreTracks = false
          this.loadMoreAlbums = false
          this.loadMoreShows = false
          this.loadMoreEpisodes = false
          this.loadMoreArtist = false

          this.tracks = []
          this.albums = []
          this.shows = []
          this.episodes = []
          this.artists = []
        }
        if (data.artists) {
          this.artists = data.artists.items
          this.nextArtists = data.artists.next

          this.loadMorePlaylist = false
          this.loadMoreTracks = false
          this.loadMoreAlbums = false
          this.loadMoreShows = false
          this.loadMoreEpisodes = false
          this.loadMoreArtist = true

          this.playlists = []
          this.tracks = []
          this.albums = []
          this.shows = []
          this.episodes = []
        }
        if (data.tracks) {
          this.tracks = data.tracks.items
          this.nextTracks = data.tracks.next

          this.loadMorePlaylist = false
          this.loadMoreTracks = true
          this.loadMoreAlbums = false
          this.loadMoreShows = false
          this.loadMoreEpisodes = false
          this.loadMoreArtist = false

          this.playlists = []
          this.albums = []
          this.shows = []
          this.episodes = []
          this.artists = []
        }
        if (data.albums) {
          this.albums = data.albums.items
          this.nextAlbums = data.albums.next

          this.loadMorePlaylist = false
          this.loadMoreTracks = false
          this.loadMoreAlbums = true
          this.loadMoreShows = false
          this.loadMoreEpisodes = false
          this.loadMoreArtist = false

          this.playlists = []
          this.tracks = []
          this.shows = []
          this.episodes = []
          this.artists = []
        }
        if (data.episodes) {
          this.episodes = data.episodes.items
          this.nextEpisodes = data.espisodes.next

          this.loadMorePlaylist = false
          this.loadMoreTracks = false
          this.loadMoreAlbums = false
          this.loadMoreShows = false
          this.loadMoreEpisodes = true
          this.loadMoreArtist = false

          this.playlists = []
          this.tracks = []
          this.albums = []
          this.shows = []
          this.artists = []
        }
        if (data.shows) {
          this.shows = data.shows.items
          this.nextShows = data.shows.next

          this.loadMorePlaylist = false
          this.loadMoreTracks = false
          this.loadMoreAlbums = false
          this.loadMoreShows = true
          this.loadMoreEpisodes = false
          this.loadMoreArtist = false

          this.playlists = []
          this.tracks = []
          this.albums = []
          this.episodes = []
          this.artists = []
        }
      })()
    },
    change (event) {
      this.selected = event.target.value
    },
    nextArtist () {
      (async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-Type': 'application/json'
          }
        }
        const response = await axios.get(this.nextArtists, config)
        const data = response.data
        if (data.artists.next) {
          this.nextArtists = data.artists.next
        } else {
          this.loadMoreArtist = false
        }
        this.artists = [...this.artists, ...data.artists.items]
        console.log(data)
      })()
    },
    nextTrack () {
      (async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-Type': 'application/json'
          }
        }
        const response = await axios.get(this.nextTracks, config)
        const data = response.data
        if (data.tracks.next) {
          this.nextTracks = data.tracks.next
        } else {
          this.loadMoreTracks = false
        }
        this.tracks = [...this.tracks, ...data.tracks.items]
        console.log(data)
      })()
    },
    nextAlbum () {
      (async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-Type': 'application/json'
          }
        }
        const response = await axios.get(this.nextAlbums, config)
        const data = response.data
        if (data.albums.next) {
          this.nextAlbums = data.albums.next
        } else {
          this.loadMoreAlbums = false
        }
        this.albums = [...this.albums, ...data.albums.items]
        console.log(data)
      })()
    },
    nextPlaylist () {
      (async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-Type': 'application/json'
          }
        }
        const response = await axios.get(this.nextPlaylists, config)
        const data = response.data
        if (data.playlists.next) {
          this.nextPlaylists = data.playlists.next
        } else {
          this.loadMorePlaylist = false
        }
        this.playlists = [...this.playlists, ...data.playlists.items]
        console.log(data)
      })()
    },
    nextShow () {
      (async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-Type': 'application/json'
          }
        }
        const response = await axios.get(this.nextShows, config)
        const data = response.data
        if (data.shows.next) {
          this.nextShows = data.shows.next
        } else {
          this.loadMorePlaylist = false
        }
        this.shows = [...this.shows, ...data.shows.items]
        console.log(data)
      })()
    },
    nextEpisode () {
      (async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
            'Content-Type': 'application/json'
          }
        }
        const response = await axios.get(this.nextEpisodes, config)
        const data = response.data
        if (data.episodes.next) {
          this.nextEpisodes = data.episodes.next
        } else {
          this.loadMoreEpisodes = false
        }
        this.episodes = [...this.episodes, ...data.episodes.items]
        console.log(data)
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
input{
  width: 800px;
  height: 40px;
  border: none;
  outline: none;
  background: rgba(255,255,255, 0.2);
  border-radius: 15px;
  color: white;
  font-size: 2rem;
  padding-left: 10px;
  margin: 10px 10px;
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

select {
  width: 100px;
  height: 40px;
  margin: 0px 10px;
  border-radius: 15px;
  background: rgba(255,255,255, 0.2);
  border: none;
  color: white;
  padding-left: 5px;
  font-size: 2rem
}

option {
  padding-left: 5px;
  font-size: 2rem;
  background: transparent;
}
option:active{
  outline: 1px solid aqua;
}

.load-more {
  width: 200px;
  height: 200px;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: white;
  font-size: 2rem;
}
.load-more:hover {
  color: aqua;
  outline: 2px solid aqua;
}
</style>
