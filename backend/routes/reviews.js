const express = require('express');
const Pool = require('../db/client');
const router = express.Router();


// GET /reviews - Get all reviews with optional filtering
router.get('/reviews', async (req, res) => {
  try {
    const { user_id, item_id, limit = 10, offset = 0, sort = 'created_at', order = 'DESC' } = req.query;
    
    let query = 'SELECT * FROM reviews WHERE 1=1';
    const params = [];
    
    if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    }
    
    if (item_id) {
      query += ' AND item_id = ?';
      params.push(item_id);
    }
    
    query += ` ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    const reviews = await Pool.query(query, params);
    
    res.json({
      success: true,
      data: reviews,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// GET /reviews/:id - Get a specific review by ID
router.get('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    
    if (!review || review.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    res.json({ success: true, data: review[0] });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch review' });
  }
});

// GET /reviews/item/:item_id - Get all reviews for a specific item
router.get('/reviews/item/:item_id', async (req, res) => {
  try {
    const { item_id } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const reviews = await Pool.query(
      'SELECT * FROM reviews WHERE item_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [item_id, parseInt(limit), parseInt(offset)]
    );
    
    // Get average rating for the item
    const avgRating = await Pool.query(
      'SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM reviews WHERE item_id = ?',
      [item_id]
    );
    
    res.json({
      success: true,
      data: reviews,
      stats: {
        average_rating: parseFloat(avgRating[0].average_rating || 0).toFixed(1),
        total_reviews: avgRating[0].total_reviews
      }
    });
  } catch (error) {
    console.error('Error fetching item reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch item reviews' });
  }
});

// GET /reviews/user/:user_id - Get all reviews by a specific user
router.get('/reviews/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const reviews = await Pool.query(
      'SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [user_id, parseInt(limit), parseInt(offset)]
    );
    
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user reviews' });
  }
});

// POST /reviews - Create a new review
router.post('/reviews', async (req, res) => {
  try {
    const { user_id, item_id, rating, content } = req.body;
    
    // Validation
    if (!user_id || !item_id || !rating) {
      return res.status(400).json({ 
        success: false, 
        message: 'user_id, item_id, and rating are required' 
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }
    
    // Check if user already reviewed this item
    const existingReview = await Pool.query(
      'SELECT id FROM reviews WHERE user_id = ? AND item_id = ?',
      [user_id, item_id]
    );
    
    if (existingReview.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'User has already reviewed this item' 
      });
    }
    
    const result = await Pool.query(
      'INSERT INTO reviews (user_id, item_id, rating, content, created_at) VALUES (?, ?, ?, ?, NOW())',
      [user_id, item_id, rating, content || null]
    );
    
    const newReview = await Pool.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      data: newReview[0],
      message: 'Review created successfully' 
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Failed to create review' });
  }
});

// PUT /reviews/:id - Update an existing review
router.put('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content, user_id } = req.body;
    
    // Check if review exists
    const existingReview = await Pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    
    if (!existingReview || existingReview.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    // Optional: Check if the user owns this review
    if (user_id && existingReview[0].user_id !== user_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this review' 
      });
    }
    
    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }
    
    // Build update query dynamically
    const updates = [];
    const params = [];
    
    if (rating !== undefined) {
      updates.push('rating = ?');
      params.push(rating);
    }
    
    if (content !== undefined) {
      updates.push('content = ?');
      params.push(content);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No valid fields to update' 
      });
    }
    
    params.push(id);
    
    await Pool.query(
      `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    
    const updatedReview = await Pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    
    res.json({ 
      success: true, 
      data: updatedReview[0],
      message: 'Review updated successfully' 
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
});

// DELETE /reviews/:id - Delete a review
router.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body; // Optional: for authorization
    
    // Check if review exists
    const existingReview = await Pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    
    if (!existingReview || existingReview.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    // Optional: Check if the user owns this review
    if (user_id && existingReview[0].user_id !== user_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this review' 
      });
    }
    
    await Pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    
    res.json({ 
      success: true, 
      message: 'Review deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

// GET /reviews/stats/:item_id - Get rating statistics for an item
router.get('/reviews/stats/:item_id', async (req, res) => {
  try {
    const { item_id } = req.params;
    
    const stats = await Pool.query(`
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews 
      WHERE item_id = ?
    `, [item_id]);
    
    const result = stats[0];
    
    res.json({
      success: true,
      data: {
        average_rating: parseFloat(result.average_rating || 0).toFixed(1),
        total_reviews: result.total_reviews,
        distribution: {
          5: result.five_star,
          4: result.four_star,
          3: result.three_star,
          2: result.two_star,
          1: result.one_star
        }
      }
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch review stats' });
  }
});

module.exports = router;