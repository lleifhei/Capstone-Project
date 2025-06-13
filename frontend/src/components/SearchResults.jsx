import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css'
import AlbumCard from './AlbumCard';

const SearchResults = () => {
  const [albums, setAlbums] = useState([]);
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';

  useEffect(() => {
    // if (!query) return;
    axios.get(`${apiUrl}/api/items/search?q=${encodeURIComponent(query)}`)
      .then(res => setAlbums(res.data))
      .catch(err => console.error("Search failed", err));
  }, [query, apiUrl]);

  return (
    <div className="search-results">
      <h2>Results for "{query}"</h2>
      {albums.length > 0 ? (
        <div className='album-list'>
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
          <p className='search-p'>No results found.</p> 
      )}
    </div>
  );
};

export default SearchResults;
