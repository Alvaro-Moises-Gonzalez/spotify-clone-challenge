import { playerEndpoints } from './endpoints'
import axios from 'axios'

export const playElement = async (position, urisArray) => {
  const uris = [...urisArray]
  const config = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: uris,
      offset: {
        position: `${position}`
      },
      position_ms: '0'
    })
  }
  await fetch(playerEndpoints.startResumePlayback, config)
}

export const playCollection = async (uri) => {
  const config = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      context_uri: uri,
      offset: {
        position: '0'
      },
      position_ms: '0'
    })
  }
  await fetch(playerEndpoints.startResumePlayback, config)
}

export const currentSong = async (config) => {
  const response = await axios.get(playerEndpoints.currentlyPlaying, config)
  const songData = await response.data
  return songData
}

export const resume = async () => {
  const config = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  }
  await fetch(playerEndpoints.startResumePlayback, config)
}

export const nextElement = async () => {
  await fetch(playerEndpoints.skipToNext, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}

export const prevElement = async () => {
  await fetch(playerEndpoints.skiptoPrevius, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}

export const pauseElement = async () => {
  await fetch(playerEndpoints.pausePlayback, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}
