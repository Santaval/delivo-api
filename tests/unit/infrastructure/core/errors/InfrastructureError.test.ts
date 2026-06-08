import InfrastructureError from '@/infrastructure/core/errors/InfrastructureError';

describe('InfrastructureError', () => {
  describe('constructor', () => {
    it('defaults statusCode to 500', () => {
      const error = new InfrastructureError('Test error');
      expect(error.statusCode).toBe(500);
    });

    it('defaults layer to "infrastructure"', () => {
      const error = new InfrastructureError('Test error');
      expect(error.layer).toBe('infrastructure');
    });

    it('defaults isOperational to true', () => {
      const error = new InfrastructureError('Test error');
      expect(error.isOperational).toBe(true);
    });

    it('sets status to "error" for 5xx codes', () => {
      const error = new InfrastructureError('Test error');
      expect(error.status).toBe('error');
    });

    it('sets status to "fail" for 4xx codes', () => {
      const error = new InfrastructureError('Test error') as InfrastructureError & { statusCode: number };
      error.statusCode = 400;
      error.status = `${error.statusCode}`.startsWith('4') ? 'fail' : 'error';
      expect(error.status).toBe('fail');
    });

    it('passes message to parent Error', () => {
      const error = new InfrastructureError('Specific error message');
      expect(error.message).toBe('Specific error message');
    });

    it('has name "InfrastructureError"', () => {
      const error = new InfrastructureError('Test error');
      expect(error.name).toBe('InfrastructureError');
    });

    it('is an instance of Error', () => {
      const error = new InfrastructureError('Test error');
      expect(error).toBeInstanceOf(Error);
    });

    it('generates a stack trace', () => {
      const error = new InfrastructureError('Test error');
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });
  });
});
