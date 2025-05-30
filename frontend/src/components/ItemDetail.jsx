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
            <div className="album-detail">
                <h1>{album.name}</h1>
                <img src={album.image_url} alt={album.name} />
                <p><strong>Artist:</strong> {album.artist}</p>
                <p><strong>Category:</strong> {album.category}</p>
                <p><strong>Release Date:</strong> {album.release_date}</p>

                <h2>Reviews</h2>
                {reviews.length ? (
                    reviews.map(review => (
                        <div key={review.id} className="review">
                            <p><strong>Rating:</strong> {review.rating}</p>
                            <p>{review.content}</p>
                            <h4>Comments</h4>
                            {(comments || []).map(comment => {
                                <div key={comment.id} className="comment">
                                    <p>{comment.content}</p>
                                </div>
                            })}
                        </div>
                    ))
                ): (
                    <p>No reviews yet.</p>
                )}
            </div>
        </>
    );
  };
  
  export default ItemDetail;