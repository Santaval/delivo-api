import DatabaseInsertError from '@/infrastructure/core/errors/DatabaseInsertError';
import InfrastructureError from '@/infrastructure/core/errors/InfrastructureError';

describe('DatabaseInsertError', () => {
  describe('constructor', () => {
    it('extends InfrastructureError', () => {
      const error = new DatabaseInsertError('Insert error');
      expect(error).toBeInstanceOf(InfrastructureError);
    });

    it('has name "DatabaseInsertError"', () => {
      const error = new DatabaseInsertError('Insert error');
      expect(error.name).toBe('DatabaseInsertError');
    });

    it('passes message to parent', () => {
      const error = new DatabaseInsertError('Specific insert error');
      expect(error.message).toBe('Specific insert error');
    });

    it('generates a stack trace', () => {
      const error = new DatabaseInsertError('Insert error');
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('has default statusCode of 500', () => {
      const error = new DatabaseInsertError('Insert error');
      expect(error.statusCode).toBe(500);
    });

    it('has layer "infrastructure"', () => {
      const error = new DatabaseInsertError('Insert error');
      expect(error.layer).toBe('infrastructure');
    });

    it('is operational', () => {
      const error = new DatabaseInsertError('Insert error');
      expect(error.isOperational).toBe(true);
    });
  });
});
