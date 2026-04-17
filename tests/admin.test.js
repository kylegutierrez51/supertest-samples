// tests/admin.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

function tokenFor(role) {
  return jwt.sign({ id: 1, email: 'user@test.com', role }, JWT_SECRET, {
    expiresIn: '1h',
  });
}

describe('GET /admin/dashboard', () => {
  it('allows access for admin role', async () => {
    const res = await request(app)
      .get('/admin/dashboard')
      .set('Authorization', `Bearer ${tokenFor('admin')}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/admin dashboard/i);
  });

  it('blocks access for regular user role', async () => {
    const res = await request(app)
      .get('/admin/dashboard')
      .set('Authorization', `Bearer ${tokenFor('user')}`);

    expect(res.status).toBe(403);
  });
});

describe('DELETE /admin/users/:id', () => {
  it('allows moderators to delete users', async () => {
    const res = await request(app)
      .delete('/admin/users/42')
      .set('Authorization', `Bearer ${tokenFor('moderator')}`);

    expect(res.status).toBe(200);
    expect(res.body.deleted).toBe(42);
  });

  it('blocks viewers from deleting users', async () => {
    const res = await request(app)
      .delete('/admin/users/42')
      .set('Authorization', `Bearer ${tokenFor('viewer')}`);

    expect(res.status).toBe(403);
  });
});