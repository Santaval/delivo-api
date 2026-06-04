import ApplicationError from '@/application/core/errors/ApplicationError';

describe('ApplicationError', () => {
  describe('constructor', () => {
    it('sets default values with empty message', () => {
      const error = new ApplicationError('');

      expect(error.message).toBe('');
      expect(error.name).toBe('ApplicationError');
      expect(error.statusCode).toBe(500);
      expect(error.status).toBe('error');
      expect(error.isOperational).toBe(true);
      expect(error.layer).toBe('application');
    });

    it('sets custom message and status code', () => {
      const error = new ApplicationError('Custom error message', 400);

      expect(error.message).toBe('Custom error message');
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('fail');
    });

    it('sets fail status for 4xx codes', () => {
      const error404 = new ApplicationError('Not found', 404);
      expect(error404.status).toBe('fail');

      const error422 = new ApplicationError('Unprocessable', 422);
      expect(error422.status).toBe('fail');

      const error409 = new ApplicationError('Conflict', 409);
      expect(error409.status).toBe('fail');
    });

    it('sets error status for non-4xx codes', () => {
      const error500 = new ApplicationError('Server error', 500);
      expect(error500.status).toBe('error');

      const error503 = new ApplicationError('Unavailable', 503);
      expect(error503.status).toBe('error');
    });
  });
});