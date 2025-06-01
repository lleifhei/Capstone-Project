import './Review.css';
import ReviewItem from './ReviewItem';
import { useState } from 'react';

const Review = ({ reviews, album }) => {
    const [ showForm, setShowForm ] = useState(false);
    const [ rating, setRating ] = useState(0);
    const [ content, setContent ] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Post to your review API
        console.log("Submitted:", { rating, content });
        setRating(0);
        setContent("");
        setShowForm(false);
    };
    return (
    <div className="review-section-container">
        <div className="review-section-header">
        <h2>Reviews</h2>
        <button className="write-review-button" onClick={() => setShowForm(true)}>Write a Review</button>
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
                <ReviewItem review={review}/>
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
