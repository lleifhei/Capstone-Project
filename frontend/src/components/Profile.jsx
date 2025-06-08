import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import './Profile.css';
import axios from 'axios';

const Profile = () => {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const [data, setData] = useState([]);
  const decoded = jwtDecode(token);

  useEffect(() => {
    if (token) {
      setUser(decoded);
      if (decoded.role === 'admin') {
        setActiveTab('music');
        fetchData('music');
      } else {
        setActiveTab('reviews');
        fetchData('reviews');
      }
    }
  }, [token]);

  const fetchData = async (tab) => {
    try {
      setActiveTab(tab);
      let res;
      if(decoded.role === 'admin'){
        if (tab === 'music') res = await axios.get('http://localhost:3000/api/items');
        else if (tab === 'reviews') res = await axios.get('http://localhost:3000/api/reviews');
        else if (tab === 'comments') res = await axios.get('http://localhost:3000/api/auth');
        else if (tab === 'users') res = await axios.get('http://localhost:3000/api/auth');
      }else{
        if (tab === 'reviews') res = await axios.get(`http://localhost:3000/api/reviews/user/${decoded.id}`);
        else if (tab === 'comments') res = await axios.get(`http://localhost:3000/api/comments/user/${decoded.id}`);
      }
      setData(res.data);
    } catch (err) {
      console.error(`Error loading ${tab}:`, err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id'); 
    window.location.href = '/login'; 
  };  

  const adminTabs = ['music', 'reviews', 'users'];
  const userTabs = ['reviews', 'comments'];

  const tabs = user?.role === 'admin' ? adminTabs : userTabs;

  return (
    <div className="profile-container">
      {user && (
        <div className="user-info">
          <img
            className="user-profile-pic"
            src={user.image}
            alt={`${user.username}'s profile`}
          />
          <div className="user-details">
            <h1>{user.username}'s Profile</h1>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      )}

      <div className="profile-filter-section">
        <div className="profile-buttons">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`profile-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => fetchData(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <ul className="data-list">
          {data.map((item, idx) => {
            if (activeTab === 'music') {
              return (
                <li key={item.id || idx} className="data-card music-card">
                  <img src={item.image_url} alt={item.title} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>By {item.artist}</p>
                  </div>
                </li>
              );
            }

            if (activeTab === 'reviews') {
              return (
                <li key={item.id || idx} className="data-card review-card2">
                  <img src={item.profile_image_url} alt={item.username} />
                  <div className="review-details">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <h4>{item.username}</h4>
                    <p>{item.content}</p>
                  </div>
                </li>
              );
            }
            if (activeTab === 'reviews' && decoded.role !== 'admin') {
              return (
                <li key={item.id || idx} className="data-card review-card2">
                  <img src={item.profile_image_url} alt={item.username} />
                  <div className="review-details">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <h4>{item.username}</h4>
                    <p>{item.content}</p>
                  </div>
                </li>
              );
            }

            if (activeTab === 'users') {
              return (
                <li key={item.id || idx} className="data-card user-card">
                  <img src={item.profile_image_url || "/default-profile.png"} alt={item.email} />
                  <div>
                    <p><strong>{item.email}</strong></p>
                    <p>Role: {item.role}</p>
                  </div>
                </li>
              );
            }

            if (activeTab === 'comments') {
              return (
                <li key={item.id || idx} className="data-card comment-card2">
                  <img src={item.profile_image_url} alt={item.username} />
                  <div className="comment-details">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <h4>On Review ID: {item.review_id}</h4>
                    <p>{item.content}</p>
                  </div>
                </li>
              );
            }
            return null;
          })}
        </ul>
    </div>
  );
};

export default Profile;
