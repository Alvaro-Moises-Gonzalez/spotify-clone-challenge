<template>
  <div class="wrapper">
    <div class="user-info">
      <img src="@/assets/placeholder.jpg" alt="foto de perfil" />
      <button>Inicio</button>
      <button>Buscar</button>
      <button>Biblioteca</button>
    </div>
    <div>
      <div class="categories"></div>
      <div class="playlist"></div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
}
.user-info {
  width: auto;
  height: 700px;
  display: flex;
  flex-direction: column;
  background-color: red;
}
.user-info img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 40px;
}
.categories {
  width: 100%;
  height: 350px;
  background-color: blue;
}
</style>
