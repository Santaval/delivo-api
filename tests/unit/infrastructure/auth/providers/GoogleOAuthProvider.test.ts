import { OAuthUserPayload } from '@/domain/auth/providers/IOAuthProvider';
import InfrastructureError from '@/infrastructure/core/errors/InfrastructureError';

const mockVerifyIdToken = jest.fn();

jest.mock('@/infrastructure/auth/config/googleOAuthClient', () => ({
  googleClient: {
    verifyIdToken: (...args: unknown[]) => mockVerifyIdToken(...args),
  },
}));

jest.mock('@/infrastructure/core/errors/InfrastructureError', () => {
  return jest.fn().mockImplementation((message: string) => {
    const error = new Error(message);
    error.name = 'InfrastructureError';
    return error;
  });
});

describe('GoogleOAuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserInfo', () => {
    const mockPayload = {
      sub: 'google-user-123',
      email: 'user@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
      email_verified: true,
    };

    it('returns OAuthUserPayload for valid verified token', async () => {
      const mockTicket = {
        getPayload: jest.fn().mockReturnValue(mockPayload),
      };
      mockVerifyIdToken.mockResolvedValue(mockTicket);

      const { default: GoogleOAuthProvider } = await import(
        '@/infrastructure/auth/providers/GoogleOAuthProvider'
      );
      const provider = new GoogleOAuthProvider();
      const result = await provider.getUserInfo('valid-google-token');

      expect(result).toEqual({
        sub: mockPayload.sub,
        email: mockPayload.email,
        name: mockPayload.name,
        picture: mockPayload.picture,
        email_verified: mockPayload.email_verified,
      } as OAuthUserPayload);

      expect(mockVerifyIdToken).toHaveBeenCalledWith({
        idToken: 'valid-google-token',
        audience: [
          process.env.GOOGLE_IOS_CLIENT_ID,
          process.env.GOOGLE_ANDROID_CLIENT_ID,
        ],
      });
    });

    it('throws InfrastructureError when payload is null', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: jest.fn().mockReturnValue(null),
      });

      const { default: GoogleOAuthProvider } = await import(
        '@/infrastructure/auth/providers/GoogleOAuthProvider'
      );
      const provider = new GoogleOAuthProvider();

      await expect(provider.getUserInfo('token')).rejects.toThrow(
        'Invalid Google token payload'
      );
    });

    it('throws InfrastructureError when email is not verified', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: jest.fn().mockReturnValue({
          ...mockPayload,
          email_verified: false,
        }),
      });

      const { default: GoogleOAuthProvider } = await import(
        '@/infrastructure/auth/providers/GoogleOAuthProvider'
      );
      const provider = new GoogleOAuthProvider();

      await expect(provider.getUserInfo('token')).rejects.toThrow(
        'Google email not verified'
      );
    });

    it('throws when verifyIdToken rejects', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Google API Error'));

      const { default: GoogleOAuthProvider } = await import(
        '@/infrastructure/auth/providers/GoogleOAuthProvider'
      );
      const provider = new GoogleOAuthProvider();

      await expect(provider.getUserInfo('token')).rejects.toThrow(
        'Google API Error'
      );
    });

    it('throws when verifyIdToken throws', async () => {
      mockVerifyIdToken.mockImplementation(() => {
        throw new Error('Verification failed');
      });

      const { default: GoogleOAuthProvider } = await import(
        '@/infrastructure/auth/providers/GoogleOAuthProvider'
      );
      const provider = new GoogleOAuthProvider();

      await expect(provider.getUserInfo('token')).rejects.toThrow(
        'Verification failed'
      );
    });
  });
});
