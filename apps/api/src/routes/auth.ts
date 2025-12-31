import { prisma } from "@rcps/prisma";
import bcrypt from "bcrypt";
import { Router } from "express";
import { requireInternalKey } from "../middleware/requireInternalKey";
import { isValidEmail, isValidPassword, normalizeEmail } from "../utils/validation";

const router = Router();

// TODO: Production auth improvements
// 1. Email verification - Send verification email on signup, add emailVerified field to User
// 2. Password reset flow - Implement forgot password with secure token
// 3. Account lockout - Lock account after X failed login attempts
// 4. Audit logging - Log auth events (login, logout, failed attempts)
// 5. Session management - Allow users to see/revoke active sessions
// 6. 2FA - Add optional two-factor authentication

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Server-side validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Normalize email
    const normalizedEmail = normalizeEmail(email);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        username: name?.trim() || normalizedEmail.split("@")[0],
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        role: true,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Normalize email
    const normalizedEmail = normalizeEmail(email);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.password) {
      // Use generic message to prevent user enumeration
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Return user data (without password)
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get user by ID (for session validation)
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Get user by email (for OAuth flows) - INTERNAL ONLY
router.get("/user-by-email", requireInternalKey, async (req, res) => {
  try {
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// OAuth sign in - create or find user - INTERNAL ONLY
router.post("/oauth", requireInternalKey, async (req, res) => {
  try {
    const { email, name, provider } = req.body;

    if (!email || !provider) {
      return res.status(400).json({ error: "Email and provider are required" });
    }

    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    // If user doesn't exist, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: name || email.split("@")[0],
          // No password for OAuth users
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
        },
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("OAuth user sync failed:", error);
    res.status(500).json({ error: "Failed to sync OAuth user" });
  }
});

export default router;
