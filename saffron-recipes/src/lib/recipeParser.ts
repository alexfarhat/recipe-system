import { Dish, Ingredient, Instruction } from '../types';

const UNITS = [
'cups',
'cup',
'tablespoons',
'tablespoon',
'tbsp',
'tbs',
'teaspoons',
'teaspoon',
'tsp',
'grams',
'gram',
'kg',
'g',
'milliliters',
'ml',
'liters',
'liter',
'l',
'ounces',
'ounce',
'oz',
'pounds',
'pound',
'lbs',
'lb',
'cloves',
'clove',
'pinches',
'pinch',
'dash',
'dashes',
'medium',
'large',
'small',
'cans',
'can',
'bunches',
'bunch',
'slices',
'slice',
'pieces',
'piece',
'sprigs',
'sprig',
'sticks',
'stick'];


const TAG_KEYWORDS = [
'vegan',
'vegetarian',
'gluten-free',
'dairy-free',
'quick',
'easy',
'healthy',
'spicy',
'comfort',
'sweet',
'savory',
'fresh',
'summer',
'winter',
'baked',
'grilled',
'fried',
'roasted'];


const CATEGORY_KEYWORDS: Record<Dish['category'], string[]> = {
  Breakfast: [
  'breakfast',
  'brunch',
  'morning',
  'pancake',
  'waffle',
  'omelet',
  'omelette'],

  Lunch: ['lunch', 'sandwich', 'wrap', 'salad bowl'],
  Dinner: ['dinner', 'supper', 'main course', 'entree', 'entrée'],
  Dessert: [
  'dessert',
  'cake',
  'cookie',
  'pie',
  'tart',
  'pudding',
  'ice cream',
  'chocolate',
  'sweet'],

  Snack: ['snack', 'appetizer', 'starter', 'hors d', 'finger food', 'dip']
};

const INSTRUCTION_VERBS = [
'preheat',
'heat',
'add',
'mix',
'stir',
'combine',
'whisk',
'beat',
'fold',
'cook',
'bake',
'roast',
'fry',
'sauté',
'saute',
'simmer',
'boil',
'steam',
'cut',
'chop',
'slice',
'dice',
'mince',
'grate',
'peel',
'season',
'sprinkle',
'pour',
'drizzle',
'remove',
'transfer',
'serve',
'garnish',
'let',
'allow',
'place',
'set',
'reduce',
'increase',
'cover',
'uncover',
'drain',
'rinse'];


const SECTION_PATTERNS = {
  ingredients:
  /^[\s•*\-#]*\b(ingredients?|what\s+you'?ll?\s+need|you\s+will\s+need|shopping\s+list)\b[\s:.]*$/i,
  instructions:
  /^[\s•*\-#]*\b(instructions?|directions?|steps?|method|how\s+to\s+(make|prepare|cook)|preparation|procedure)\b[\s:.]*$/i,
  notes:
  /^[\s•*\-#]*\b(chef'?s?\s+notes?|notes?|tips?|chef'?s?\s+tips?|extras?)\b[\s:.]*$/i,
  details:
  /^[\s•*\-#]*\b(serving\s+(suggestions?|ideas?)|additional\s+(details?|info|information)|storage|to\s+serve|pairing)\b[\s:.]*$/i
};

function cleanLine(line: string): string {
  return line.replace(/^[\s•*\-]+/, '').trim();
}

function looksLikeIngredient(line: string): boolean {
  const cleaned = cleanLine(line);
  if (cleaned.length < 2 || cleaned.length > 150) return false;
  // Starts with a quantity (digit or fraction)
  if (/^[\d¼½¾⅓⅔⅛⅜⅝⅞]+/.test(cleaned)) return true;
  // Contains a unit word
  const unitRegex = new RegExp(`\\b(${UNITS.join('|')})\\b`, 'i');
  if (unitRegex.test(cleaned) && /^\S{1,30}\b/.test(cleaned)) return true;
  // "to taste" pattern
  if (/\bto\s+taste\b/i.test(cleaned)) return true;
  // Was a bulleted list item
  if (/^[•*\-]/.test(line.trim())) return true;
  return false;
}

function looksLikeInstruction(line: string): boolean {
  const cleaned = cleanLine(line);
  if (cleaned.length < 10) return false;
  // Numbered step like "1." or "1)"
  if (/^\d+[\.\):]\s+/.test(cleaned)) return true;
  // "Step 1" pattern
  if (/^step\s*\d+/i.test(cleaned)) return true;
  // Starts with an imperative verb
  const firstWord = cleaned.
  split(/\s+/)[0].
  toLowerCase().
  replace(/[^a-z]/g, '');
  if (INSTRUCTION_VERBS.includes(firstWord)) return true;
  return false;
}

function parseIngredientLine(rawLine: string): Ingredient | null {
  let line = cleanLine(rawLine);
  if (!line) return null;

  // Extract amount (digits, fractions, decimals, and unicode fractions)
  const amountMatch = line.match(
    /^([\d]+(?:\.\d+)?(?:\s*\/\s*\d+)?|[¼½¾⅓⅔⅛⅜⅝⅞]|\d+\s*[¼½¾⅓⅔⅛⅜⅝⅞])/
  );
  let amount = '';
  if (amountMatch) {
    amount = amountMatch[1].replace(/\s+/g, '');
    line = line.slice(amountMatch[0].length).trim();
  }

  // Extract unit
  let unit = '';
  const unitRegex = new RegExp(`^(${UNITS.join('|')})\\b`, 'i');
  const unitMatch = line.match(unitRegex);
  if (unitMatch) {
    unit = unitMatch[1].toLowerCase();
    line = line.slice(unitMatch[0].length).trim();
  }

  // Remove leading "of"
  line = line.replace(/^of\s+/i, '');

  // "to taste" detection
  if (/\bto\s+taste\b/i.test(line)) {
    return {
      id: `ing-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: line.replace(/,?\s*to\s+taste\s*/i, '').trim() || 'salt',
      amount: amount || 'to taste',
      unit,
      note: 'to taste'
    };
  }

  // Split name and note by comma
  const parts = line.split(/,\s*/);
  const name = parts[0].trim();
  const note = parts.slice(1).join(', ').trim();

  if (!name) return null;

  return {
    id: `ing-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.toLowerCase(),
    amount,
    unit,
    note: note || undefined
  };
}

function detectSection(line: string): keyof typeof SECTION_PATTERNS | null {
  for (const [key, pattern] of Object.entries(SECTION_PATTERNS) as [
    keyof typeof SECTION_PATTERNS,
    RegExp][])
  {
    if (pattern.test(line.trim())) return key;
  }
  return null;
}

export function parseRecipe(text: string): Partial<Dish> {
  const rawLines = text.split(/\r?\n/);
  const lines = rawLines.map((l) => l.trim()).filter(Boolean);

  // ----- Pass 1: identify section blocks -----
  type Block = {
    type: 'unknown' | keyof typeof SECTION_PATTERNS;
    lines: string[];
  };
  const blocks: Block[] = [];
  let currentBlock: Block = { type: 'unknown', lines: [] };

  for (const line of lines) {
    const section = detectSection(line);
    if (section) {
      if (currentBlock.lines.length) blocks.push(currentBlock);
      currentBlock = { type: section, lines: [] };
    } else {
      currentBlock.lines.push(line);
    }
  }
  if (currentBlock.lines.length) blocks.push(currentBlock);

  // ----- Pass 2: classify unknown blocks by content heuristics -----
  const unknownBlocks = blocks.filter((b) => b.type === 'unknown');
  for (const block of unknownBlocks) {
    const ingredientLines = block.lines.filter(looksLikeIngredient).length;
    const instructionLines = block.lines.filter(looksLikeInstruction).length;
    const total = block.lines.length;

    // Heuristic: if more than half look like ingredients or instructions, label the block
    if (
    total >= 3 &&
    ingredientLines / total >= 0.5 &&
    ingredientLines > instructionLines)
    {
      block.type = 'ingredients';
    } else if (total >= 2 && instructionLines / total >= 0.5) {
      block.type = 'instructions';
    }
  }

  // ----- Pass 3: extract title & description from the first unknown block -----
  let title = '';
  let description = '';
  const firstUnknown = blocks.find((b) => b.type === 'unknown');
  if (firstUnknown && firstUnknown.lines.length) {
    // Title: first line that's short-ish and doesn't look like ingredient/instruction
    const candidateTitleIdx = firstUnknown.lines.findIndex(
      (l) =>
      l.length < 80 && !looksLikeIngredient(l) && !looksLikeInstruction(l)
    );
    if (candidateTitleIdx >= 0) {
      title = firstUnknown.lines[candidateTitleIdx].
      replace(/^(title|name|recipe)\s*[:.\-]\s*/i, '').
      replace(/^#+\s*/, '').
      trim();
      // Description: remaining lines from that block that aren't ingredients/instructions
      description = firstUnknown.lines.
      filter((_, i) => i !== candidateTitleIdx).
      filter((l) => !looksLikeIngredient(l) && !looksLikeInstruction(l)).
      join(' ').
      trim();
    } else {
      description = firstUnknown.lines.join(' ').trim();
    }
  }

  // ----- Pass 4: collect ingredients -----
  const ingredients: Ingredient[] = [];
  blocks.forEach((block) => {
    if (block.type === 'ingredients') {
      block.lines.forEach((line) => {
        if (
        looksLikeIngredient(line) ||
        ingredients.length === 0 ||
        !looksLikeInstruction(line))
        {
          const ing = parseIngredientLine(line);
          if (ing) ingredients.push(ing);
        }
      });
    }
  });

  // Fallback: also scan unknown blocks for stray ingredient-looking lines if we have very few
  if (ingredients.length < 3) {
    blocks.forEach((block) => {
      if (block.type === 'unknown') {
        block.lines.forEach((line) => {
          if (looksLikeIngredient(line) && !looksLikeInstruction(line)) {
            const ing = parseIngredientLine(line);
            if (ing) ingredients.push(ing);
          }
        });
      }
    });
  }

  // ----- Pass 5: collect instructions -----
  const instructionTexts: string[] = [];
  blocks.forEach((block) => {
    if (block.type === 'instructions') {
      block.lines.forEach((line) => {
        const cleaned = cleanLine(line).
        replace(/^(step\s*)?\d+[\.\):]\s*/i, '').
        trim();
        if (cleaned.length > 5) instructionTexts.push(cleaned);
      });
    }
  });

  // Fallback: scan unknown blocks for instruction-like lines
  if (instructionTexts.length < 2) {
    blocks.forEach((block) => {
      if (block.type === 'unknown') {
        block.lines.forEach((line) => {
          if (looksLikeInstruction(line)) {
            const cleaned = cleanLine(line).
            replace(/^(step\s*)?\d+[\.\):]\s*/i, '').
            trim();
            if (cleaned.length > 5) instructionTexts.push(cleaned);
          }
        });
      }
    });
  }

  const instructions: Instruction[] = instructionTexts.map((text, index) => ({
    id: `inst-${Date.now()}-${index}`,
    step: index + 1,
    text
  }));

  // ----- Pass 6: collect chef's notes & additional details -----
  const chefNotes = blocks.
  filter((b) => b.type === 'notes').
  flatMap((b) => b.lines).
  join(' ').
  trim();

  const additionalDetails = blocks.
  filter((b) => b.type === 'details').
  flatMap((b) => b.lines).
  join(' ').
  trim();

  // ----- Pass 7: extract cook time and calories from full text -----
  let cookTime = 30;
  const timeMatch = text.match(
    /(\d+)\s*(?:to\s*\d+\s*)?(min(?:ute)?s?|hr?s?|hours?)/i
  );
  if (timeMatch) {
    const num = parseInt(timeMatch[1]);
    cookTime = /^h/i.test(timeMatch[2]) ? num * 60 : num;
  }

  let calories = 0;
  const calorieMatch = text.match(/(\d+)\s*(?:kcal|cal(?:orie)?s?)/i);
  if (calorieMatch) {
    calories = parseInt(calorieMatch[1]);
  } else {
    // fallback: estimate based on category later
    calories = 350;
  }

  // ----- Pass 8: detect tags and category -----
  const lowerText = text.toLowerCase();
  const tags: string[] = [];
  TAG_KEYWORDS.forEach((kw) => {
    if (lowerText.includes(kw) && !tags.includes(kw)) tags.push(kw);
  });

  let category: Dish['category'] = 'Dinner';
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [
    Dish['category'],
    string[]][])
  {
    if (keywords.some((kw) => lowerText.includes(kw))) {
      category = cat;
      break;
    }
  }

  return {
    title: title || 'Untitled Recipe',
    description: description || '',
    ingredients,
    instructions,
    chefNotes,
    additionalDetails,
    cookTime,
    calories,
    tags,
    category
  };
}