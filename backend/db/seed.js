require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./client');
const { fetchTopAlbums } = require('../services/spotify');

const seed = async () => {
  try {
    console.log('Seeding database...');

    const passwordHash = await bcrypt.hash('password123', 10);
    const userRes = await pool.query(`
      INSERT INTO users (email, password, role)
      VALUES
        ('user1@example.com', $1, 'user'),
        ('user2@example.com', $1, 'user'),
        ('admin@example.com', $1, 'admin')
      RETURNING *;
    `, [passwordHash]);
    console.log('Users created');

    const albums = await fetchTopAlbums();
    for (const album of albums) {
    await pool.query(
        `INSERT INTO items (title, artist, spotify_id, image_url, category)
        VALUES ($1, $2, $3, $4, $5)`,
        [album.title, album.artist, album.spotify_id, album.image_url, album.category]
    );
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
