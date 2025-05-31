import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ItemDetails.css"
import axios from 'axios'

const ItemDetail = () => {
    const { id } = useParams()
    const [ album, setAlbum] = useState()
    const [ reviews, setReviews] = useState([])
    const [ comments, setComments] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:3000/api/items/${id}`).then(res => setAlbum(res.data)).catch(err => console.error(`Error fetching album details for ${id}`, err))
        axios.get(`http://localhost:3000/api/reviews/item/${id}`).then(res => setReviews(res.data)).catch(err => console.error(`Error fetching album reviews for ${id}`, err))
        axios.get(`http://localhost:3000/api/comments/items/${id}`).then(res => setComments(res.data)).catch(err => console.error(`Error fetching album comments for ${id}`, err))
    }, [id])
    if (!album) return <p>Loading...</p>
    return (
        <>
            <div className="album-header-section">
                    <div className="album-banner-bg">
                        <img src={album.artist_image_url} alt={album.title} />
                    </div>
                    <div className="album-header-content">
                        <div className="album-left">
                            <img className="album-art" src={album.image_url} alt={album.title} />
                            <div className="album-info">
                                <h1>{album.title}</h1>
                                <p className="album-meta">
                                {album.type} • {album.release_date} • {album.total_tracks || "??"} Tracks
                                </p>
                                <p className="album-artist">By {album.artist}</p>
                            </div>
                        </div>
                        <div className="album-ratings">
                            <div>
                                <p className="label">Total Ratings</p>
                                <p className="value">{album.total_ratings || 0}</p>
                            </div>
                            <div>
                                <p className="label">Average Rating</p>
                                <p className="value">⭐ {album.avg_rating?.toFixed(1) || "0.0"} / 5</p>
                            </div>
                            <div>
                                <p className="label">Your Rating</p>
                                {/* <p className="value">☆ {userRating || 0} / 5</p> */}
                            </div>
                        </div>
                    </div>
            </div>
        </>
    );
  };
  
  export default ItemDetail;