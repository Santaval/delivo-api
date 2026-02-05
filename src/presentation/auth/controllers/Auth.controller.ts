import { Request, Response } from "express";
import { IOAuthService } from "@/application/auth/services/interfaces/IOAuthService";
import { AuthResponse } from "../responses/AuthResponse";
import IJwtService from "@/domain/auth/services/IJwtService";
import { IUserService } from "@/application/users/services/interfaces/IUserService";
import UserDtoMapper from "@/presentation/users/mappers/User.mapper";

export default class AuthController {
  constructor(
    private readonly oAuthService: IOAuthService,
    private readonly jwtService: IJwtService,
    private readonly usersService: IUserService
  ) {}

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      
      if (!token) {
        res.status(400).json({ message: "Token de Google es requerido" });
        return;
      }

      // Authenticate with Google and get/create user
      const user = await this.oAuthService.google(token);

      // Generate JWT token
      const jwtToken = this.jwtService.generateToken({
        id: user.id,
        email: user.email.value,
      });

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email.value,
          name: user.name,
          surnames: user.surnames,
        },
        token: jwtToken,
        expiresIn: "7d", // Should match JWT_EXPIRES_IN
      };

      res.json(response);
    } catch (error) {
      console.error("Google login error:", error);
      res.status(401).json({ message: "Autenticación fallida" });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: "Token no proporcionado" });
      return;
    }

    const token = authHeader.substring(7);
    const payload = this.jwtService.verifyToken(token);

    if (!payload) {
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    // Fetch user information
    const user = await this.usersService.find(payload.id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.json(UserDtoMapper.toResponse(user));
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: "Token no proporcionado" });
        return;
      }

      const token = authHeader.substring(7);
      const payload = this.jwtService.verifyToken(token);
      
      if (!payload) {
        res.status(401).json({ message: "Token inválido" });
        return;
      }

      // Generate new token
      const newToken = this.jwtService.generateToken({
        id: payload.id,
        email: payload.email,
      });

      res.json({
        token: newToken,
        expiresIn: "7d",
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(401).json({ message: "Error renovando token" });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // With JWT, logout is handled client-side by removing the token
    // Optionally, you could implement a token blacklist here
    res.json({ message: "Sesión cerrada exitosamente" });
  }
}
