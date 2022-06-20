<template>
  <header>
    <p>Wolf's Music</p>
  </header>
  <div class="container" >
    <p>Create, share, discover your favorites spotify's tracks and playlist</p>
    <button @click=login >LogIn <img src="../assets/Spotify_Logo_CMYK_White.png" alt="spotify logo"/></button>
  </div>
  <footer>
    <p>Create, share, discover your favorites spotify's tracks and playlist from Spotify</p>
  </footer>
</template>

<script>
import { challenge } from '@/utils/sha256'
import { generateRandomString } from '@/utils/generateRandomString'
import { scopes } from '@/utils/scopesArray'
// @ is an alias to /src
export default {
  setup () {
    const login = () => {
      let url = 'https://accounts.spotify.com/authorize?'
      url += 'response_type=code'
      url += `&client_id=${process.env.VUE_APP_CLIENT_ID}`
      url += '&redirect_uri=' + encodeURI(process.env.VUE_APP_REDIRECT_URI)
      url += `&state="${generateRandomString(16)}"`
      url += `&scope=${encodeURIComponent(scopes.join(' '))}`
      url += '&code_challenge_method="s256"'
      url += `&challenge=${challenge}`
      window.location.href = url
    }
    return { login }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

header{
  background-color: rgb(38, 13, 38);
  height: 60px;
}
header p{
  color: white;
  font-size: 3rem;
  padding: 20px;
  margin-bottom: 15px;
  display: inline-block;
  font-family: 'Great Vibes', sans-serif;
  letter-spacing: 0.2rem;
}
.container {
  height: 600px;
  background: linear-gradient(rgba(0,0,0, 0.8), rgba(0,0,0, 0.2)), url("../assets/background-landing.jpg");
  background-size: cover;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.container p{
  color: white;
  font-size: 4rem;
  display: inline-block;
  width: 300px;
  font-family: 'Jost', sans-serif;
  margin-left: 40px;
}
.container button {
  width: 250px;
  height: 60px;
  margin-right: 50px;
  font-size: 2.5rem;
  color: white;
  background-color: rgb(33, 193, 33);
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: color 0.4s;
}
.container button:hover{
  background-color: rgb(20, 150, 20);
}

footer{
  background-color: rgb(72, 20, 72);
  height: 70px;
}
footer p {
  color: white;
  padding: 20px;
  font-size: 2rem;
}

button img{
  width: 90px;
  height: 30px;
  margin-left: 20px;
}
</style>
