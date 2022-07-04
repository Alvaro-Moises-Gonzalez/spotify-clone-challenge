<template>
  <div class="wrapper">
    <button class="backward" @click="prevTrack">
      <i class="fas fa-backward"></i>
    </button>
    <button
      v-if="isPlaying"
      class="media"
      :class="{ active: isPlaying }"
      @click="play"
    >
      <i class="fas fa-play"></i>
    </button>
    <button v-else class="media" @click="pause">
      <i class="fas fa-pause"></i>
    </button>
    <button class="foward" @click="nextTrack">
      <i class="fas fa-forward"></i>
    </button>
    <label class="volume">
      <input type="range"  min="0" max="100" value="25" @change="selected"/>
      <i class="fas fa-volume-up"></i>
    </label>
    <p class="name">{{ trackName }}</p>
    <p>{{ msToMinutes(progress) }}</p>
    <input
      type="range"
      min="0"
      :max="trackDuration"
      :value="progress"
      class="progress"
    />
    <p>{{ msToMinutes(trackDuration) }}</p>
  </div>
</template>

<script>
import { playerEndpoints } from '@/api/endpoints'
export default {
  props: {
    trackName: {
      type: String,
      default: 'default prop'
    },
    trackDuration: {
      type: Number,
      default: 0
    },
    progress: {
      type: Number,
      default: 0
    },
    isPlaying: {
      type: Boolean,
      default: true
    }
  },
  inject: ['nextTrack', 'prevTrack', 'pause', 'play'],
  data() {
    return {
      totalSeconds: 0,
      value: 25
    }
  },
  methods: {
    msToMinutes(ms) {
      var minutes = Math.floor(ms / 60000)
      var seconds = ((ms % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    },
    async selected(event) {
        const volume = event.target.value
        const config = {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
                'Content-Type': 'application/json'
            }
        }
        await fetch(playerEndpoints.setVolume(volume), config)
    }
  }
}
</script>

<style scoped>
.wrapper {
  background: rgba(0, 0, 0, 0.3);
  height: 100px;
  width: 250px;
  place-self: center;
  margin: 10px;
  border-radius: 15px;
  display: grid;
  grid-template: auto / 1fr 1fr 1fr 0.2fr;
  color: white;
}

.media {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  place-self: center;
  margin: 5px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: white;
}

.media:hover {
  outline: 1px solid rgb(68, 255, 47);
  color: rgb(60, 255, 47);
}
.foward {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  justify-self: start;
  align-self: center;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: white;
}
.backward {
  justify-self: end;
  align-self: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: white;
  margin-left: 5px;
}

.backward:hover {
  outline: 1px solid rgb(68, 255, 47);
  color: rgb(68, 255, 47);
  cursor: pointer;
}

.foward:hover {
  outline: 1px solid rgb(68, 255, 47);
  color: rgb(68, 255, 47);
  cursor: pointer;
}

.active {
  color: rgb(60, 255, 47);
  outline: 1px solid rgb(60, 2550, 47);
}

.name {
  grid-column: span 3;
}

p {
  place-self: center;
}

input {
  background: rgba(0, 0, 0, 0.2);
  padding: 0;
  margin: 0;
  place-self: center;
}
.progress {
  width: 12rem;
}
::-moz-range-progress {
  background: rgb(68, 255, 47);
}

::-moz-range-track {
  background-color: rgba(0, 0, 0, 0.3);
}

::-moz-range-thumb {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgb(27, 254, 2);
  border: none;
}

.volume {
  transform: rotate(90deg);
  display: flex;
  grid-row: span 2;
  width: 60px;
  height: 10px;
  margin: 0px;
  place-self: center;
}

.volume input {
    width: 60px;
    transform: rotate(180deg);
    margin: 2px;
}

.volume i {
    margin: 5px;
}
</style>
