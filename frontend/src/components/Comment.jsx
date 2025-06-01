import './Comment.css';
import axios from 'axios'
import { useState, useEffect } from 'react';
import CommentItem from './CommentItem';

const Comment = ({ review }) => {
  const [ comments, setComments] = useState([]);
  useEffect(() => {
    if (!review?.id) return;
    axios.get(`http://localhost:3000/api/comments/reviews/${review.id}`).then(res => setComments(res.data)).catch(err => console.error(`Error fetching tracks for ${review.id}`, err))
  }, [review.id])
  return (
    <div className="comment-section">
      {comments.length ? (
        comments.map((comment) => (
            <CommentItem comment={comment}/>
        ))
      ) : (
        <p className="no-comments">No comments yet.</p>
      )}
    </div>
  );
};

export default Comment;
