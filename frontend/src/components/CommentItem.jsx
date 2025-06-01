import './CommentItem.css';
import axios from 'axios'
import { useState, useEffect } from 'react';

const CommentItem = ({ comment }) => {
    const [ user, setUser] = useState([]);
    useEffect(() => {
        if (!comment?.user_id) return;
        axios.get(`http://localhost:3000/api/auth/${comment.user_id}`).then(res => setUser(res.data[0])).catch(err => console.error(`Error fetching user for ${comment.user_id}`, err))
    }, [comment.user_id])
  return (
    <div key={comment.id} className="comment-card">
        <div className="comment-user">
        <img
            src={user.profile_image_url}
            alt="User profile"
            className="comment-profile-image"
        />
        <p className="comment-by">
            Comment by <strong>{user.username}</strong>
        </p>
        </div>
        <p className="comment-content">{comment.content}</p>
    </div>
  );
};

export default CommentItem;