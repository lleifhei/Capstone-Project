import './AlbumCard.css'
import { Link } from 'react-router-dom'

const AlbumCard = ({ album }) => {
    return (
        <Link to={`/items/${album.id}`} className="album-card-link">
              <div className="album-card">
                <img src={album.image_url} alt={album.title} width="200" />
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
                <p>{album.category}</p>
            </div>
        </Link>
    );
  };
  
  export default AlbumCard;