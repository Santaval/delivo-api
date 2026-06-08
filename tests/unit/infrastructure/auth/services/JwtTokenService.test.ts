import { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import JwtTokenService from '@/infrastructure/auth/services/JwtTokenService';

jest.mock('jsonwebtoken', () => {
  const mockSign = jest.fn<string, [string | object, Secret, SignOptions?]>();;
  const mockVerify = jest.fn<JwtPayload | string, [string, Secret]>();
  return {
    __esModule: true,
    default: { sign: mockSign, verify: mockVerify },
    sign: mockSign,
    verify: mockVerify,
  };
});

const mockSign = (jest.requireMock('jsonwebtoken') as { sign: jest.Mock<string, [string | object, Secret, SignOptions?]> }).sign;
const mockVerify = (jest.requireMock('jsonwebtoken') as { verify: jest.Mock<JwtPayload | string, [string, Secret]> }).verify;

describe('JwtTokenService', () => {
  const mockSecret: Secret = 'test-secret';
  const mockExpiresIn = '7d';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('uses provided secret and expiresIn', () => {
      const service = new JwtTokenService(mockSecret, '1h');
      expect(service).toBeDefined();
    });

    it('uses environment variables as fallback', () => {
      const originalSecret = process.env.JWT_SECRET;
      const originalExpiresIn = process.env.JWT_EXPIRES_IN;

      process.env.JWT_SECRET = 'env-secret';
      process.env.JWT_EXPIRES_IN = '24h';

      const service = new JwtTokenService();

      process.env.JWT_SECRET = originalSecret;
      process.env.JWT_EXPIRES_IN = originalExpiresIn;

      expect(service).toBeDefined();
    });
  });

  describe('generateToken', () => {
    it('generates a valid JWT token with correct payload', () => {
      const payload = { id: 'user-1', email: 'test@example.com' };
      const mockToken = 'mock.jwt.token';

      mockSign.mockReturnValue(mockToken);

      const service = new JwtTokenService(mockSecret, mockExpiresIn);
      const result = service.generateToken(payload);

      expect(result).toBe(mockToken);
      expect(mockSign).toHaveBeenCalledWith(
        payload,
        mockSecret,
        { expiresIn: mockExpiresIn } as SignOptions
      );
    });

    it('excludes iat and exp from input payload', () => {
      const payload = { id: 'user-1', email: 'test@example.com' };
      mockSign.mockReturnValue('token');

      const service = new JwtTokenService(mockSecret, mockExpiresIn);
      service.generateToken(payload);

      const signCall = mockSign.mock.calls[0];
      const signedPayload = signCall?.[0] as object;
      expect(signedPayload).not.toHaveProperty('iat');
      expect(signedPayload).not.toHaveProperty('exp');
    });
  });

  describe('verifyToken', () => {
    it('returns decoded payload for valid token', () => {
      const token = 'valid.jwt.token';
      const decodedPayload = { id: 'user-1', email: 'test@example.com' } as JwtPayload;

      mockVerify.mockReturnValue(decodedPayload);

      const service = new JwtTokenService(mockSecret, mockExpiresIn);
      const result = service.verifyToken(token);

      expect(result).toEqual(decodedPayload);
      expect(mockVerify).toHaveBeenCalledWith(token, mockSecret);
    });

    it('returns null when jwt.verify throws an error', () => {
      const token = 'invalid-token';
      mockVerify.mockImplementation(() => {
        throw new Error('invalid signature');
      });

      const service = new JwtTokenService(mockSecret, mockExpiresIn);
      const result = service.verifyToken(token);

      expect(result).toBeNull();
    });

    it('returns null when jwt.verify returns a string', () => {
      const token = 'string-only-token';
      mockVerify.mockReturnValue('string-payload');

      const service = new JwtTokenService(mockSecret, mockExpiresIn);
      const result = service.verifyToken(token);

      expect(result).toBeNull();
    });

    it('returns null for malformed token', () => {
      const token = 'not.a.jwt';
      mockVerify.mockImplementation(() => {
        throw new Error('JsonWebTokenError: malformed token');
      });

      const service = new JwtTokenService(mockSecret, mockExpiresIn);
      const result = service.verifyToken(token);

      expect(result).toBeNull();
    });

    it('returns null for expired token', () => {
      const token = 'expired.jwt.token';
      mockVerify.mockImplementation(() => {
        throw new Error('TokenExpiredError: jwt expired');
      });

      const service = new JwtTokenService(mockSecret, mockExpiresIn);
      const result = service.verifyToken(token);

      expect(result).toBeNull();
    });
  });
});
