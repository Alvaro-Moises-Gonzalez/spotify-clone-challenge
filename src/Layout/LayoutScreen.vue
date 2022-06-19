<template>
  <div class="wrapper">
    <user-info />
    <div class="two-piles">
      <div class="upper-container">
        <slot name="upper"></slot>
      </div>
      <div class="bottom-container">
        <slot name="bottom"></slot>
      </div>
    </div>
    <div class="music-player"></div>
  </div>
</template>

<script>
import UserInfo from '@/components/UserInfo.vue'
export default {
  components: {
    UserInfo
  }
}
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-wrap: wrap;
    background: linear-gradient(180deg, rgba(2,0,36,0.8) 0%, rgba(10,10,68,0.2) 41%, rgba(154,0,255,0.1) 100%), url("../assets/home-background.jpg");
    background-attachment: fixed;
    gap: 5px;
}
.two-piles{
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.upper-container{
  margin: 10px 0;
}
.bottom-container{
  display: flex;
  flex-wrap: wrap;
  background: rgba(0,0,0, 0.2);
  width: 980px;
  height: 550px;
  margin-left: 10px;
  border-radius: 15px;
  overflow-y: scroll;
}
.music-player{
  width: 100%;
  height: 60px;
  background-color: rgb(11, 8, 31);
  position: sticky;
  bottom: 0;
}
</style>
