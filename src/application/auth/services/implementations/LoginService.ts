import { IPasswordHasher } from "@/domain/auth/services/IPasswordHasherService";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsError";
import { ILoginService } from "../interfaces/ILoginService";
import { LoginCommand } from "../../input/LoginCommand";
import { IUserService } from "@/application/users/services/interfaces/IUserService";
import { User } from "@/domain/users/entities/User";

export class LoginService implements ILoginService {
  constructor(
    private readonly userService: IUserService,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  /**
   * Login user service
   * @param data The login command containing email and password.
   * @returns {Promise<User>} The authenticated user.
   */
  async login(data: LoginCommand): Promise<User> {
    const user = await this.userService.find(data.email, "email");
    if (!user) throw new InvalidCredentialsError();
    const isPasswordValid = await this.passwordHasher.compare(
      data.password,
      user.password.value
    );
    if (!isPasswordValid) throw new InvalidCredentialsError();
    return user;
  }
}
