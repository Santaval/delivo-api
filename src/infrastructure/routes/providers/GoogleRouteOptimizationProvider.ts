import { RouteOptimizationClient } from '@googlemaps/routeoptimization';
import IRouteOptimizationProvider, { OptimizationResult, RouteDelivery, RouteVehicle } from "@/domain/routes/providers/IRouteOptimizationProvider";
import moment from 'moment';
import InfrastructureError from '@/infrastructure/core/errors/InfrastructureError';


export default class GoogleRouteOptimizationProvider implements IRouteOptimizationProvider {
  private client: RouteOptimizationClient;
  private projectId: string;
  private parent: string;

  constructor() {
    this.client = new RouteOptimizationClient({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!)
    });
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT!;
    this.parent = `projects/${this.projectId}`;
  }

  async optimize(deliveries: RouteDelivery[], vehicles: RouteVehicle[]): Promise<OptimizationResult> {
    const request = {
      parent: this.parent,
      "populatePolylines": true,
      "populateTransitionPolylines": true,
      
      model: {
        shipments: deliveries.map(del => ({
          deliveries: [del],
          pickups: []
        })),
        vehicles,
        globalStartTime: {
          seconds: moment().startOf('day').unix(),
          nanos: 0
        },
        globalEndTime: {
          seconds: moment().endOf('day').unix(),
          nanos: 0
        },
        considerRoadTraffic: true,
      }
    };


    try {

      const [response] = await this.client.optimizeTours(request);
      if (!response.routes) throw new InfrastructureError('No routes in response');
      const route = response?.routes[0];
      if (!route) throw new InfrastructureError('No route found');
      const visits = route.visits;
      if (!visits) throw new InfrastructureError('No visits found');
      return {
        visits: visits.map(visit => ({
          id: visit.visitLabel || "",
        })),
        polyline: route.routePolyline?.points || ''
      };

    } catch (error) {
      console.error('Error optimizing tours:', error);
      throw new InfrastructureError('Error optimizing tours');
    }
  }


}
    