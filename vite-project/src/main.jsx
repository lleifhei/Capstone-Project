import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Router } from 'react-router-dom'
import { Route } from 'react-router-dom'
import App from './App.jsx'
import Home from './routes/Home.jsx'
import Profile from './routes/Profile.jsx'
import ReviewDetail from './routes/ReviewDetail.jsx'
import Reviews from './routes/Reviews.jsx'
import NewReview from './routes/NewReview.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Router>
        <App />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reviews/:id" element={<ReviewDetail />} />
        <Route path="/new-review" element={<NewReview />} />
      </Router>
    </BrowserRouter>
    
  </StrictMode>,
)
