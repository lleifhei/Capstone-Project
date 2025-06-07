import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ItemDetail from "./components/ItemDetail";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { useState, useEffect } from "react";
function App() {
  const [token, setToken] = useState(null)
  useEffect(() => {
    const store = localStorage.getItem('token');
    if (store) setToken(store)
  })
  return (
    <>
      <BrowserRouter>
        <Navbar token={token}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken}/>}/>
          <Route path="/items/:id" element={<ItemDetail token={token}/>}/>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
