<template>
  <div class="wrapper">
    <aside class="sideBar">
      <slot name="aside"></slot>
    </aside>
    <div class="two-piles">
      <div class="upper-container">
        <slot name="upper"></slot>
      </div>
      <div class="bottom-container">
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>
</template>


<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr;
  background: linear-gradient(
      180deg,
      rgba(2, 0, 36, 0.8) 0%,
      rgba(10, 10, 68, 0.2) 41%,
      rgba(154, 0, 255, 0.1) 100%
    ),
    url('../assets/home-background.jpg');
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  gap: 10px;
}
.two-piles {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.upper-container {
  margin: 10px 0;
}
.bottom-container {
  display: flex;
  flex-wrap: wrap;
  background: rgba(0, 0, 0, 0.2);
  min-width: 75vw;
  height: 85vh;
  margin-right: 10px;
  border-radius: 15px;
  overflow-y: scroll;
  justify-content: center;
}
</style>
