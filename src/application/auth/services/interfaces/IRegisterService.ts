import { User } from "@/domain/users/entities/User";
import UserRegisterCommand from "../../input/UserRegisterCommand";

export interface IRegisterService {
    /** Register user service
     * @param email
     * @param password
     * @returns {Promise<UserRegisterResult | null>}
     */
    registerUser(data: User): Promise<User>;
}