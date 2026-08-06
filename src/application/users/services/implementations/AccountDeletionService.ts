import { CompanyMember } from "@/domain/companies/entities/CompanyMember";
import { IUserDeletionUnitOfWork } from "@/domain/users/unitsOfWork/UserDeletionUnitOfWork";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { AccountDeletionResult, IAccountDeletionService } from "../interfaces/IAccountDeletionService";

export class AccountDeletionService implements IAccountDeletionService {
  constructor(
    private readonly userDeletionUOW: IUserDeletionUnitOfWork,
  ) {}

  async deleteAccount(userId: string): Promise<AccountDeletionResult> {
    return this.userDeletionUOW.runInTransaction(async (ctx) => {
      const userRepo       = ctx.getUserRepository();
      const companyRepo    = ctx.getCompanyRepository();
      const memberRepo     = ctx.getCompanyMemberRepository();
      const invitationRepo = ctx.getCompanyInvitationRepository();

      const user = await userRepo.find(userId, "id");
      if (!user) throw new UserNotFoundError();

      const email = user.email.value;
      const name  = `${user.name} ${user.surnames}`.trim();

      const deletedCompanyIds:  string[] = [];
      const unlinkedCompanyIds: string[] = [];

      const memberships = await memberRepo.findByUser(userId);
      for (const membership of memberships) {
        const members = await memberRepo.findByCompany(membership.companyId);
        if (CompanyMember.isLastOwner(membership, members)) {
          await companyRepo.deleteWithAllData(membership.companyId);
          deletedCompanyIds.push(membership.companyId);
        } else {
          await memberRepo.remove(userId, membership.companyId);
          unlinkedCompanyIds.push(membership.companyId);
        }
      }

      await invitationRepo.deleteManyByInvitedBy(userId);
      await invitationRepo.deleteManyByEmail(email);

      await userRepo.delete(userId);

      return { email, name, deletedCompanyIds, unlinkedCompanyIds };
    });
  }
}