import { User } from "@/domain/users/entities/User";
import { IUserRepository } from "@/domain/users/repositories/IUserRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { Prisma } from "@/infrastructure/prisma/generated/prisma/client";
import { PrismaUserMapper } from "../mappers/PrismaUserMapper";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";
import { MemberCodeTakenError } from "@/domain/users/errors/MemberCodeTakenError";

export default class PrismaUsersRepository implements IUserRepository {

  private readonly client: Prisma.TransactionClient;

  constructor(client?: Prisma.TransactionClient) {
    this.client = client || prisma;
  }

  /**
   * Fetch all users from the database.
   * @returns A promise that resolves to an array of User entities.
   */
  async all(): Promise<User[]> {
    try {
      const users = await this.client.user.findMany({
        include: this.getIncludes(),
      });
      return users.map((user) => PrismaUserMapper.toDomain(user));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new DatabaseError("Could not fetch users");
    }
  }

  /**
   * Find a user by a specific field.
   * @param value The value to search for.
   * @param field The field to search in (defaults to "id").
   * @returns A promise that resolves to a User entity or null if not found.
   */
  async find(value: string, field?: string): Promise<User | null> {
    try {
      const user = await this.client.user.findFirst({
        where: {
          [field || "id"]: value,
        },
        include: this.getIncludes(),
      });
      return user ? PrismaUserMapper.toDomain(user) : null;
    } catch (error) {
      console.error("Error finding user:", error);
      throw new DatabaseError("Could not find user");
    }
  }

  /**
   * Create a new user in the database.
   * @param user The User entity to create.
   * @returns A promise that resolves when the user is created.
   */
  async create(user: User): Promise<void> {
    try {
      await this.client.user.create(PrismaUserMapper.toPersistence(user));
    } catch (error) {
      console.error("Error creating user:", error);
      throw new DatabaseInsertError("Could not create user");
    }
  }

  /**
   * Update an existing user in the database.
   * @param user The User entity to update.
   * @returns A promise that resolves when the user is updated.
   */
  async update(user: User): Promise<void> {
    try {
      await this.client.user.update({
        where: { id: user.id },
        data: PrismaUserMapper.toPersistence(user),
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw new DatabaseInsertError("Could not update user");
    }
  }

  /**
   * Delete a user from the database.
   * @param id The ID of the user to delete.
   * @returns A promise that resolves when the user is deleted.
   */
  async delete(id: string): Promise<void> {
    try {
      await this.client.user.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new DatabaseInsertError("Could not delete user");
    }
  }

  /**
   * Assign a member code to a user. The code is never written by create/update.
   * @throws MemberCodeTakenError when the unique constraint on memberCode is violated.
   */
  async setMemberCode(userId: string, code: string): Promise<void> {
    try {
      await this.client.user.update({
        where: { id: userId },
        data: { memberCode: code },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new MemberCodeTakenError();
      }
      console.error("Error setting member code:", error);
      throw new DatabaseInsertError("Could not set member code");
    }
  }

  /**
   * Find a user by their member code.
   * @returns A promise that resolves to a User entity or null if not found.
   */
  async findByMemberCode(code: string): Promise<User | null> {
    try {
      const user = await this.client.user.findUnique({
        where: { memberCode: code },
        include: this.getIncludes(),
      });
      return user ? PrismaUserMapper.toDomain(user) : null;
    } catch (error) {
      console.error("Error finding user by member code:", error);
      throw new DatabaseError("Could not find user");
    }
  }

  getIncludes() {
    return {
      companies: {
        include: {
          company: true
        }
      },
    }
  }

}