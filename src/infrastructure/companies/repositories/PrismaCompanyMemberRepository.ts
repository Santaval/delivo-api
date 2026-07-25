import { CompanyMember } from "@/domain/companies/entities/CompanyMember";
import { ICompanyMemberRepository } from "@/domain/companies/repositories/ICompanyMemberRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaCompanyMemberMapper } from "../mappers/PrismaCompanyMemberMapper";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";

export default class PrismaCompanyMemberRepository implements ICompanyMemberRepository {

  constructor() { }

  async findByCompany(companyId: string): Promise<CompanyMember[]> {
    try {
      const rows = await prisma.userCompany.findMany({
        where: { companyId },
      });
      return rows.map((row) => PrismaCompanyMemberMapper.toDomain(row));
    } catch (error) {
      console.error("Error fetching company members:", error);
      throw new DatabaseError("Could not fetch company members");
    }
  }

  async findMembership(userId: string, companyId: string): Promise<CompanyMember | null> {
    try {
      const row = await prisma.userCompany.findUnique({
        where: { userId_companyId: { userId, companyId } },
      });
      return row ? PrismaCompanyMemberMapper.toDomain(row) : null;
    } catch (error) {
      console.error("Error finding membership:", error);
      throw new DatabaseError("Could not find membership");
    }
  }

  async add(member: CompanyMember): Promise<void> {
    try {
      await prisma.userCompany.create(PrismaCompanyMemberMapper.toPersistence(member));
    } catch (error) {
      console.error("Error adding member:", error);
      throw new DatabaseInsertError("Could not add member to company");
    }
  }

  async updateRole(member: CompanyMember): Promise<void> {
    try {
      await prisma.userCompany.update({
        where: { userId_companyId: { userId: member.userId, companyId: member.companyId } },
        data: { role: member.role },
      });
    } catch (error) {
      console.error("Error updating member role:", error);
      throw new DatabaseInsertError("Could not update member role");
    }
  }

  async remove(userId: string, companyId: string): Promise<void> {
    try {
      await prisma.userCompany.delete({
        where: { userId_companyId: { userId, companyId } },
      });
    } catch (error) {
      console.error("Error removing member:", error);
      throw new DatabaseInsertError("Could not remove member");
    }
  }
}