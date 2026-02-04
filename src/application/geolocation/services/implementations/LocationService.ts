import { LocationAutocompleteCommand } from "../../input/LocationAutocompleteCommand";
import { PlaceResult } from "../../output/AutocompleteResult";
import { ILocationService } from "../interfaces/ILocationService";
import { IPlacesService } from "../interfaces/IPlacesService";
import { PlacesDtoMapper } from "../mappers/PlacesDtoMapper";
import { PlaceDetailsResult } from "../../output/PlaceDetailsResult";

export default class LocationService implements ILocationService {
  constructor(
    private readonly placesService: IPlacesService,
  ) { }


  async autocomplete(command: LocationAutocompleteCommand): Promise<PlaceResult[]> {
    const placeSuggestions = await this.placesService.autocomplete(command.query);
    return placeSuggestions.map(PlacesDtoMapper.toPlaceResult);
  }

  async placeDetails(id: string): Promise<PlaceDetailsResult | null> {
    return this.placesService.details(id);
  }

}