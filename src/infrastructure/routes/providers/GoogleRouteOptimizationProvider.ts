import { RouteOptimizationClient } from '@googlemaps/routeoptimization';
import IRouteOptimizationProvider, { RouteDelivery, RouteVehicle } from "@/domain/routes/providers/IRouteOptimizationProvider";
import moment from 'moment';


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

  async optimize(deliveries: RouteDelivery[], vehicles: RouteVehicle[]): Promise<void> {
    const request = {
      parent: this.parent,
      searchmode: 2,
      timeout: {
        seconds: 10,
        nanos: 0
      },
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
        populatePolylines: true,
        populateTransitionPolylines: true,
        considerRoadTraffic: true,
      }
    };


    try {

      const [response] = await this.client.optimizeTours(request);
      console.log('Optimization response:', JSON.stringify(response, null, 2));
  
    } catch (error) {
      console.error('Error optimizing tours:', error);
    }
  }


}
    