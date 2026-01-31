import { User } from "@/domain/users/entities/User";

export interface IOAuthService {
  google(accessToken: string): Promise<User>;
}
