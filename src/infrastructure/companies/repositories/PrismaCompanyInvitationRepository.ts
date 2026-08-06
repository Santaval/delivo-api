import { CompanyInvitation } from "@/domain/companies/entities/CompanyInvitation";
import { ICompanyInvitationRepository } from "@/domain/companies/repositories/ICompanyInvitationRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { Prisma } from "@/infrastructure/prisma/generated/prisma/client";
import { PrismaCompanyInvitationMapper } from "../mappers/PrismaCompanyInvitationMapper";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";

export default class PrismaCompanyInvitationRepository implements ICompanyInvitationRepository {

  private readonly client: Prisma.TransactionClient;

  constructor(client?: Prisma.TransactionClient) {
    this.client = client || prisma;
  }

  async create(invitation: CompanyInvitation): Promise<void> {
    try {
      await this.client.companyInvitation.create(PrismaCompanyInvitationMapper.toPersistence(invitation));
    } catch (error) {
      console.error("Error creating invitation:", error);
      throw new DatabaseInsertError("Could not create invitation");
    }
  }

  async findById(id: string): Promise<CompanyInvitation | null> {
    try {
      const row = await this.client.companyInvitation.findUnique({
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
      const row = await this.client.companyInvitation.findUnique({
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
      const row = await this.client.companyInvitation.findFirst({
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
      const rows = await this.client.companyInvitation.findMany({
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
      await this.client.companyInvitation.update({
        where: { id: invitation.id },
        data: PrismaCompanyInvitationMapper.toPersistence(invitation).data,
      });
    } catch (error) {
      console.error("Error updating invitation:", error);
      throw new DatabaseInsertError("Could not update invitation");
    }
  }

  async deleteManyByInvitedBy(invitedById: string): Promise<void> {
    try {
      await this.client.companyInvitation.deleteMany({
        where: { invitedById },
      });
    } catch (error) {
      console.error("Error deleting invitations by inviter:", error);
      throw new DatabaseInsertError("Could not delete invitations by inviter");
    }
  }

  async deleteManyByEmail(email: string): Promise<void> {
    try {
      await this.client.companyInvitation.deleteMany({
        where: { email },
      });
    } catch (error) {
      console.error("Error deleting invitations by email:", error);
      throw new DatabaseInsertError("Could not delete invitations by email");
    }
  }
}