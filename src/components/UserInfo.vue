<template>
  <div class="user-info">
    <img :src="userInfo.images[0].url" alt="foto de perfil" />
    <p>{{ userInfo.display_name }}</p>
    <p class="email">{{ userInfo.email }}</p>
    <p class="country">Country: {{ userInfo.country }}</p>
    <router-link :to="{ path: '/home' }"
      ><button>
        <span><i class="fa fa-home-alt icon"></i></span>Home
      </button></router-link
    >
    <router-link :to="{ path: '/search' }"
      ><button>
        <span><i class="fas fa-search icon"></i></span>Search
      </button></router-link
    >
    <router-link :to="{ path: '/playlist' }"
      ><button>
        <span><i class="fas fa-book ico"></i></span>My Playlists
      </button></router-link
    >
    <button class="logout-btn" @click="logout">Logout</button>
    <music-player :trackName="trackName" :trackDuration="trackDuration" :isPlaying="isPlaying" :progress="progress"/>
  </div>
</template>

<script>
import MusicPlayer from '@/components/MusicPlayer.vue'
import { playerEndpoints } from '@/api/endpoints'
export default {
  methods: {
    async logout() {
      const config = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        }
      }
      await fetch(
        playerEndpoints.pausePlayback,
        config
      )
      localStorage.removeItem('CODE')
      localStorage.removeItem('ACCESS_TOKEN')
      localStorage.removeItem('EXPIRES')
      localStorage.removeItem('REFRESH_TOKEN')
      this.$router.push({ path: '/' })
    }
  },
  props: {
    userInfo: {
      type: Object,
      default(rawProps) {
        return {
          images: ['@/assets/placeholder.jpg'],
          email: '',
          country: '',
          display_name: ''
        }
      }
    },
    trackName: {
        type: String,
        default: 'default from user'
    },
    trackDuration:{
        type: Number,
        default: 10000
    },
    progress: {
        Type: Number,
        default: 0
    },
    isPlaying:{
        type: Boolean,
        default: true
    }
  },
  components: {
    MusicPlayer
  }
}
</script>

<style scoped>
.user-info {
  width: auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2));
  position: relative;
}
.user-info img {
  width: 220px;
  height: 230px;
  border-radius: 50%;
  margin: 20px;
  background-size: contain;
}
.user-info p {
  color: white;
  text-align: center;
  font-size: 3rem;
  margin: 10px 0px;
}
.user-info .email {
  font-size: 1.5rem;
  margin: 5px 0px 5px 0px;
}

.user-info .country {
  font-size: 1.5rem;
  text-align: left;
  margin-left: 35px;
}

button {
  background-color: transparent;
  border: none;
  text-align: left;
  margin-left: 20px;
  color: white;
  font-size: 2rem;
  margin-bottom: 10px;
  border-bottom: 1px solid transparent;
  margin-right: 10px;
}
button span {
  margin-right: 10px;
}
button:hover {
  color: aqua;
  border-bottom: 1px solid aqua;
}
.logout-btn {
  background: rgba(0, 0, 0, 0.3);
  width: 100px;
  height: 60px;
  border-radius: 15px;
  text-align: center;
  color: white;
  border: 1px solid transparent;
}
.logout-btn:hover {
  border: 1px solid aqua;
}
</style>
