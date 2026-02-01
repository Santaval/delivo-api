import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";

export class Company {
  private props: CompanyProps;
  
  constructor(props: CompanyConstructorProps) {
    this.props = {
      id: CompanyId.create(props.id),
      name: props.name,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    };
  }

  get id() { return this.props.id.value; }
  get name() { return this.props.name; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
  
  set id(value: string) { this.props.id = CompanyId.create(value); }
  set name(value: string) { this.props.name = value; }
  set updatedAt(value: Date) { this.props.updatedAt = value; }
}

export interface CompanyProps {
  id: CompanyId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyConstructorProps {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
