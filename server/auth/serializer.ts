import { User } from "@prisma/client";

export const authSerializer = {
  serializeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  },

  serializeAuthResponse(user: User, token: string) {
    return {
      user: this.serializeUser(user),
      token,
    };
  },
};
