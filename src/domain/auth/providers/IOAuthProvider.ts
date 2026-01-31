export interface OAuthUserPayload {
  sub: string
  email: string
  name?: string
  picture?: string
  email_verified: boolean
}

export interface IOAuthProvider {
  getUserInfo: (accessToken: string) => Promise<OAuthUserPayload>;
}