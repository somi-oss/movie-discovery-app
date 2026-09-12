const express = require('express');
const router = express.Router();
const prisma = require('../db/prismaClient');

// GET all wishlist items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.wishlist.findMany({
      orderBy: { addedAt: 'desc' },
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching wishlist:', error.message);
    res.status(500).json({ error: 'Failed to fetch wishlist.' });
  }
});

// POST add a movie to the wishlist
router.post('/', async (req, res) => {
  try {
    const { movieId, title, posterPath, releaseYear, rating } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({ error: 'movieId and title are required.' });
    }

    const item = await prisma.wishlist.create({
      data: { movieId, title, posterPath, releaseYear, rating },
    });

    res.status(201).json(item);
  } catch (error) {
    // Prisma throws a specific error code when a @unique constraint is violated
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Movie is already in your wishlist.' });
    }
    console.error('Error adding to wishlist:', error.message);
    res.status(500).json({ error: 'Failed to add movie to wishlist.' });
  }
});

// DELETE remove a movie from the wishlist
router.delete('/:movieId', async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId);

    await prisma.wishlist.delete({
      where: { movieId },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Movie not found in wishlist.' });
    }
    console.error('Error removing from wishlist:', error.message);
    res.status(500).json({ error: 'Failed to remove movie from wishlist.' });
  }
});

// GET check if a specific movie is already wishlisted (useful for showing a filled/empty heart icon)
router.get('/check/:movieId', async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId);
    const item = await prisma.wishlist.findUnique({ where: { movieId } });
    res.json({ isWishlisted: !!item });
  } catch (error) {
    console.error('Error checking wishlist status:', error.message);
    res.status(500).json({ error: 'Failed to check wishlist status.' });
  }
});

module.exports = router;