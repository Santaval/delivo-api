import DataException from "@/domain/core/errors/DataError";

export class PhoneNumber {
  private constructor(private readonly _value: string) {}

  static create(value: string) {
    if (!value || value.trim().length === 0) {
      throw new DataException("Phone number cannot be empty");
    }
    
    const cleanValue = value.trim();
    
    // Basic validation - remove non-numeric characters for validation
    const numericOnly = cleanValue.replace(/\D/g, '');
    
    if (numericOnly.length < 8) {
      throw new DataException("Phone number must have at least 8 digits");
    }
    
    if (numericOnly.length > 15) {
      throw new DataException("Phone number cannot exceed 15 digits");
    }
    
    return new PhoneNumber(cleanValue);
  }

  get value() {
    return this._value;
  }
}
