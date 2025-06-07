import './CommentItem.css';
import axios from 'axios'
import { useState, useEffect } from 'react';

const CommentItem = ({ comment, currentUserId, token, fetchComments }) => {
    const [ user, setUser] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    useEffect(() => {
        if (!comment?.user_id) return;
        axios.get(`http://localhost:3000/api/auth/${comment.user_id}`).then(res => setUser(res.data[0])).catch(err => console.error(`Error fetching user for ${comment.user_id}`, err))
    }, [comment.user_id])

    const handleDelete = async () => {
        try {
          await axios.delete(
            `http://localhost:3000/api/comments/${comment.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchComments(); 
        } catch (err) {
          console.error("Failed to delete comment", err);
        }
      };

      const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.put(
            `http://localhost:3000/api/comments/${comment.id}`,
            { content: editContent },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setIsEditing(false);
          fetchComments(); 
        } catch (err) {
          console.error("Failed to edit comment", err);
        }
      };
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
            {currentUserId === comment.user_id && !isEditing && (
            <div className="comment-actions">
                <button className="icon-button" onClick={() => setIsEditing(true)} title="Edit">✏️</button>
                <button className="icon-button" onClick={handleDelete} title="Delete">🗑️</button>
            </div>
            )}
        </div>
        {isEditing ? (
            <form onSubmit={handleEditSubmit} className="edit-comment-form">
            <textarea
                className='edit-comment-input'
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
            />
            <div className="modal-buttons2">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
            </form>
        ) : (
            <p className="comment-content">{comment.content}</p>
        )}
    </div>
  );
};

export default CommentItem;