import './Review.css';
import ReviewItem from './ReviewItem';

const Review = ({ reviews }) => {
    return (
    <div className="review-section-container">
        <div className="review-section-header">
        <h2>Reviews</h2>
        <button className="write-review-button">Write a Review</button>
        </div>
        <div className="reviews-list">
        {reviews.length ? (
            reviews.map(review => (
                <ReviewItem review={review}/>
            ))
        ) : (
            <p>No reviews yet.</p>
        )}
        </div>
    </div>
    );
};

export default Review;
