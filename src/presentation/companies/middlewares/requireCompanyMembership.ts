import { NextFunction, Request, Response } from "express";
import { companyMemberRepository } from "@/dependencyInjection/container";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";

/** Any role: the caller must be a member of the company in `x-company-id` (mount after requireCompanyId). */
export default async function requireCompanyMembership(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const companyId = CompanyIdParser(req);
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const membership = await companyMemberRepository.findMembership(userId, companyId);
    if (!membership) {
      res.status(403).json({ message: "No perteneces a esta empresa" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}
