import RoutePointResponse from "./RoutePointResponse";

export default interface RouteResponse {
    id: string;
    name: string;
    status: string;
    companyId: string;
    points?: RoutePointResponse[];
    polyline: string | null;
    createdAt?: string;
    updatedAt?: string;
}