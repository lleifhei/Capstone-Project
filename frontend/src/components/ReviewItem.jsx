import Comment from './Comment';
import axios from 'axios';
import './ReviewItem.css'
import { useState, useEffect } from 'react';

const ReviewItem = ({ review, token, album }) => {
    const [ user, setUser] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!review?.user_id) return;
        axios.get(`http://localhost:3000/api/auth/${review.user_id}`).then(res => setUser(res.data[0])).catch(err => console.error(`Error fetching user for ${review.user_id}`, err))
    }, [review.user_id])
    const fetchComments = async () => {
      try{
        const res = await axios.get(`http://localhost:3000/api/comments/reviews/${review.id}`)
        setComments(res.data);
      }catch (err){
        console.error("Failed to fetch comments", err)
      }
    }
    useEffect(() => {
      fetchComments();
    }, [review.id])
    const handleSubmitComment = async (e) => {
        e.preventDefault();
    
        try {
          if (!commentContent.trim()) {
            setError('Comment cannot be empty');
            return;
          }
          await axios.post('http://localhost:3000/api/comments', {
            review_id: review.id,
            item_id: album.id,
            content: commentContent
          },
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          })
          setCommentContent('');
          setError('');
          await fetchComments();
        } catch (err) {
          console.error('Failed to post comment', err);
          setError('You must be logged in to write a comment.');
        }
      };
    return (
        <div key={review.id} className="review-card">
            <div className="review-user">
            <img
                src={user.profile_image_url}
                alt="Profile"
                className="review-profile-image"
            />
            <div className="review-user-info">
                <p className="review-by">Review by <strong>{user.username}</strong></p>
            </div>
            </div>
            <p className="review-rating-bottom">⭐ {review.rating} / 5</p>
            <p className="review-content">{review.content}</p>
            <div className="review-comments">
            <Comment comments={comments}/>
            </div>
            <form onSubmit={handleSubmitComment} className="comment-form">
                <textarea
                className="comment-input"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                ></textarea>
                <button type="submit" className="comment-submit-btn">
                Post Comment
                </button>
                {error && <p className="comment-error">{error}</p>}
            </form>
      </div>
    );
};
export default ReviewItem;
