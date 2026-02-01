import { NextFunction, Request, Response } from "express";
import CompanyIdParser from "../utils/companyIdParser";

export default function requireCompanyId(req: Request, res: Response, next: NextFunction) {
  const companyId = CompanyIdParser(req);
  if (!companyId) {
    res.status(400).json({ message: "Company ID is required" });
    return;
  }

  next();
}
