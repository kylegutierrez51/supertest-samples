// tests/profile.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Helper: generate a token directly so tests don't depend on /login
function makeToken(payload = { id: 1, email: 'alice@test.com' }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

describe('GET /profile/me', () => {
  it('returns the current user when token is valid', async () => {
    const token = makeToken();

    const res = await request(app)
      .get('/profile/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('alice@test.com');
  });

  it('returns 401 when no token is sent', async () => {
    const res = await request(app).get('/profile/me');
    expect(res.status).toBe(401);
  });

  it('returns 403 when the token is invalid/tampered', async () => {
    const res = await request(app)
      .get('/profile/me')
      .set('Authorization', 'Bearer totally.fake.token');

    expect(res.status).toBe(403);
  });

  it('returns 403 when the token is expired', async () => {
    const expiredToken = jwt.sign(
      { id: 1, email: 'alice@test.com' },
      JWT_SECRET,
      { expiresIn: '-1s' } // already expired
    );

    const res = await request(app)
      .get('/profile/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(403);
  });
});

describe('PUT /profile/me', () => {
  it('updates displayName for an authenticated user', async () => {
    const token = makeToken();

    const res = await request(app)
      .put('/profile/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'Alice W.' });

    expect(res.status).toBe(200);
    expect(res.body.displayName).toBe('Alice W.');
  });

  it('returns 400 if displayName is missing', async () => {
    const token = makeToken();

    const res = await request(app)
      .put('/profile/me')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});