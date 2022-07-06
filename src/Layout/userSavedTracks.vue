<template>
  <div class="wrapper">
    <aside class="sideBar">
      <slot name="aside"></slot>
    </aside>
    <div class="track-container">
      <slot name="tracks"></slot>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template: 1fr / 1fr 3fr;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)),
    url('@/assets/background-userTracks.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  gap: 10px;
}

.track-container {
  max-width: 70vw;
  background: linear-gradient(rgba(0,0,0, 0.8), rgba(0,0,0, 0.2));
  margin: 10px;
  border-radius: 15px;
}
</style>
