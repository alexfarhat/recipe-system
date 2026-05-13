import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
  ShoppingBagIcon,
  ClockIcon,
  FlameIcon,
  LoaderIcon,
  ArrowRightIcon,
  RefreshCwIcon } from
'lucide-react';
import { useDb } from '../hooks/useDb';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Dish } from '../types';
interface MatchResult {
  dish: Dish;
  matched: string[]; // ingredient ids that user has
  missing: {
    id: string;
    name: string;
    amount: string;
    unit: string;
  }[];
  matchPercent: number;
}
export function DishFinder() {
  const db = useDb();
  const navigate = useNavigate();
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const addItem = (val: string) => {
    const trimmed = val.trim().toLowerCase();
    if (trimmed && !items.includes(trimmed)) {
      setItems((prev) => [...prev, trimmed]);
    }
    setInput('');
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addItem(input);
    } else if (e.key === 'Backspace' && !input && items.length) {
      setItems((prev) => prev.slice(0, -1));
    }
  };
  const removeItem = (item: string) => {
    setItems((prev) => prev.filter((i) => i !== item));
  };
  const matchIngredient = (
  ingredientName: string,
  userItems: string[])
  : boolean => {
    const ing = ingredientName.toLowerCase();
    return userItems.some((item) => {
      // Match if user item is contained in ingredient name or vice versa
      const words = item.split(/\s+/).filter((w) => w.length > 2);
      return (
        ing.includes(item) ||
        item.includes(ing) ||
        words.some((w) => ing.includes(w)));

    });
  };
  const findDishes = async () => {
    if (items.length === 0) return;
    setIsLoading(true);
    setShowShoppingList(false);
    setSelectedDishId(null);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const dishes = db.dishes.getAll();
    const matchResults: MatchResult[] = dishes.map((dish) => {
      const matched: string[] = [];
      const missing: MatchResult['missing'] = [];
      dish.ingredients.forEach((ing) => {
        if (matchIngredient(ing.name, items)) {
          matched.push(ing.id);
        } else {
          missing.push({
            id: ing.id,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit
          });
        }
      });
      const matchPercent =
      dish.ingredients.length > 0 ?
      Math.round(matched.length / dish.ingredients.length * 100) :
      0;
      return {
        dish,
        matched,
        missing,
        matchPercent
      };
    });
    matchResults.sort((a, b) => b.matchPercent - a.matchPercent);
    setResults(matchResults);
    setIsLoading(false);
  };
  const reset = () => {
    setResults(null);
    setSelectedDishId(null);
    setShowShoppingList(false);
  };
  const bestMatch = results?.[0];
  const isStrongMatch = bestMatch && bestMatch.matchPercent >= 60;
  const recommendations = results?.slice(0, 3) || [];
  const selectedResult =
  results?.find((r) => r.dish.id === selectedDishId) || bestMatch;
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 pb-20">
      {/* ============== HEADER ============== */}
      <motion.div
        initial={{
          opacity: 0,
          y: 12
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-10">
        
        <div className="flex items-center gap-2 mb-3">
          <SparklesIcon className="w-4 h-4 text-accent" />
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            AI Dish Finder
          </p>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-semibold text-text-dark mb-3 tracking-tight">
          What's in your kitchen?
        </h1>
        <p className="text-base text-text-muted max-w-2xl leading-relaxed">
          List the ingredients you have on hand. We'll find the closest matching
          recipe and help you fill in what's missing.
        </p>
      </motion.div>

      {/* ============== INPUT SECTION ============== */}
      <motion.div
        initial={{
          opacity: 0,
          y: 12
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.05
        }}
        className="mb-8">
        
        <Card className="p-6">
          <label className="block text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
            Your Ingredients
          </label>
          <div className="flex flex-wrap items-center gap-2 p-3 bg-canvas border border-border rounded-md min-h-[60px] focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
            <AnimatePresence>
              {items.map((item) =>
              <motion.span
                key={item}
                initial={{
                  opacity: 0,
                  scale: 0.8
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-border-strong rounded-full text-sm text-text-dark">
                
                  {item}
                  <button
                  onClick={() => removeItem(item)}
                  className="text-text-muted hover:text-tomato transition-colors"
                  aria-label={`Remove ${item}`}>
                  
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              )}
            </AnimatePresence>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
              items.length === 0 ?
              'Type an ingredient and press Enter (e.g. chicken, garlic, lemon)...' :
              'Add another...'
              }
              className="flex-1 min-w-[200px] bg-transparent outline-none text-sm placeholder:text-text-muted py-1" />
            
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-text-muted">
              {items.length} {items.length === 1 ? 'ingredient' : 'ingredients'}{' '}
              added
            </p>
            <div className="flex gap-2">
              {results &&
              <Button
                variant="ghost"
                onClick={reset}
                className="flex items-center gap-2">
                
                  <RefreshCwIcon className="w-4 h-4" />
                  New Search
                </Button>
              }
              <Button
                onClick={findDishes}
                disabled={items.length === 0 || isLoading}
                className="flex items-center gap-2">
                
                {isLoading ?
                <>
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    Finding dishes...
                  </> :

                <>
                    <SparklesIcon className="w-4 h-4" />
                    Find Dishes
                  </>
                }
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ============== EMPTY STATE / SUGGESTIONS ============== */}
      {!results && !isLoading && items.length === 0 &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          delay: 0.15
        }}>
        
          <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
            Try these
          </p>
          <div className="flex flex-wrap gap-2">
            {[
          'chicken',
          'garlic',
          'lemon',
          'olive oil',
          'onion',
          'tomatoes',
          'pasta',
          'eggs'].
          map((suggestion) =>
          <button
            key={suggestion}
            onClick={() => addItem(suggestion)}
            className="px-3 py-1.5 bg-surface border border-border rounded-full text-sm text-text-muted hover:text-text-dark hover:border-border-strong transition-colors">
            
                <PlusIcon className="w-3 h-3 inline mr-1" />
                {suggestion}
              </button>
          )}
          </div>
        </motion.div>
      }

      {/* ============== RESULTS: STRONG MATCH ============== */}
      <AnimatePresence mode="wait">
        {results && isStrongMatch && selectedResult &&
        <motion.div
          key="strong-match"
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.3
          }}
          className="space-y-6">
          
            <div className="flex items-baseline gap-4 mt-2">
              <span className="font-serif text-2xl text-primary font-semibold">
                ★
              </span>
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-xs uppercase tracking-widest text-text-muted font-semibold">
                Closest Match
              </h2>
            </div>

            {/* Matched dish hero */}
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <img
                  src={selectedResult.dish.image}
                  alt={selectedResult.dish.title}
                  className="w-full h-full object-cover" />
                
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded shadow-sm">
                    {selectedResult.matchPercent}% match
                  </div>
                </div>
                <div className="p-7 flex flex-col">
                  <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-2">
                    {selectedResult.dish.category}
                  </p>
                  <h3 className="text-3xl font-serif font-semibold text-text-dark mb-3 tracking-tight">
                    {selectedResult.dish.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-5">
                    {selectedResult.dish.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-text-muted mb-6">
                    <span className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4" />
                      {selectedResult.dish.cookTime} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FlameIcon className="w-4 h-4" />
                      {selectedResult.dish.calories} kcal
                    </span>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <Button
                    onClick={() =>
                    navigate(`/recipes/${selectedResult.dish.id}`)
                    }
                    className="flex items-center gap-2">
                    
                      View Full Recipe
                      <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                    {selectedResult.missing.length > 0 &&
                  <Button
                    variant="outline"
                    onClick={() => setShowShoppingList((prev) => !prev)}
                    className="flex items-center gap-2">
                    
                        <ShoppingBagIcon className="w-4 h-4" />
                        {showShoppingList ? 'Hide' : 'Shopping List'}
                      </Button>
                  }
                  </div>
                </div>
              </div>
            </Card>

            {/* Ingredient checklist */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
                  Ingredient Checklist
                </h3>
                <Card className="overflow-hidden">
                  <div className="divide-y divide-border">
                    {selectedResult.dish.ingredients.map((ing) => {
                    const have = selectedResult.matched.includes(ing.id);
                    return (
                      <div
                        key={ing.id}
                        className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${have ? 'bg-forest/[0.03]' : 'bg-tomato/[0.03]'}`}>
                        
                          <div
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${have ? 'bg-forest border-forest' : 'bg-surface border-border-strong'}`}>
                          
                            {have &&
                          <CheckIcon
                            className="w-3.5 h-3.5 text-white"
                            strokeWidth={3} />

                          }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                            className={`text-sm font-medium ${have ? 'text-text-dark' : 'text-tomato'}`}>
                            
                              {ing.name}
                            </p>
                            {ing.note &&
                          <p className="text-xs text-text-muted italic mt-0.5">
                                {ing.note}
                              </p>
                          }
                          </div>
                          <span
                          className={`text-sm whitespace-nowrap font-serif font-medium ${have ? 'text-text-muted' : 'text-tomato/80'}`}>
                          
                            {ing.amount} {ing.unit}
                          </span>
                        </div>);

                  })}
                  </div>
                </Card>
              </div>

              {/* Shopping list panel */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
                  Shopping List
                </h3>
                {selectedResult.missing.length === 0 ?
              <Card className="p-6 text-center bg-forest/[0.04] border-forest/30">
                    <CheckIcon className="w-8 h-8 text-forest mx-auto mb-2" />
                    <p className="text-sm font-serif font-semibold text-text-dark">
                      You have everything!
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Ready to cook.
                    </p>
                  </Card> :

              <Card className="p-5 bg-accent/[0.04] border-accent/30">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-accent/20">
                      <ShoppingBagIcon className="w-4 h-4 text-accent" />
                      <p className="text-sm font-semibold text-text-dark">
                        Need to buy
                      </p>
                      <span className="ml-auto text-xs text-text-muted">
                        {selectedResult.missing.length} items
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {selectedResult.missing.map((item) =>
                  <li
                    key={item.id}
                    className="flex justify-between items-baseline text-sm">
                    
                          <span className="text-text-dark">{item.name}</span>
                          <span className="text-xs text-text-muted whitespace-nowrap font-serif ml-2">
                            {item.amount} {item.unit}
                          </span>
                        </li>
                  )}
                    </ul>
                  </Card>
              }
              </div>
            </div>
          </motion.div>
        }

        {/* ============== RESULTS: WEAK MATCH — show 3 recommendations ============== */}
        {results && !isStrongMatch && !selectedDishId &&
        <motion.div
          key="recommendations"
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.3
          }}
          className="space-y-6">
          
            <div className="flex items-baseline gap-4 mt-2 mb-2">
              <span className="font-serif text-2xl text-accent font-semibold">
                ~
              </span>
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-xs uppercase tracking-widest text-text-muted font-semibold">
                Suggested Recipes
              </h2>
            </div>
            <Card className="p-5 bg-accent/[0.04] border-accent/30 flex items-start gap-3">
              <SparklesIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-serif font-semibold text-text-dark mb-1">
                  No close match found
                </p>
                <p className="text-sm text-text-muted">
                  Here are three recipes you might enjoy — pick one and we'll
                  generate the full shopping list for you.
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-5">
              {recommendations.map((rec) =>
            <Card
              key={rec.dish.id}
              className="overflow-hidden cursor-pointer hover:shadow-card-hover hover:border-border-strong transition-all group"
              onClick={() => setSelectedDishId(rec.dish.id)}>
              
                  <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
                    <img
                  src={rec.dish.image}
                  alt={rec.dish.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-surface/95 backdrop-blur-sm rounded text-xs font-semibold uppercase tracking-wider text-text-dark">
                      {rec.matchPercent}% match
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-1">
                      {rec.dish.category}
                    </p>
                    <h3 className="font-serif font-semibold text-lg text-text-dark mb-2 line-clamp-1">
                      {rec.dish.title}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-2 leading-relaxed mb-4">
                      {rec.dish.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {rec.dish.cookTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <FlameIcon className="w-3.5 h-3.5" />
                          {rec.dish.calories} kcal
                        </span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Card>
            )}
            </div>
          </motion.div>
        }

        {/* ============== RESULTS: WEAK MATCH — user selected one, show full shopping list ============== */}
        {results && !isStrongMatch && selectedDishId && selectedResult &&
        <motion.div
          key="selected-rec"
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.3
          }}
          className="space-y-6">
          
            <button
            onClick={() => setSelectedDishId(null)}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted hover:text-text-dark transition-colors">
            
              <ArrowRightIcon className="w-3.5 h-3.5 rotate-180" />
              Back to suggestions
            </button>

            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <img
                  src={selectedResult.dish.image}
                  alt={selectedResult.dish.title}
                  className="w-full h-full object-cover" />
                
                </div>
                <div className="p-7 flex flex-col">
                  <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-2">
                    {selectedResult.dish.category}
                  </p>
                  <h3 className="text-3xl font-serif font-semibold text-text-dark mb-3 tracking-tight">
                    {selectedResult.dish.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-5">
                    {selectedResult.dish.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-text-muted mb-6">
                    <span className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4" />
                      {selectedResult.dish.cookTime} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FlameIcon className="w-4 h-4" />
                      {selectedResult.dish.calories} kcal
                    </span>
                  </div>
                  <div className="mt-auto">
                    <Button
                    onClick={() =>
                    navigate(`/recipes/${selectedResult.dish.id}`)
                    }
                    className="flex items-center gap-2">
                    
                      View Full Recipe
                      <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
                Complete Shopping List
              </h3>
              <Card className="p-6 bg-accent/[0.04] border-accent/30">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-accent/20">
                  <ShoppingBagIcon className="w-5 h-5 text-accent" />
                  <p className="font-serif font-semibold text-text-dark">
                    Everything you'll need
                  </p>
                  <span className="ml-auto text-xs text-text-muted">
                    {selectedResult.dish.ingredients.length} items
                  </span>
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {selectedResult.dish.ingredients.map((ing) =>
                <li
                  key={ing.id}
                  className="flex justify-between items-baseline text-sm py-1 border-b border-border/50">
                  
                      <span className="text-text-dark">{ing.name}</span>
                      <span className="text-xs text-text-muted whitespace-nowrap font-serif ml-2">
                        {ing.amount} {ing.unit}
                      </span>
                    </li>
                )}
                </ul>
              </Card>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}