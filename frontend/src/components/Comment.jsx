import './Comment.css';
import CommentItem from './CommentItem';

const Comment = ({ comments, currentUserId, token, fetchComments }) => {
  return (
    <div className="comment-section">
      {comments.length ? (
        comments.slice().reverse().map((comment) => (
            <CommentItem comment={comment} currentUserId={currentUserId} token={token} fetchComments={fetchComments}/>
        ))
      ) : (
        <p className="no-comments">No comments yet.</p>
      )}
    </div>
  );
};

export default Comment;
