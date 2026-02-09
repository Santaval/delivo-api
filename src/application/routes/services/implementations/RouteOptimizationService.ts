import ApplicationError from "@/application/core/errors/ApplicationError";
import { Location } from "@/domain/clients/valueObjects/location.valouObject";
import { Route, RouteId } from "@/domain/routes";
import IRouteOptimizationProvider, { RouteDelivery, RouteVehicle } from "@/domain/routes/providers/IRouteOptimizationProvider";
import IRouteRepository from "@/domain/routes/repositories/IRouteRepository";
import IRouteOptimizationService from "@/domain/routes/service/IRouteOptimizationService";
import moment from "moment";

export default class RouteOptimizationService implements IRouteOptimizationService {

  constructor(
    private readonly routeRepository: IRouteRepository,
    private readonly optimizationProvider: IRouteOptimizationProvider
  ) { }

  async optimize(routeId: RouteId, startLocation: Location): Promise<void> {
    const route = await this.routeRepository.findById(routeId);
    if (!route) throw new ApplicationError("Route not found", 404);
    const deliveries: RouteDelivery[] = this.parseDeliveries(route);
    const vehicles: RouteVehicle[] = this.parseVehicles(startLocation);
    return this.optimizationProvider.optimize(deliveries, vehicles);
  }


  private parseDeliveries(route: Route): RouteDelivery[] {
    const startDay = moment().startOf("day");
    const endDay = moment().endOf("day");
    return route.points.map(point => ({
      arrivalLocation: {
        latitude: point.order.client.location.lat!,
        longitude: point.order.client.location.lng!
      },
      displayName: point.order.client.name,
      label: point.id,
      timeWindows: [
        {
          startTime: {
            seconds: startDay.unix(),
            nanos: 0
          },
          endTime: {
            seconds: endDay.unix(),
            nanos: 0
          }
        }
      ]
    }));
  }

  private parseVehicles(startLocation: Location): RouteVehicle[] {
    return [{
      costPerHour: 10,
      startLocation: {
            latitude: startLocation.lat!,
            longitude: startLocation.lng!
      },
      costPerKilometer: 5,
      endLocation: {
            latitude: startLocation.lat!,
            longitude: startLocation.lng!
          }
    }]
  }

}
     