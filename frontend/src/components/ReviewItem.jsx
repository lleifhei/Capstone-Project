import Comment from './Comment';
import axios from 'axios';
import './ReviewItem.css'
import {jwtDecode} from "jwt-decode";
import { useState, useEffect } from 'react';

const ReviewItem = ({ review, token, album, fetchReviews }) => {
    const [ user, setUser] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editContent, setEditContent] = useState(review.content);
    const [editRating, setEditRating] = useState(review.rating);
    const apiUrl = import.meta.env.VITE_API_URL;


    let currentUserId = null;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        currentUserId = decoded.id; 
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    useEffect(() => {
        if (!review?.user_id) return;
        axios.get(`${apiUrl}/api/auth/${review.user_id}`).then(res => setUser(res.data[0])).catch(err => console.error(`Error fetching user for ${review.user_id}`, err))
    }, [review.user_id])

    useEffect(() => {
      setEditContent(review.content);
      setEditRating(review.rating);
    }, [review.content, review.rating]);

    const fetchComments = async () => {
      try{
        const res = await axios.get(`${apiUrl}/api/comments/reviews/${review.id}`)
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
          await axios.post(`${apiUrl}/api/comments`, {
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

      const handleEditClick = () => {
        setEditContent(review.content);
        setEditRating(review.rating);
        setShowEditModal(true);
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
            {currentUserId === review.user_id && (
              <div className="review-actions">
                <button className="icon-button2" onClick={handleEditClick}>✏️</button>
                <button className="icon-button2" onClick={() => setShowDeleteConfirm(true)}>🗑️</button>
              </div>
            )}
            </div>
            <p className="review-rating-bottom">⭐ {review.rating} / 5</p>
            <p className="review-content">{review.content}</p>
            <div className="review-comments">
            <Comment comments={comments} currentUserId={currentUserId} token={token} fetchComments={fetchComments}/>
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
            {showEditModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Edit Your Review</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        console.log("Here", token)
                        await axios.put(`${apiUrl}/api/reviews/${review.id}`, {
                          rating: editRating,
                          content: editContent
                        }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        setShowEditModal(false);
                        fetchReviews()
                      } catch (err) {
                        console.error("Failed to update review", err);
                      }
                    }}
                  >
                    <label>Rating (1-5):</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                    />
                    <label>Review:</label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="modal-buttons">
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {showDeleteConfirm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Delete Review</h3>
                  <p>Are you sure you want to delete this review?</p>
                  <div className="modal-buttons">
                    <button
                      className="delete-btn"
                      onClick={async () => {
                        try {
                          await axios.delete(`${apiUrl}/api/reviews/${review.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setShowDeleteConfirm(false);
                          fetchReviews()
                        } catch (err) {
                          console.error("Failed to delete review", err);
                        }
                      }}
                    >
                      Yes, Delete
                    </button>
                    <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

      </div>
    );
};
export default ReviewItem;
