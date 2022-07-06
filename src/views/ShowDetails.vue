<template>
  <show-layout>
    <template #aside>
      <user-info
        :userInfo="userInfo"
        :isPlaying="playing"
        :progress="totalSeconds"
        :trackDuration="trackDuration"
        :trackName="trackName"
      />
    </template>
    <template #upper>
      <show-thumbnail
        :show="show"
        :src="src"
        :playShow="playShow"
        @follow="follow"
        @unfollow="unfollow"
      />
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
            @like="like"
            @unlike="unlike"
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

import { showsEndpoints } from '@/api/endpoints'
import {
  followShow,
  removeUserEpisode,
  saveUserEpisode,
  userData,
  unfollowShow
} from '@/api/callFunctions'
import {
  resume,
  nextElement,
  prevElement,
  pauseElement,
  playElement,
  playCollection,
  currentSong
} from '@/api/playercontrols'

export default {
  components: {
    ShowThumbnail,
    ShowLayout,
    UserInfo,
    EpisodeRow
  },
  watch: {
    async totalSeconds(oldVal) {
      if (oldVal >= this.trackDuration) {
        clearInterval(this.interval)
        setTimeout(async () => {
          const currentTrack = await currentSong(this.config)
          this.trackName = currentTrack.item.name
          this.trackDuration = currentTrack.item.duration_ms
          this.totalSeconds = 0
          this.totalSeconds = currentTrack.progress_ms
          this.playing = false
          this.timer()
        }, 1000)
      }
    }
  },
  async created() {
    const id = this.$route.params.id

    this.userInfo = await userData(this.config)

    const showResponse = await axios.get(
      showsEndpoints.getShow(id),
      this.config
    )
    this.show = showResponse.data
    this.showUri = showResponse.data.uri

    this.src = showResponse.data.images[0]
      ? showResponse.data.images[0].url
      : undefined

    const episodesResponse = await axios.get(
      showsEndpoints.getEpisodes(id),
      this.config
    )
    this.episodesUris = episodesResponse.data.items.map(
      (episode) => episode.uri
    )
    this.episodes = episodesResponse.data.items
    if (episodesResponse.data.next) {
      this.next = episodesResponse.data.next
    }

    const currentTrack = await currentSong(this.config)
    this.trackName = currentTrack.item.name
    this.trackDuration = currentTrack.item.duration_ms
    this.totalSeconds = currentTrack.progress_ms
    if (currentTrack.is_playing == true) {
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
      trackName: '',
      trackDuration: 0,
      playing: true,
      totalSeconds: 0,
      interval: undefined,
      config: {
        headers: {
          Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
          'Content-Type': 'application/json'
        }
      }
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
      clearInterval(this.interval)
      playCollection(uri)
      this.playing = false
      setTimeout(async () => {
        const currentTrack = await currentSong(this.config)
        this.trackDuration = currentTrack.duration_ms
        this.totalSeconds = 0
        this.totalSeconds = currentTrack.progress_ms
        this.timer()
      }, 3000)
    },
    async playEpisode(duration, name, uri) {
      clearInterval(this.interval)
      playElement(0, [uri])
      this.playing = false
      setTimeout(async () => {
        const currentTrack = await currentSong(this.config)
        this.trackDuration = duration
        this.trackName = name
        this.totalSeconds = 0
        this.totalSeconds = currentTrack.progress_ms
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
      return
    },
    async nextTrack() {
      return
    },
    async pause() {
      clearInterval(this.interval)
      pauseElement()
      this.playing = true
    },
    async play() {
      resume()
      this.playing = false
      setTimeout(async () => {
        const currentTrack = await currentSong(this.config)
        this.totalSeconds = 0
        this.totalSeconds = currentTrack.progress_ms
        this.playing = false
        this.timer()
      })
    },
    async follow(id) {
      await followShow(id)
    },
    async unfollow(id) {
      await unfollowShow(id)
    },
    async like(id) {
      await saveUserEpisode(id)
    },
    async unlike(id) {
      await removeUserEpisode(id)
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
