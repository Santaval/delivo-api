import { RoutePoint } from '@/domain/routes/entities/RoutePoint';
import { RoutePointConstructorProps } from '@/domain/routes/entities/RoutePoint';
import { createOrder } from './orders.factory';

export const createRoutePoint = (overrides: Partial<RoutePointConstructorProps> = {}): RoutePoint => {
  const props: RoutePointConstructorProps = {
    id: 'route-point-1',
    status: 'CREATED',
    index: 0,
    order: createOrder(),
    polyline: null,
    routeId: 'route-1',
    ...overrides,
  };
  return new RoutePoint(props);
};