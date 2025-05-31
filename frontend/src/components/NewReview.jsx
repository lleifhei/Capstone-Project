import React, { useState } from 'react';

const NewReview = () => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ review, rating }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to submit review');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Review submitted successfully:', data);
                setReview('');
                setRating(0);
                    })
                    .catch((error) => {
                        console.error('Error submitting review:', error);
                    });
            };

    return (
        <div>
            <h1>New Review</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="review">Review:</label>
                    <textarea
                        id="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="rating">Rating:</label>
                    <input
                        type="number"
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        min="1"
                        max="5"
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default NewReview;