<template>
    <div class="card-container">
        <p class="title">{{ track.name }}</p>
        <p>Artists: {{ track.artists.map(item => item.name).join(', ') }}</p>
        <p>Type: <strong>Track</strong></p>
    </div>
</template>

<script>
export default {
  props: {
    track: {
      type: Object,
      default (rawProps) {
        return {
          name: 'track name',
          artists: [{
            name: 'Artist name'
          }]
        }
      }
    }
  }
}
</script>

<style scoped>
.card-container {
    display: flex;
    width: 200px;
    height: 230px;
    border-radius: 15px;
    margin: 20px;
    background-size: contain;
    position: relative;
    flex-wrap: wrap;
}

.card-container::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-image: linear-gradient(rgba(0,0,0, 0.8), rgba(0,0,0, 0.2)), url("@/assets/category.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  filter: grayscale(100%) blur(2px);
  z-index: 0;
  opacity: 0.4;
  transition: all 0.4s;
  border-radius: 15px;
}

.card-container:hover::before {
  cursor: pointer;
  filter: none;
  outline: 3px solid rgb(0, 255, 208);
  opacity: 1;
  z-index: -1;
}

.card-container p {
    display: block;
    text-align: center;
    font-size: 2rem;
    color: white;
    text-transform: capitalize;
    cursor: pointer;
    place-self: center;
    padding-right: 50px;
    letter-spacing: 0.2rem;
    margin-left: 35px;
}

.card-container .title {
  font-size: 2.3rem;
}

</style>
