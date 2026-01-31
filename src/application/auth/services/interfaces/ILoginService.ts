import { User } from "@/domain/users/entities/User";
import { LoginCommand } from "../../input/LoginCommand";

export interface ILoginService {
    /** Login user service
     * @param email
     * @param password
     * @returns {Promise<User | null>}
     */
    login(data: LoginCommand): Promise<User>;
}