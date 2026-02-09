import IRouteRepository from "@/domain/routes/repositories/IRouteRepository";
import IRouteService from "../interfaces/IRouteService";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { Route, RouteId, RoutePoint, RoutePointId } from "@/domain/routes";
import IRouteOptimizationService from "@/domain/routes/service/IRouteOptimizationService";
import { Location } from "@/domain/clients/valueObjects/location.valouObject";

export default class RouteService implements IRouteService {
  constructor(
    private readonly routeRepository: IRouteRepository,
    private readonly routeOptimizationService: IRouteOptimizationService
  ) {}

  findAllByCompany(companyId: CompanyId): Promise<Route[]> {
    return this.routeRepository.findAllByCompany(companyId);
  }

  create(route: Route): Promise<Route> {
    return this.routeRepository.create(route);
  }

  update(route: Route): Promise<Route> {
    return this.routeRepository.update(route);
  }

  delete(id: RouteId): Promise<void> {
    return this.routeRepository.delete(id);
  }

  addPoint(point: RoutePoint): Promise<RoutePoint> {
    return this.routeRepository.addPoint(point);
  }

  removePoint(pointId: RoutePointId): Promise<void> {
    return this.routeRepository.removePoint(pointId);
  }

  findById(id: RouteId): Promise<Route | null> {
    return this.routeRepository.findById(id);
  }

  async start(routeId: RouteId, startLocation: Location): Promise<Route> {
    const optimizedRoute = await this.routeOptimizationService.optimize(routeId, startLocation);
    optimizedRoute.setStatus("STARTED");
    const updatedRoute = await this.routeRepository.update(optimizedRoute);
    return updatedRoute;
  }
}