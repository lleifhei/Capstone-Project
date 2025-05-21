import React from 'react';

const Reviews = () => {
    const reviews = [
        { id: 1, author: 'John Doe', content: 'Great product!' },
        { id: 2, author: 'Jane Smith', content: 'Amazing experience!' },
        { id: 3, author: 'Sam Wilson', content: 'Highly recommend!' },
    ];

    return (
        <div>
            <h1>All Reviews</h1>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <h3>{review.author}</h3>
                        <p>{review.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reviews;