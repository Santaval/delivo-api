import DomainError from "@/domain/core/errors/DomainError";

export class OrderTotal {
  private readonly _subtotal: number;
  private readonly _ivaTotal: number;
  private readonly _total: number;
  private readonly _due: number;
  private readonly _paid: number;

  private constructor(subtotal: number, ivaTotal: number, total: number, paid: number, due: number) {
    this._subtotal = subtotal;
    this._ivaTotal = ivaTotal;
    this._total = total;
    this._paid = paid;
    this._due = due;
  }

  static create(subtotal: number, ivaTotal: number, paid: number): OrderTotal {
    if (subtotal < 0) {
      throw new DomainError("Subtotal cannot be negative");
    }

    if (ivaTotal < 0) {
      throw new DomainError("IVA total cannot be negative");
    }

    if (paid < 0) {
      throw new DomainError("Due cannot be negative");
    }


    const total = subtotal + ivaTotal;
    const due = total - paid;

    return new OrderTotal(subtotal, ivaTotal, total, paid, due);
  }

  get due(): number {
    return this._due;
  }

  get paid(): number {
    return this._paid;
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

  toString(): string {
    return `Subtotal: ${this._subtotal}, IVA: ${this._ivaTotal}, Total: ${this._total}`;
  }
}
