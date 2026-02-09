export default interface IRouteOptimizationProvider {
  optimize: (deliveries: RouteDelivery[], vehicles: RouteVehicle[]) => Promise<OptimizationResult>;
};

export type OptimizationVisit = {
  id: string;
}

export type OptimizationResult = {
  visits: OptimizationVisit[],
  polyline: string;
}


export type RouteVehicle = {
  endLocation: RouteWaypoint;
  startLocation: RouteWaypoint;
  costPerKilometer: number;
  costPerHour: number;
};

export type RouteWaypoint = {
      latitude: number;
      longitude: number;
};

export type TimeWindow = {
  startTime: {
    seconds: number;
    nanos: number;
  };
  endTime: {
    seconds: number;
    nanos: number;
  };
};

export type RouteDelivery = {
  displayName: string;
  arrivalLocation: RouteWaypoint;
  label: string;
  timeWindows: TimeWindow[];
};