import { PlaceResult } from "@/application/geolocation/output/AutocompleteResult";
import { LocationAutocompleteResponse } from "../responses/LocationAutocompleteResponse";
import { LocationAutocompleteCommand } from "@/application/geolocation/input/LocationAutocompleteCommand";

export class LocationMapper {
    static toLocationAutocompleteResponse(results: PlaceResult[]): LocationAutocompleteResponse {
        return {
            results,
        };
    }

    static toLocationAutocompleteCommand(query: string): LocationAutocompleteCommand {
        return {
            query,
        };
    }
}
        