import DataException from "@/domain/core/errors/DataError";

export type PaymentProviderType = "REVENUECAT";

export const PAYMENT_PROVIDERS: PaymentProviderType[] = ["REVENUECAT"];

export class PaymentProvider {
  private readonly _value: PaymentProviderType;

  private constructor(value: PaymentProviderType) {
    this._value = value;
  }

  static create(value: string): PaymentProvider {
    if (!PAYMENT_PROVIDERS.includes(value as PaymentProviderType)) {
      throw new DataException(`Invalid payment provider: ${value}. Valid providers are: ${PAYMENT_PROVIDERS.join(", ")}`);
    }

    return new PaymentProvider(value as PaymentProviderType);
  }

  get value(): PaymentProviderType {
    return this._value;
  }
}
