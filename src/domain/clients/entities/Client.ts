import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";
import { PhoneNumber } from "../valueObjects/phoneNumber.valueObject";
import { Email } from "@/domain/users/valueObjects/email.valueObject";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { Location } from "../valueObjects/location.valouObject";

export class Client {
  private props: ClientProps;
  
  constructor(props: ClientConstructorProps) {
    this.props = {
      id: ClientId.create(props.id),
      name: props.name,
      phoneNumber: props.phoneNumber ? PhoneNumber.create(props.phoneNumber) : undefined,
      email: props.email ? Email.create(props.email) : undefined,
      location: Location.create(props.lat, props.lng),
      companyId: CompanyId.create(props.companyId),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : null,
    };
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get phoneNumber() { return this.props.phoneNumber; }
  get email() { return this.props.email; }
  get location() { return this.props.location; }
  get companyId() { return this.props.companyId; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
  get deletedAt() { return this.props.deletedAt; }

}

export interface ClientProps {
  id: ClientId;
  name: string;
  phoneNumber?: PhoneNumber;
  email?: Email;
  companyId: CompanyId;
  location: Location;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ClientConstructorProps {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  lat: number | null;
  lng: number | null;
  deletedAt?: string | null;
}
