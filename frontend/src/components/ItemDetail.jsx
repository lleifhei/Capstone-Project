import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TrackList from "./Tracklist";
import Review from "./Review";
import "./ItemDetails.css"
import axios from 'axios'

const ItemDetail = ( { token }) => {
    const { id } = useParams()
    const [ album, setAlbum] = useState()
    const [ tracks, setTracks] = useState([])
    const [ reviews, setReviews] = useState([])
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchReviews = async () => {
        try{
            const res = await axios.get(`${apiUrl}/api/reviews/item/${id}`)
            setReviews(res.data);
        }catch(err){
            console.error(`Error fetching album reviews for ${id}`, err)
        }
    }

    useEffect(() => {
        axios.get(`${apiUrl}/api/items/${id}`).then(res => setAlbum(res.data)).catch(err => console.error(`Error fetching album details for ${id}`, err))
        axios.get(`${apiUrl}/api/items/${id}/tracks`).then(res => setTracks(res.data)).catch(err => console.error(`Error fetching tracks for ${id}`, err))
        fetchReviews();
    }, [id])
    if (!album) return <p>Loading...</p>
    return (
        <>
            <div className="album-header-section">
                <div className="container">
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
                                <p className="value">{reviews.length}</p>
                            </div>
                            <div>
                                <p className="label">Average Rating</p>
                                <p className="value">⭐ {reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0"} / 5</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tracks-reviews-container">
                {tracks.length !== 1 && <TrackList tracks={tracks}/>}
                <Review reviews={reviews} album={album} token={token} fetchReviews={fetchReviews} />
            </div>
        </>
    );
  };
  
  export default ItemDetail;