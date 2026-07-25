import ENV from "@/presentation/core/config/env";
import OAuthService from "@/application/auth/services/implementations/IOAuthService";
import { ClientService } from "@/application/clients/services/implementations/ClientService";
import { CompanyService } from "@/application/companies/services/implementations/CompanyService";
import LocationService from "@/application/geolocation/services/implementations/LocationService";
import OrderDeliveryStatusManager from "@/application/orders/services/implementations/OrderDeliveryStatusManger";
import OrderItemsManager from "@/application/orders/services/implementations/OrderItemsManager";
import OrderPaymentsService from "@/application/orders/services/implementations/OrderPaymentsService";
import OrderPricingCalculator from "@/application/orders/services/implementations/OrderPricingCalculator";
import OrdersService from "@/application/orders/services/implementations/OrdersService";
import PaymentMethodsService from "@/application/orders/services/implementations/PaymentmethodsService";
import { ProductService } from "@/application/products/services/implementations/ProductService";
import RouteOptimizationService from "@/application/routes/services/implementations/RouteOptimizationService";
import RouteService from "@/application/routes/services/implementations/RouteService";
import FinancialSummaryCalculator from "@/application/stats/services/implementations/FinancialSummaryCalculator";
import { UserService } from "@/application/users/services/implementations/UserService";
import GoogleOAuthProvider from "@/infrastructure/auth/providers/GoogleOAuthProvider";
import AppleOAuthProvider from "@/infrastructure/auth/providers/AppleOAuthProvider";
import JwtTokenService from "@/infrastructure/auth/services/JwtTokenService";
import PrismaClientsRepository from "@/infrastructure/clients/repositories/PrismaClientsRepository";
import PrismaCompaniesRepository from "@/infrastructure/companies/repositories/PrismaCompaniesRepository";
import UuidIDGenerator from "@/infrastructure/core/services/UuidIDGenerator";
import { GooglePlacesService } from "@/infrastructure/geolocation/services/GooglePlacesService";
import PrismaOrdersRepository from "@/infrastructure/orders/repositories/PrismaOrdersRepository";
import PrismaPaymentMethodsRepository from "@/infrastructure/orders/repositories/PrismaPaymentMethodsRepository";
import PrismaPaymentsRepository from "@/infrastructure/orders/repositories/PrismaPaymentsRepository";
import PrismaProductsRepository from "@/infrastructure/products/repositories/PrismaProductsRepository";
import { PrismaProductDeletionUnitOfWork } from "@/infrastructure/products/unitsOfWork/PrismaProductDeletionUnitOfWork";
import GoogleRouteOptimizationProvider from "@/infrastructure/routes/providers/GoogleRouteOptimizationProvider";
import PrismaRoutesRepository from "@/infrastructure/routes/repositories/PrismaRoutesRepository";
import PrismaUsersRepository from "@/infrastructure/users/repositories/PrismaUsersRepository";
import ResendEmailProvider from "@/infrastructure/email/providers/ResendEmailProvider";
import AuthController from "@/presentation/auth/controllers/Auth.controller";
import ClientController from "@/presentation/clients/controllers/Client.controller";
import CompanyController from "@/presentation/companies/controllers/Company.controller";
import LocationController from "@/presentation/geolocation/controllers/LocationController";
import OrdersController from "@/presentation/orders/controllers/Orders.controller";
import PaymentMethodsController from "@/presentation/orders/controllers/PaymentMethods.controller";
import ProductController from "@/presentation/products/controllers/Product.controller";
import RoutesContoller from "@/presentation/routes/controllers/Routes.controller";
import StatsController from "@/presentation/stats/controllers/Stats.controller";
import MyProfileController from "@/presentation/users/controllers/MyProfile.controller";
import { IEmailService } from "@/domain/core/services/IEmailService";

// ==================== INFRASTRUCTURE ====================

// repositories
export const userRepository = new PrismaUsersRepository();
export const companiesRepository = new PrismaCompaniesRepository();
export const clientsRepository = new PrismaClientsRepository();
export const productsRepository = new PrismaProductsRepository();
export const ordersRepository = new PrismaOrdersRepository();
export const routesRepository = new PrismaRoutesRepository();
export const paymentMethodsRepository = new PrismaPaymentMethodsRepository();
export const paymentsRepository = new PrismaPaymentsRepository();

// unit of work
export const productDeletionUOW = new PrismaProductDeletionUnitOfWork();

// providers
export const idGenerator = new UuidIDGenerator();
export const googleOAuthProvider = new GoogleOAuthProvider();
export const appleOAuthProvider = new AppleOAuthProvider();
export const placesProvider = new GooglePlacesService();
export const routeOptimizationProvider = new GoogleRouteOptimizationProvider();
export const emailService: IEmailService = new ResendEmailProvider(ENV.RESEND_API_KEY, ENV.MAIL_FROM);


// services
export const jwtService = new JwtTokenService();


// ==================== APPLICATION ====================

// services
export const userService = new UserService(userRepository);
export const oAuthService = new OAuthService(userService, googleOAuthProvider, appleOAuthProvider, idGenerator);
export const companiesService = new CompanyService(companiesRepository);
export const clientsService = new ClientService(clientsRepository);
export const productsService = new ProductService(productsRepository, productDeletionUOW);
export const ordersPricingCalculator = new OrderPricingCalculator(ordersRepository, productsRepository);
export const ordersService = new OrdersService(ordersRepository);
export const orderDeliveryStatusManager = new OrderDeliveryStatusManager(ordersRepository);
export const routeOptimizationService = new RouteOptimizationService(routesRepository, routeOptimizationProvider);
export const routesService = new RouteService(routesRepository, routeOptimizationService, orderDeliveryStatusManager);
export const financialSummaryCalculator = new FinancialSummaryCalculator(ordersRepository)
export const locationService = new LocationService(placesProvider);
export const paymentMethodsService = new PaymentMethodsService(paymentMethodsRepository);
export const orderPaymentsService = new OrderPaymentsService(paymentsRepository, ordersRepository);
export const orderItemsManager = new OrderItemsManager(ordersRepository, productsRepository, ordersPricingCalculator);


//  ==================== PRESENTATION ====================

// controllers
export const myProfileController = new MyProfileController(userService);
export const companyController = new CompanyController(companiesService, idGenerator);
export const authController = new AuthController(oAuthService, jwtService, userService);
export const clientsController = new ClientController(clientsService);
export const productsController = new ProductController(productsService);
export const ordersController = new OrdersController(ordersService, orderPaymentsService, orderItemsManager);
export const routesController = new RoutesContoller(routesService);
export const statsController = new StatsController(financialSummaryCalculator);
export const locationController = new LocationController(locationService);
export const paymentMethodsController = new PaymentMethodsController(paymentMethodsService)

