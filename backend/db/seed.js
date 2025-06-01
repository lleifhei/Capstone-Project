require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./client');
const { fetchTopAlbums, fetchTracksForAlbum, fetchArtistImage } = require('../services/spotify');

const seed = async () => {
  try {
    console.log('Seeding database...');

    const passwordHash = await bcrypt.hash('password123', 10);
    const userRes = await pool.query(`
      INSERT INTO users (username, email, password, role)
      VALUES
        ('user1', 'user1@example.com', $1, 'user'),
        ('user2', 'user2@example.com', $1, 'user'),
        ('admin1', 'admin1@example.com', $1, 'admin')
      RETURNING *;
    `, [passwordHash]);
    console.log('Users created');

    const albums = await fetchTopAlbums();
    for (const album of albums) {
      const artistImageUrl = await fetchArtistImage(album.artist_id)
      const results = await pool.query(
          `INSERT INTO items (title, artist, artist_id, artist_image_url, spotify_id, image_url, type, total_tracks, release_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
          [album.title, album.artist, album.artist_id, artistImageUrl, album.spotify_id, album.image_url, album.type, album.total_tracks, album.release_date]
      );
      const itemId = results.rows[0].id

      const tracks = await fetchTracksForAlbum(album.spotify_id)
      for(const track of tracks){
        await pool.query(
          `INSERT INTO tracks (item_id, track_number, name, duration, artist)
          VALUES ($1, $2, $3, $4, $5)`,
          [itemId, track.track_number, track.name, track.duration, track.artist]
        )
      }
    }
    console.log('Spotify albums seeded into items table');

    await pool.query(`
      INSERT INTO reviews (user_id, item_id, rating, content)
      VALUES
        (1, 1, 5, 'A masterpiece!'),
        (2, 1, 4, 'Really good but a bit long'),
        (1, 2, 3, 'Nice but not my style')
    `);
    console.log('Reviews created');

    await pool.query(`
      INSERT INTO comments (user_id, review_id, content)
      VALUES
        (2, 1, 'Totally agree!'),
        (1, 2, 'You’re crazy, it’s a classic.')
    `);
    console.log('Comments created');

    console.log('Done seeding.');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await pool.end();
  }
};

seed();
