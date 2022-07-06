import axios from 'axios'
import {
  userEndpoints,
  tracksEndpoints,
  categoriesEndpoints,
  playlistEndpoints,
  showsEndpoints,
  albumsEndpoints,
  episodesEndpoints
} from './endpoints'

export const userData = async (basicConfig) => {
  const userInfoResponse = await axios.get(
    userEndpoints.currentUser,
    basicConfig
  )
  const userInfo = userInfoResponse.data
  return userInfo
}

export const userTracks = async (basicConfig) => {
  const userTracksResponse = await axios.get(
    tracksEndpoints.UserSavedTracks,
    basicConfig
  )
  const userTracks = userTracksResponse.data
  return userTracks
}

export const categories = async (config) => {
  const response = await axios.get(
    `${categoriesEndpoints.getCategories}?country=${localStorage.getItem(
      'COUNTRY'
    )}`,
    config
  )
  const categoryData = response.data
  return categoryData
}

export const playlists = async (config) => {
  const response = await axios.get(playlistEndpoints.userPlaylists, config)
  const playlists = response.data
  return playlists
}

export const saveTrack = async (id) => {
  await fetch(`${tracksEndpoints.saveTracks}?ids=${id}`, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}

export const removeTrack = async (id) => {
  await fetch(`${tracksEndpoints.saveTracks}?ids=${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}

export const checkSavedTracks = async (id) => {
  const response = await axios.get(tracksEndpoints.checkUserSavedTracks(id), {
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
  const data = response.data[0]
  return data
}

export const followPlaylist = async (id) => {
  await fetch(playlistEndpoints.followPlaylist(id), {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    },
    body: {
      public: true
    }
  })
}

export const unfollowPlaylist = async (id) => {
  await fetch(playlistEndpoints.followPlaylist(id), {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN')
    }
  })
}

export const checkUserPlaylist = async (id, userId) => {
  const followResponse = await axios.get(
    playlistEndpoints.checkUserPlaylist(id, userId),
    {
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
        'Content-Type': 'application/json'
      }
    }
  )
  const followPlaylist = followResponse.data
  return followPlaylist
}

export const followAlbum = async (id) => {
  await fetch(albumsEndpoints.putSaveAlbums(id), {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}

export const unfollowAlbum = async (id) => {
  await fetch(albumsEndpoints.deleteRemoveAlbum(id), {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}

export const checkSavedAlbum = async (id) => {
  const response = await axios.get(albumsEndpoints.checkSavedAlbums(id), {
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
  const data = response.data
  return data
}

export const followShow = async (id) => {
  await fetch(showsEndpoints.saveShow(id), {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}

export const unfollowShow = async (id) => {
  await fetch(showsEndpoints.removeShow(id), {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}

export const checkUserSavedShow = async (id) => {
  const response = await axios.get(showsEndpoints.checkUserSavedShow(id), {
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
  const data = response.data[0]
  return data
}

export const saveUserEpisode = async (id) => {
  await fetch(episodesEndpoints.saveEpisode(id), {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}

export const removeUserEpisode = async (id) => {
  await fetch(episodesEndpoints.removeEpisode(id), {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
}

export const checkUserEpisodes = async (id) => {
  const response = await axios.get(episodesEndpoints.checkSavedEpisodes(id), {
    headers: {
      Authorization: 'Bearer' + ' ' + localStorage.getItem('ACCESS_TOKEN'),
      'Content-Type': 'application/json'
    }
  })
  const data = response.data[0]
  return data
}
