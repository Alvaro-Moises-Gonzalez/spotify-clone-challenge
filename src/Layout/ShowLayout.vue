<template>
  <div class="wrapper">
    <aside class="sideBar">
      <slot name="aside"></slot>
    </aside>
    <div class="two-piles">
      <div class="upper-container">
        <slot name="upper"></slot>
      </div>
      <p>Episodes</p>
      <div class="bottom-container">
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template: 1fr / 1fr 3fr;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)),
    url('@/assets/show-background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  gap: 10px;
}

.sideBar {
  grid-row: 1 / 3;
}
.two-piles {
  display: flex;
  flex-direction: column;
}
.upper-container {
  margin: 0 10px;
  height: auto;
}
.bottom-container {
  display: flex;
  flex-wrap: wrap;
  background: rgba(0, 0, 0, 0.2);
  max-width: 75vw;
  max-height: 60vh;
  margin: 0px 10px;
  border-radius: 15px;
  overflow-y: scroll;
}
 p{
    font-size: 2.5rem;
    margin: 10px 10px;
    color: white;
 }
</style>
