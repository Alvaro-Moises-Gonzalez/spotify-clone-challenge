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
    display: flex;
    flex-wrap: wrap;
    background: linear-gradient(180deg, rgba(2,0,36,0.8) 0%, rgba(10,10,68,0.2) 41%, rgba(154,0,255,0.1) 100%), url("../assets/background-detail.jpg");
    background-attachment: fixed;
    background-size: cover;
    gap: 5px;
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
  width: 980px;
  height: 400px;
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
