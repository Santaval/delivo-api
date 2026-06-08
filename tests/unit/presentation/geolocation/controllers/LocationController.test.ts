import { Request, Response } from 'express';
import LocationController from '@/presentation/geolocation/controllers/LocationController';
import { ILocationService } from '@/application/geolocation/services/interfaces/ILocationService';
import { PlaceResult } from '@/application/geolocation/output/AutocompleteResult';

describe('LocationController', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  let locationService: jest.Mocked<ILocationService>;
  let controller: LocationController;

  beforeEach(() => {
    locationService = { autocomplete: jest.fn(), placeDetails: jest.fn() } as any;
    controller = new LocationController(locationService);
  });

  describe('autocomplete', () => {
    it('should return autocomplete results', async () => {
      const results: PlaceResult[] = [{ description: 'Bogotá', placeId: 'place-1' }];
      locationService.autocomplete.mockResolvedValue(results);
      const req = { query: { q: 'Bog' } } as unknown as Request;
      const res = mockRes();
      await controller.autocomplete(req, res);
      expect(locationService.autocomplete).toHaveBeenCalledWith({ query: 'Bog' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ results }));
    });

    it('should return 400 when query is missing', async () => {
      const req = { query: {} } as unknown as Request;
      const res = mockRes();
      await controller.autocomplete(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('placeDetails', () => {
    it('should return place details', async () => {
      locationService.placeDetails.mockResolvedValue({ lat: 10, lng: -66 } as any);
      const req = { params: { id: 'place-1' } } as unknown as Request;
      const res = mockRes();
      await controller.placeDetails(req, res);
      expect(locationService.placeDetails).toHaveBeenCalledWith('place-1');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when id is missing', async () => {
      const req = { params: {} } as unknown as Request;
      const res = mockRes();
      await controller.placeDetails(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 when place not found', async () => {
      locationService.placeDetails.mockResolvedValue(null as any);
      const req = { params: { id: 'place-1' } } as unknown as Request;
      const res = mockRes();
      await controller.placeDetails(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
