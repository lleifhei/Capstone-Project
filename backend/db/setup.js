require('dotenv').config();
const pool = require('./client');

const setup = async () => {
  try {
    console.log('Dropping tables...');
    await pool.query(`
      DROP TABLE IF EXISTS tracks;
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS items;
      DROP TABLE IF EXISTS users;
    `);

    console.log('Creating tables...');
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        profile_image_url TEXT DEFAULT 'https://www.gravatar.com/avatar/?d=mp',
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(10) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255),
        artist_id VARCHAR(50),
        artist_image_url TEXT,
        spotify_id VARCHAR(50),
        image_url TEXT,
        type VARCHAR(100),
        total_tracks INT,
        release_date VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, item_id)
      );

      CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
        item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE tracks(
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
        track_number INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        duration INTEGER,
        artist VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('All tables created successfully.');
  } catch (err) {
    console.error('Error setting up the database:', err);
  } finally {
    await pool.end();
  }
};

setup();
