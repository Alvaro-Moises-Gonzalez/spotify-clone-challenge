<template>
  <layout-screen>
    <template #aside>
      <user-info :userInfo="userInfo" />
    </template>
    <template #upper>
      <label>
        <input
          type="text"
          placeholder="Search playlist, tracks and more...."
          v-model="value"
        />
        <select value="artist" @change="change($event)">
          <option value="artist">Artist</option>
          <option value="track">Track</option>
          <option value="album">Album</option>
          <option value="show">Show</option>
          <option value="playlist">Playlist</option>
          <option value="episode">Episode</option>
        </select>
        <button @click="fetchSearch"><i class="fas fa-search"></i></button>
      </label>
    </template>
    <template #bottom>
      <transition-group appear @beforeEnter="beforeEnter" @enter="enter">
        <artist-card
          v-for="(artist, index) in artists"
          :key="index"
          :artist="artist"
        />
        <album-card
          v-for="(album, index) in albums"
          :key="index"
          :album="album"
        />
        <track-card
          v-for="(card, index) in tracks"
          :key="index"
          :track="card"
        />
        <playlist-card
          v-for="(playlist, index) in playlists"
          :key="index"
          :playlist="playlist"
        />
        <show-card v-for="(show, index) in shows" :key="index" :show="show" />
        <episode-card
          v-for="(card, index) in episodes"
          :key="index"
          :title="card.name"
        />
        <button class="load-more" v-if="next" @click="nextLoad">More</button>
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
import UserInfo from '@/components/UserInfo.vue'
import gsap from 'gsap'
import { searchEndpoint, userEndpoints } from '@/api/endpoints'
import { config } from '@/api/config'
import axios from 'axios'

export default {
  components: {
    LayoutScreen,
    ArtistCard,
    AlbumCard,
    TrackCard,
    PlaylistCard,
    ShowCard,
    EpisodeCard,
    UserInfo
  },
  data() {
    return {
      value: '',
      albums: [],
      artists: [],
      tracks: [],
      episodes: [],
      playlists: [],
      shows: [],
      selected: 'artist',
      next: undefined,
      userInfo: undefined
    }
  },
  methods: {
    async fetchSearch() {
      const response = await axios.get(
        `${searchEndpoint(
          this.value,
          this.selected
        )}&country=${localStorage.getItem(
          'COUNTRY'
        )}&market=${localStorage.getItem('COUNTRY')}`,
        config
      )
      const data = response.data
      if (data.playlists) {
        this.playlists = data.playlists.items
        if (data.playlists.next) {
          this.next = data.playlists.next
        } else {
          this.next = undefined
        }

        this.tracks = []
        this.albums = []
        this.shows = []
        this.episodes = []
        this.artists = []
      }
      if (data.artists) {
        this.artists = data.artists.items
        if (data.artists.next) {
          this.next = data.artists.next
        } else {
          this.next = undefined
        }

        this.playlists = []
        this.tracks = []
        this.albums = []
        this.shows = []
        this.episodes = []
      }
      if (data.tracks) {
        this.tracks = data.tracks.items
        if (data.tracks.next) {
          this.next = data.tracks.next
        } else {
          this.next = undefined
        }

        this.playlists = []
        this.albums = []
        this.shows = []
        this.episodes = []
        this.artists = []
      }
      if (data.albums) {
        this.albums = data.albums.items
        if (data.albums.next) {
          this.next = data.albums.next
        } else {
          this.next = undefined
        }

        this.playlists = []
        this.tracks = []
        this.shows = []
        this.episodes = []
        this.artists = []
      }
      if (data.episodes) {
        this.episodes = data.episodes.items
        if (data.episodes.next) {
          this.next = data.episodes.next
        } else {
          this.next = undefined
        }

        this.playlists = []
        this.tracks = []
        this.albums = []
        this.shows = []
        this.artists = []
      }
      if (data.shows) {
        this.shows = data.shows.items
        if (data.shows.next) {
          this.next = data.shows.next
        } else {
          this.next = undefined
        }
        this.playlists = []
        this.tracks = []
        this.albums = []
        this.episodes = []
        this.artists = []
      }
    },
    change(event) {
      this.selected = event.target.value
    },
    async nextLoad() {
      const nextLoad = await axios.get(this.next, config)
      const nextData = nextLoad.data
      if (nextData.artists) {
        this.artists = [...this.artists, ...nextData.artists.items]
        if (nextData.artists.next) {
          this.next = nextData.artists.next
        } else {
          this.next = undefined
        }
      }

      if (nextData.albums) {
        this.albums = [...this.albums, ...nextData.albums.items]
        if (nextData.albums.next) {
          this.next = nextData.albums.next
        } else {
          this.next = undefined
        }
      }

      if (nextData.tracks) {
        this.tracks = [...this.tracks, ...nextData.tracks.items]
        if (nextData.tracks.next) {
          this.next = nextData.tracks.next
        } else {
          this.next = undefined
        }
      }

      if (nextData.shows) {
        this.shows = [...this.shows, ...nextData.shows.items]
        if (nextData.shows.next) {
          this.next = nextData.shows.next
        } else {
          this.next = undefined
        }
      }

      if (nextData.episodes) {
        this.episodes = [...this.episodes, ...nextData.episodes.items]
        if (nextData.tracks.next) {
          this.next = nextData.episodes.next
        } else {
          this.next = undefined
        }
      }

      if (nextData.playlists) {
        this.playlists = [...this.playlists, ...nextData.playlists.items]
        if (nextData.playlists.next) {
          this.next = nextData.playlits.next
        } else {
          this.next = undefined
        }
      }
    },
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
    }
  },
  async created() {
    const userInfoResponse = await axios.get(userEndpoints.currentUser, config)
    this.userInfo = userInfoResponse.data
  }
}
</script>

<style scoped>
input {
  min-width: 80%;
  height: 40px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  color: white;
  font-size: 2rem;
  padding-left: 10px;
  margin: 10px 10px;
}
::placeholder {
  color: white;
  font-size: 2rem;
  padding: 20px;
}
input[type='text']:focus {
  outline: 1px solid aqua;
}
label button {
  width: 50px;
  height: 50px;
  font-size: 2rem;
  background: rgba(0, 0, 0, 0.2);
  outline: none;
  border: none;
  border-radius: 50%;
  color: white;
}
label button:hover {
  color: aqua;
  outline: 1px solid aqua;
}
.search-results {
  position: absolute;
  width: 980px;
  height: 560px;
  background: rgba(80, 0, 0, 0.2);
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
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding-left: 5px;
  font-size: 2rem;
}

option {
  padding-left: 5px;
  font-size: 2rem;
  background: transparent;
}
option:active {
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
