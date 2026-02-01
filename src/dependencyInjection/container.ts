import OAuthService from "@/application/auth/services/implementations/IOAuthService";
import { CompanyService } from "@/application/companies/services/implementations/CompanyService";
import { UserService } from "@/application/users/services/implementations/UserService";
import GoogleOAuthProvider from "@/infrastructure/auth/providers/GoogleOAuthProvider";
import PrismaCompaniesRepository from "@/infrastructure/companies/repositories/PrismaCompaniesRepository";
import UuidIDGenerator from "@/infrastructure/core/services/UuidIDGenerator";
import PrismaUsersRepository from "@/infrastructure/users/repositories/PrismaUsersRepository";
import CompanyController from "@/presentation/companies/controllers/Company.controller";
import MyProfileController from "@/presentation/users/controllers/MyProfile.controller";

// ==================== INFRASTRUCTURE ====================

// repositories
export const userRepository = new PrismaUsersRepository();
export const companiesRepository = new PrismaCompaniesRepository();

// providers
export const idGenerator = new UuidIDGenerator();
export const googleOAuthProvider = new GoogleOAuthProvider();


// ==================== APPLICATION ====================

// services
export const userService = new UserService(userRepository);
export const oAuthService = new OAuthService(userService, googleOAuthProvider, idGenerator);
export const companiesService = new CompanyService(companiesRepository);

//  ==================== PRESENTATION ====================

// controllers
export const myProfileController = new MyProfileController(userService);
export const companyController = new CompanyController(companiesService, idGenerator);
