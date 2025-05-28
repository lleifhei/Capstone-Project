import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import ReviewDetail from "./routes/ReviewDetail";
import Reviews from "./routes/Reviews";
import NewReview from "./routes/NewReview";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
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
