import { Product } from "@/domain/products/entities/Product";
import { CreateProductRequest } from "../requests/CreateProductRequest";
import { UpdateProductRequest } from "../requests/UpdateProductRequest";
import { ProductResponse } from "../responses/ProductResponse";

export default class ProductDtoMapper {
  static fromCreateRequest(request: CreateProductRequest, companyId: string): Product {
    return new Product({
      id: "to-be-filled",
      name: request.name,
      ivaRate: request.ivaRate || 13,
      companyId: companyId,
      grossPrice: request.grossPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromUpdateRequest(request: UpdateProductRequest, existingProduct: Product): Product {
    return new Product({
      id: request.id,
      name: request.name || existingProduct.name,
      ivaRate: request.ivaRate !== undefined ? request.ivaRate : existingProduct.pricing.ivaRate,
      grossPrice: request.grossPrice !== undefined ? request.grossPrice : existingProduct.pricing.grossPrice,
      companyId: existingProduct.companyId,
      createdAt: existingProduct.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static toResponse(product: Product): ProductResponse {
    return {
      id: product.id,
      name: product.name,
      pricing: {
        netPrice: product.pricing.netPrice,
        ivaRate: product.pricing.ivaRate,
        ivaAmount: product.ivaAmount,
        totalPrice: product.pricing.totalPrice,
      },
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  static toResponseArray(products: Product[]): ProductResponse[] {
    return products.map(product => this.toResponse(product));
  }
}
