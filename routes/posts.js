// routes/posts.js
// try: http://localhost:3000/posts?page=2&limit=5&category=tech
const express = require('express');
const router = express.Router();

// Fake dataset
const posts = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  category: i % 2 === 0 ? 'tech' : 'lifestyle',
}));

router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));
  const { category } = req.query;

  let filtered = category
    ? posts.filter(p => p.category === category)
    : posts;

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  res.status(200).json({
    data: paginated,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  });
});

module.exports = router;