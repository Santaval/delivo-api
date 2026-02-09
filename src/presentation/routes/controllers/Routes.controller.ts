import IRouteService from "@/application/routes/services/interfaces/IRouteService";
import RouteDtoMapper from "../mappers/RouteDtoMapper";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import { Request, Response } from "express";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { RouteId, RoutePointId } from "@/domain/routes";
import RoutePointDtoMapper from "../mappers/RoutePointDtoMapper";
import { Location } from "@/domain/clients/valueObjects/location.valouObject";

export default class RoutesContoller {
  constructor(
    private readonly routeService: IRouteService
  ) {}

  async create(req: Request, res: Response) {
    const companyId = CompanyIdParser(req)
    const route = RouteDtoMapper.fromCreateToDomain(req.body, companyId);
    const result = await this.routeService.create(route);
    return res.status(201).json(RouteDtoMapper.toResponse(result));
  }

  async findAll(req: Request, res: Response) {
    const companyId = CompanyIdParser(req);
    const result = await this.routeService.findAllByCompany(CompanyId.create(companyId));
    return res.status(200).json(result.map(RouteDtoMapper.toResponse));
  }

  async findById(req: Request, res: Response) {
    const routeId = RouteId.create(req.params.id);
    const result = await this.routeService.findById(routeId);
    if (!result) {
      return res.status(404).json({ message: "Route not found" });
    }
    return res.status(200).json(RouteDtoMapper.toResponse(result));
  }

  async addPoint(req: Request, res: Response) {
    const routeId = req.params.id;
    const point = RoutePointDtoMapper.fromAddRequest(req.body, routeId);
    const result = await this.routeService.addPoint(point);
    return res.status(201).json(RoutePointDtoMapper.toResponse(result));
  }

  async removePoint(req: Request, res: Response) {
    const pointId = req.params.pointId;
    await this.routeService.removePoint(RoutePointId.create(pointId));
    return res.status(204).send();
  }

  async startOptimization(req: Request, res: Response) {
    const routeId = RouteId.create(req.params.id);
    const startLocation = Location.create(req.body.startLocation.lat, req.body.startLocation.lng);
    const route = await this.routeService.start(routeId, startLocation);
    return res.status(200).json(RouteDtoMapper.toResponse(route));
  }
}