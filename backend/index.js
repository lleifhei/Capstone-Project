require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth')
const itemsRoutes = require('./routes/items')
const reviewsRouter = require('./routes/reviews');
const commentsRouter = require('./routes/comments');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('API is running'));

app.use('/api/auth', authRoutes)
app.use('/api/items', itemsRoutes)
app.use('/api/reviews', reviewsRouter);
app.use('/api/comments', commentsRouter);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
