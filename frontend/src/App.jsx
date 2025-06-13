import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ItemDetail from "./components/ItemDetail";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import SearchResults from "./components/SearchResults";
import "./App.css";
import {jwtDecode} from "jwt-decode";
import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState(null)
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      const decoded = jwtDecode(stored);
      const now = Date.now() / 1000; 
      if (decoded.exp && decoded.exp < now) {
        localStorage.removeItem('token');
        setToken(null);
      } else {
        setToken(stored);
      }
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar token={token}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken}/>}/>
          <Route path="/items/:id" element={<ItemDetail token={token}/>}/>
          <Route path="/profile" element={<Profile setToken={setToken}/>} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
