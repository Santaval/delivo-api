import ENV from "@/presentation/core/config/env";
import OAuthService from "@/application/auth/services/implementations/IOAuthService";
import TestLoginService from "@/application/auth/services/implementations/TestLoginService";
import { ITestLoginService } from "@/application/auth/services/interfaces/ITestLoginService";
import { TestAccountSeeder } from "@/application/auth/services/implementations/TestAccountSeeder";
import { ITestAccountSeeder } from "@/application/auth/services/interfaces/ITestAccountSeeder";
import { ClientService } from "@/application/clients/services/implementations/ClientService";
import { CompanyService } from "@/application/companies/services/implementations/CompanyService";
import { CompanyMemberService } from "@/application/companies/services/implementations/CompanyMemberService";
import InvitationEmailSender from "@/application/companies/services/invitations/InvitationEmailSender";
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
import { AccountDeletionService } from "@/application/users/services/implementations/AccountDeletionService";
import { IAccountDeletionService } from "@/application/users/services/interfaces/IAccountDeletionService";
import AccountDeletionEmailSender from "@/application/users/services/AccountDeletionEmailSender";
import { AccountDeletionExternalCleanup } from "@/application/users/services/AccountDeletionExternalCleanup";
import { IAccountDeletionExternalCleanup } from "@/application/users/services/interfaces/IAccountDeletionExternalCleanup";
import GoogleOAuthProvider from "@/infrastructure/auth/providers/GoogleOAuthProvider";
import AppleOAuthProvider from "@/infrastructure/auth/providers/AppleOAuthProvider";
import JwtTokenService from "@/infrastructure/auth/services/JwtTokenService";
import PrismaClientsRepository from "@/infrastructure/clients/repositories/PrismaClientsRepository";
import PrismaSubscriptionRepository from "@/infrastructure/billing/repositories/PrismaSubscriptionRepository";
import PrismaCompaniesRepository from "@/infrastructure/companies/repositories/PrismaCompaniesRepository";
import PrismaCompanyMemberRepository from "@/infrastructure/companies/repositories/PrismaCompanyMemberRepository";
import PrismaCompanyInvitationRepository from "@/infrastructure/companies/repositories/PrismaCompanyInvitationRepository";
import UuidIDGenerator from "@/infrastructure/core/services/UuidIDGenerator";
import { GooglePlacesService } from "@/infrastructure/geolocation/services/GooglePlacesService";
import PrismaOrdersRepository from "@/infrastructure/orders/repositories/PrismaOrdersRepository";
import PrismaPaymentMethodsRepository from "@/infrastructure/orders/repositories/PrismaPaymentMethodsRepository";
import PrismaPaymentsRepository from "@/infrastructure/orders/repositories/PrismaPaymentsRepository";
import PrismaProductsRepository from "@/infrastructure/products/repositories/PrismaProductsRepository";
import { PrismaProductDeletionUnitOfWork } from "@/infrastructure/products/unitsOfWork/PrismaProductDeletionUnitOfWork";
import { PrismaCompanyCreationUnitOfWork } from "@/infrastructure/companies/unitsOfWork/PrismaCompanyCreationUnitOfWork";
import { PrismaUserDeletionUnitOfWork } from "@/infrastructure/users/unitsOfWork/PrismaUserDeletionUnitOfWork";
import GoogleRouteOptimizationProvider from "@/infrastructure/routes/providers/GoogleRouteOptimizationProvider";
import PrismaRoutesRepository from "@/infrastructure/routes/repositories/PrismaRoutesRepository";
import PrismaUsersRepository from "@/infrastructure/users/repositories/PrismaUsersRepository";
import ResendEmailProvider from "@/infrastructure/email/providers/ResendEmailProvider";
import AuthController from "@/presentation/auth/controllers/Auth.controller";
import ClientController from "@/presentation/clients/controllers/Client.controller";
import CompanyController from "@/presentation/companies/controllers/Company.controller";
import CompanyMemberController from "@/presentation/companies/controllers/CompanyMember.controller";
import LocationController from "@/presentation/geolocation/controllers/LocationController";
import OrdersController from "@/presentation/orders/controllers/Orders.controller";
import PaymentMethodsController from "@/presentation/orders/controllers/PaymentMethods.controller";
import ProductController from "@/presentation/products/controllers/Product.controller";
import RoutesContoller from "@/presentation/routes/controllers/Routes.controller";
import StatsController from "@/presentation/stats/controllers/Stats.controller";
import MyProfileController from "@/presentation/users/controllers/MyProfile.controller";
import { IEmailService } from "@/domain/core/services/IEmailService";
import { ICompanyMemberService } from "@/application/companies/services/interfaces/ICompanyMemberService";
import { UsageService } from "@/application/billing/services/implementations/UsageService";
import { IUsageService } from "@/application/billing/services/interfaces/IUsageService";
import { EntitlementService } from "@/application/billing/services/implementations/EntitlementService";
import { IEntitlementService } from "@/application/billing/services/interfaces/IEntitlementService";
import { SubscriptionSyncService } from "@/application/billing/services/implementations/SubscriptionSyncService";
import { ISubscriptionSyncService } from "@/application/billing/services/interfaces/ISubscriptionSyncService";
import { IPaymentProvider } from "@/domain/billing/providers/IPaymentProvider";
import RevenueCatProvider from "@/infrastructure/billing/providers/RevenueCatProvider";
import BillingWebhookController from "@/presentation/billing/controllers/BillingWebhook.controller";
import BillingController from "@/presentation/billing/controllers/Billing.controller";
import SystemController from "@/presentation/system/controllers/SystemController";

// ==================== INFRASTRUCTURE ====================

// repositories
export const userRepository = new PrismaUsersRepository();
export const companiesRepository = new PrismaCompaniesRepository();
export const companyMemberRepository = new PrismaCompanyMemberRepository();
export const companyInvitationRepository = new PrismaCompanyInvitationRepository();
export const clientsRepository = new PrismaClientsRepository();
export const productsRepository = new PrismaProductsRepository();
export const ordersRepository = new PrismaOrdersRepository();
export const routesRepository = new PrismaRoutesRepository();
export const paymentMethodsRepository = new PrismaPaymentMethodsRepository();
export const paymentsRepository = new PrismaPaymentsRepository();
export const subscriptionRepository = new PrismaSubscriptionRepository();

// unit of work
export const productDeletionUOW = new PrismaProductDeletionUnitOfWork();
export const companyCreationUOW = new PrismaCompanyCreationUnitOfWork();
export const userDeletionUOW = new PrismaUserDeletionUnitOfWork();

// providers
export const idGenerator = new UuidIDGenerator();
export const googleOAuthProvider = new GoogleOAuthProvider();
export const appleOAuthProvider = new AppleOAuthProvider(
  ENV.APPLE_TEAM_ID,
  ENV.APPLE_KEY_ID,
  ENV.APPLE_PRIVATE_KEY,
  ENV.APPLE_CLIENT_ID,
);
export const placesProvider = new GooglePlacesService();
export const routeOptimizationProvider = new GoogleRouteOptimizationProvider();
export const emailService: IEmailService = new ResendEmailProvider(ENV.RESEND_API_KEY, ENV.MAIL_FROM);
export const paymentProvider: IPaymentProvider = new RevenueCatProvider(ENV.REVENUECAT_WEBHOOK_AUTH, ENV.REVENUECAT_API_KEY);


// services
export const jwtService = new JwtTokenService();


// ==================== APPLICATION ====================

// services
export const userService = new UserService(userRepository);
export const oAuthService = new OAuthService(userService, googleOAuthProvider, appleOAuthProvider, idGenerator);
export const companiesService = new CompanyService(companiesRepository, companyCreationUOW, idGenerator);
export const invitationEmailSender = new InvitationEmailSender(emailService, ENV.APP_INVITE_URL);
export const companyMemberService: ICompanyMemberService = new CompanyMemberService(
  companyMemberRepository,
  companyInvitationRepository,
  companiesRepository,
  userRepository,
  idGenerator,
  invitationEmailSender,
);
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
export const testAccountSeeder: ITestAccountSeeder = new TestAccountSeeder(
  userService,
  companiesService,
  clientsService,
  productsService,
  ordersService,
  orderItemsManager,
  idGenerator,
);
export const testLoginService: ITestLoginService = new TestLoginService(userService, idGenerator, {
  enabled: ENV.TEST_LOGIN_ENABLED,
  email: ENV.TEST_LOGIN_EMAIL,
  password: ENV.TEST_LOGIN_PASSWORD,
}, testAccountSeeder);
export const usageService: IUsageService = new UsageService(ordersRepository, routesRepository, clientsRepository, productsRepository, companyMemberRepository);
export const entitlementService: IEntitlementService = new EntitlementService(subscriptionRepository, usageService);
export const subscriptionSyncService: ISubscriptionSyncService = new SubscriptionSyncService(subscriptionRepository, companiesRepository);

export const accountDeletionService: IAccountDeletionService = new AccountDeletionService(userDeletionUOW);
export const accountDeletionEmailSender = new AccountDeletionEmailSender(emailService);
export const accountDeletionExternalCleanup: IAccountDeletionExternalCleanup = new AccountDeletionExternalCleanup(
  appleOAuthProvider,
  paymentProvider,
  accountDeletionEmailSender,
);


//  ==================== PRESENTATION ====================

// controllers
export const myProfileController = new MyProfileController(
  userService,
  accountDeletionService,
  accountDeletionExternalCleanup,
);
export const companyController = new CompanyController(companiesService, idGenerator);
export const companyMemberController = new CompanyMemberController(companyMemberService);
export const authController = new AuthController(oAuthService, jwtService, userService, testLoginService);
export const clientsController = new ClientController(clientsService);
export const productsController = new ProductController(productsService);
export const ordersController = new OrdersController(ordersService, orderPaymentsService, orderItemsManager);
export const routesController = new RoutesContoller(routesService);
export const statsController = new StatsController(financialSummaryCalculator);
export const locationController = new LocationController(locationService);
export const paymentMethodsController = new PaymentMethodsController(paymentMethodsService)
export const billingWebhookController = new BillingWebhookController(paymentProvider, subscriptionSyncService);
export const billingController = new BillingController(entitlementService, subscriptionRepository);
export const systemController = new SystemController(ENV.MIN_FRONTEND_VERSION);

