import { Money } from '@/domain/products/valueObjects/money.valueObject';
import DataException from '@/domain/core/errors/DataError';

describe('Money', () => {
  it('should create Money with gross price and default IVA rate', () => {
    const money = Money.create(113);

    expect(money.grossPrice).toBe(113);
    expect(money.ivaRate).toBe(13);
    expect(money.netPrice).toBeCloseTo(100, 2);
    expect(money.ivaAmount).toBeCloseTo(13, 2);
  });

  it('should create Money with custom IVA rate', () => {
    const money = Money.create(121, 10);

    expect(money.grossPrice).toBe(121);
    expect(money.ivaRate).toBe(10);
    expect(money.netPrice).toBeCloseTo(110, 2);
    expect(money.ivaAmount).toBeCloseTo(11, 2);
  });

  it('should create Money with string gross price', () => {
    const money = Money.create('226', '13');

    expect(money.grossPrice).toBe(226);
    expect(money.netPrice).toBeCloseTo(200, 2);
  });

  it('should create Money with string IVA rate', () => {
    const money = Money.create(110, '10');

    expect(money.ivaRate).toBe(10);
    expect(money.netPrice).toBeCloseTo(100, 2);
  });

  it('should calculate totalPrice as grossPrice', () => {
    const money = Money.create(100, 10);

    expect(money.totalPrice).toBe(100);
  });

  it('should return formatted strings', () => {
    const money = Money.create(113, 13);

    expect(money.formattedNetPrice).toBe('100.00');
    expect(money.formattedIvaRate).toBe('13.00');
    expect(money.formattedIvaAmount).toBe('13.00');
    expect(money.formattedTotalPrice).toBe('113.00');
  });

  it('should throw DataException when gross price is negative', () => {
    expect(() => Money.create(-10)).toThrow(DataException);
  });

  it('should throw DataException when gross price is NaN', () => {
    expect(() => Money.create(NaN)).toThrow(DataException);
  });

  it('should throw DataException when IVA rate is negative', () => {
    expect(() => Money.create(100, -5)).toThrow(DataException);
    expect(() => Money.create(100, -5)).toThrow('IVA rate must be between 0 and 100');
  });

  it('should throw DataException when IVA rate exceeds 100', () => {
    expect(() => Money.create(100, 101)).toThrow(DataException);
    expect(() => Money.create(100, 101)).toThrow('IVA rate must be between 0 and 100');
  });

  it('should throw DataException when IVA rate is NaN', () => {
    expect(() => Money.create(100, NaN)).toThrow(DataException);
  });

  it('should handle zero gross price', () => {
    const money = Money.create(0, 13);

    expect(money.grossPrice).toBe(0);
    expect(money.netPrice).toBe(0);
    expect(money.ivaAmount).toBe(0);
  });

  it('should handle zero IVA rate', () => {
    const money = Money.create(100, 0);

    expect(money.ivaRate).toBe(0);
    expect(money.netPrice).toBe(100);
    expect(money.ivaAmount).toBe(0);
  });
});