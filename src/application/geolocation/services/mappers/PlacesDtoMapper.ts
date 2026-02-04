import { PlaceSuggestion } from "@/domain/geolocation/valueObjects/PlaceSuggestion";
import { PlaceResult } from "../../output/AutocompleteResult";

export class PlacesDtoMapper {

    static toPlaceResult(placeSuggestion: PlaceSuggestion): PlaceResult {
        return {
            description: placeSuggestion.description,
            placeId: placeSuggestion.placeId,
        };
    }
}