import { Route } from '@/domain/routes/entities/Route';
import { RouteConstructorProps } from '@/domain/routes/entities/Route';

export const createRoute = (overrides: Partial<RouteConstructorProps> = {}): Route => {
  const props: RouteConstructorProps = {
    id: 'route-1',
    name: 'Test Route',
    status: 'CREATED',
    companyId: 'company-1',
    polyline: null,
    points: [],
    ...overrides,
  };
  return new Route(props);
};