import React from 'react';
import { useParams } from 'react-router-dom';

const ReviewDetail = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Review Detail</h1>
            <p>Displaying details for review ID: {id}</p>
        </div>
    );
};

export default ReviewDetail;