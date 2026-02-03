import IRouteService from "@/application/routes/services/interfaces/IRouteService";
import RouteDtoMapper from "../mappers/RouteDtoMapper";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import { Request, Response } from "express";

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
}