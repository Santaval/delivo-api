import IRouteLocationService from "@/application/routes/services/interfaces/IRouteLocationService";
import DriverLocationDtoMapper from "../mappers/DriverLocationDtoMapper";
import { Route } from "@/domain/routes";
import IRouteService from "@/application/routes/services/interfaces/IRouteService";
import RouteDtoMapper from "../mappers/RouteDtoMapper";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import { Request, Response } from "express";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { RouteId, RoutePointId } from "@/domain/routes";
import RoutePointDtoMapper from "../mappers/RoutePointDtoMapper";
import z from "zod";
import { Location } from "@/domain/clients/valueObjects/location.valouObject";

export default class RoutesContoller {
  constructor(
    private readonly routeService: IRouteService,
    private readonly routeLocationService: IRouteLocationService
  ) {}

  private userId(req: Request): string {
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    return req.user.id;
  }

  /** Responses embed the driver location only for callers allowed to read it. */
  private async toResponses(req: Request, companyId: string, routes: Route[]) {
    const canSee = await this.routeLocationService.getLocationVisibility(companyId, this.userId(req));
    return routes.map((route) => RouteDtoMapper.toResponse(route, canSee(route)));
  }

  async create(req: Request, res: Response) {
    const companyId = CompanyIdParser(req)
    const route = RouteDtoMapper.fromCreateToDomain(req.body, companyId);
    const result = await this.routeService.create(route);
    const [dto] = await this.toResponses(req, companyId, [result]);
    return res.status(201).json(dto);
  }

  async findAll(req: Request, res: Response) {
    const companyId = CompanyIdParser(req);
    const driverIdQuery = req.query.driverId;
    let driverId: string | undefined;
    if (driverIdQuery !== undefined) {
      if (typeof driverIdQuery !== "string") {
        return res.status(400).json({ message: "driverId must be 'me' or a UUID" });
      }
      if (driverIdQuery === "me") {
        // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
        driverId = req.user.id;
      } else if (z.uuid().safeParse(driverIdQuery).success) {
        driverId = driverIdQuery;
      } else {
        return res.status(400).json({ message: "driverId must be 'me' or a UUID" });
      }
    }
    const result = await this.routeService.findAllByCompany(CompanyId.create(companyId), { driverId });
    return res.status(200).json(await this.toResponses(req, companyId, result));
  }

  async findById(req: Request, res: Response) {
    const routeId = RouteId.create(req.params.id);
    const result = await this.routeService.findById(routeId);
    if (!result) {
      return res.status(404).json({ message: "Route not found" });
    }
    const [resultDto] = await this.toResponses(req, result.companyId, [result]);
    return res.status(200).json(resultDto);
  }

  async assignDriver(req: Request, res: Response) {
    const companyId = CompanyIdParser(req);
    const result = await this.routeService.assignDriver(RouteId.create(req.params.id), req.body.driverId, companyId);
    const [dto] = await this.toResponses(req, companyId, [result]);
    return res.status(200).json(dto);
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
    const [dto] = await this.toResponses(req, route.companyId, [route]);
    return res.status(200).json(dto);
  }

  async completeDelivery(req: Request, res: Response) {
    const pointId = req.params.pointId;
    const result = await this.routeService.completeDelivery(RoutePointId.create(pointId));
    return res.status(200).json(RoutePointDtoMapper.toResponse(result));
  }

  async reportLocation(req: Request, res: Response) {
    const points = DriverLocationDtoMapper.fromReportToDomain(req.body);
    await this.routeLocationService.report(req.params.id, this.userId(req), points);
    return res.status(204).send();
  }

  async getLocation(req: Request, res: Response) {
    const location = await this.routeLocationService.getLatest(req.params.id, this.userId(req));
    return res.status(200).json(location ? DriverLocationDtoMapper.toResponse(location) : null);
  }

  /**
   * Server-Sent Events stream of the driver's live location.
   *
   * Everything that can fail (auth, 404/403) happens BEFORE the headers are flushed, so errors
   * still reach the errorHandler as normal JSON responses. After `flushHeaders()` nothing here
   * awaits or throws, and no JSON is ever written.
   */
  async streamLocation(req: Request, res: Response) {
    const routeId = req.params.id;
    const route = await this.routeLocationService.authorizeRead(routeId, this.userId(req));

    // client went away while we were authorizing
    if (res.destroyed || res.writableEnded) return;

    // SSE connections are long-lived: no idle timeout on this socket
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);

    res.status(200).set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.flushHeaders();

    const send = (event: string, data: unknown) => {
      if (res.writableEnded || res.destroyed) return;
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    // client retry delay after a dropped connection
    res.write("retry: 5000\n\n");

    if (route.status === "COMPLETED") {
      send("finished", {});
      res.end();
      return;
    }

    let unsubscribe: () => void = () => {};
    let pingInterval: NodeJS.Timeout | undefined;
    const cleanup = () => {
      if (pingInterval) clearInterval(pingInterval);
      pingInterval = undefined;
      unsubscribe();
      unsubscribe = () => {};
    };
    // `res` close is used (not `req`): it fires reliably when the client disconnects.
    res.on("close", cleanup);

    // subscribe first, then send the last known position taken from the same read
    unsubscribe = this.routeLocationService.subscribe(routeId, (event) => {
      if (event.type === "location") {
        send("location", DriverLocationDtoMapper.toResponse(event.location));
      } else if (event.type === "cleared") {
        send("cleared", null);
      } else {
        send("finished", {});
        cleanup();
        res.end();
      }
    });

    if (route.driverLocation) send("location", DriverLocationDtoMapper.toResponse(route.driverLocation));

    // comment line so proxies (Coolify/Traefik/nginx) don't drop the idle connection
    pingInterval = setInterval(() => {
      if (res.writableEnded || res.destroyed) return cleanup();
      res.write(": ping\n\n");
    }, 25_000);
  }
}
