import './AlbumCard.css'
import { Link } from 'react-router-dom'

const AlbumCard = ({ album }) => {
    return (
        <Link to={`/items/${album.id}`} className="album-card-link">
              <div className="album-card">
                <img src={album.image_url} alt={album.title} width="200" />
                <div className="album-card-details">
                    <p>{album.type}</p>
                    <h3>{album.title}</h3>
                    <p>By {album.artist}</p>
                    <p>{album.release_date}</p>
                </div>
            </div>
        </Link>
    );
  };
  
  export default AlbumCard;