import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: any = {};

// Task 1 helper (don't touch)
app.post("/parse", (req: Request, res: Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  }
  res.json({ msg: parsed_string });
  return;

});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  if (!recipeName || recipeName.trim().length === 0) return null;

  const cleanedRecipeName = recipeName
    .replace(/[-_]/g, " ")
    .replace(/[^a-zA-Z\s]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim();

  return cleanedRecipeName.length === 0 ? null : cleanedRecipeName;
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req: Request, res: Response) => {
  const entry: cookbookEntry = req.body;

  // Check if entry is defined and entry.name exists
  if (!entry || entry.name == null) {
    return res.status(400).json({ message: "Entry doesn't exist." })
  }

  // Validate the type
  if (entry.type !== "recipe" && entry.type !== "ingredient") {
    return res.status(400).json({ message: "Invalid type. Must be 'recipe' or 'ingredient'." })
  }

  // See if the name already exists
  if (cookbook[entry.name]) {
    return res.status(400).json({ message: "An entry with this name already exists." });
  }

  // Handling 'ingredient' type validation
  if (entry.type === "ingredient") {
    const ingredient = entry as ingredient;
    if (ingredient.cookTime < 0) {
      return res.status(400).json({ message: "Cook time must be greater than or equal to 0." });
    }
    // Add to the cookbook
    cookbook[ingredient.name] = ingredient;
    return res.status(200).json({});
  }

  // Handling 'recipe' type validation
  if (entry.type === "recipe") {
    const recipe = entry as recipe;

    // Validate that requiredItems only have one element per name
    const requiredItemNames: string[] = [];
    for (const item of recipe.requiredItems) {
      if (requiredItemNames.includes(item.name)) {
        return res.status(400).json({ message: "Each required item can only appear once." });
      }
      requiredItemNames.push(item.name);
    }

    // Add to the cookbook
    cookbook[recipe.name] = recipe;
    return res.status(200).json({});
  }

  // Fallback in case the entry type doesn't match anything above
  return res.status(400).json({ message: "Invalid Entry" })
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req: Request, res: Request) => {
  // TODO: implement me
  res.status(500).send("not yet implemented!")

});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
