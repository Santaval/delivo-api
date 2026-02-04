import { locationController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import { Router } from "express";


const locationRouter = Router();

locationRouter.get("/autocomplete", 
    asyncHandler(locationController.autocomplete.bind(locationController))
);
locationRouter.get("/place/:id", asyncHandler(locationController.placeDetails.bind(locationController)));

export default locationRouter;