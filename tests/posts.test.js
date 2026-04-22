// tests/posts.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /posts — pagination and filtering', () => {
  it('returns the first page with default limit of 10', async () => {
    const res = await request(app).get('/posts');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
    expect(res.body.page).toBe(1);
    expect(res.body.total).toBe(25);
  });

  it('respects page and limit query params', async () => {
    const res = await request(app).get('/posts?page=2&limit=5');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.page).toBe(2);
    expect(res.body.data[0].id).toBe(6); // page 2, limit 5 starts at id 6
  });

  it('filters by category', async () => {
    const res = await request(app).get('/posts?category=tech');

    expect(res.status).toBe(200);
    res.body.data.forEach(post => {
      expect(post.category).toBe('tech');
    });
  });

  it('returns the correct totalPages', async () => {
    const res = await request(app).get('/posts?limit=10');

    expect(res.body.totalPages).toBe(3); // 25 posts / 10 per page
  });

  it('returns an empty data array for an out-of-range page', async () => {
    const res = await request(app).get('/posts?page=999');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.data).toHaveLength(1);
  });
});