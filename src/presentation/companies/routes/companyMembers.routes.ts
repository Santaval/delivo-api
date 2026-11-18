import { Router } from "express";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import jwtAuth from "@/presentation/auth/middlewares/jwtAuth";
import { InviteMemberSchema } from "../validators/inviteMember";
import { AddMemberByCodeSchema } from "../validators/addMemberByCode";
import { AcceptInvitationSchema } from "../validators/acceptInvitation";
import requireCompanyRole from "../middlewares/requireCompanyRole";
import { companyMemberController } from "@/dependencyInjection/container";
import enforceLimit from "@/presentation/billing/middlewares/enforceLimit";
import rateLimit from "@/presentation/core/middlewares/rateLimit";

const companyMembersRouter = Router();

companyMembersRouter.use(jwtAuth);

companyMembersRouter.get(
  "/:companyId/members",
  asyncHandler(companyMemberController.listMembers.bind(companyMemberController)),
);

// The limiter runs before the handler so failed (404) lookups count too, which blunts
// enumeration of the 6-digit code space. Keyed per acting user, not per IP.
companyMembersRouter.post(
  "/:companyId/members",
  requireCompanyRole,
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    keyGenerator: (req) => `add-member:${req.user?.id ?? req.ip}`,
  }),
  // Only DEALER members consume a driver seat.
  enforceLimit("drivers", {
    companyId: (req) => req.params.companyId,
    when: (req) => req.body?.role === "DEALER",
  }),
  validateSchema(AddMemberByCodeSchema),
  asyncHandler(companyMemberController.addMemberByCode.bind(companyMemberController)),
);

companyMembersRouter.get(
  "/:companyId/invitations",
  requireCompanyRole,
  asyncHandler(companyMemberController.listInvitations.bind(companyMemberController)),
);

companyMembersRouter.post(
  "/:companyId/invitations",
  requireCompanyRole,
  // The driver seat is only consumed by DEALER invitations; ADMIN invitations don't count
  // against the plan's driver limit.
  enforceLimit("drivers", {
    companyId: (req) => req.params.companyId,
    when: (req) => req.body?.role === "DEALER",
  }),
  validateSchema(InviteMemberSchema),
  asyncHandler(companyMemberController.inviteMember.bind(companyMemberController)),
);

companyMembersRouter.delete(
  "/:companyId/invitations/:invitationId",
  requireCompanyRole,
  asyncHandler(companyMemberController.revokeInvitation.bind(companyMemberController)),
);

// Must be declared before "/:companyId/members/:userId" so "me" is not parsed as a userId.
// No requireCompanyRole: any member (including DEALER) may leave; the service checks membership.
companyMembersRouter.delete(
  "/:companyId/members/me",
  asyncHandler(companyMemberController.leaveCompany.bind(companyMemberController)),
);

companyMembersRouter.delete(
  "/:companyId/members/:userId",
  requireCompanyRole,
  asyncHandler(companyMemberController.removeMember.bind(companyMemberController)),
);

const invitationsRouter = Router();

invitationsRouter.use(jwtAuth);

invitationsRouter.post(
  "/accept",
  validateSchema(AcceptInvitationSchema),
  asyncHandler(companyMemberController.acceptInvitation.bind(companyMemberController)),
);

export { companyMembersRouter, invitationsRouter };