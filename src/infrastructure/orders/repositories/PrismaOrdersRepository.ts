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

export default class PrismaOrderRepository implements IOrderRepository {
  constructor() { }

  /**
   * Find orders by company ID
   * @param companyId  The ID of the company to find orders for
   * @returns A promise that resolves to an array of orders
   */
  async findByCompany(companyId: string): Promise<Order[]> {
    try {
      const result = await prisma.clientBill.findMany({
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
      const result = await prisma.clientBill.findMany({
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
      const result = await prisma.clientBill.create(data);
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
      const result = await prisma.clientBill.findUnique({
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
      await prisma.clientBill.delete({
        where: { id }
      });
    } catch (error) {
      throw new Error("Error deleting order");
    }
  }

  async update(order: Order): Promise<Order> {
    try {
      const data = PrismaOrderMapper.toPrismaUpdate(order);
      const result = await prisma.clientBill.update(data);
      // @ts-expect-error
      return PrismaOrderMapper.toDomain(result);
    } catch (error) {
      throw new Error("Error updating order");
    }
  }

  async addItem(item: OrderItem): Promise<Order> {
    try {
      const data = PrismaOrderItemMapper.toPrisma(item);
      await prisma.clientBillItem.create(data)
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
      await prisma.clientBillItem.delete({
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
      const result = await prisma.clientBillItem.findUnique({
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
      const result = await prisma.clientBill.findMany({
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
      const result = await prisma.clientBill.findMany({
        where: { clientId: clientId.value, deliveryStatus: { in: statuses } },
        include: this.getIncludes()
      });
      return result.map((order) => PrismaOrderMapper.toDomain(order));
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching orders");
    }
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