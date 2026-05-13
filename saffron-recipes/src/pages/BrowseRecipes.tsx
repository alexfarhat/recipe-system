import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { useDb } from '../hooks/useDb';
import { DishCard } from '../components/dishes/DishCard';
export function BrowseRecipes() {
  const db = useDb();
  const dishes = db.dishes.getAll();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredDishes = dishes.filter(
    (dish) =>
    dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.tags.some((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-12">
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
          duration: 0.3
        }}
        className="mb-10">
        
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
          The Collection
        </p>
        <h1 className="text-4xl font-serif font-semibold text-text-dark mb-2 tracking-tight">
          Browse Recipes
        </h1>
        <p className="text-sm text-text-muted">
          Discover dishes from our curated library
        </p>
      </motion.div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          
        </div>
      </div>

      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          delay: 0.1
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        
        {filteredDishes.map((dish, index) =>
        <motion.div
          key={dish.id}
          initial={{
            opacity: 0,
            y: 12
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: Math.min(index * 0.03, 0.3),
            duration: 0.3
          }}>
          
            <DishCard dish={dish} />
          </motion.div>
        )}
      </motion.div>

      {filteredDishes.length === 0 &&
      <div className="text-center py-16">
          <p className="text-sm text-text-muted">
            No recipes found matching your search.
          </p>
        </div>
      }
    </div>);

}