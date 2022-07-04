<template>
  <div class="wrapper">
    <slot name="aside"></slot>
    <div class="blocks-container">
      <div class="upper-block">
        <slot name="upper-block"></slot>
      </div>
      <div class="down-block">
       <slot name="rows"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background: linear-gradient(rgba(0,0,0, 0.8), rgba(0,0,0, 0.4)), url('@/assets/background-playlist.jpg');
  background-size: cover;
  display: flex;
}
.blocks-container {
  width: 80%;
  height: auto;
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px
}

.upper-block{
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
}

.down-block {
  background: rgba(0,0,0, 0.2);
  border-radius: 15px;
  max-height: 57vh;
  overflow-y: scroll;
  position: relative;
}
</style>
