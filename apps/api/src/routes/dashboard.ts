import { prisma } from "@rcps/prisma";
import { Router } from "express";
import { requireInternalKey } from "../middleware/requireInternalKey";

const router = Router();

// Get dashboard statistics (admin only, internal endpoint)
router.get("/stats", requireInternalKey, async (_, res) => {
  try {
    // Get start of today for "active today" calculations
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Run all counts in parallel for performance
    const [
      totalUsers,
      totalRecipes,
      totalIngredients,
      usersCreatedToday,
      recipesCreatedToday,
      recentUsers,
      recentRecipes,
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.recipe.count(),
      prisma.ingredient.count(),

      // Activity today
      prisma.user.count({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.recipe.count({
        where: { createdAt: { gte: todayStart } },
      }),

      // Recent users (last 5)
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          role: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Recent recipes (last 5)
      prisma.recipe.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
          status: true,
          author: {
            select: {
              username: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    // Combine new users and recipes for "active today"
    const activeToday = usersCreatedToday + recipesCreatedToday;

    // Build recent activity feed with structured data for client-side translation
    const recentActivity = [
      ...recentUsers.map((user) => ({
        type: "user_registered" as const,
        id: user.id,
        timestamp: user.createdAt,
        data: {
          name: user.username || user.email,
          email: user.email,
          role: user.role,
        },
      })),
      ...recentRecipes.map((recipe) => ({
        type: "recipe_created" as const,
        id: recipe.id,
        timestamp: recipe.createdAt,
        data: {
          title: recipe.title,
          author: recipe.author?.username || recipe.author?.email || "Unknown",
          status: recipe.status,
        },
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    res.json({
      stats: {
        totalUsers,
        totalRecipes,
        totalIngredients,
        activeToday,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

export default router;
