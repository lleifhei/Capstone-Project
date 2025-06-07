const express = require("express");
const app = express();
const Pool = require("../db/client");
const authenticate = require("../middleware/authenticate")
const router = express.Router();


app.use(express.json());

// GET /reviews - Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Pool.query(`SELECT 
      reviews.id AS review_id,
      reviews.item_id,
      reviews.rating,
      reviews.content,
      reviews.created_at,
      users.id AS user_id,
      users.username,
      users.email,
      users.profile_image_url,
      users.role
      FROM reviews
      JOIN users ON reviews.user_id = users.id;`
    );
    res.json(reviews.rows)
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
});

// GET /reviews/:id - Get a specific review by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Pool.query("SELECT * FROM reviews WHERE id = $1", [id]);

    if (review.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({
      success: true,
      data: review.rows[0],
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ success: false, message: "Failed to fetch review" });
  }
});
  
// GET /reviews/item/:item_id - Get all reviews for a specific item
router.get("/item/:item_id", async (req, res) => {
  try {
    const { item_id } = req.params;
    const reviews = await Pool.query("SELECT * FROM reviews WHERE item_id = $1", [item_id]);
    res.json(reviews.rows)
  } catch (error) {
    console.error("Error fetching reviews for item:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews for item" });
  }
});

// GET /reviews/user/:user_id - Get all reviews by a specific user
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    // const reviews = await Pool.query("SELECT * FROM reviews WHERE user_id = $1", [user_id]);
    const reviews = await Pool.query(`SELECT 
      reviews.id AS review_id,
      reviews.item_id,
      reviews.rating,
      reviews.content,
      reviews.created_at,
      users.id AS user_id,
      users.username,
      users.email,
      users.profile_image_url,
      users.role
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      WHERE user_id = $1`, [user_id]
    );

    res.json(reviews.rows)
  } catch (error) {
    console.error("Error fetching reviews by user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews by user" });
  }
});
  
// POST /reviews - Create a new review
router.post("/", authenticate, async (req, res) => {
  try {
    const { item_id, rating, content } = req.body;
    const user_id = req.user.id;
    const newReview = await Pool.query(
      "INSERT INTO reviews (item_id, user_id, rating, content) VALUES ($1, $2, $3, $4) RETURNING *",
      [item_id, user_id, rating, content]
    );

    res.status(201).json(newReview.rows[0]);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, message: "Failed to create review" });
  }
});

// PUT /reviews/:id - Update an existing review
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content } = req.body;

    const updatedReview = await Pool.query(
      "UPDATE reviews SET rating = $1, content = $2 WHERE id = $3 RETURNING *",
      [rating, content, id]
    );

    if (updatedReview.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.json(updatedReview.rows[0])
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
});

// DELETE /reviews/:id - Delete a review
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Pool.query("DELETE FROM reviews WHERE id = $1 RETURNING *", [id]);

    if (deletedReview.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
      data: deletedReview.rows[0],
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
});


module.exports = router;
