import { Request, Response } from "express";
import { UpdateUserRequest } from "../requests/UpdateUserRequest";
import UserDtoMapper from "../mappers/User.mapper";
import { IUserService } from "@/application/users/services/interfaces/IUserService";

export default class MyProfileController {

  constructor(
    private readonly userService: IUserService,
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
}