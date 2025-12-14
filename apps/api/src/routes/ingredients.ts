import { prisma } from "@rcps/prisma";
import { Router } from "express";

const router = Router();

router.get("/", async (_, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { visibility: "PUBLIC" },
      include: {
        nutritions: {
          include: { nutrient: true },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json({ ingredients });
  } catch (error) {
    console.error("Failed to fetch ingredients", error);
    res.status(500).json({ error: "Failed to fetch ingredients" });
  }
});

export default router;
