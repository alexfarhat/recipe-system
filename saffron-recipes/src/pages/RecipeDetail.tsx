import React, { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ClockIcon,
  FlameIcon,
  UtensilsCrossedIcon,
  QuoteIcon,
  BookOpenIcon,
  ChefHatIcon,
  InfoIcon } from
'lucide-react';
import { useDb } from '../hooks/useDb';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
export function RecipeDetail() {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const db = useDb();
  const dish = db.dishes.getById(id!);
  if (!dish) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-text-muted">Recipe not found.</p>
        <Button onClick={() => navigate('/recipes')} className="mt-4">
          Back to Recipes
        </Button>
      </div>);

  }
  const categoryBg: Record<typeof dish.category, string> = {
    Breakfast: 'bg-accent',
    Lunch: 'bg-forest',
    Dinner: 'bg-primary',
    Dessert: 'bg-accent',
    Snack: 'bg-forest'
  };
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-8 pb-20">
      <button
        onClick={() => navigate('/recipes')}
        className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted hover:text-text-dark transition-colors mb-8">
        
        <ArrowLeftIcon className="w-3.5 h-3.5" />
        Back to Recipes
      </button>

      {/* ============== SECTION 1: HERO ============== */}
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
          duration: 0.4
        }}
        className="mb-12">
        
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 relative rounded-xl overflow-hidden border border-border shadow-card aspect-[4/3] lg:aspect-[5/4]">
            <img
              src={dish.image}
              alt={dish.title}
              className="w-full h-full object-cover" />
            
          </div>
          <div className="lg:col-span-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-semibold tracking-widest uppercase text-white mb-5 ${categoryBg[dish.category]}`}>
              
              {dish.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-text-dark mb-5 leading-[1.05] tracking-tight">
              {dish.title}
            </h1>
            <p className="text-base text-text-muted leading-relaxed mb-6">
              {dish.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {dish.tags.map((tag) =>
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-canvas border border-border rounded text-text-muted">
                
                  {tag}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============== SECTION 2: META STRIP ============== */}
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
          duration: 0.4,
          delay: 0.05
        }}
        className="mb-14">
        
        <Card className="grid grid-cols-3 divide-x divide-border">
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-canvas border border-border flex items-center justify-center flex-shrink-0">
              <ClockIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-0.5">
                Cook Time
              </p>
              <p className="font-serif font-semibold text-lg text-text-dark">
                {dish.cookTime}{' '}
                <span className="text-sm text-text-muted font-sans font-normal">
                  min
                </span>
              </p>
            </div>
          </div>
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-canvas border border-border flex items-center justify-center flex-shrink-0">
              <FlameIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-0.5">
                Energy
              </p>
              <p className="font-serif font-semibold text-lg text-text-dark">
                {dish.calories}{' '}
                <span className="text-sm text-text-muted font-sans font-normal">
                  kcal
                </span>
              </p>
            </div>
          </div>
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-canvas border border-border flex items-center justify-center flex-shrink-0">
              <UtensilsCrossedIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-0.5">
                Components
              </p>
              <p className="font-serif font-semibold text-lg text-text-dark">
                {dish.ingredients.length}{' '}
                <span className="text-sm text-text-muted font-sans font-normal">
                  items
                </span>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ============== SECTION 3: INGREDIENTS ============== */}
      <motion.section
        initial={{
          opacity: 0,
          y: 12
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4,
          delay: 0.1
        }}
        className="mb-14">
        
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-serif text-2xl text-primary font-semibold">
            01
          </span>
          <div className="h-px flex-1 bg-border" />
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4 text-text-muted" />
            <h2 className="text-xs uppercase tracking-widest text-text-muted font-semibold">
              Ingredients
            </h2>
          </div>
        </div>
        <h3 className="text-3xl font-serif font-semibold text-text-dark mb-6">
          What you'll need
        </h3>
        <Card className="overflow-hidden">
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="divide-y divide-border">
              {dish.ingredients.
              slice(0, Math.ceil(dish.ingredients.length / 2)).
              map((ing) =>
              <div
                key={ing.id}
                className="px-6 py-3.5 flex justify-between items-baseline gap-4 hover:bg-canvas/40 transition-colors">
                
                    <div className="min-w-0">
                      <p className="font-medium text-text-dark text-sm">
                        {ing.name}
                      </p>
                      {ing.note &&
                  <p className="text-xs text-text-muted italic mt-0.5">
                          {ing.note}
                        </p>
                  }
                    </div>
                    <span className="text-sm text-text-muted whitespace-nowrap font-serif font-medium flex-shrink-0">
                      {ing.amount} {ing.unit}
                    </span>
                  </div>
              )}
            </div>
            <div className="divide-y divide-border">
              {dish.ingredients.
              slice(Math.ceil(dish.ingredients.length / 2)).
              map((ing) =>
              <div
                key={ing.id}
                className="px-6 py-3.5 flex justify-between items-baseline gap-4 hover:bg-canvas/40 transition-colors">
                
                    <div className="min-w-0">
                      <p className="font-medium text-text-dark text-sm">
                        {ing.name}
                      </p>
                      {ing.note &&
                  <p className="text-xs text-text-muted italic mt-0.5">
                          {ing.note}
                        </p>
                  }
                    </div>
                    <span className="text-sm text-text-muted whitespace-nowrap font-serif font-medium flex-shrink-0">
                      {ing.amount} {ing.unit}
                    </span>
                  </div>
              )}
            </div>
          </div>
        </Card>
      </motion.section>

      {/* ============== SECTION 4: INSTRUCTIONS ============== */}
      <motion.section
        initial={{
          opacity: 0,
          y: 12
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4,
          delay: 0.15
        }}
        className="mb-14">
        
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-serif text-2xl text-primary font-semibold">
            02
          </span>
          <div className="h-px flex-1 bg-border" />
          <div className="flex items-center gap-2">
            <ChefHatIcon className="w-4 h-4 text-text-muted" />
            <h2 className="text-xs uppercase tracking-widest text-text-muted font-semibold">
              Method
            </h2>
          </div>
        </div>
        <h3 className="text-3xl font-serif font-semibold text-text-dark mb-6">
          Step by step
        </h3>
        <div className="space-y-3">
          {dish.instructions.map((inst) =>
          <Card key={inst.id} className="p-6">
              <div className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center">
                    <span className="font-serif text-base text-primary font-semibold">
                      {String(inst.step).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="text-text-dark leading-relaxed text-[15px]">
                    {inst.text}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </motion.section>

      {/* ============== SECTION 5: CHEF'S NOTES ============== */}
      {dish.chefNotes &&
      <motion.section
        initial={{
          opacity: 0,
          y: 12
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4,
          delay: 0.2
        }}
        className="mb-10">
        
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-serif text-2xl text-accent font-semibold">
              03
            </span>
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-2">
              <QuoteIcon className="w-4 h-4 text-text-muted" />
              <h2 className="text-xs uppercase tracking-widest text-text-muted font-semibold">
                From the Chef
              </h2>
            </div>
          </div>
          <Card className="p-8 bg-accent/[0.04] border-accent/30">
            <div className="flex gap-5">
              <QuoteIcon
              className="w-8 h-8 text-accent flex-shrink-0"
              strokeWidth={1.5} />
            
              <div>
                <p className="text-lg font-serif italic text-text-dark leading-relaxed">
                  {dish.chefNotes}
                </p>
              </div>
            </div>
          </Card>
        </motion.section>
      }

      {/* ============== SECTION 6: ADDITIONAL DETAILS ============== */}
      {dish.additionalDetails &&
      <motion.section
        initial={{
          opacity: 0,
          y: 12
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4,
          delay: 0.25
        }}>
        
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-serif text-2xl text-forest font-semibold">
              {dish.chefNotes ? '04' : '03'}
            </span>
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-2">
              <InfoIcon className="w-4 h-4 text-text-muted" />
              <h2 className="text-xs uppercase tracking-widest text-text-muted font-semibold">
                Serving & Storage
              </h2>
            </div>
          </div>
          <Card className="p-8 bg-forest/[0.04] border-forest/30">
            <p className="text-base text-text-dark leading-relaxed">
              {dish.additionalDetails}
            </p>
          </Card>
        </motion.section>
      }
    </div>);

}