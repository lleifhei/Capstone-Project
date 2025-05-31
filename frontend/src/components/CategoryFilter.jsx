import './CategoryFilter.css';
import { useState, useEffect } from 'react';
import axios from 'axios';


const CategoryFilter = ({ setAlbums}) => {
  const [active, setActive] = useState("all");

  const filters = ["all", "album", "single", "ep", "compilation"];

  useEffect(() => {
    const fetchAlbums = async () => {
      try{
        const res = await axios.get(
          active === "all"
          ? "http://localhost:3000/api/items"
          : `http://localhost:3000/api/items?type=${active}`
        )
        setAlbums(res.data)
      }catch(err){
        console.error("Error fetching albums:", err);
      }
    }
    fetchAlbums()
  }, [active, setAlbums])

  return (
    <div className="category-section">
      <div className="category-buttons">
        {filters.map(filter => (
          <button
            key={filter}
            className={`category-btn ${active === filter ? 'active' : ''}`}
            onClick={() => setActive(filter)}
          >
            {filter.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;