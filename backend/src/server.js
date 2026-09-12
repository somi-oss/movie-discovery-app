require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const moviesRouter = require('./routes/movies');
app.use('/api/movies', moviesRouter);
const wishlistRouter = require('./routes/wishlist');
app.use('/api/wishlist', wishlistRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Movie Discovery API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});