import { Request, Response } from "express";
import { User } from "@/domain/users/entities/User";
import UserDtoMapper from "@/presentation/users/mappers/User.mapper";

export default class AuthController {
  constructor( ) { }

  /** Handle user login request
     * @param req The request object.
     * @param res The response object.
     */
  async login(req: Request, res: Response) {
    const user = req.user as User;
    res.status(200).json(UserDtoMapper.toMyProfileResponse(user));
  }

  /** Handle user registration request
     * @param req The request object.
     * @param res The response object.
     */
  async registerUser(req: Request, res: Response) {
    const user = req.user as User;
    res.status(200).json(UserDtoMapper.toMyProfileResponse(user));
  }


  /**
   * Logout user
   * @param req 
   * @param res
   */
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