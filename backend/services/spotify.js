require('dotenv').config();
const axios = require('axios');

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}

async function fetchArtistImage(artistId) {
  const token = await getAccessToken();
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.images?.[0]?.url || null;
}

async function fetchTopAlbums() {
  const token = await getAccessToken();
  const response = await axios.get(
    'https://api.spotify.com/v1/browse/new-releases?limit=50',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.albums.items.map(album => ({
    title: album.name,
    artist: album.artists.map(a => a.name).join(', '),
    artist_id: album.artists[0].id,
    spotify_id: album.id,
    image_url: album.images[0]?.url || null,
    type: album.album_type,
    total_tracks: album.total_tracks,
    release_date: album.release_date
  }));
}

async function fetchTracksForAlbum(albumId) {
  const token = await getAccessToken()
  const response = await axios.get(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.items.map(track => ({
    name: track.name,
    track_number: track.track_number,
    artist: track.artists.map(a => a.name).join(', '),
    duration: track.duration_ms
  }));
}

module.exports = {
  fetchTopAlbums,
  fetchTracksForAlbum,
  fetchArtistImage
};
