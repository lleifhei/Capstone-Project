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
    const { id } = req.body;

    const comment = await Pool.query("SELECT * FROM comments WHERE id = ?", [
      id,
    ]);

    if (!comment || comment.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    res.json({ success: true, data: comments[0] });
  } catch (error) {
    console.error("Error fetching comment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch comment" });
  }
});

// GET /comments/reviews/:review_id - Get all comments for a specific review
router.get("/reviews/:review_id", async (req, res) => {
  try {
    const { review_id } = req.body;
    // First check if the review exists
    const reviewExists = await Pool.query(
      "SELECT id FROM reviews WHERE id = ?",
      [review_id]
    );

    if (!reviewExists || reviewExists.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    const comments = await Pool.query(
      "SELECT * FROM comments WHERE review_id = ?",
      [review_id]
    );

    // Get total comment count for this review
    const countResult = await Pool.query(
      "SELECT COUNT(*) as total FROM comments WHERE review_id = ?",
      [review_id]
    );

    res.json({
      success: true,
      data: comments.rows,
      total_comments: countResult[0].total,
    });
  } catch (error) {
    console.error("Error fetching review comments:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch review comments" });
  }
});

// GET /comments/user/:user_id - Get all comments by a specific user
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const comments = await Pool.query(
      "SELECT * FROM comments WHERE user_id = ?",
      [user_id]
    );

    res.json({
      success: true,
      data: comments.rows,
      total_comments: countResult[0].total,
    });
  } catch (error) {
    console.error("Error fetching user comments:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user comments" });
  }
});

// POST /comments - Create a new comment
router.post("/", async (req, res) => {
  try {
    const { user_id, review_id, content } = req.body;

    // Validation
    if (!user_id || !review_id || !content) {
      return res.status(400).json({
        success: false,
        message: "user_id, review_id, and content are required",
      });
    }

    const newComment = await Pool.query("SELECT * FROM comments WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      success: true,
      data: newComment[0],
      message: "Comment created successfully",
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create comment" });
  }
});

// PUT /comments/:id - Update an existing comment
router.put("/:id", async (req, res) => {
  try {
    const { id, content, user_id } = req.body;

    // Check if comment exists
    const existingComment = await Pool.query(
      "SELECT * FROM comments WHERE id = ?",
      [id]
    );

    if (!existingComment || existingComment.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Check if the user owns this comment
    if (user_id && existingComment[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this comment",
      });
    }

    // Validation
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment content cannot be empty",
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment content cannot exceed 1000 characters",
      });
    }

    await Pool.query("UPDATE comments SET content = ? WHERE id = ?", [
      content.trim(),
      id,
    ]);

    const updatedComment = await Pool.query(
      "SELECT * FROM comments WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      data: updatedComment[0],
      message: "Comment updated successfully",
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update comment" });
  }
});

// DELETE /comments/:id - Delete a comment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body; // Optional: for authorization

    // Check if comment exists
    const existingComment = await Pool.query(
      "SELECT * FROM comments WHERE id = ?",
      [id]
    );

    if (!existingComment || existingComment.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Check if the user owns this comment
    if (user_id && existingComment[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    await Pool.query("DELETE FROM comments WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete comment" });
  }
});

module.exports = router;
