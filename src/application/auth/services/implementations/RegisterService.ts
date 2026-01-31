import { IRegisterService } from "../interfaces/IRegisterService";
import { IPasswordHasher } from "@/domain/auth/services/IPasswordHasherService";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";
import { IUserService } from "@/application/users/services/interfaces/IUserService";
import { User } from "@/domain/users/entities/User";

export default class RegisterService implements IRegisterService {

    constructor(
        private readonly userService: IUserService,
        private readonly passwordHasher: IPasswordHasher,
        private readonly idGenerator: IIDGenerator
    ) {}

    async registerUser(data: User): Promise<User> {
        const hashedPassword = await this.passwordHasher.hash(data.password.value);
        const id = this.idGenerator.generate();
        const newUser = new User({
            id,
            email: data.email.value,
            name: data.name,
            surnames: data.surnames,
            birthDate: data.birthDate,
            gender: data.gender?.value || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            identificationUrl: data.identificationUrl,
            imageUrl: data.imageUrl,
            isOnboardingComplete: data.isOnboardingComplete,
            roles: data.roles,
            password: hashedPassword,
        });
        return this.userService.create(newUser);
    }

}