import { CompanyResponse } from "@/presentation/companies/responses/CompanyResponse";

export interface UserResponse {
    id: string;
    email: string;
    name: string;
    surnames: string;
    /** The user's own member code; never exposed on other members' payloads. */
    memberCode: string | null;
    companies: CompanyResponse[]
}

