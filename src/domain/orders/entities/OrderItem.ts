import { Product, ProductConstructorProps } from "@/domain/products/entities/Product";

export default class OrderItem extends Product {
  private _quantity: number;
  private _billId: string;

  constructor(props: OrderItemConstructorProps) {
    super(props);
    this._quantity = props.quantity;
    this._billId = props.billId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get billId(): string {
    return this._billId;
  }
}

interface OrderItemConstructorProps extends ProductConstructorProps {
  quantity: number;
  billId: string;
}
