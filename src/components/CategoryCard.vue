<template>
    <div class="card-container" @click=goToDetails>
        <p>{{ category.name }}</p>
    </div>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      default (rawProps) {
        return {
          name: '',
          id: ''
        }
      }
    }
  },
  methods: {
    goToDetails () {
      this.$router.push({ name: 'category details', params: { id: this.id } })
    }
  },
  data () {
    return {
      id: this.category.id
    }
  }
}
</script>

<style scoped>
.card-container {
    display: flex;
    width: 250px;
    height: 230px;
    border-radius: 15px;
    margin: 20px;
    background-size: contain;
    position: relative;
    align-content: center;
    justify-content: center;
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
  border: 1px solid aqua;
  opacity: 1;
  z-index: -1;
}

.card-container p {
    display: block;
    text-align: center;
    font-size: 2.5rem;
    color: white;
    text-transform: capitalize;
    cursor: pointer;
    align-self: center;
    letter-spacing: 0.2rem;
    justify-self: center;
}
</style>
