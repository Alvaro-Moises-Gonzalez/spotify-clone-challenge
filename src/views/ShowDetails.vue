<template>
  <show-layout>
    <template #aside>
      <user-info
        :userInfo="userInfo"
        :isPlaying="playing"
        :progress="totalSeconds"
        :trackDuration="trackDuration"
        :trackName="currentTrack"
      />
    </template>
    <template #upper>
      <show-thumbnail :show="show" :src="src" :playShow="playShow" />
    </template>
    <template #bottom>
      <table>
        <tr class="table-header">
          <th class="number">#</th>
          <th class="title">title</th>
          <th class="description">description</th>
          <th class="date">date</th>
          <th class="duration">duration</th>
        </tr>
        <transition-group appear @enter="enter" @beforeEnter="beforeEnter">
          <episode-row
            v-for="(episode, index) in episodes"
            :key="index"
            :data-index="index"
            :episodeNumber="index + 1"
            :episode="episode"
            @playEpisode="playEpisode"
          />
        </transition-group>
        <button v-if="next" @click="nextEpisodes" class="more-episodes">
          more
        </button>
      </table>
    </template>
  </show-layout>
</template>

<script>
import ShowThumbnail from '@/components/ShowThumbnail.vue'
import ShowLayout from '@/Layout/ShowLayout.vue'
import UserInfo from '@/components/UserInfo.vue'
import EpisodeRow from '@/components/EpisodeRow.vue'
import axios from 'axios'
import gsap from 'gsap'

import { playerEndpoints, showsEndpoints, userEndpoints } from '@/api/endpoints'

export default {
  components: {
    ShowThumbnail,
    ShowLayout,
    UserInfo,
    EpisodeRow
  },
  async created() {
    const id = this.$route.params.id
    const config = {
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
        'Content-Type': 'application/json'
      }
    }

    const userInfoResponse = await axios.get(userEndpoints.currentUser, config)
    this.userInfo = userInfoResponse.data

    const showResponse = await axios.get(showsEndpoints.getShow(id), config)
    this.show = showResponse.data
    this.showUri = showResponse.data.uri

    this.src = showResponse.data.images[0]
      ? showResponse.data.images[0].url
      : undefined

    const episodesResponse = await axios.get(
      showsEndpoints.getEpisodes(id),
      config
    )
    this.episodesUris = episodesResponse.data.items.map(
      (episode) => episode.uri
    )
    this.episodes = episodesResponse.data.items
    if (episodesResponse.data.next) {
      this.next = episodesResponse.data.next
    }
    const currentResponse = await axios.get(
      playerEndpoints.currentlyPlaying,
      config
    )
    const currentData = currentResponse.data
    this.currentTrack = currentData.item.name
    this.trackDuration = currentData.item.duration_ms
    this.totalSeconds = currentData.progress_ms
    if (currentData.is_playing == true) {
      this.playing = false
      this.timer()
    }
  },
  data() {
    return {
      src: undefined,
      show: undefined,
      userInfo: undefined,
      episodes: undefined,
      next: undefined,
      showUri: undefined,
      episodesUris: undefined,
      currentTrack: '',
      trackDuration: 0,
      playing: true,
      totalSeconds: 0,
      interval: undefined
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
    async nextEpisodes() {
      const config = {
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
          'Content-Type': 'application/json'
        }
      }
      const moreEpisodes = await axios.get(this.next, config)
      this.episodes = [...this.episodes, ...moreEpisodes.data.items]
      if (moreEpisodes.data.next) {
        this.next = moreEpisodes.data.next
      } else {
        this.next = undefined
      }
    },
    async playShow() {
      const uri = this.showUri
      const config = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context_uri: `${uri}`,
          offset: {
            position: '0'
          },
          position_ms: '0'
        })
      }
      await fetch(playerEndpoints.startResumePlayback, config)
      clearInterval(this.interval)
      setTimeout(async () => {
        const currentResponse = await axios.get(
          playerEndpoints.currentlyPlaying,
          config
        )
        const currentData = currentResponse.data
        this.currentTrack = currentData.item.name
        this.trackDuration = currentData.item.duration_ms
        this.totalSeconds = currentData.progress_ms
        this.playing = false
        this.timer()
      }, 2000)
    },
    async playEpisode(number) {
      const config = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: this.episodesUris,
          offset: {
            position: `${number}`
          },
          position_ms: '0'
        })
      }
      await fetch(playerEndpoints.startResumePlayback, config)
      clearInterval(this.interval)
      setTimeout(async () => {
        const currentResponse = await axios.get(
          playerEndpoints.currentlyPlaying,
          config
        )
        const currentData = currentResponse.data
        this.currentTrack = currentData.item.name
        this.trackDuration = currentData.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentData.progress_ms
        this.playing = false
        this.timer()
      }, 3000)
    },
    timer() {
      const addSeconds = () => {
        this.totalSeconds += 110
      }
      this.interval = setInterval(addSeconds, 100)
    },
    async prevTrack() {
      clearInterval(this.interval)
      await fetch(playerEndpoints.skiptoPrevius, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        }
      })
      setTimeout(async () => {
        const currentResponse = await axios.get(
          playerEndpoints.currentlyPlaying,
          {
            headers: {
              Authorization:
                'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
              'Content-Type': 'application/json'
            }
          }
        )
        const currentData = currentResponse.data
        this.currentTrack = currentData.item.name
        this.trackDuration = currentData.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentData.progress_ms
        this.playing = false
        this.timer()
      }, 3000)
    },
    async nextTrack() {
      clearInterval(this.interval)
      const config = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          clear_preloaded: 'true',
          play: 'false'
        })
      }
      await fetch(playerEndpoints.skipToNext, config)
      setTimeout(async () => {
        const currentResponse = await axios.get(
          playerEndpoints.currentlyPlaying,
          config
        )
        const currentData = currentResponse.data
        this.currentTrack = currentData.item.name
        this.trackDuration = currentData.item.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentData.progress_ms
        this.playing = false
        this.timer()
      }, 3000)
    },
    async pause() {
      const config = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        }
      }
      await fetch(playerEndpoints.pausePlayback, config)
      this.playing = true
      clearInterval(this.interval)
    },
    async play() {
      const config = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'application/json'
        }
      }
      await fetch(playerEndpoints.startResumePlayback, config)
      this.playing = false
      setTimeout(async () => {
        const currentResponse = await axios.get(
          playerEndpoints.currentlyPlaying,
          config
        )
        const currentData = currentResponse.data
        this.currentTrack = currentData.item.name
        this.trackDuration = currentData.item.duration_ms
        this.totalSeconds = currentData.progress_ms
        this.playing = false
        this.timer()
      })
    }
  },
  provide() {
    return {
      nextTrack: this.nextTrack,
      prevTrack: this.prevTrack,
      pause: this.pause,
      play: this.play
    }
  }
}
</script>

<style>
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
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2));
}
th::before {
  content: ' ';
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
.number {
  width: 20px;
}
.title {
  width: 300px;
}
.duration {
  width: 100px;
}
.date {
  width: 150px;
}
.description {
  width: 400px;
}

.more-episodes {
  width: 100px;
  height: 60px;
  border: none;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 2rem;
  border-radius: 15px;
  margin: 10px;
}

.more-episodes:hover {
  outline: 2px solid aqua;
  color: aqua;
}
</style>
