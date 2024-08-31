const { it, expect, describe } = require('@jest/globals');
require('dotenv').config();
const ApiError = require('../utils/error');
const request = require('supertest');
const app = require('../app');

describe('ApiError', () => {
  it('should set status to "failed" for 404 statusCode', () => {
    const apiError = new ApiError('Not Found', 404);
    expect(apiError.status).toBe('failed');
  });

  it('should set status to "error" for 500 statusCode', () => {
    const apiError = new ApiError('Internal Server Error', 500);
    expect(apiError.status).toBe('error');
  });

  it('should set status to "error" for 200 statusCode', () => {
    const apiError = new ApiError('OK', 200);
    expect(apiError.status).toBe('error');
  });
});

describe('API Not Found', () => {
  it('should return 404 Not Found', async () => {
    const response = await request(app).get('/api/v1/other');
    expect(response.statusCode).toBe(404);
  });
});
