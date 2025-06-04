import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ItemDetail from "./components/ItemDetail";
import Profile from "./components/Profile";
import ReviewDetail from "./components/ReviewDetail";
import Reviews from "./components/Reviews";
import NewReview from "./components/NewReview";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
function App() {
  const token = localStorage.getItem('token')
  return (
    <>
      <BrowserRouter>
        <Navbar token={token}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/items/:id" element={<ItemDetail token={token}/>}/>
          <Route path="/profile" element={<Profile />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/:id" element={<ReviewDetail />} />
          <Route path="/new-review" element={<NewReview />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
