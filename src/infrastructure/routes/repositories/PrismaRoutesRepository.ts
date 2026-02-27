import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { Route, RouteId, RoutePoint, RoutePointId } from "@/domain/routes";
import IRouteRepository from "@/domain/routes/repositories/IRouteRepository";
import { prisma } from "@/infrastructure/prisma/client";
import PrismaRouteMapper from "../mappers/PrismaRouteMapper";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import PrismaRoutePointMapper from "../mappers/PrismaRoutePointMapper";

export default class PrismaRoutesRepository implements IRouteRepository {
  /**
   * Find all routes by company ID
   * @param companyId
   * @returns Route array promise
   */
  async findAllByCompany(companyId: CompanyId): Promise<Route[]> {
    try {
      const results = await prisma.route.findMany({
        where: {
          companyId: companyId.value,
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
      const result = await prisma.route.create(raw);
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
      const result = await prisma.route.findUnique({
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
      await prisma.route.delete({
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
      const result = await prisma.route.update(raw);
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
      const result = await prisma.routePoint.create(raw);
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
      await prisma.routePoint.delete({
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
      const result = await prisma.routePoint.update(raw);
      // @ts-expect-error
      return PrismaRoutePointMapper.toDomain(result);
    } catch (error) {
      console.error("Error updating route point:", error);
      throw new DatabaseError("Could not update route point");
    }
  }

  async findPointById(id: RoutePointId): Promise<RoutePoint | null> {
    try {
      const result = await prisma.routePoint.findUnique({
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

  getIncludeConditions() {
    return {
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
