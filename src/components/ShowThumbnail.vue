<template>
  <div class="wrapper">
    <img v-if="src" :src="src" :alt="show.name" />
    <img v-else src="@/assets/album-placeholder.jpg" :alt="show.name" />
    <div class="show-info">
      <p class="publisher">{{ show.publisher }}</p>
      <p :v-if="show.explicit">Explicit Content</p>
      <p :v-if="show.copyrights">{{ show.copyrights.join(', ') }}</p>
      <p>{{ show.description }}</p>
      <p>Total epísodes: {{ show.total_episodes }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Object,
      default(rawProps) {
        return {
            copyrights: [],
            explicit: false,
            description: '',
            name: '',
            total_episodes: 0,
            publisher: ''
        }
      }
    },
    src: {
      type: String
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  height: auto;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
}

.show-info {
  display: grid;
  grid-template: auto / 1fr;
  color: white;
  font-size: 2rem;
}
img {
  width: 150px;
  height: 150px;
  border-radius: 15px;
  margin: 10px;
}

.publisher {
  font-size: 2.5rem;
  margin-top: 10px;
}

.date {
  font-size: 1.8rem;
}
p {
  margin-left: 5px;
}
</style>
