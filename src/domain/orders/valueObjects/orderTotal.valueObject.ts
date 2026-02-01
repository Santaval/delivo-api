import DomainError from "@/domain/core/errors/DomainError";

export class OrderTotal {
  private readonly _subtotal: number;
  private readonly _ivaTotal: number;
  private readonly _total: number;

  private constructor(subtotal: number, ivaTotal: number, total: number) {
    this._subtotal = subtotal;
    this._ivaTotal = ivaTotal;
    this._total = total;
  }

  static create(subtotal: number, ivaTotal: number): OrderTotal {
    if (subtotal < 0) {
      throw new DomainError("Subtotal cannot be negative");
    }

    if (ivaTotal < 0) {
      throw new DomainError("IVA total cannot be negative");
    }

    const total = subtotal + ivaTotal;

    return new OrderTotal(subtotal, ivaTotal, total);
  }

  static fromTotal(total: number, ivaRate: number = 13.00): OrderTotal {
    if (total < 0) {
      throw new DomainError("Total cannot be negative");
    }

    if (ivaRate < 0 || ivaRate > 100) {
      throw new DomainError("IVA rate must be between 0 and 100");
    }

    const subtotal = total / (1 + ivaRate / 100);
    const ivaTotal = total - subtotal;

    return new OrderTotal(
      Math.round(subtotal * 100) / 100, // Round to 2 decimal places
      Math.round(ivaTotal * 100) / 100,
      Math.round(total * 100) / 100
    );
  }

  get subtotal(): number {
    return this._subtotal;
  }

  get ivaTotal(): number {
    return this._ivaTotal;
  }

  get total(): number {
    return this._total;
  }

  add(other: OrderTotal): OrderTotal {
    return OrderTotal.create(
      this._subtotal + other._subtotal,
      this._ivaTotal + other._ivaTotal
    );
  }

  equals(other: OrderTotal): boolean {
    return this._subtotal === other._subtotal && 
           this._ivaTotal === other._ivaTotal && 
           this._total === other._total;
  }

  toString(): string {
    return `Subtotal: ${this._subtotal}, IVA: ${this._ivaTotal}, Total: ${this._total}`;
  }
}
