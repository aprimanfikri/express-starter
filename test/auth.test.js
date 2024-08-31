require('dotenv').config();
const request = require('supertest');
const { it, expect, beforeAll, describe, afterAll } = require('@jest/globals');
const app = require('../app');
const connect = require('../configs/database');
const mongoose = require('mongoose');

let token;

beforeAll(() => {
  connect();
});

afterAll(() => {
  mongoose.connection.close();
});

describe('Enpoint Login', () => {
  it('Should return 400 Credentials are required.', async () => {
    const user = {
      password: process.env.ADMIN_PASSWORD,
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Credentials are required.');
  }, 15000);

  it('Should return 400 Password is required.', async () => {
    const user = {
      credentials: process.env.ADMIN_USERNAME,
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password is required.');
  }, 15000);

  it('Should return 401 Invalid credentials.', async () => {
    const user = {
      credentials: 'example',
      password: process.env.ADMIN_PASSWORD,
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials.');
  }, 15000);

  it('Should return 401 Invalid credentials.', async () => {
    const user = {
      credentials: process.env.ADMIN_USERNAME,
      password: 'wrong',
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials.');
  }, 15000);

  it('Should return 200 User logged in successfully.', async () => {
    const user = {
      credentials: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    token = response.body.token;
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User logged in successfully.');
  }, 15000);
});

describe('Endpoint Register', () => {
  it('Should return 400 Name is required.', async () => {
    const user = {
      email: 'example@example.com',
      username: 'example',
      password: 'password',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Name is required.');
  }, 15000);

  it('Should return 400 Email is required.', async () => {
    const user = {
      name: 'example',
      username: 'example',
      password: 'password',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is required.');
  }, 15000);

  it('Should return 400 Username is required.', async () => {
    const user = {
      name: 'example',
      email: 'example@example.com',
      password: 'password',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username is required.');
  }, 15000);

  it('Should return 400 Password is required.', async () => {
    const user = {
      name: 'example',
      username: 'example',
      email: 'example@example.com',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password is required.');
  }, 15000);

  it('Should return 409 Email is already in use.', async () => {
    const user = {
      name: 'example',
      email: process.env.ADMIN_EMAIL,
      username: 'example',
      password: 'password',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email is already in use.');
  }, 15000);

  it('Should return 201 User registered successfully.', async () => {
    const user = {
      name: 'example',
      email: 'example@example.com',
      username: 'example',
      password: 'password',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully.');
  }, 15000);
});

describe('Endpoint Get User', () => {
  it('Should return 401 Authorization token is required.', async () => {
    const response = await request(app).get('/api/v1/auth/me').send();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authorization token is required.');
  });

  it('Should return 401 Authorization token must start with Bearer.', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', token)
      .send();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      'Authorization token must start with Bearer.'
    );
  });

  it('Should return 401 Invalid token.', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${process.env.TOKEN_INVALID}`)
      .send();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token.');
  });

  it('Should return 401 Token has expired.', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${process.env.TOKEN_EXPIRED}`)
      .send();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token has expired.');
  });

  it('Should return 404 User not found.', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${process.env.TOKEN_NOTFOUND}`)
      .send();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found.');
  });

  it('Should return 200 User fetched successfully.', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User fetched successfully.');
  });
});
