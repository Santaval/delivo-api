import { Order, OrderItem } from "@/domain/orders";
import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import { prisma } from "@/infrastructure/prisma/client";
import PrismaOrderMapper from "../mappers/PrismaOrderMapper";
import InfrastructureError from "@/infrastructure/core/errors/InfrastructureError";
import PrismaOrderItemMapper from "../mappers/PrismaOrderItemMapper";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import { OrderDeliveryStatusType } from "@/domain/orders/valueObjects/orderDeliveryStatus";
import { Prisma } from "@/infrastructure/prisma/generated/prisma/client";
import { PageRequest, PaginatedResult } from "@/domain/core/pagination/Pagination";
import { BillsFilter, BillsQuery, BillStatusCounts } from "@/domain/orders/repositories/BillsQuery";

export default class PrismaOrderRepository implements IOrderRepository {

  private client: Prisma.TransactionClient;

  constructor(client?: Prisma.TransactionClient) {
    this.client = client ?? prisma;
  }

  /**
   * Find orders by company ID
   * @param companyId  The ID of the company to find orders for
   * @returns A promise that resolves to an array of orders
   */
  async findByCompany(companyId: string): Promise<Order[]> {
    try {
      const result = await this.client.clientBill.findMany({
        where: { companyId },
        orderBy: {
          createdAt: "desc",
        },
        include: this.getIncludes(),
      });
      return result.map((order) => PrismaOrderMapper.toDomain(order));
    } catch (error) {
      console.log(error)
      throw new Error("Error fetching orders");
    }
  }

  async byCompanyAndManyDeliveryStatus(companyId: string, statuses: OrderDeliveryStatusType[]): Promise<Order[]> {
    try {
      const result = await this.client.clientBill.findMany({
        where: {
          companyId,
          deliveryStatus: {
            in: statuses
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        include: this.getIncludes()
      });
      return result.map((order) => PrismaOrderMapper.toDomain(order));
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching orders");
    }
  }

  /**
   * Create a new order
   * @param order The order to create
   * @returns The created order
   */
  async create(order: Order): Promise<Order> {
    try {
      const data = PrismaOrderMapper.toPrisma(order);
      const result = await this.client.clientBill.create(data);
      // @ts-expect-error 
      return PrismaOrderMapper.toDomain(result);
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error creating order");
    }
  }

  /**
   * Find an order by ID
   * @param id The ID of the order to find
   * @returns The found order or null if not found
   */
  async findById(id: string): Promise<Order | null> {
    try {
      const result = await this.client.clientBill.findUnique({
        where: { id },
        include: this.getIncludes()
      });

      return result ? PrismaOrderMapper.toDomain(result) : null;
    } catch (error) {
      throw new Error("Error fetching order");
    }
  }

  /**
   * Delete an order by ID
   * @param id The ID of the order to delete
   * @returns A promise that resolves when the order is deleted
   */
  async delete(id: string): Promise<void> {
    try {
      await this.client.clientBill.delete({
        where: { id }
      });
    } catch (error) {
      throw new Error("Error deleting order");
    }
  }

  async update(order: Order): Promise<Order> {
    try {
      const data = PrismaOrderMapper.toPrismaUpdate(order);
      const result = await this.client.clientBill.update(data);
      // @ts-expect-error
      return PrismaOrderMapper.toDomain(result);
    } catch (error) {
      throw new Error("Error updating order");
    }
  }

  async addItem(item: OrderItem): Promise<Order> {
    try {
      const data = PrismaOrderItemMapper.toPrisma(item);
      await this.client.clientBillItem.create(data)
      const updatedOrder = await this.findById(item.billId);
      if (!updatedOrder)
        throw new InfrastructureError("Order not found");
      return updatedOrder;
    } catch (error) {
      console.log(error);
      throw new InfrastructureError("Error adding item to order");
    }
  }

  async removeItem(orderId: string, itemId: string): Promise<Order> {
    try {
      await this.client.clientBillItem.delete({
        where: { id: itemId }
      });
      const modifiedOrder = await this.findById(orderId);
      if (!modifiedOrder) {
        throw new InfrastructureError("Order not found");
      }
      return modifiedOrder;
    } catch (error) {
      throw new InfrastructureError("Error removing item from order");
    }
  }

  async getItem(itemId: string): Promise<OrderItem | null> {
    try {
      const result = await this.client.clientBillItem.findUnique({
        where: { id: itemId },
        include: {
          product: true
        }
      });
      return result ? PrismaOrderItemMapper.toDomain(result) : null;
    } catch (error) {
      throw new InfrastructureError("Error fetching order item");
    }
  }

  async byTimeRange(start: Date, end: Date, companyId: CompanyId): Promise<Order[]> {
    try {
      const result = await this.client.clientBill.findMany({
        where: {
          companyId: companyId.value,
          createdAt: {
            gte: start,
            lte: end
          }
        },
        include: this.getIncludes()
      });
      return result.map((order) => PrismaOrderMapper.toDomain(order));
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching orders");
    }
  }

  async byClientAndManyDeliveryStatus(clientId: ClientId, statuses: OrderDeliveryStatusType[]): Promise<Order[]> {
    try {
      const result = await this.client.clientBill.findMany({
        where: { clientId: clientId.value, deliveryStatus: { in: statuses } },
        include: this.getIncludes()
      });
      return result.map((order) => PrismaOrderMapper.toDomain(order));
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching orders");
    }
  }

  /**
   * Count fiscal documents (`ClientBill`) issued by a company within a half-open date range `[start, end)`.
   * @param companyId The ID of the company.
   * @param start Inclusive lower bound of `issueDate`.
   * @param end Exclusive upper bound of `issueDate`.
   * @returns A promise that resolves to the number of matching documents.
   */
  async countByCompanyAndIssueDateRange(companyId: string, start: Date, end: Date): Promise<number> {
    try {
      return await this.client.clientBill.count({
        where: {
          companyId,
          issueDate: {
            gte: start,
            lt: end,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error counting orders");
    }
  }

  async paginatedBills(query: BillsQuery, page: PageRequest): Promise<PaginatedResult<Order>> {
    try {
      const where: Prisma.ClientBillWhereInput = {
        ...this.billsWhere(query),
        ...(query.status ? { status: query.status } : {}),
      };
      const [rows, total] = await Promise.all([
        this.client.clientBill.findMany({
          where,
          // `number` is unique, so it keeps page boundaries stable when createdAt ties.
          orderBy: [{ createdAt: "desc" }, { number: "desc" }],
          skip: (page.page - 1) * page.pageSize,
          take: page.pageSize,
          include: this.getIncludes(),
        }),
        this.client.clientBill.count({ where }),
      ]);
      return {
        items: rows.map((order) => PrismaOrderMapper.toDomain(order)),
        page: page.page,
        pageSize: page.pageSize,
        total,
      };
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error fetching bills");
    }
  }

  async countBillsByStatus(filter: BillsFilter): Promise<BillStatusCounts> {
    try {
      const groups = await this.client.clientBill.groupBy({
        by: ["status"],
        where: this.billsWhere(filter),
        _count: { _all: true },
      });
      const counts: BillStatusCounts = { PENDING: 0, PAID: 0, CANCELLED: 0 };
      for (const group of groups) counts[group.status] = group._count._all;
      return counts;
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error counting bills");
    }
  }

  private billsWhere(filter: BillsFilter): Prisma.ClientBillWhereInput {
    const where: Prisma.ClientBillWhereInput = {
      companyId: filter.companyId,
      deliveryStatus: { in: filter.deliveryStatuses },
    };
    const search = filter.search?.trim();
    if (search) {
      // Users type "INV-123" or "123"; strip the prefix so both match the number.
      const numeric = search.replace(/^inv-?/i, "");
      const or: Prisma.ClientBillWhereInput[] = [{ client: { name: { contains: search } } }];
      if (/^\d+$/.test(numeric) && Number.isSafeInteger(Number(numeric))) {
        or.push({ number: Number(numeric) });
      }
      where.OR = or;
    }
    return where;
  }

  getIncludes() {
    return {
      items: {
        include: {
          product: true
        }
      },
      client: true,
      payments: {
        include: {
          method: true
        }
      }
    }
  }

}