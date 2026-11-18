import { User } from "@/domain/users/entities/User";
import { IUserRepository } from "@/domain/users/repositories/IUserRepository";
import { IMemberCodeGenerator } from "@/domain/users/services/IMemberCodeGenerator";
import { MemberCodeTakenError } from "@/domain/users/errors/MemberCodeTakenError";
import { IMemberCodeService } from "../interfaces/IMemberCodeService";
import { MemberCodeGenerationError } from "../../errors/MemberCodeGenerationError";
import { UserNotFoundError } from "../../errors/UserNotFoundError";

const MAX_ATTEMPTS = 5;

export class MemberCodeService implements IMemberCodeService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly generator: IMemberCodeGenerator,
  ) {}

  async assignNewCode(userId: string): Promise<string> {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const code = this.generator.generate();
      try {
        await this.userRepository.setMemberCode(userId, code);
        return code;
      } catch (error) {
        if (error instanceof MemberCodeTakenError) continue;
        throw error;
      }
    }
    throw new MemberCodeGenerationError();
  }

  async ensureMemberCode(user: User): Promise<User> {
    if (user.memberCode) return user;
    await this.assignNewCode(user.id);
    const refreshed = await this.userRepository.find(user.id, "id");
    if (!refreshed) throw new UserNotFoundError();
    return refreshed;
  }
}
