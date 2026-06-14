import { IOAuthProvider, OAuthUserPayload } from "@/domain/auth/providers/IOAuthProvider";
import InfrastructureError from "@/infrastructure/core/errors/InfrastructureError";
import appleSignin from "apple-signin-auth";

export default class AppleOAuthProvider implements IOAuthProvider {
  async getUserInfo(identityToken: string): Promise<OAuthUserPayload> {
    try {
      const claims = await appleSignin.verifyIdToken(identityToken, {
        audience: process.env.APPLE_CLIENT_ID!,
        ignoreExpiration: false,
      });

      if (!claims.email) {
        throw new InfrastructureError("Apple identity token missing email claim");
      }

      return {
        sub: claims.sub,
        email: claims.email,
        email_verified: claims.email_verified === true || claims.email_verified === "true",
      };
    } catch (error) {
      if (error instanceof InfrastructureError) throw error;
      throw new InfrastructureError("Invalid Apple identity token");
    }
  }
}
