import './Comment.css';
import CommentItem from './CommentItem';

const Comment = ({ comments }) => {
  return (
    <div className="comment-section">
      {comments.length ? (
        comments.slice().reverse().map((comment) => (
            <CommentItem comment={comment}/>
        ))
      ) : (
        <p className="no-comments">No comments yet.</p>
      )}
    </div>
  );
};

export default Comment;
