const express = require("express");
const app = express();
const Pool = require("../db/client");
const router = express.Router();

app.use(express.json());

// GET /comments - Get all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Pool.query("SELECT * FROM comments");

    res.json({
      success: true,
      data: comments.rows,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch comments" });
  }
});

// GET /comments/:id - Get a specific comment by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Pool.query("SELECT * FROM comments WHERE id = $1", [id]);

    if (comment.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    res.json({
      success: true,
      data: comment.rows[0],
    });
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({ success: false, message: "Failed to fetch comment" });
  }
});

// GET /comments/reviews/:review_id - Get all comments for a specific review
router.get("/reviews/:review_id", async (req, res) => {
  try {
    const { review_id } = req.params;
    const comments = await Pool.query("SELECT * FROM comments WHERE review_id = $1", [review_id]);

    res.json({
      success: true,
      data: comments.rows,
    });
  } catch (error) {
    console.error("Error fetching comments for review:", error);
    res.status(500).json({ success: false, message: "Failed to fetch comments for review" });
  }
});

// GET /comments/user/:user_id - Get all comments by a specific user
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const comments = await Pool.query("SELECT * FROM comments WHERE user_id = $1", [user_id]);

    res.json({
      success: true,
      data: comments.rows,
    });
  } catch (error) {
    console.error("Error fetching comments by user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch comments by user" });
  }
});

// POST /comments - Create a new comment
router.post("/", async (req, res) => {
  try {
    const { user_id, review_id, content } = req.body;
    const newComment = await Pool.query(
      "INSERT INTO comments (user_id, review_id, content) VALUES ($1, $2, $3) RETURNING *",
      [user_id, review_id, content]
    );

    res.status(201).json({
      success: true,
      data: newComment.rows[0],
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Failed to create comment" });
  }
});

// PUT /comments/:id - Update an existing comment
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedComment = await Pool.query(
      "UPDATE comments SET content = $1 WHERE id = $2 RETURNING *",
      [content, id]
    );

    if (updatedComment.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    res.json({
      success: true,
      data: updatedComment.rows[0],
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ success: false, message: "Failed to update comment" });
  }
});

// DELETE /comments/:id - Delete a comment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await Pool.query("DELETE FROM comments WHERE id = $1 RETURNING *", [id]);

    if (deletedComment.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Failed to delete comment" });
  }
});

module.exports = router;
