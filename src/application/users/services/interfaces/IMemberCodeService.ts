import { User } from "@/domain/users/entities/User";

export interface IMemberCodeService {
  /** Generates and persists a new unique code for the user, replacing any previous one. */
  assignNewCode(userId: string): Promise<string>;
  /** Lazy backfill: returns the user with a member code, assigning one if missing. */
  ensureMemberCode(user: User): Promise<User>;
}
