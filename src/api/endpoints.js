// note: in many endpoints it necesary specify user country code on market to get items, as query parameter
const baseURL = 'https://api.spotify.com/v1'

const userEndpoints = {
  currentUser: `${baseURL}/me`,
  getUserTopItems: (type) => `${baseURL}/me/top/${type}`,
  getUserProfile: (userID) => `${baseURL}/users/${userID}`,
  putFollowPlaylist: (playlistID) => `${baseURL}/playlist/${playlistID}/followers`,
  unfollowPlaylist: (playlistID) => `${baseURL}/playlist/${playlistID}/followers`,
  getFollowedArtists: (limit) => `${baseURL}/me/following?type=artist&limit=${limit}`,
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
  getSubcategories: (categoryID) => `${baseURL}/browse/categories/${categoryID}`, // query country, locale
  getGenders: `${baseURL}/recommendations/avaliable-genre-seeds`
}

const albumsEndpoints = {
  getAlbum: (id, market) => `${baseURL}/albums/${id}?market=${market}`,
  getAlbums: `${baseURL}/albums`, // queries ids, market
  getAlbumTracks: (id, limit, market, offset) => `${baseURL}/albums/${id}/tracks?limit=${limit}&market=${market}&offset=${offset}`,
  getSavedAlbums: `${baseURL}/me/albums`,
  putSaveAlbums: `${baseURL}/me/albums`,
  deleteRemoveAlbum: `${baseURL}/me/albums`,
  getNewReleases: `${baseURL}/browse/new-releases`
}

const showsEndpoints = {
  getShow: (id) => `${baseURL}/shows/${id}`,
  getShows: `${baseURL}/shows`,
  getEpisodes: (id) => `${baseURL}/shows/${id}/episodes`,
  getUserSavedShows: `${baseURL}/me/shows`,
  saveShow: `${baseURL}/me/shows`,
  removeShow: `${baseURL}/me/shows`
}

const episodesEndpoints = {
  getEpisode: (id) => `${baseURL}/episodes/${id}`,
  getEpisodes: `${baseURL}/episodes`,
  userSavedEpisodes: `${baseURL}/me/episodes`,
  saveEpisode: `${baseURL}/me/episodes`,
  removeEpisode: `${baseURL}/me/episodes`
}

const tracksEndpoints = {
  getTrack: (id) => `${baseURL}/tracks/${id}`,
  getTracks: `${baseURL}/tracks`,
  UserSavedTracks: `${baseURL}/me/tracks`,
  saveTracks: `${baseURL}/me/tracks`,
  removeTracks: `${baseURL}/me/tracks`,
  getRecomendedTracks: `${baseURL}/recommendations`
}

const playlistEndpoints = {
  userPlaylists: `${baseURL}/me/playlists`,
  getPlaylistFromUser: (userid) => `${baseURL}/playlist/${userid}?country=${localStorage.getItem('COUNTRY')}`,
  modifyUserPlaylist: (playlistid) => `${baseURL}/playlist/${playlistid}?country=${localStorage.getItem('COUNTRY')}`,
  getPlaylistTracks: (playlistid) => `${baseURL}/playlist/${playlistid}/tracks?country=${localStorage.getItem('COUNTRY')}
  `,
  addTrackToPlaylist: (playlistid) => `${baseURL}/playlist/${playlistid}/tracks?country=${localStorage.getItem('COUNTRY')}`,
  getPlaylistFromCategories: (categoryId) => `${baseURL}/browse/categories/${categoryId}/playlists?country${localStorage.getItem('COUNTRY')}`,
  getPlaylist: (playlistid) => `${baseURL}/playlists/${playlistid}?country=${localStorage.getItem('COUNTRY')}`
}

const searchEndpoint = (string, array) => `${baseURL}/search?q=${string}&type=${array}`
export {
  userEndpoints,
  categoriesEndpoints,
  searchEndpoint,
  albumsEndpoints,
  artistEndpoints,
  showsEndpoints,
  episodesEndpoints,
  tracksEndpoints,
  playlistEndpoints
}
