import RoutePointResponse from "./RoutePointResponse";

export default interface RouteResponse {
    id: string;
    name: string;
    status: string;
    companyId: string;
    points?: RoutePointResponse[];
    createdAt?: string;
    updatedAt?: string;
}