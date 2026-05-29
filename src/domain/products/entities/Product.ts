import { ProductId } from "@/domain/products/valueObjects/productId.valueObject";
import { Money } from "@/domain/products/valueObjects/money.valueObject";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";

export class Product {
  private props: ProductProps;
  
  constructor(props: ProductConstructorProps) {
    this.props = {
      id: ProductId.create(props.id),
      name: props.name,
      pricing: Money.create(props.grossPrice, props.ivaRate),
      companyId: CompanyId.create(props.companyId),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : null,
    };
  }

  get id() { return this.props.id.value; }
  get name() { return this.props.name; }
  get pricing() { return this.props.pricing; }
  get ivaAmount() { return this.props.pricing.ivaAmount; }
  get companyId() { return this.props.companyId.value; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
  get deletedAt() { return this.props.deletedAt; }
}

export interface ProductProps {
  id: ProductId;
  name: string;
  pricing: Money;
  companyId: CompanyId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ProductConstructorProps {
  id: string;
  name: string;
  grossPrice: number | string;
  ivaRate?: number | string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
