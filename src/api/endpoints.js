// note: in many endpoints it necesary specify user country code on market to get items, as query parameter
const baseURL = 'https://api.spotify.com/v1'

const userEndpoints = {
  currentUser: `${baseURL}/me`,
  getUserTopItems: (type) => `${baseURL}/me/top/${type}`,
  getUserProfile: (userID) => `${baseURL}/users/${userID}`,
  putFollowPlaylist: (playlistID) =>
    `${baseURL}/playlist/${playlistID}/followers`,
  unfollowPlaylist: (playlistID) =>
    `${baseURL}/playlist/${playlistID}/followers`,
  getFollowedArtists: (limit) =>
    `${baseURL}/me/following?type=artist&limit=${limit}`,
  followArtistUsers: `${baseURL}/me/following`, // request type put
  unfollowArtistUsers: `${baseURL}/me/following` // request type delete
}

const artistEndpoints = {
  getArtist: (id) => `${baseURL}/artists/${id}`,
  getArtists: `${baseURL}/artists`,
  getArtistsAlbums: (id) => `${baseURL}/artists/${id}/albums`,
  getArtistTopTracks: (id) => `${baseURL}/artists/${id}/top-tracks`,
  getRelatedArtists: (id) => `${baseURL}/artists/${id}/related-artists`
}

const categoriesEndpoints = {
  getCategories: `${baseURL}/browse/categories`, // query country, limit, locale
  getSubcategories: (categoryID) =>
    `${baseURL}/browse/categories/${categoryID}`, // query country, locale
  getGenders: `${baseURL}/recommendations/avaliable-genre-seeds`
}

const albumsEndpoints = {
  getAlbum: (id) =>
    `${baseURL}/albums/${id}?country=${localStorage.getItem('COUNTRY')}`,
  getAlbums: `${baseURL}/albums`, // queries ids, market
  getAlbumTracks: (id) =>
    `${baseURL}/albums/${id}/tracks?country=${localStorage.getItem('COUNTRY')}`,
  checkSavedAlbums: (id) => `${baseURL}/me/albums/contains?ids=${id}`,
  putSaveAlbums: (id) => `${baseURL}/me/albums?ids=${id}`,
  deleteRemoveAlbum: (id) => `${baseURL}/me/albums?ids=${id}`,
  getNewReleases: `${baseURL}/browse/new-releases`,
  getSavedAlbums: `${baseURL}/me/albums`
}

const showsEndpoints = {
  getShow: (id) => `${baseURL}/shows/${id}`,
  getShows: `${baseURL}/shows`,
  getEpisodes: (id) => `${baseURL}/shows/${id}/episodes`,
  getUserSavedShows: `${baseURL}/me/shows`,
  saveShow: (id) => `${baseURL}/me/shows?ids=${id}`,
  removeShow: (id) => `${baseURL}/me/shows?ids=${id}`,
  checkUserSavedShow: (id) => `${baseURL}/me/shows/contains?ids=${id}`
}

const episodesEndpoints = {
  getEpisode: (id) => `${baseURL}/episodes/${id}`,
  getEpisodes: `${baseURL}/episodes`,
  userSavedEpisodes: `${baseURL}/me/episodes`,
  saveEpisode: (id) => `${baseURL}/me/episodes?ids=${id}`,
  removeEpisode: (id) => `${baseURL}/me/episodes?ids=${id}`,
  checkSavedEpisodes: (id) => `${baseURL}/me/episodes/contains?ids=${id}`
}

const tracksEndpoints = {
  getTrack: (id) => `${baseURL}/tracks/${id}`,
  getTracks: `${baseURL}/tracks`,
  UserSavedTracks: `${baseURL}/me/tracks`,
  saveTracks: `${baseURL}/me/tracks`,
  removeTracks: `${baseURL}/me/tracks`,
  getRecomendedTracks: `${baseURL}/recommendations`,
  checkUserSavedTracks: (id) => `${baseURL}/me/tracks/contains?ids=${id}`
}

const playlistEndpoints = {
  userPlaylists: `${baseURL}/me/playlists`,
  getPlaylistFromUser: (userid) =>
    `${baseURL}/playlist/${userid}?country=${localStorage.getItem('COUNTRY')}`,
  modifyUserPlaylist: (playlistid) =>
    `${baseURL}/playlist/${playlistid}?country=${localStorage.getItem(
      'COUNTRY'
    )}`,
  getPlaylistTracks: (
    playlistid
  ) => `${baseURL}/playlist/${playlistid}/tracks?country=${localStorage.getItem(
    'COUNTRY'
  )}
  `,
  addTrackToPlaylist: (playlistid) =>
    `${baseURL}/playlist/${playlistid}/tracks?country=${localStorage.getItem(
      'COUNTRY'
    )}`,
  getPlaylistFromCategories: (categoryId) =>
    `${baseURL}/browse/categories/${categoryId}/playlists?country${localStorage.getItem(
      'COUNTRY'
    )}`,
  getPlaylist: (playlistid) =>
    `${baseURL}/playlists/${playlistid}?country=${localStorage.getItem(
      'COUNTRY'
    )}&limit=50&offset=50`,
  followPlaylist: (id) => `${baseURL}/playlists/${id}/followers`,
  checkUserPlaylist: (id, userid) =>
    `${baseURL}/playlists/${id}/followers/contains?ids=${userid}`
}

const searchEndpoint = (string, array) =>
  `${baseURL}/search?q=${string}&type=${array}`

const playerEndpoints = {
  getPlaybackState: `${baseURL}/me/player?country=${localStorage.getItem(
    'COUNTRY'
  )}&market=${localStorage.getItem('COUNTRY')}`,
  putTransferPlayback: `${baseURL}/me/player`,
  getAvaliableDevices: `${baseURL}/me/player/devices`,
  currentlyPlaying: `${baseURL}/me/player/currently-playing?country=${localStorage.getItem(
    'COUNTRY'
  )}&market=${localStorage.getItem('COUNTRY')}`,
  startResumePlayback: `${baseURL}/me/player/play?`,
  pausePlayback: `${baseURL}/me/player/pause`,
  skipToNext: `${baseURL}/me/player/next`,
  skiptoPrevius: `${baseURL}/me/player/previous`,
  seekToPosition: (position) =>
    `${baseURL}/me/player/seek?postion_ms=${position}`,
  repeatTrack: `${baseURL}/me/player/repeat?state="track`,
  repeatContext: `${baseURL}/me/player/repeat?state="context`,
  repeatOff: `${baseURL}/me/player/repeat?state="off`,
  setVolume: (vol) => `${baseURL}/me/player/volume?volume_percent=${vol}`,
  shuffle: (state) => `${baseURL}/me/player/shuffle?state=${state}`,
  AddToQueue: (uri) => `${baseURL}/me/player/queue?uri=${uri}`
}
export {
  userEndpoints,
  categoriesEndpoints,
  searchEndpoint,
  albumsEndpoints,
  artistEndpoints,
  showsEndpoints,
  episodesEndpoints,
  tracksEndpoints,
  playlistEndpoints,
  playerEndpoints
}
