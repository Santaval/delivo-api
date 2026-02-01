import DataException from "@/domain/core/errors/DataError";

export class Money {
  private readonly _netPrice: number;
  private readonly _grossPrice: number;
  private readonly _ivaRate: number;

  private constructor(netPrice: number, grossPrice: number, ivaRate: number) {
    this._netPrice = netPrice;
    this._grossPrice = grossPrice;
    this._ivaRate = ivaRate;
  }

  static create(grossPrice: number | string, ivaRate: number | string = 13.00) {
    const numericGrossPrice = typeof grossPrice === 'string' ? parseFloat(grossPrice) : grossPrice;
    const numericIvaRate = typeof ivaRate === 'string' ? parseFloat(ivaRate) : ivaRate;

    // calculate net price if not provided
    const netPrice = numericGrossPrice / (1 + numericIvaRate / 100);

    if (isNaN(netPrice) || netPrice < 0) {
      throw new DataException("Net price must be a non-negative number");
    }

    if (isNaN(numericGrossPrice) || numericGrossPrice < 0) {
      throw new DataException("Gross price must be a non-negative number");
    }

    if (isNaN(numericIvaRate) || numericIvaRate < 0 || numericIvaRate > 100) {
      throw new DataException("IVA rate must be between 0 and 100");
    }

    if (isNaN(numericGrossPrice) || numericGrossPrice < 0) {
      throw new DataException("Gross price must be a non-negative number");
    }

    return new Money(netPrice, numericGrossPrice, numericIvaRate);
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
    return this._grossPrice;
  }

  get grossPrice(): number {
    return this._grossPrice;
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