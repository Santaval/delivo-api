import requireCompanyId from "@/presentation/core/middlewares/requireCompanyId";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import { CreateClientSchema } from "../validators/createClient";
import { clientsController } from "@/dependencyInjection/container";
import { UpdateClientSchema } from "../validators/updateClient";
import enforceLimit from "@/presentation/billing/middlewares/enforceLimit";

const clientsRouter = Router();

clientsRouter.use(requireCompanyId)

clientsRouter.post("/", enforceLimit("clients"), validateSchema(CreateClientSchema),clientsController.create.bind(clientsController));

clientsRouter.get("/", clientsController.findByCompany.bind(clientsController));

clientsRouter.get("/:id", clientsController.findById.bind(clientsController));

clientsRouter.put("/:id", validateSchema(UpdateClientSchema), clientsController.update.bind(clientsController));

clientsRouter.delete("/:id", clientsController.delete.bind(clientsController));

export default clientsRouter;