import OAuthService from "@/application/auth/services/implementations/IOAuthService";
import { UserService } from "@/application/users/services/implementations/UserService";
import GoogleOAuthProvider from "@/infrastructure/auth/providers/GoogleOAuthProvider";
import UuidIDGenerator from "@/infrastructure/core/services/UuidIDGenerator";
import PrismaUsersRepository from "@/infrastructure/users/repositories/PrismaUsersRepository";
import MyProfileController from "@/presentation/users/controllers/MyProfile.controller";

// ==================== INFRASTRUCTURE ====================

// repositories
export const userRepository = new PrismaUsersRepository();

// providers
export const idGenerator = new UuidIDGenerator();
export const googleOAuthProvider = new GoogleOAuthProvider();


// ==================== APPLICATION ====================

// services
export const userService = new UserService(userRepository);
export const oAuthService = new OAuthService(userService, googleOAuthProvider, idGenerator)

//  ==================== PRESENTATION ====================

// controllers
export const myProfileController = new MyProfileController(userService);
