import { Order } from "@/domain/orders";
import { BillDeliveryStatus, BillStatus, Client, ClientBill, ClientBillItem, ClientPayment, PaymentMethod } from "@/infrastructure/prisma/generated/prisma/client";
import PrismaOrderItemMapper from "./PrismaOrderItemMapper";
import { ClientBillCreateArgs, ClientBillUpdateArgs } from "@/infrastructure/prisma/generated/prisma/models";
import { PrismaClientMapper } from "@/infrastructure/clients/mappers/PrismaClientMapper";
import PrismaPaymentMapper, { FullPaymentType } from "./PrismaPaymentMapper";

export default class PrismaOrderMapper {
  static toDomain(raw: ClientBill & {items: ClientBillItem[], client: Client, payments: FullPaymentType[]}): Order {
    return new Order({
      client: PrismaClientMapper.toDomain(raw.client),
      companyId: raw.companyId,
      id: raw.id,
      // @ts-expect-error
      items: raw.items.map((item) => PrismaOrderItemMapper.toDomain(item)),
      ivaTotal: raw.ivaTotal.toNumber(),
      paid: raw.paid.toNumber(),
      number: raw.number,
      status: raw.status,
      deliveryStatus: raw.deliveryStatus,
      subtotal: raw.subtotal.toNumber(),
      total: raw.total.toNumber(),
      payments: raw.payments.map(PrismaPaymentMapper.toDomain),
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString()
    });
  }

  static toPrisma(order: Order): ClientBillCreateArgs {
    return {
      data: {
        ivaTotal: order.ivaTotal,
        subtotal: order.subtotal,
        total: order.subtotal,
        clientId: order.client.id.value,
        companyId: order.companyId,
        paid: order.paid,
        status: order.status as BillStatus,
        deliveryStatus: order.deliveryStatus as BillDeliveryStatus,
        issueDate: order.createdAt
      },
      include: {
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
    };
  }

  static toPrismaUpdate(order: Order): ClientBillUpdateArgs {
    return {
      where: { id: order.id },
      data: {
        ivaTotal: order.ivaTotal,
        subtotal: order.subtotal,
        total: order.subtotal,
        paid: order.paid,
        clientId: order.client.id.value,
        companyId: order.companyId,
        number: order.number,
        status: order.status as BillStatus,
        deliveryStatus: order.deliveryStatus as BillDeliveryStatus,
        issueDate: order.createdAt
      },
      
      include: {
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
    };
  }
}