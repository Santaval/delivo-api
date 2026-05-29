import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import { IProductRepository } from "../repositories/IProductRepository";

export interface IProductDeletionUnitOfWork {
  runInTransaction<T>(work: (context: IProductDeletionContext) => Promise<T>): Promise<T>;
}

export interface IProductDeletionContext {
  getProductRepository(): IProductRepository;
  getOrderRepository(): IOrderRepository;
}