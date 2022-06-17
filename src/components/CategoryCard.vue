<template>
    <div class="card-container">
        <img src="@/assets/placeholder.jpg" alt="category image" />
        <p>{{ title }}</p>
    </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Category name'
    }
  }
}
</script>

<style scoped>
.card-container {
    width: 200px;
    height: 230px;
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.1));
    border-radius: 15px;
    margin: 20px;
}
.card-container img {
    width: 200px;
    height: 200px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}
.card-container p {
    text-align: center;
    font-size: 2rem;
    color: white;
}
</style>
