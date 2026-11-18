export interface IMemberCodeGenerator {
  /** Returns a random 6-digit numeric string (leading zeros allowed). */
  generate(): string;
}
