import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ItemDetail from "./components/ItemDetail";
import Profile from "./routes/Profile";
import ReviewDetail from "./routes/ReviewDetail";
import Reviews from "./routes/Reviews";
import NewReview from "./routes/NewReview";
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
