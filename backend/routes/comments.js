const express = require('express');
const app = express();
const Pool = require('../db/client');
const router = express.Router();

app.use(express.json());



// GET /comments - Get all comments with optional filtering
router.get('/comments', async (req, res) => {
  try {
    const { user_id, review_id, limit = 10, offset = 0, sort = 'created_at', order = 'DESC' } = req.query;
    
    let query = 'SELECT * FROM comments WHERE 1=1';
    const params = [];
    
    if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    }
    
    if (review_id) {
      query += ' AND review_id = ?';
      params.push(review_id);
    }
    
    query += ` ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    const comments = await Pool.query(query, params);
    
    res.json({
      success: true,
      data: comments,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
});

// GET /comments/:id - Get a specific comment by ID
router.get('/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    
    if (!comment || comment.length === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    
    res.json({ success: true, data: comment[0] });
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comment' });
  }
});

// GET /comments/review/:review_id - Get all comments for a specific review
router.get('/comments/review/:review_id', async (req, res) => {
  try {
    const { review_id } = req.params;
    const { limit = 20, offset = 0, sort = 'created_at', order = 'ASC' } = req.query;
    
    // First check if the review exists
    const reviewExists = await Pool.query('SELECT id FROM reviews WHERE id = ?', [review_id]);
    
    if (!reviewExists || reviewExists.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    const comments = await Pool.query(
      `SELECT * FROM comments WHERE review_id = ? ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
      [review_id, parseInt(limit), parseInt(offset)]
    );
    
    // Get total comment count for this review
    const countResult = await Pool.query(
      'SELECT COUNT(*) as total FROM comments WHERE review_id = ?',
      [review_id]
    );
    
    res.json({
      success: true,
      data: comments,
      total_comments: countResult[0].total,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching review comments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch review comments' });
  }
});

// GET /comments/user/:user_id - Get all comments by a specific user
router.get('/comments/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 10, offset = 0, sort = 'created_at', order = 'DESC' } = req.query;
    
    const comments = await Pool.query(
      `SELECT c.*, r.item_id, r.rating 
       FROM comments c 
       LEFT JOIN reviews r ON c.review_id = r.id 
       WHERE c.user_id = ? 
       ORDER BY c.${sort} ${order} 
       LIMIT ? OFFSET ?`,
      [user_id, parseInt(limit), parseInt(offset)]
    );
    
    // Get total comment count for this user
    const countResult = await Pool.query(
      'SELECT COUNT(*) as total FROM comments WHERE user_id = ?',
      [user_id]
    );
    
    res.json({
      success: true,
      data: comments,
      total_comments: countResult[0].total,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user comments' });
  }
});

// POST /comments - Create a new comment
router.post('/comments', async (req, res) => {
  try {
    const { user_id, review_id, content } = req.body;
    
    // Validation
    if (!user_id || !review_id || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'user_id, review_id, and content are required' 
      });
    }
    
    if (content.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Comment content cannot be empty' 
      });
    }
    
    if (content.length > 1000) { // Adjust max length as needed
      return res.status(400).json({ 
        success: false, 
        message: 'Comment content cannot exceed 1000 characters' 
      });
    }
    
    // Check if the review exists
    const reviewExists = await Pool.query('SELECT id FROM reviews WHERE id = ?', [review_id]);
    
    if (!reviewExists || reviewExists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }
    
    // Optional: Prevent users from commenting on their own reviews
    const reviewOwner = await Pool.query('SELECT user_id FROM reviews WHERE id = ?', [review_id]);
    if (reviewOwner[0].user_id === user_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot comment on your own review' 
      });
    }
    
    const result = await Pool.query(
      'INSERT INTO comments (user_id, review_id, content, created_at) VALUES (?, ?, ?, NOW())',
      [user_id, review_id, content.trim()]
    );
    
    const newComment = await Pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      data: newComment[0],
      message: 'Comment created successfully' 
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ success: false, message: 'Failed to create comment' });
  }
});

// PUT /comments/:id - Update an existing comment
router.put('/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, user_id } = req.body;
    
    // Check if comment exists
    const existingComment = await Pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    
    if (!existingComment || existingComment.length === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    
    // Check if the user owns this comment
    if (user_id && existingComment[0].user_id !== user_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this comment' 
      });
    }
    
    // Validation
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Content is required' 
      });
    }
    
    if (content.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Comment content cannot be empty' 
      });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Comment content cannot exceed 1000 characters' 
      });
    }
    
    await Pool.query(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content.trim(), id]
    );
    
    const updatedComment = await Pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    
    res.json({ 
      success: true, 
      data: updatedComment[0],
      message: 'Comment updated successfully' 
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ success: false, message: 'Failed to update comment' });
  }
});

// DELETE /comments/:id - Delete a comment
router.delete('/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body; // Optional: for authorization
    
    // Check if comment exists
    const existingComment = await Pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    
    if (!existingComment || existingComment.length === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    
    // Check if the user owns this comment
    if (user_id && existingComment[0].user_id !== user_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this comment' 
      });
    }
    
    await Pool.query('DELETE FROM comments WHERE id = ?', [id]);
    
    res.json({ 
      success: true, 
      message: 'Comment deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete comment' });
  }
});

// GET /comments/review/:review_id/count - Get comment count for a specific review
router.get('/comments/review/:review_id/count', async (req, res) => {
  try {
    const { review_id } = req.params;
    
    const countResult = await Pool.query(
      'SELECT COUNT(*) as total FROM comments WHERE review_id = ?',
      [review_id]
    );
    
    res.json({
      success: true,
      data: {
        review_id: review_id,
        comment_count: countResult[0].total
      }
    });
  } catch (error) {
    console.error('Error fetching comment count:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comment count' });
  }
});

// GET /comments/recent - Get recent comments across all reviews
router.get('/comments/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const recentComments = await Pool.query(`
      SELECT c.*, r.item_id, r.rating, r.user_id as review_author_id
      FROM comments c
      LEFT JOIN reviews r ON c.review_id = r.id
      ORDER BY c.created_at DESC
      LIMIT ?
    `, [parseInt(limit)]);
    
    res.json({
      success: true,
      data: recentComments
    });
  } catch (error) {
    console.error('Error fetching recent comments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent comments' });
  }
});

// DELETE /comments/review/:review_id - Delete all comments for a specific review (admin/cleanup)
router.delete('/comments/review/:review_id', async (req, res) => {
  try {
    const { review_id } = req.params;
    const { admin_user_id } = req.body; // For admin authorization
    
    // Optional: Add admin authorization check here
    // if (!isAdmin(admin_user_id)) { ... }
    
    const result = await Pool.query('DELETE FROM comments WHERE review_id = ?', [review_id]);
    
    res.json({ 
      success: true, 
      message: `${result.affectedRows} comments deleted successfully`,
      deleted_count: result.affectedRows
    });
  } catch (error) {
    console.error('Error deleting review comments:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review comments' });
  }
});

module.exports = router;