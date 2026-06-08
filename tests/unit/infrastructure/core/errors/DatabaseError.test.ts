import DatabaseError from '@/infrastructure/core/errors/DatabaseError';
import InfrastructureError from '@/infrastructure/core/errors/InfrastructureError';

describe('DatabaseError', () => {
  describe('constructor', () => {
    it('extends InfrastructureError', () => {
      const error = new DatabaseError('DB error');
      expect(error).toBeInstanceOf(InfrastructureError);
    });

    it('has name "DatabaseError"', () => {
      const error = new DatabaseError('DB error');
      expect(error.name).toBe('DatabaseError');
    });

    it('passes message to parent', () => {
      const error = new DatabaseError('Specific DB error');
      expect(error.message).toBe('Specific DB error');
    });

    it('generates a stack trace', () => {
      const error = new DatabaseError('DB error');
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('has default statusCode of 500', () => {
      const error = new DatabaseError('DB error');
      expect(error.statusCode).toBe(500);
    });

    it('has layer "infrastructure"', () => {
      const error = new DatabaseError('DB error');
      expect(error.layer).toBe('infrastructure');
    });

    it('is operational', () => {
      const error = new DatabaseError('DB error');
      expect(error.isOperational).toBe(true);
    });
  });
});
