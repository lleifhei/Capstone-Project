const express = require("express");
const app = express();
const Pool = require("../db/client");
const router = express.Router();

app.use(express.json());

// GET /reviews - Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Pool.query("SELECT * FROM reviews");

    res.json({
      success: true,
      data: reviews.rows,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
});

// GET /reviews/:id - Get a specific review by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Pool.query("SELECT * FROM reviews WHERE id = ?", [id]);

    if (!review || review.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, data: reviews[0] });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ success: false, message: "Failed to fetch review" });
  }
});

// GET /reviews/item/:item_id - Get all reviews for a specific item
router.get("/item/:item_id", async (req, res) => {
  try {
    const { item_id } = req.params;

    const reviews = await Pool.query(
      "SELECT * FROM reviews WHERE item_id = ?",
      [item_id]
    );

    // Get average rating for the item
    const avgRating = await Pool.query(
      "SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM reviews WHERE item_id = ?",
      [item_id]
    );

    res.json({
      success: true,
      data: reviews.rows,
      stats: {
        average_rating: parseFloat(avgRating[0].average_rating || 0).toFixed(1),
        total_reviews: avgRating[0].total_reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching item reviews:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch item reviews" });
  }
});

// GET /reviews/user/:user_id - Get all reviews by a specific user
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const reviews = await Pool.query(
      "SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [user_id]
    );

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user reviews" });
  }
});

// POST /reviews - Create a new review
router.post("/", async (req, res) => {
  try {
    const { user_id, item_id, rating, content } = req.body;

    // Validation
    if (!user_id || !item_id || !rating) {
      return res.status(400).json({
        success: false,
        message: "user_id, item_id, and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if user already reviewed this item
    const existingReview = await Pool.query(
      "SELECT id FROM reviews WHERE user_id = ? AND item_id = ?",
      [user_id, item_id]
    );

    if (existingReview.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User has already reviewed this item",
      });
    }

    const result = await Pool.query(
      "INSERT INTO reviews (user_id, item_id, rating, content, created_at) VALUES (?, ?, ?, ?, NOW())",
      [user_id, item_id, rating, content || null]
    );

    const newReview = await Pool.query("SELECT * FROM reviews WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      success: true,
      data: newReview[0],
      message: "Review created successfully",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create review" });
  }
});

// PUT /reviews/:id - Update an existing review
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content, user_id } = req.body;

    // Check if review exists
    const existingReview = await Pool.query(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );

    if (!existingReview || existingReview.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Optional: Check if the user owns this review
    if (user_id && existingReview[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (rating !== undefined) {
      updates.push("rating = ?");
      params.push(rating);
    }

    if (content !== undefined) {
      updates.push("content = ?");
      params.push(content);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    params.push(id);

    await Pool.query(
      `UPDATE reviews SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    const updatedReview = await Pool.query(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      data: updatedReview[0],
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update review" });
  }
});

// DELETE /reviews/:id - Delete a review
router.delete("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body; // Optional: for authorization

    // Check if review exists
    const existingReview = await Pool.query(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );

    if (!existingReview || existingReview.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Optional: Check if the user owns this review
    if (user_id && existingReview[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    await Pool.query("DELETE FROM reviews WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete review" });
  }
});

module.exports = router;
