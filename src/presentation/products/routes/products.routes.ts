import { productsController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import requireCompanyId from "@/presentation/core/middlewares/requireCompanyId";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import { CreateProductSchema } from "../validators/createProduct";
import enforceLimit from "@/presentation/billing/middlewares/enforceLimit";

const productsRouter = Router()

productsRouter.use(requireCompanyId)

productsRouter.get("/", asyncHandler(productsController.findByCompany.bind(productsController)))
productsRouter.post("/", enforceLimit("products"), validateSchema(CreateProductSchema), asyncHandler(productsController.create.bind(productsController)))
productsRouter.get("/:id", asyncHandler(productsController.findById.bind(productsController)))
productsRouter.put("/:id", asyncHandler(productsController.update.bind(productsController)))
productsRouter.delete("/:id", asyncHandler(productsController.delete.bind(productsController)))

export default productsRouter;