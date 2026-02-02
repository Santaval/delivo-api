import { Product, ProductConstructorProps } from "@/domain/products/entities/Product";

export default class OrderItem extends Product {
  private _quantity: number;
  private _billId: string;
  private _itemId: string;

  constructor(props: OrderItemConstructorProps) {
    super(props);
    this._quantity = props.quantity;
    this._billId = props.billId;
    this._itemId = props.itemId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get billId(): string {
    return this._billId;
  }
  get itemId(): string {
    return this._itemId;
  }
}

interface OrderItemConstructorProps extends ProductConstructorProps {
  quantity: number;
  billId: string;
  itemId: string;
}
