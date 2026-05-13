import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, FlameIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { Dish } from '../../types';
import { Badge } from '../ui/Badge';
interface DishRowProps {
  dish: Dish;
  index?: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
export function DishRow({ dish, index = 0, onEdit, onDelete }: DishRowProps) {
  const categoryColors: Record<
    Dish['category'],
    'forest' | 'accent' | 'primary'> =
  {
    Breakfast: 'accent',
    Lunch: 'forest',
    Dinner: 'primary',
    Dessert: 'accent',
    Snack: 'forest'
  };
  return (
    <motion.tr
      initial={{
        opacity: 0,
        y: 6
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        delay: Math.min(index * 0.02, 0.2),
        duration: 0.25
      }}
      className="border-b border-border last:border-b-0 hover:bg-canvas/60 transition-colors group">
      
      <td className="py-5 px-6">
        <div className="flex items-center gap-4 w-full">
          <img
            src={dish.image}
            alt={dish.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-border" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <p className="font-serif font-semibold text-base text-text-dark truncate">
                {dish.title}
              </p>
              <Badge variant={categoryColors[dish.category]}>
                {dish.category}
              </Badge>
            </div>
            <p className="text-sm text-text-muted truncate mb-2 max-w-2xl">
              {dish.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <ClockIcon className="w-3.5 h-3.5" />
                {dish.cookTime} min
              </span>
              <span className="flex items-center gap-1.5">
                <FlameIcon className="w-3.5 h-3.5" />
                {dish.calories} kcal
              </span>
              <div className="flex gap-1.5">
                {dish.tags.slice(0, 4).map((tag) =>
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-canvas border border-border rounded text-text-muted">
                  
                    {tag}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(dish.id);
              }}
              className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded transition-colors"
              aria-label="Edit dish">
              
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(dish.id);
              }}
              className="p-2 text-text-muted hover:text-tomato hover:bg-tomato/5 rounded transition-colors"
              aria-label="Delete dish">
              
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </td>
    </motion.tr>);

}