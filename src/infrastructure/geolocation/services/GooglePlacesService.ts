import { PlaceDetailsResult } from "@/application/geolocation/output/PlaceDetailsResult";
import { IPlacesService } from "@/application/geolocation/services/interfaces/IPlacesService";
import { PlaceSuggestion } from "@/domain/geolocation/valueObjects/PlaceSuggestion";
import InfrastructureError from "@/infrastructure/core/errors/InfrastructureError";
import { Client } from "@googlemaps/google-maps-services-js";

export class GooglePlacesService implements IPlacesService {
  private client: Client = new Client({});
  
    /**
     * Autocomplete place suggestions based on a query string.
     * @param query 
     * @returns  Promise<PlaceSuggestion[]>
     */
  async autocomplete(query: string) : Promise<PlaceSuggestion[]> {
    try {
      const params = {
        input: query,
        key: process.env.GOOGLE_MAPS_API_KEY || "",
        components: [ "country:cr" ] // Restrict to Costa Rica
      };

      const response = await this.client.placeAutocomplete({
        params,
      }); 


      return response.data.predictions.map(prediction => ({
        description: prediction.description,
        placeId: prediction.place_id
      }));

    } catch {
        throw new InfrastructureError("Failed to fetch place autocomplete");
    }
  }

  async details(placeId: string): Promise<PlaceDetailsResult> {
    try {
      const params = {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY || "",
        fields: ["geometry", "name", "place_id"]
      };

      const response = await this.client.placeDetails({
        params,
      });

      const result = response.data.result;
      if (!result.geometry || !result.geometry.location) {
        throw new InfrastructureError("Location data not found in place details");
      }
      const location: PlaceDetailsResult = {
        placeId,
        name: result.name || "",
        address: result.formatted_address || "",
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng
      };

      return location;
    } catch (error) {
      if (error instanceof InfrastructureError) throw error;
      throw new InfrastructureError("Failed to fetch place details");
    }
  }

}