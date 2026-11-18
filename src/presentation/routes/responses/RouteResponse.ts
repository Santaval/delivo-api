import RoutePointResponse from "./RoutePointResponse";

export default interface RouteResponse {
    id: string;
    name: string;
    status: string;
    companyId: string;
    points?: RoutePointResponse[];
    polyline: string | null;
    driverId: string | null;
    driver: { id: string; name: string; surnames: string } | null;
    createdAt?: string;
    updatedAt?: string;
}