import { CompanyInvitation } from "@/domain/companies/entities/CompanyInvitation";
import { ICompanyInvitationRepository } from "@/domain/companies/repositories/ICompanyInvitationRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaCompanyInvitationMapper } from "../mappers/PrismaCompanyInvitationMapper";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";

export default class PrismaCompanyInvitationRepository implements ICompanyInvitationRepository {

  constructor() { }

  async create(invitation: CompanyInvitation): Promise<void> {
    try {
      await prisma.companyInvitation.create(PrismaCompanyInvitationMapper.toPersistence(invitation));
    } catch (error) {
      console.error("Error creating invitation:", error);
      throw new DatabaseInsertError("Could not create invitation");
    }
  }

  async findById(id: string): Promise<CompanyInvitation | null> {
    try {
      const row = await prisma.companyInvitation.findUnique({
        where: { id },
      });
      return row ? PrismaCompanyInvitationMapper.toDomain(row) : null;
    } catch (error) {
      console.error("Error finding invitation by id:", error);
      throw new DatabaseError("Could not find invitation");
    }
  }

  async findByToken(token: string): Promise<CompanyInvitation | null> {
    try {
      const row = await prisma.companyInvitation.findUnique({
        where: { token },
      });
      return row ? PrismaCompanyInvitationMapper.toDomain(row) : null;
    } catch (error) {
      console.error("Error finding invitation by token:", error);
      throw new DatabaseError("Could not find invitation");
    }
  }

  async findPendingByEmailAndCompany(email: string, companyId: string): Promise<CompanyInvitation | null> {
    try {
      const row = await prisma.companyInvitation.findFirst({
        where: { email, companyId, status: "PENDING" },
      });
      return row ? PrismaCompanyInvitationMapper.toDomain(row) : null;
    } catch (error) {
      console.error("Error finding pending invitation:", error);
      throw new DatabaseError("Could not find invitation");
    }
  }

  async findByCompany(companyId: string): Promise<CompanyInvitation[]> {
    try {
      const rows = await prisma.companyInvitation.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
      });
      return rows.map((row) => PrismaCompanyInvitationMapper.toDomain(row));
    } catch (error) {
      console.error("Error fetching invitations:", error);
      throw new DatabaseError("Could not fetch invitations");
    }
  }

  async update(invitation: CompanyInvitation): Promise<void> {
    try {
      await prisma.companyInvitation.update({
        where: { id: invitation.id },
        data: PrismaCompanyInvitationMapper.toPersistence(invitation).data,
      });
    } catch (error) {
      console.error("Error updating invitation:", error);
      throw new DatabaseInsertError("Could not update invitation");
    }
  }
}