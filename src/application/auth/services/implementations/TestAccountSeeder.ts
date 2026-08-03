import { Company } from "@/domain/companies/entities/Company";
import { Client } from "@/domain/clients/entities/Client";
import { Product } from "@/domain/products/entities/Product";
import Order from "@/domain/orders/entities/Order";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";
import { ITestAccountSeeder } from "../interfaces/ITestAccountSeeder";
import { IUserService } from "@/application/users/services/interfaces/IUserService";
import { ICompanyService } from "@/application/companies/services/interfaces/ICompanyService";
import { IClientService } from "@/application/clients/services/interfaces/IClientService";
import { IProductService } from "@/application/products/services/interfaces/IProductService";
import { IOrdersService } from "@/application/orders/services/interfaces/IOrdersService";
import IOrderItemsManager from "@/application/orders/services/interfaces/IOrderItemsManager";

/**
 * Seeds a fresh review account with a demo company and some sample data, so App Store / Google
 * Play reviewers land on a populated app instead of an empty one. Runs once, on the first
 * test-login of a brand new user (see TestLoginService) — never on subsequent logins.
 *
 * Stays well under the FREE plan limits (`PlanCatalog.ts`): 4 clients, 4 products and 3 orders
 * are nowhere near the 25 clients / 20 products / 10 documents-per-month ceiling.
 */
export class TestAccountSeeder implements ITestAccountSeeder {
  constructor(
    private readonly usersService: IUserService,
    private readonly companiesService: ICompanyService,
    private readonly clientsService: IClientService,
    private readonly productsService: IProductService,
    private readonly ordersService: IOrdersService,
    private readonly orderItemsManager: IOrderItemsManager,
    private readonly idGenerator: IIDGenerator,
  ) {}

  async seed(userId: string): Promise<void> {
    try {
      // Idempotency guard: only seed a user that exists and has no company yet. A retried
      // login, or a redeploy that re-runs this against the same account, must not duplicate
      // the demo data.
      const user = await this.usersService.find(userId);
      if (!user) return;
      if (user.companies.length > 0) return;

      const now = new Date().toISOString();

      // The company creation also adds the user as owner and creates the default FREE
      // subscription, in one transaction (CompanyService.create) — no privileged path needed.
      const company = await this.companiesService.create(
        new Company({ id: this.idGenerator.generate(), name: "Distribuidora Demo", createdAt: now, updatedAt: now }),
        userId,
      );

      const clients = await this.seedClients(company.id, now);
      const products = await this.seedProducts(company.id, now);
      await this.seedOrders(company.id, clients, products, now);
    } catch (error) {
      // The demo seed is a nice-to-have, not part of the login contract: a failure here must
      // never prevent the reviewer from getting a token.
      console.error("[test-login] demo seed failed:", error);
    }
  }

  private async seedClients(companyId: string, now: string): Promise<Client[]> {
    const seeds = [
      { name: "Pulpería La Esquina Demo", phoneNumber: "88880001", email: "pulperia.demo@example.com", lat: 9.9281, lng: -84.0907 },
      { name: "Soda Los Cocos Demo", phoneNumber: "88880002", email: "soda.demo@example.com", lat: 9.9974, lng: -84.1197 },
      { name: "Minisúper El Roble Demo", phoneNumber: "88880003", email: "minisuper.demo@example.com", lat: 9.8644, lng: -83.9186 },
      { name: "Abastecedor Demo del Valle", phoneNumber: "88880004", email: "abastecedor.demo@example.com", lat: 10.0162, lng: -84.2116 },
    ];

    const clients: Client[] = [];
    for (const seed of seeds) {
      const client = await this.clientsService.create(new Client({
        id: this.idGenerator.generate(),
        name: seed.name,
        phoneNumber: seed.phoneNumber,
        email: seed.email,
        companyId,
        createdAt: now,
        updatedAt: now,
        lat: seed.lat,
        lng: seed.lng,
      }));
      clients.push(client);
    }

    return clients;
  }

  private async seedProducts(companyId: string, now: string): Promise<Product[]> {
    const seeds = [
      { name: "Producto Demo — Agua 5L", grossPrice: 1500 },
      { name: "Producto Demo — Refresco 2L", grossPrice: 1200 },
      { name: "Producto Demo — Hielo 5kg", grossPrice: 2000 },
      { name: "Producto Demo — Café 500g", grossPrice: 3200 },
    ];

    const products: Product[] = [];
    for (const seed of seeds) {
      const product = await this.productsService.create(new Product({
        id: this.idGenerator.generate(),
        name: seed.name,
        grossPrice: seed.grossPrice,
        ivaRate: 13, // CR IVA, percentage points — Money.create expects 0-100, not 0-1
        companyId,
        createdAt: now,
        updatedAt: now,
      }));
      products.push(product);
    }

    return products;
  }

  private async seedOrders(companyId: string, clients: Client[], products: Product[], now: string): Promise<void> {
    const plans: { clientIndex: number; items: { productIndex: number; quantity: number }[]; deliver: boolean }[] = [
      { clientIndex: 0, items: [{ productIndex: 0, quantity: 2 }, { productIndex: 2, quantity: 1 }], deliver: true },
      { clientIndex: 1, items: [{ productIndex: 1, quantity: 3 }], deliver: false },
      { clientIndex: 2, items: [{ productIndex: 3, quantity: 1 }, { productIndex: 1, quantity: 1 }], deliver: false },
    ];

    for (const plan of plans) {
      const client = clients[plan.clientIndex];

      let order = await this.ordersService.create(new Order({
        id: this.idGenerator.generate(),
        client,
        number: 1, // placeholder — Prisma assigns the real autoincrement number
        subtotal: 0,
        ivaTotal: 0,
        total: 0,
        paid: 0,
        companyId,
        items: [],
        status: "PENDING",
        deliveryStatus: "PENDING",
        payments: [],
        createdAt: now,
        updatedAt: now,
      }));

      for (const item of plan.items) {
        const product = products[item.productIndex];
        order = await this.orderItemsManager.addItem(product.id, item.quantity, order.id);
      }

      if (plan.deliver) {
        await this.ordersService.markAsDelivered(order.id);
      }
    }
  }
}
