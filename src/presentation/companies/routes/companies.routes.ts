import { Router } from "express";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import requireAuth from "@/presentation/auth/middlewares/requireAuth";
import { CreateCompanySchema } from "../validators/createCompany";
import { UpdateCompanySchema } from "../validators/updateCompany";
import { companyController } from "@/dependencyInjection/container";

const companyRouter = Router();

// Apply authentication to all routes
companyRouter.use(requireAuth);

// CRUD Routes
companyRouter.post('/', 
  validateSchema(CreateCompanySchema), 
  asyncHandler(companyController.create.bind(companyController))
);

companyRouter.get('/', 
  asyncHandler(companyController.findAll.bind(companyController))
);

companyRouter.get('/:id', 
  asyncHandler(companyController.findById.bind(companyController))
);

companyRouter.put('/:id', 
  validateSchema(UpdateCompanySchema), 
  asyncHandler(companyController.update.bind(companyController))
);

companyRouter.delete('/:id', 
  asyncHandler(companyController.delete.bind(companyController))
);

export default companyRouter;
