import { React, useState } from "react";
import AlbumCard from "./AlbumCard";
import CategoryFilter from "./CategoryFilter";
import "./Home.css"

const Home = () => {
  const [albums, setAlbums] = useState([]);
  return (
    <>
    <CategoryFilter setAlbums={setAlbums}/>
      <div className="album-list">
        {albums.map(album => (
          <AlbumCard key={album.id} album={album}/>
        ))}
      </div>
    </>
  );
};
export default Home;
