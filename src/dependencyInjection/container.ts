import OAuthService from "@/application/auth/services/implementations/IOAuthService";
import { ClientService } from "@/application/clients/services/implementations/ClientService";
import { CompanyService } from "@/application/companies/services/implementations/CompanyService";
import { UserService } from "@/application/users/services/implementations/UserService";
import GoogleOAuthProvider from "@/infrastructure/auth/providers/GoogleOAuthProvider";
import JwtTokenService from "@/infrastructure/auth/services/JwtTokenService";
import PrismaClientsRepository from "@/infrastructure/clients/repositories/PrismaClientsRepository";
import PrismaCompaniesRepository from "@/infrastructure/companies/repositories/PrismaCompaniesRepository";
import UuidIDGenerator from "@/infrastructure/core/services/UuidIDGenerator";
import PrismaUsersRepository from "@/infrastructure/users/repositories/PrismaUsersRepository";
import AuthController from "@/presentation/auth/controllers/Auth.controller";
import ClientController from "@/presentation/clients/controllers/Client.controller";
import CompanyController from "@/presentation/companies/controllers/Company.controller";
import MyProfileController from "@/presentation/users/controllers/MyProfile.controller";

// ==================== INFRASTRUCTURE ====================

// repositories
export const userRepository = new PrismaUsersRepository();
export const companiesRepository = new PrismaCompaniesRepository();
export const clientsRepository = new PrismaClientsRepository();

// providers
export const idGenerator = new UuidIDGenerator();
export const googleOAuthProvider = new GoogleOAuthProvider();

// services
export const jwtService = new JwtTokenService();


// ==================== APPLICATION ====================

// services
export const userService = new UserService(userRepository);
export const oAuthService = new OAuthService(userService, googleOAuthProvider, idGenerator);
export const companiesService = new CompanyService(companiesRepository);
export const clientsService = new ClientService(clientsRepository);

//  ==================== PRESENTATION ====================

// controllers
export const myProfileController = new MyProfileController(userService);
export const companyController = new CompanyController(companiesService, idGenerator);
export const authController = new AuthController(oAuthService, jwtService);
export const clientsController = new ClientController(clientsService);
