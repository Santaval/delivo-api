import { CompanyResponse } from "@/presentation/companies/responses/CompanyResponse";

export interface UserResponse {
    id: string;
    email: string;
    name: string;
    surnames: string;
    companies: CompanyResponse[]
}

