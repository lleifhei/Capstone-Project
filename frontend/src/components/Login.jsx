import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming you have a loginUser function that handles the API call
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      })
      localStorage.setItem('token', response.data.token)
      navigate("/");
    } catch (error) {
      setError("An error occurred while logging in.");
      alert("An error occurred while logging in.");
    }
  };


  return (
 
  
//     <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//       <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
        
//         <div>
//           <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
//           <div className="mt-2">
//             <input type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={(e) => setEmail(e.target.value)} />
//           </div>
//         </div>
  
//         <div>
          
//             <label htmlFor="password">Password</label>
          
//             <input type="password" name="password" id="password" autoComplete="current-password" required onChange={(e) => setPassword(e.target.value)}/>
//           </div>
        
  
//         <div>
//           <button type="submit" className="login-button">Login</button>
//         </div>
//         {error && <p className="comment-error">{error}</p>}
//       </form>
//       <p className="mt-10 text-center text-sm/6 text-gray-500">
//         Don't have an account?{" "}
//         <a href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign up</a>
//       </p>
  
     
//     </div>
//   </div>
//     );
// }
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
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
