import { SupplierId } from "@/domain/suppliers/valueObjects/supplierId.valueObject";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";

export class Supplier {
  private props: SupplierProps;
  
  constructor(props: SupplierConstructorProps) {
    this.props = {
      id: SupplierId.create(props.id),
      name: props.name,
      companyId: CompanyId.create(props.companyId),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    };
  }

  get id() { return this.props.id.value; }
  get name() { return this.props.name; }
  get companyId() { return this.props.companyId.value; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
}

export interface SupplierProps {
  id: SupplierId;
  name: string;
  companyId: CompanyId;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierConstructorProps {
  id: string;
  name: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
