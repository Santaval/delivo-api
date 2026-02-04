import { PlaceSuggestion } from "@/domain/geolocation/valueObjects/PlaceSuggestion";
import { PlaceDetailsResult } from "../../output/PlaceDetailsResult";

export interface IPlacesService {
  autocomplete(query: string): Promise<PlaceSuggestion[]>;
  details(placeId: string): Promise<PlaceDetailsResult>;
}
