import { React, useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import "./Review.css"


const Profile = () => {
  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]);

  let { token, user_id } = useParams();
  if (!user_id) {
    user_id = localStorage.getItem("user_id");
  }
  if (!token) {
    token = localStorage.getItem("token");
  }
  const isAuthenticated = token && user_id;
  if (!isAuthenticated) {
    console.error("No user_id or token found in localStorage");
    window.location.href = "/login"; // Redirect to login page if no user_id or token
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [user_id, token]);
  // State to hold user reviews
  // and fetch reviews from the backend

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }
        const response = await axios.get(
          `http://localhost:3000/api/reviews/users/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.rows || []);
        if (response.rows.length === 0) {
          console.log("No reviews found for this user.");
        }
        console.log("Fetched reviews:", response.rows);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [user_id]);

  const handleAccountDeletion = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      await axios.delete(`http://localhost:3000/api/users/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page after deletion
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
    <div className="profile-container">
      <div className="user-profile-container">
        <h1 className="user-profile-title">
          {user.username ? `${user.username}'s Profile` : "My Profile"}
        </h1>
        <h2 className="user-joined">
          Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
        </h2>
      </div>
      <div className="reviews-container">
        User Reviews:
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <h3 className="review-title">{review.title}</h3>
              <p className="review-content">{review.content}</p>
              <p className="review-rating">Rating: {review.rating}</p>
              <p className="review-date">
                Date: {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>You haven't posted any reviews yet!</p>
        )}
      </div>
      <div className="profile-actions">
        <button className="delete-account-button" onClick={handleAccountDeletion}>Delete Account</button>
      
      </div>
      <div className="logout-container">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login"; // Redirect to login page
          }}
        >
          Logout
        </button>
      </div>
    </div>
    </>
  );
};

export default Profile;
