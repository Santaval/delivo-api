import { Router } from "express";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import jwtAuth from "@/presentation/auth/middlewares/jwtAuth";
import { InviteMemberSchema } from "../validators/inviteMember";
import { AcceptInvitationSchema } from "../validators/acceptInvitation";
import requireCompanyRole from "../middlewares/requireCompanyRole";
import { companyMemberController } from "@/dependencyInjection/container";
import enforceLimit from "@/presentation/billing/middlewares/enforceLimit";

const companyMembersRouter = Router();

companyMembersRouter.use(jwtAuth);

companyMembersRouter.get(
  "/:companyId/members",
  asyncHandler(companyMemberController.listMembers.bind(companyMemberController)),
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