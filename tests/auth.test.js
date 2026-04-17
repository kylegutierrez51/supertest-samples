// tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const { users } = require('../routes/auth');

beforeEach(() => {
  users.length = 0; // reset in-memory store between tests
});

describe('POST /auth/register', () => {
  it('registers a new user and returns id + email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'alice@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('alice@test.com');
    expect(res.body).toHaveProperty('id');
    expect(res.body).not.toHaveProperty('password'); // never leak passwords
  });

  it('returns 400 if password is missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'alice@test.com' }); // no password

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it('returns 400 if email is missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ password: 'hi-squidward' }); // no email

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it('returns 400 if email and password are missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({}); // no email or password

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it('returns 409 if email is already taken', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'alice@test.com', password: 'password123' });

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'alice@test.com', password: 'different' });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already registered/i);
  });
});

describe('POST /auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'alice@test.com', password: 'password123' });
  });

  it('returns a JWT token on valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('returns 401 on wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('returns 401 for an unregistered email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'ghost@test.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});