import OAuthService from "@/application/auth/services/implementations/IOAuthService";
import { ClientService } from "@/application/clients/services/implementations/ClientService";
import { CompanyService } from "@/application/companies/services/implementations/CompanyService";
import OrderPricingCalculator from "@/application/orders/services/implementations/OrderPricingCalculator";
import OrdersService from "@/application/orders/services/implementations/OrdersService";
import { ProductService } from "@/application/products/services/implementations/ProductService";
import RouteService from "@/application/routes/services/implementations/RouteService";
import FinancialSummaryCalculator from "@/application/stats/services/implementations/FinancialSummaryCalculator";
import { UserService } from "@/application/users/services/implementations/UserService";
import GoogleOAuthProvider from "@/infrastructure/auth/providers/GoogleOAuthProvider";
import JwtTokenService from "@/infrastructure/auth/services/JwtTokenService";
import PrismaClientsRepository from "@/infrastructure/clients/repositories/PrismaClientsRepository";
import PrismaCompaniesRepository from "@/infrastructure/companies/repositories/PrismaCompaniesRepository";
import UuidIDGenerator from "@/infrastructure/core/services/UuidIDGenerator";
import PrismaOrdersRepository from "@/infrastructure/orders/repositories/PrismaOrdersRepository";
import PrismaProductsRepository from "@/infrastructure/products/repositories/PrismaProductsRepository";
import PrismaRoutesRepository from "@/infrastructure/routes/repositories/PrismaRoutesRepository";
import PrismaUsersRepository from "@/infrastructure/users/repositories/PrismaUsersRepository";
import AuthController from "@/presentation/auth/controllers/Auth.controller";
import ClientController from "@/presentation/clients/controllers/Client.controller";
import CompanyController from "@/presentation/companies/controllers/Company.controller";
import OrdersController from "@/presentation/orders/controllers/Orders.controller";
import ProductController from "@/presentation/products/controllers/Product.controller";
import RoutesContoller from "@/presentation/routes/controllers/Routes.controller";
import StatsController from "@/presentation/stats/controllers/Stats.controller";
import MyProfileController from "@/presentation/users/controllers/MyProfile.controller";

// ==================== INFRASTRUCTURE ====================

// repositories
export const userRepository = new PrismaUsersRepository();
export const companiesRepository = new PrismaCompaniesRepository();
export const clientsRepository = new PrismaClientsRepository();
export const productsRepository = new PrismaProductsRepository();
export const ordersRepository = new PrismaOrdersRepository();
export const routesRepository = new PrismaRoutesRepository();

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
export const productsService = new ProductService(productsRepository);
export const ordersPricingCalculator = new OrderPricingCalculator(ordersRepository, productsRepository);
export const ordersService = new OrdersService(ordersRepository, productsRepository, ordersPricingCalculator);
export const routesService = new RouteService(routesRepository);
export const financialSummaryCalculator = new FinancialSummaryCalculator(ordersRepository)

//  ==================== PRESENTATION ====================

// controllers
export const myProfileController = new MyProfileController(userService);
export const companyController = new CompanyController(companiesService, idGenerator);
export const authController = new AuthController(oAuthService, jwtService);
export const clientsController = new ClientController(clientsService);
export const productsController = new ProductController(productsService);
export const ordersController = new OrdersController(ordersService);
export const routesController = new RoutesContoller(routesService);
export const statsController = new StatsController(financialSummaryCalculator);
