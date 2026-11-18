import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { Route, RouteId, RoutePoint, RoutePointId } from "@/domain/routes";
import IRouteRepository, { RouteFilters } from "@/domain/routes/repositories/IRouteRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { Prisma } from "@/infrastructure/prisma/generated/prisma/client";
import PrismaRouteMapper from "../mappers/PrismaRouteMapper";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import PrismaRoutePointMapper from "../mappers/PrismaRoutePointMapper";

export default class PrismaRoutesRepository implements IRouteRepository {
  private readonly client: Prisma.TransactionClient;

  constructor(client?: Prisma.TransactionClient) {
    this.client = client || prisma;
  }

  /**
   * Find all routes by company ID
   * @param companyId
   * @param filters Optional filters (e.g. driverId)
   * @returns Route array promise
   */
  async findAllByCompany(companyId: CompanyId, filters?: RouteFilters): Promise<Route[]> {
    try {
      const results = await this.client.route.findMany({
        where: {
          companyId: companyId.value,
          ...(filters?.driverId ? { driverId: filters.driverId } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
        include: this.getIncludeConditions(),
      });

      return results.map(PrismaRouteMapper.toDomain);
    } catch (error) {
      console.error("Error finding routes by company ID:", error);
      throw new DatabaseError("Could not find routes");
    }
  }

  /**
   * Create a new route
   * @param route 
   * @returns Route promise
   */
  async create(route: Route): Promise<Route> {
    try {
      const raw = PrismaRouteMapper.toPersistence(route);
      const result = await this.client.route.create(raw);
      // @ts-expect-error 
      return PrismaRouteMapper.toDomain(result);
    } catch (error) {
      console.error("Error creating route:", error);
      throw new DatabaseInsertError("Could not create route");
    }
  }

  /**
   * Find a route by ID
   * @param id 
   * @returns 
   */
  async findById(id: RouteId): Promise<Route | null> {
    try {
      const result = await this.client.route.findUnique({
        where: {
          id: id.value,
        },
        include: this.getIncludeConditions(),
      });
      return result ? PrismaRouteMapper.toDomain(result) : null;
    } catch (error) {
      console.error("Error finding route by ID:", error);
      return null;
    }
  }

  /**
   * Delete a route by ID
   * @param id 
   */
  async delete(id: RouteId): Promise<void> {
    try {
      await this.client.route.delete({
        where: {
          id: id.value,
        },
      });
    } catch (error) {
      throw new DatabaseError("Could not delete route");
    }
  }

  /**
   * Update a route
   * @param route 
   * @returns 
   */
  async update(route: Route): Promise<Route> {
    try {
      const raw = PrismaRouteMapper.toPersistenceUpdate(route);
      const result = await this.client.route.update(raw);
      // @ts-expect-error
      return PrismaRouteMapper.toDomain(result);
    } catch (error) {
      console.error("Error updating route:", error);
      throw new DatabaseError("Could not update route");
    }
  }

  /**
   * Add a point to a route
   * @param point 
   * @returns 
   */
  async addPoint(point: RoutePoint): Promise<RoutePoint> {
    try {
      const raw = PrismaRoutePointMapper.toPersistence(point);
      const result = await this.client.routePoint.create(raw);
      // @ts-expect-error
      return PrismaRoutePointMapper.toDomain(result);
    } catch (error) {
      console.error("Error adding route point:", error);
      throw new DatabaseInsertError("Could not add route point");
    }
  }

  /**
   * Remove a route point by ID
   * @param pointId 
   */
  async removePoint(pointId: RoutePointId): Promise<void> {
    try {
      await this.client.routePoint.delete({
        where: {
          id: pointId.value,
        },
      });
    } catch (error) {
      console.error("Error removing route point:", error);
      throw new DatabaseError("Could not remove route point");
    }
  }

  async updatePoint(point: RoutePoint): Promise<RoutePoint> {
    try {
      const raw = PrismaRoutePointMapper.toPersistenceUpdate(point);
      const result = await this.client.routePoint.update(raw);
      // @ts-expect-error
      return PrismaRoutePointMapper.toDomain(result);
    } catch (error) {
      console.error("Error updating route point:", error);
      throw new DatabaseError("Could not update route point");
    }
  }

  async findPointById(id: RoutePointId): Promise<RoutePoint | null> {
    try {
      const result = await this.client.routePoint.findUnique({
        where: {
          id: id.value,
        },
        include: {
          bill: {
            include: {
              client: true,
              items: {
                include: {
                  product: true
                }
              },
              payments: {
                include: {
                  method: true
                }
              }
            }
          }
        }
      });
      return result ? PrismaRoutePointMapper.toDomain(result) : null;
    } catch (error) {
      console.error("Error finding route point by ID:", error);
      return null;
    }
  }

  /**
   * Count routes created by a company within a half-open date range `[start, end)`.
   * @param companyId The ID of the company.
   * @param start Inclusive lower bound of `createdAt`.
   * @param end Exclusive upper bound of `createdAt`.
   * @returns A promise that resolves to the number of matching routes.
   */
  async countByCompanyAndCreatedAtRange(companyId: string, start: Date, end: Date): Promise<number> {
    try {
      return await this.client.route.count({
        where: {
          companyId,
          createdAt: {
            gte: start,
            lt: end,
          },
        },
      });
    } catch (error) {
      console.error("Error counting routes by company ID:", error);
      throw new DatabaseError("Could not count routes");
    }
  }

  async unassignDriverInCompany(userId: string, companyId: string): Promise<void> {
    try {
      await this.client.route.updateMany({
        where: { driverId: userId, companyId, status: { not: "COMPLETED" } },
        data: { driverId: null },
      });
    } catch (error) {
      console.error("Error unassigning driver from company routes:", error);
      throw new DatabaseError("Could not unassign driver from routes");
    }
  }

  async unassignDriverFromAll(userId: string): Promise<void> {
    try {
      await this.client.route.updateMany({
        where: { driverId: userId },
        data: { driverId: null },
      });
    } catch (error) {
      console.error("Error unassigning driver from routes:", error);
      throw new DatabaseError("Could not unassign driver from routes");
    }
  }

  getIncludeConditions() {
    return {
      driver: {
        select: { id: true, name: true, surnames: true, email: true }
      },
      points: {
        include: {
          bill: {
            include: {
              client: true,
              items: {
                include: {
                  product: true
                }
              },
              payments: {
                include: {
                  method: true
                }
              }
            }
          }
        }
      }
    };
  }
}
