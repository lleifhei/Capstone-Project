import {jwtDecode} from "jwt-decode";
import './Review.css';
import ReviewItem from './ReviewItem';
import { useState } from 'react';
import axios from 'axios';

const Review = ({ reviews, album, token, fetchReviews }) => {
    const [ showDuplicateWarning, setShowDuplicateWarning] = useState(false);
    const [ showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [ showForm, setShowForm ] = useState(false);
    const [ rating, setRating ] = useState(0);
    const [ content, setContent ] = useState("");
    const userAlreadyReviewed = token && reviews.some(review => review.user_id === jwtDecode(token).id);
    let writeReviewButton;
    if(!token){
        writeReviewButton = (
            <button className="write-review-button" onClick={() => setShowLoginPrompt(true)}>
                🔒 Write a Review
            </button>
        )
    }else if(userAlreadyReviewed){
        writeReviewButton = (
            <button className="write-review-button" onClick={() => setShowDuplicateWarning(true)}>
                🔒 Write a Review
            </button>
        )
    }else{
        writeReviewButton = (
            <button className="write-review-button" onClick={() => setShowForm(true)}>
                Write a Review
                {console.log("Here", token)}
            </button>
        )
    }
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
        {writeReviewButton}
        </div>
        {showLoginPrompt && (
            <div className="modal-overlay">
                <div className="modal-content">
                <h3>Please Log In</h3>
                <p>You must be logged in to write a review.</p>
                <div className="modal-buttons">
                    <button className='login-button' onClick={() => window.location.href = '/login'}>
                    Go to Login
                    </button>
                    <button className="cancel" onClick={() => setShowLoginPrompt(false)}>
                    Cancel
                    </button>
                </div>
                </div>
            </div>
        )}
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
        {showDuplicateWarning && (
            <div className="modal-overlay">
                <div className="modal-content">
                <h3>Review Already Submitted</h3>
                <p>You’ve already submitted a review for this {album.type}. You can only leave one review per {album.type}.</p>
                <div className="modal-buttons">
                    <button className="cancel" onClick={() => setShowDuplicateWarning(false)}>
                    OK
                    </button>
                </div>
                </div>
            </div>
        )}

        <div className="reviews-list">
        {reviews.length ? (
            reviews.slice().reverse().map(review => (
                <ReviewItem review={review} token={token} album={album} fetchReviews={fetchReviews}/>
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
