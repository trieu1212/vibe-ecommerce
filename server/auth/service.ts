import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authRepo } from "./repo";
import { LoginInput, RegisterInput } from "./schemas";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const authService = {
  async register(input: RegisterInput) {
    // Check if user exists
    const existingUser = await authRepo.findUserByEmail(input.email);
    if (existingUser) {
      throw new Error("Email đã được sử dụng");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create user
    const user = await authRepo.createUser({
      email: input.email,
      password: hashedPassword,
      name: input.name,
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return { user, token };
  },

  async login(input: LoginInput) {
    // Find user
    const user = await authRepo.findUserByEmail(input.email);
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return { user, token };
  },

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      throw new Error("Token không hợp lệ");
    }
  },

  async getCurrentUser(token: string) {
    const decoded = await this.verifyToken(token);
    const user = await authRepo.findUserById(decoded.userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    return user;
  },
};
