import Location from "@/domain/geolocation/entities/Location";
import { LocationAutocompleteCommand } from "../../input/LocationAutocompleteCommand";
import { PlaceResult } from "../../output/AutocompleteResult";
import { PlaceDetailsResult } from "../../output/PlaceDetailsResult";

export interface ILocationService {
  autocomplete(command: LocationAutocompleteCommand): Promise<PlaceResult[]>;
  placeDetails(id: string): Promise<PlaceDetailsResult | null>;
}