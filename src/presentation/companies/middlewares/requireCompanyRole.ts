import { NextFunction, Request, Response } from "express";
import { companyMemberRepository } from "@/dependencyInjection/container";

export default async function requireCompanyRole(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const companyId = req.params.companyId;
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const membership = await companyMemberRepository.findMembership(userId, companyId);
    if (!membership?.canManageMembers()) {
      res.status(403).json({ message: "No tienes permisos para gestionar miembros" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}