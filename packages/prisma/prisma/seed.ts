import bcrypt from "bcrypt";
import {
  ConnectionStatus,
  ContentOrigin,
  IngredientOwner,
  MeasurementUnit,
  NutrientCategory,
  NutrientUnit,
  RecipeStatus,
  TagType,
  UserRole,
  Visibility,
} from "../generated/prisma/index.js";
import { prisma } from "../src/client.js";

const hashedPassword = bcrypt.hashSync("nomayo", 10);

async function main() {
  console.log("Seeding database...");

  // 1. Users & connections
  const admin = await prisma.user.upsert({
    where: { email: "samuelkasman@gmail.com" },
    update: {},
    create: {
      email: "samuelkasman@gmail.com",
      role: UserRole.ADMIN,
      password: hashedPassword,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "chef@example.com" },
    update: {},
    create: {
      email: "chef@example.com",
      username: "chef",
      role: UserRole.USER,
      password: hashedPassword,
    },
  });

  await prisma.userConnection.upsert({
    where: { senderId_receiverId: { senderId: admin.id, receiverId: demoUser.id } },
    update: { status: ConnectionStatus.ACCEPTED },
    create: {
      senderId: admin.id,
      receiverId: demoUser.id,
      status: ConnectionStatus.ACCEPTED,
    },
  });

  console.log("Users ready:", [admin.email, demoUser.email].join(", "));

  // 2. Nutrients
  const nutrientsData = [
    { key: "calories", name: "Calories", unit: NutrientUnit.KCAL, category: NutrientCategory.ENERGY },
    { key: "protein", name: "Protein", unit: NutrientUnit.G, category: NutrientCategory.MACRO },
    { key: "fat", name: "Fat", unit: NutrientUnit.G, category: NutrientCategory.MACRO },
    { key: "carbs", name: "Carbohydrates", unit: NutrientUnit.G, category: NutrientCategory.MACRO },
  ];

  const nutrients = [];
  for (const n of nutrientsData) {
    const nutrient = await prisma.nutrient.upsert({
      where: { key: n.key },
      update: {},
      create: n,
    });
    nutrients.push(nutrient);
  }

  console.log("Nutrients created:", nutrients.map(n => n.key).join(", "));

  // 3. Ingredients
  const ingredientsData = [
    { name: "Egg", origin: ContentOrigin.BASE, ownerType: IngredientOwner.SYSTEM, visibility: Visibility.PUBLIC, density: 1 },
    { name: "Butter", origin: ContentOrigin.BASE, ownerType: IngredientOwner.SYSTEM, visibility: Visibility.PUBLIC, density: 0.911 },
  ];

  const ingredients = [];
  for (const i of ingredientsData) {
    const existing = await prisma.ingredient.findFirst({
      where: { name: i.name, origin: i.origin, ownerType: i.ownerType },
    });
    const ingredient = existing ?? (await prisma.ingredient.create({ data: i }));
    ingredients.push(ingredient);
  }

  console.log("Ingredients created:", ingredients.map(i => i.name).join(", "));

  const ingredientByName = Object.fromEntries(ingredients.map(i => [i.name, i]));

  // 4. Ingredient Nutrition (per 100g)
  const nutritionMap: Record<string, Record<string, number>> = {
    Egg: { calories: 155, protein: 13, fat: 11, carbs: 1.1 },
    Butter: { calories: 717, protein: 0.85, fat: 81, carbs: 0.1 },
  };

  for (const ingredient of ingredients) {
    const values = nutritionMap[ingredient.name];
    for (const nutrient of nutrients) {
      const amount = values[nutrient.key];
      if (amount !== undefined) {
        await prisma.ingredientNutrition.upsert({
          where: { ingredientId_nutrientId: { ingredientId: ingredient.id, nutrientId: nutrient.id } },
          update: {},
          create: {
            ingredientId: ingredient.id,
            nutrientId: nutrient.id,
            amountPer100g: amount,
          },
        });
      }
    }
  }

  console.log("Ingredient nutrition created.");

  // 5. Tags
  const tagsData = [
    { name: "Breakfast", type: TagType.MANUAL },
    { name: "High Protein", type: TagType.DERIVED },
  ];

  const tags = [];
  for (const tag of tagsData) {
    const created = await prisma.tag.upsert({
      where: { name: tag.name },
      update: { type: tag.type },
      create: tag,
    });
    tags.push(created);
  }

  console.log("Tags created:", tags.map(t => t.name).join(", "));

  // 6. Recipe: Omelette with Butter
  const recipeIngredientAmounts: Record<string, number> = {
    Egg: 100,
    Butter: 10,
  };

  const recipe = await prisma.recipe.create({
    data: {
      title: "Omelette with Butter",
      slug: "omelette-with-butter",
      description: "Simple omelette fried in butter.",
      instructions: "Beat eggs, melt butter in pan, cook eggs, fold omelette.",
      servings: 1,
      prepMinutes: 3,
      cookMinutes: 5,
      status: RecipeStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      origin: ContentOrigin.BASE,
      authorId: admin.id,
      ingredients: {
        create: [
          {
            ingredientId: ingredientByName["Egg"].id,
            quantity: recipeIngredientAmounts["Egg"],
            unit: MeasurementUnit.G,
          },
          {
            ingredientId: ingredientByName["Butter"].id,
            quantity: recipeIngredientAmounts["Butter"],
            unit: MeasurementUnit.G,
          },
        ],
      },
    },
  });

  console.log("Recipe created:", recipe.title);

  // 7. Recipe nutrition (derived from ingredient nutrition)
  const nutrientLookup = new Map(nutrients.map(n => [n.key, n]));
  const recipeNutritionTotals: Record<string, number> = {};

  for (const [ingredientName, grams] of Object.entries(recipeIngredientAmounts)) {
    const values = nutritionMap[ingredientName];
    if (!values) continue;
    for (const [nutrientKey, amountPer100g] of Object.entries(values)) {
      const total = (recipeNutritionTotals[nutrientKey] ?? 0) + (amountPer100g * grams) / 100;
      recipeNutritionTotals[nutrientKey] = total;
    }
  }

  for (const [nutrientKey, amountTotal] of Object.entries(recipeNutritionTotals)) {
    const nutrient = nutrientLookup.get(nutrientKey);
    if (!nutrient) continue;
    await prisma.recipeNutrition.upsert({
      where: { recipeId_nutrientId: { recipeId: recipe.id, nutrientId: nutrient.id } },
      update: {
        amountTotal,
        amountPerServing: amountTotal / recipe.servings,
      },
      create: {
        recipeId: recipe.id,
        nutrientId: nutrient.id,
        amountTotal,
        amountPerServing: amountTotal / recipe.servings,
      },
    });
  }

  console.log("Recipe nutrition created.");

  // 8. Recipe tags
  for (const tag of tags) {
    await prisma.recipeTag.upsert({
      where: { recipeId_tagId: { recipeId: recipe.id, tagId: tag.id } },
      update: {},
      create: {
        recipeId: recipe.id,
        tagId: tag.id,
      },
    });
  }

  console.log("Recipe tags created.");

  // 9. Recipe image
  await prisma.recipeImage.upsert({
    where: { id: "omelette-main-image" },
    update: {
      recipeId: recipe.id,
      url: "https://images.unsplash.com/photo-1508736793122-f516e3ba5569",
      order: 1,
    },
    create: {
      id: "omelette-main-image",
      recipeId: recipe.id,
      url: "https://images.unsplash.com/photo-1508736793122-f516e3ba5569",
      order: 1,
    },
  });

  console.log("Recipe image created.");

  // 10. Favorites
  await prisma.userFavoriteRecipe.upsert({
    where: { userId_recipeId: { userId: demoUser.id, recipeId: recipe.id } },
    update: {},
    create: {
      userId: demoUser.id,
      recipeId: recipe.id,
    },
  });

  console.log("Favorites created.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
