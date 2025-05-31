import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ItemDetail from "./components/ItemDetail";
import Profile from "./components/Profile";
import ReviewDetail from "./components/ReviewDetail";
import Reviews from "./components/Reviews";
import NewReview from "./components/NewReview";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items/:id" element={<ItemDetail />}/>
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
