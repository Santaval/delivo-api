import { IOAuthProvider, OAuthUserPayload } from "@/domain/auth/providers/IOAuthProvider";
import { googleClient } from "../config/googleOAuthClient";
import InfrastructureError from "@/infrastructure/core/errors/InfrastructureError";

export default class GoogleOAuthProvider implements IOAuthProvider {
  async getUserInfo(accessToken: string): Promise<OAuthUserPayload> {
    const ticket = await googleClient.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload()

    if (!payload) {
      throw new InfrastructureError('Invalid Google token payload')
    }

    if (!payload.email_verified) {
      throw new InfrastructureError('Google email not verified')
    }

    return {
      sub: payload.sub,
      email: payload.email!,
      name: payload.name,
      picture: payload.picture,
      email_verified: payload.email_verified
    }
  }
}
