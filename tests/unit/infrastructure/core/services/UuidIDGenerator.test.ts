import UuidIDGenerator from '@/infrastructure/core/services/UuidIDGenerator';

jest.mock('uuid', () => ({
  v7: jest.fn(() => '01914a32-7c4c-70f1-9e8a-123456789abc'),
}));

describe('UuidIDGenerator', () => {
  let generator: UuidIDGenerator;

  beforeEach(() => {
    generator = new UuidIDGenerator();
  });

  describe('generate', () => {
    it('returns a string', () => {
      const result = generator.generate();
      expect(typeof result).toBe('string');
    });

    it('returns a valid UUID v7 format', () => {
      const result = generator.generate();
      const uuidV7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(result).toMatch(uuidV7Regex);
    });

    it('calls uuid v7 function', () => {
      const { v7 } = jest.requireMock('uuid');
      generator.generate();
      expect(v7).toHaveBeenCalled();
    });

    it('generates unique IDs on multiple calls when mocked', () => {
      const { v7 } = jest.requireMock('uuid');
      v7.mockReturnValueOnce('01914a32-7c4c-70f1-9e8a-111111111111');
      v7.mockReturnValueOnce('01914a32-7c4c-70f1-9e8a-222222222222');
      v7.mockReturnValueOnce('01914a32-7c4c-70f1-9e8a-333333333333');

      const id1 = generator.generate();
      const id2 = generator.generate();
      const id3 = generator.generate();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });
  });
});
