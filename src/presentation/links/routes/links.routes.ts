import { Router } from "express";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import { linksController } from "@/dependencyInjection/container";

/**
 * Public, unversioned routes for the links domain (APP_INVITE_URL's host). Mounted at the app
 * root, not under /api/v1: iOS and Android fetch the verification files from fixed paths, and
 * the invitation email links to /invitations/accept directly.
 */
const linksRouter = Router();

linksRouter.get(
  "/.well-known/apple-app-site-association",
  asyncHandler(linksController.appleAppSiteAssociation.bind(linksController)),
);

linksRouter.get(
  "/.well-known/assetlinks.json",
  asyncHandler(linksController.assetLinks.bind(linksController)),
);

linksRouter.get(
  "/invitations/accept",
  asyncHandler(linksController.acceptInvitationPage.bind(linksController)),
);

export default linksRouter;
