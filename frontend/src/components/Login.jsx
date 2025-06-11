import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import './Login.css';
import { Link } from "react-router-dom";


const Login = ( { setToken }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password
      })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user_id', response.data.user_id);
      setToken(response.data.token)
      navigate("/profile", {
        state: { user_id: response.data.user_id }
      });
      console.log("Login successful:", response.data);
    } catch (error) {

      // Handle error response
      console.error("Login error:", error);
      setError("Incorrect Email or Password.")
    }
  };


  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-title">
          Welcome Back
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          {error && <p className="comment-error">{error}</p>}
        </form>
        <div className="login-links">
          <p className="signup-link">
            Don't have an account?<Link to="signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
