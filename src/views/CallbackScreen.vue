<template>
   <div class="container" @load=redirect >
     <div class="redirect">
      <p>Please wait... redirecting to home</p>
      <p>if not redirect please <router-link :to="{ path: '/home'}"><button>click here</button></router-link></p>
    </div>
   </div>
</template>

<script>

</script>

<style scoped>
  .container{
    background-color: rgb(12, 12, 23);
    display: flex;
    place-content: center;
  }
  .redirect{
    width: 600px;
    height: 600px;
    background: linear-gradient(rgba(0,0,0, 0.8), rgba(0,0,0, 0.2)), url("../assets/background-callback.jpg");
    border-radius: 15px;
    background-size: cover;
    margin: 30px 0;
  }
  .redirect {
    color: white;
    font-size: 4rem;
    padding: 50px;
    text-align: center;
  }

  p button{
    width: 90px;
    height: 40px;
    font-size: 1.8rem;
    background-color: rgb(22, 117, 27);
    border: none;
    outline: none;
    border-radius: 15px;
    color: black;
    cursor: pointer;
  }
  p button:hover{
    background-color: rgb(4, 182, 13);
    color: white;
  }
</style>
