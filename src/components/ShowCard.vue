<template>
    <div class="card-container" @click=goToShowDetails>
        <p class="title">{{ show.name }}</p>
        <p class="author"><strong>Author: {{ show.publisher }}</strong></p>
        <p>Type: <strong>Show</strong></p>
    </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Object,
      default (rawProps) {
        return {
          publisher: 'author',
          name: 'show name',
          id: ''
        }
      }
    }
  },
  methods: {
    goToShowDetails () {
        this.$router.push({name: 'show details', params: {
            id: this.show.id
        } })
    }
  }
}
</script>

<style scoped>
.card-container {
    display: flex;
    width: 280px;
    height: auto;
    border-radius: 15px;
    margin: 20px;
    background-size: contain;
    position: relative;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
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
  outline: 3px solid rgb(106, 0, 255);
  opacity: 1;
  z-index: -1;
}

.card-container p {
    text-align: center;
    font-size: 2rem;
    color: white;
    text-transform: capitalize;
    cursor: pointer;
    letter-spacing: 0.2rem;
    margin: 10px 0;
    padding: 0 20px;
}

.card-container .title {
  font-size: 2.3rem;
}

</style>
