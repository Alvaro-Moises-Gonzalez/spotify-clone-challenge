<template>
   <div class="user-info">
            <img src="@/assets/placeholder.jpg" alt="foto de perfil" />
            <p>John Doe</p>
            <p class="email">john@email.com</p>
            <router-link :to="{ path: '/home' }"><button><span><i class="fa fa-home-alt icon"></i></span>Home</button></router-link>
            <router-link :to="{ path: '/search'}"><button><span><i class="fas fa-search icon"></i></span>Search</button></router-link>
            <router-link :to="{ path: '/playlist'}"><button><span><i class="fas fa-book ico"></i></span>My Playlists</button></router-link>
            <router-link :to="{ path: '/'}"><button class="logout-btn">Logout</button></router-link>
        </div>
</template>

<style scoped>
.user-info {
    width: auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(rgba(0,0,0, 0.8), rgba(0,0,0, 0.2));
    position: relative;
}
.user-info img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 40px;
}
.user-info p{
  color: white;
  text-align: center;
  font-size: 3rem;
  margin: 20px 0px;
}
.user-info .email{
  font-size: 1.5rem;
  margin: 5px 0px 15px 0px;
}

button {
  background-color: transparent;
  border: none;
  text-align: left;
  margin-left: 20px;
  color: white;
  font-size: 2rem;
  margin-bottom: 10px;
  border-bottom: 1px solid transparent;
  margin-right: 10px;
}
button span{
  margin-right: 10px;
}
button:hover{
  color: aqua;
  border-bottom: 1px solid aqua;

}
.logout-btn{
  position: absolute;
  bottom: 15px;
  background: rgba(0,0,0, 0.3);
  width: 100px;
  height: 60px;
  border-radius: 15px;
  text-align: center;
  color: white;
  border: 1px solid transparent;
}
.logout-btn:hover{
  border: 1px solid aqua;
}
</style>
