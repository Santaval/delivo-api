import { randomInt } from "crypto";
import { IMemberCodeGenerator } from "@/domain/users/services/IMemberCodeGenerator";

export class CryptoMemberCodeGenerator implements IMemberCodeGenerator {
  generate(): string {
    return randomInt(0, 1_000_000).toString().padStart(6, "0");
  }
}
