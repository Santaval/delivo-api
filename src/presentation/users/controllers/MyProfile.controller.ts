import { Request, Response } from "express";
import { UpdateUserRequest } from "../requests/UpdateUserRequest";
import UserDtoMapper from "../mappers/User.mapper";
import { IUserService } from "@/application/users/services/interfaces/IUserService";
import { IAccountDeletionService } from "@/application/users/services/interfaces/IAccountDeletionService";
import AccountDeletionEmailSender from "@/application/users/services/AccountDeletionEmailSender";

export default class MyProfileController {

  constructor(
    private readonly userService: IUserService,
    private readonly accountDeletionService: IAccountDeletionService,
    private readonly accountDeletionEmailSender: AccountDeletionEmailSender,
  ) {}

  async update(req: Request, res: Response): Promise<void> {
    // @ts-expect-error 
    const { id } = req.user;
    const { body } = req;
    const data: UpdateUserRequest = {
      id,
      ...body
    }
    await this.userService.update(UserDtoMapper.fromUpdateRequestToEntity(data));
    const updatedUser = await this.userService.find(id);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(UserDtoMapper.toResponse(updatedUser));
  }

  async me(req: Request, res: Response): Promise<void> {
    // @ts-expect-error
    const { id } = req.user;
    const user = await this.userService.find(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(UserDtoMapper.toMyProfileResponse(user));
  }

  async logout(req: Request, res: Response) {
    // Invalidate user session or token here if applicable
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  }

  async deleteAccount(req: Request, res: Response): Promise<void> {
    // @ts-expect-error
    const { id } = req.user;
    const result = await this.accountDeletionService.deleteAccount(id);

    // Audit trail for a destructive action: userId + counts only.
    // Never log the email or any tokens.
    console.log(
      `[account-deletion] userId=${id} deletedCompanies=${result.deletedCompanyIds.length} unlinkedCompanies=${result.unlinkedCompanyIds.length}`,
    );

    // Send the confirmation email AFTER the deletion has committed (deleteAccount
    // returns only once the transaction is done). A Resend outage must never
    // revert the deletion nor surface as 500 to the client.
    try {
      await this.accountDeletionEmailSender.sendDeletionConfirmationEmail(
        result.email,
        result.name,
        result.deletedCompanyIds.length,
      );
    } catch (error) {
      console.error("Failed to send account deletion confirmation email:", error);
    }

    res.status(204).send();
  }
}