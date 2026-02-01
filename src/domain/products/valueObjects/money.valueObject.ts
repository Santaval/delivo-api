import DataException from "@/domain/core/errors/DataError";

export class Money {
  private readonly _netPrice: number;
  private readonly _ivaRate: number;

  private constructor(netPrice: number, ivaRate: number) {
    this._netPrice = netPrice;
    this._ivaRate = ivaRate;
  }

  static create(netPrice: number | string, ivaRate: number | string = 13.00) {
    const numericNetPrice = typeof netPrice === 'string' ? parseFloat(netPrice) : netPrice;
    const numericIvaRate = typeof ivaRate === 'string' ? parseFloat(ivaRate) : ivaRate;

    if (isNaN(numericNetPrice) || numericNetPrice < 0) {
      throw new DataException("Net price must be a non-negative number");
    }

    if (isNaN(numericIvaRate) || numericIvaRate < 0 || numericIvaRate > 100) {
      throw new DataException("IVA rate must be between 0 and 100");
    }

    return new Money(numericNetPrice, numericIvaRate);
  }

  get netPrice(): number {
    return this._netPrice;
  }

  get ivaRate(): number {
    return this._ivaRate;
  }

  get ivaAmount(): number {
    return (this._netPrice * this._ivaRate) / 100;
  }

  get totalPrice(): number {
    return this._netPrice + this.ivaAmount;
  }

  // Format for display purposes
  get formattedNetPrice(): string {
    return this._netPrice.toFixed(2);
  }

  get formattedIvaRate(): string {
    return this._ivaRate.toFixed(2);
  }

  get formattedIvaAmount(): string {
    return this.ivaAmount.toFixed(2);
  }

  get formattedTotalPrice(): string {
    return this.totalPrice.toFixed(2);
  }
}