import { ILocationService } from "@/application/geolocation/services/interfaces/ILocationService";
import { Request, Response } from "express";
import { LocationMapper } from "../mappers/LocationMapper";

export default class LocationController {
  constructor(private readonly locationService: ILocationService) { }

  async autocomplete(req: Request, res: Response) {
    if (!req.query.q || typeof req.query.q !== 'string') {
      res.status(400).json({ message: "Query parameter 'q' is required" });
      return;
    }
    const results = await this.locationService.autocomplete({ query: req.query.q as string });
    const response = LocationMapper.toLocationAutocompleteResponse(results);
    res.status(200).json(response);
  }

  async placeDetails(req: Request, res: Response) {
    if (!req.params.id) {
      res.status(400).json({ message: "Location ID is required" });
      return;
    }
    const location = await this.locationService.placeDetails(req.params.id);
    if (!location) {
      res.status(404).json({ message: "Location not found" });
      return;
    }
    res.status(200).json(location);
  }

}