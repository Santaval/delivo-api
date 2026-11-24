import RoutePointResponse from "./RoutePointResponse";
import { RouteDriverLocationResponse } from "./DriverLocationResponse";

export default interface RouteResponse {
    id: string;
    name: string;
    status: string;
    companyId: string;
    points?: RoutePointResponse[];
    polyline: string | null;
    driverId: string | null;
    driver: { id: string; name: string; surnames: string } | null;
    /** Latest driver location; null when none or when the caller is not allowed to see it. */
    driverLocation: RouteDriverLocationResponse | null;
    createdAt?: string;
    updatedAt?: string;
}