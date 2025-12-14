import { prisma } from "@rcps/prisma";
import { Router } from "express";

const router = Router();

router.get("/", async (_, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { visibility: "PUBLIC", status: "PUBLISHED" },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        tags: {
          include: { tag: true },
        },
        nutritions: {
          include: { nutrient: true },
        },
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ recipes });
  } catch (error) {
    console.error("Failed to fetch recipes", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

export default router;
