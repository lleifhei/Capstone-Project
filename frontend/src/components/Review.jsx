import './Review.css';
import ReviewItem from './ReviewItem';
import { useState } from 'react';
import axios from 'axios';

const Review = ({ reviews, album, token, fetchReviews }) => {
    const [ showForm, setShowForm ] = useState(false);
    const [ rating, setRating ] = useState(0);
    const [ content, setContent ] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.post('http://localhost:3000/api/reviews', {
                item_id: album.id,
                rating,
                content 
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setRating(0);
            setContent("");
            setShowForm(false);
            fetchReviews();
        }catch(err){
            console.error('Error posting review:', err);
            throw err;
        }
    };
    return (
    <div className="review-section-container">
        <div className="review-section-header">
        <h2>Reviews</h2>
        {token ? (
            <button className="write-review-button" onClick={() => setShowForm(true)}>
            Write a Review
            </button>
        ) : (
            <button className="write-review-button locked" disabled>
            🔒 Write a Review
            </button>
        )}
        </div>
        {showForm && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Write a Review</h3>
                    <form onSubmit={handleSubmit}>
                    <label>Rating (1–5):</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                    />
                    <label>Review:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <div className="modal-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                    </form>
                </div>
            </div>
        )}
        <div className="reviews-list">
        {reviews.length ? (
            reviews.map(review => (
                <ReviewItem review={review} token={token} album={album}/>
            ))
        ) : (
            <div className="no-reviews">
                <p>No reviews for {album.title}.</p>
            </div>
        )}
        </div>
    </div>
    );
};

export default Review;
