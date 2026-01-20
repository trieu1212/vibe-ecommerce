import { prisma } from "@/src/lib/db";
import { UserRole } from "@prisma/client";

export const authRepo = {
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
  }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || "USER",
      },
    });
  },

  async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },
};
