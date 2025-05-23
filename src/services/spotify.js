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

// Fetch top albums or tracks (we'll use this for seeding)
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

  // return simplified album info
  return response.data.albums.items.map(album => ({
    title: album.name,
    artist: album.artists.map(a => a.name).join(', '),
    spotify_id: album.id,
    image_url: album.images[0]?.url || null,
    category: 'music' // You could improve this with genre fetching later
  }));
}

module.exports = {
  fetchTopAlbums,
};
