<template>
   <div class="container">
     <div class="redirect">
      <p>Please wait... redirecting to home</p>
    </div>
   </div>
</template>

<style scoped>
  .container{
    background-color: rgb(12, 12, 23);
    display: flex;
    place-content: center;
  }
  .redirect{
    display: flex;
    width: 600px;
    height: 600px;
    background: linear-gradient(rgba(0,0,0, 0.8), rgba(0,0,0, 0.2)), url("../assets/background-callback.jpg");
    border-radius: 15px;
    background-size: cover;
    margin: 30px 0;
    align-items: center;
    justify-content: center;
  }
  .redirect {
    color: white;
    font-size: 4rem;
    padding: 150px;
    text-align: center;
  }
</style>
