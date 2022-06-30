<template>
  <div class="container" @load="redirect">
    <div class="redirect">
      <p>Please wait... redirecting to home</p>
      <p>
        if not redirect please
        <router-link :to="{ path: '/home' }"
          ><button>click here</button></router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import { verifier } from '@/utils/encode64'
import { playerEndpoints } from '@/api/endpoints'
import router from 'vue-router'
export default {
  async created() {


    const query = this.$route.query
    localStorage.setItem('CODE', query.code)
    window.history.replaceState({}, document.title, '/')

    const tokenResponse = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Authorization: `Basic ${process.env.VUE_APP_COMBINED_ID_CLIENT}=`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          redirect_uri: encodeURI(process.env.VUE_APP_REDIRECT_URI),
          code: localStorage.getItem('CODE'),
          code_verifier: verifier,
          client_id: process.env.VUE_APP_CLIENT_ID
        }),
        json: true
      }
    )

    const token = await tokenResponse.json()
    localStorage.setItem('ACCESS_TOKEN', token.access_token)
    localStorage.setItem('REFRESH_TOKEN', token.refresh_token)

    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)
    window.onSpotifyWebPlaybackSDKReady = async () => {
      const player = new window.Spotify.Player({
        name: 'Wolf Music',
        getOAuthToken: async (callback) => {
          const tokenResponse = await fetch(
            'https://accounts.spotify.com/api/token',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded',
                Authorization: `Basic ${process.env.VUE_APP_COMBINED_ID_CLIENT}=`
              },
              body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: encodeURIComponent(localStorage.getItem('REFRESH_TOKEN')),
                client_id: process.env.VUE_APP_CLIENT_ID
              }),
              json: true
            }
          )
          const token = await tokenResponse.json()
          localStorage.setItem('ACCESS_TOKEN', token.access_token)
          callback(token.access_token)
        },
        volume: 0.5
      })

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready to play')
        localStorage.setItem('DEVICE_ID', device_id)
      })

      player.addListener('not_ready', ({ device_id }) => {
        console.log('id offline', device_id)
      })

      await player.connect()
    }

    setTimeout(async () => {
    await fetch(playerEndpoints.putTransferPlayback, {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [`${localStorage.getItem('DEVICE_ID')}`],
        play: 'false'
      }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
      }
    })

        this.$router.push({path: '/home'})
    }, 5000)
  }
}
</script>

<style scoped>
.container {
  background-color: rgb(12, 12, 23);
  display: flex;
  place-content: center;
  min-height: 100vh;
}
.redirect {
  width: 600px;
  height: 600px;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)),
    url('../assets/background-callback.jpg');
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

p button {
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
p button:hover {
  background-color: rgb(4, 182, 13);
  color: white;
}
</style>
