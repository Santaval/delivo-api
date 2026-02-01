import DataException from "@/domain/core/errors/DataError";

export class TaxIdentificationNumber {
  private constructor(private readonly _value: string) {}

  static create(value: string) {
    if (!value || value.trim().length === 0) {
      throw new DataException("Tax identification number cannot be empty");
    }
    
    const cleanValue = value.trim().toUpperCase();
    
    // Basic validation - can be extended for specific country formats
    if (cleanValue.length < 5) {
      throw new DataException("Tax identification number must be at least 5 characters");
    }
    
    return new TaxIdentificationNumber(cleanValue);
  }

  get value() {
    return this._value;
  }
}
