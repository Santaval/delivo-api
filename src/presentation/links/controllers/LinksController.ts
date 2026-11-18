import { Request, Response } from "express";
import { renderAcceptInvitationPage } from "../views/acceptInvitationPage";

export interface LinksConfig {
  /** Custom URL scheme of the mobile app (e.g. "com.tributcr.savaldev"). */
  appScheme: string;
  iosBundleId: string;
  /** Apple Developer Team ID. Without it the AASA file is not served. */
  appleTeamId: string;
  androidPackageName: string;
  /** SHA-256 fingerprints of the Android signing certs. Without them assetlinks.json is not served. */
  androidSha256CertFingerprints: string[];
  appStoreUrl: string;
  playStoreUrl: string;
}

// Paths the OS hands to the app instead of the browser. Keep in sync with the app's
// associatedDomains / intentFilters (delivo-app app.json).
const APP_LINK_PATHS = ["/invitations/*"];

// Invitation tokens are generated ids; anything else is rejected before it reaches the page.
const TOKEN_REGEX = /^[A-Za-z0-9_-]{1,128}$/;

export default class LinksController {
  constructor(private readonly config: LinksConfig) {}

  /** GET /.well-known/apple-app-site-association — iOS universal links. */
  async appleAppSiteAssociation(_req: Request, res: Response): Promise<void> {
    if (!this.config.appleTeamId) {
      res.status(404).end();
      return;
    }
    const appId = `${this.config.appleTeamId}.${this.config.iosBundleId}`;
    res
      .status(200)
      .type("application/json")
      .json({
        applinks: {
          details: [
            {
              appIDs: [appId],
              components: APP_LINK_PATHS.map((path) => ({ "/": path })),
            },
          ],
        },
      });
  }

  /** GET /.well-known/assetlinks.json — Android app links verification. */
  async assetLinks(_req: Request, res: Response): Promise<void> {
    if (this.config.androidSha256CertFingerprints.length === 0) {
      res.status(404).end();
      return;
    }
    res.status(200).json([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: this.config.androidPackageName,
          sha256_cert_fingerprints: this.config.androidSha256CertFingerprints,
        },
      },
    ]);
  }

  /**
   * GET /invitations/accept?token=… — the link in the invitation email. Accepting needs a signed-in
   * user, so this page only hands the token to the app; the app calls POST /api/v1/invitations/accept.
   */
  async acceptInvitationPage(req: Request, res: Response): Promise<void> {
    const rawToken = req.query.token;
    const token = typeof rawToken === "string" && TOKEN_REGEX.test(rawToken) ? rawToken : null;
    const appUrl = token
      ? `${this.config.appScheme}://invitations/accept?token=${encodeURIComponent(token)}`
      : null;

    res
      .status(token ? 200 : 400)
      // The token is in the URL: don't leak it to the stores via Referer, and don't cache it.
      .set("Referrer-Policy", "no-referrer")
      .set("Cache-Control", "no-store")
      .set("X-Robots-Tag", "noindex")
      .set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")
      .type("html")
      .send(
        renderAcceptInvitationPage({
          appUrl,
          appStoreUrl: this.config.appStoreUrl,
          playStoreUrl: this.config.playStoreUrl,
        }),
      );
  }
}
