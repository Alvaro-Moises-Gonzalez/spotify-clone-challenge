<template>
  <div class="general-wrapper">
    <slot name="aside"></slot>
    <div class="two-rows">
      <div class="upper">
        <slot name="upper"></slot>
      </div>
      <p>PlayLists: </p>
      <div class="bottom">
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.general-wrapper {
    display: grid;
  grid-template: 1fr / 1fr 3fr;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)),
    url('@/assets/background-detail.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  gap: 10px;
}
.two-rows{
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.upper {
  width: 980px;
  height: auto;
  display: flex;
  background: rgba(0,0,0, 0.2);
  margin: 10px 10px;
  border-radius: 15px;
}
.bottom {
  display: flex;
  flex-wrap: wrap;
  background: rgba(0,0,0, 0.2);
  width: 75vw;
  height: 57vh;
  margin-left: 10px;
  border-radius: 15px;
  overflow-y: scroll;
}

p {
  font-size: 3rem;
  color: white;
  margin-left: 10px;
}
</style>
