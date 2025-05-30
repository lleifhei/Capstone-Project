import { React, useEffect, useState } from "react";
import AlbumCard from "./AlbumCard";
import "./Home.css"
import axios from 'axios'

const Home = () => {
  const [albums, setAlbums] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3000/api/items').then(res => setAlbums(res.data)).catch(err => console.error('Error fetching albums', err))
  }, [])
  return (
    <>
      <h1>Spotify Albums</h1>
      <div className="album-list">
        {albums.map(album => (
          <AlbumCard key={album.id} album={album}/>
        ))}
      </div>
    </>
  );
};
export default Home;
