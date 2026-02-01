import { Product } from "@/domain/products/entities/Product";
import { CreateProductRequest } from "../requests/CreateProductRequest";
import { UpdateProductRequest } from "../requests/UpdateProductRequest";
import { ProductResponse } from "../responses/ProductResponse";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";

export default class ProductDtoMapper {
  static fromCreateRequest(request: CreateProductRequest, idGenerator: IIDGenerator): Product {
    return new Product({
      id: idGenerator.generate(),
      name: request.name,
      netPrice: request.netPrice,
      ivaRate: request.ivaRate || 13,
      companyId: request.companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromUpdateRequest(request: UpdateProductRequest, existingProduct: Product): Product {
    return new Product({
      id: request.id,
      name: request.name || existingProduct.name,
      netPrice: request.netPrice !== undefined ? request.netPrice : existingProduct.netPrice,
      ivaRate: request.ivaRate !== undefined ? request.ivaRate : existingProduct.ivaRate,
      companyId: existingProduct.companyId,
      createdAt: existingProduct.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static toResponse(product: Product): ProductResponse {
    return {
      id: product.id,
      name: product.name,
      netPrice: product.netPrice,
      ivaRate: product.ivaRate,
      ivaAmount: product.ivaAmount,
      totalPrice: product.totalPrice,
      companyId: product.companyId,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  static toResponseArray(products: Product[]): ProductResponse[] {
    return products.map(product => this.toResponse(product));
  }
}
