import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ClockIcon, FlameIcon } from 'lucide-react';
import { Dish } from '../../types';
import { Badge } from '../ui/Badge';
interface DishCardProps {
  dish: Dish;
}
export function DishCard({ dish }: DishCardProps) {
  const navigate = useNavigate();
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
    <motion.div
      whileHover={{
        y: -3
      }}
      transition={{
        duration: 0.2
      }}
      onClick={() => navigate(`/recipes/${dish.id}`)}
      className="bg-surface rounded-xl overflow-hidden shadow-card hover:shadow-card-hover border border-border hover:border-border-strong cursor-pointer group transition-all">
      
      <div className="relative h-52 overflow-hidden bg-canvas">
        <img
          src={dish.image}
          alt={dish.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-semibold tracking-wider uppercase text-white shadow-sm ${dish.category === 'Lunch' || dish.category === 'Snack' ? 'bg-forest' : dish.category === 'Dinner' ? 'bg-primary' : 'bg-accent'}`}>
            
            {dish.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif font-semibold text-lg text-text-dark mb-2 line-clamp-1">
          {dish.title}
        </h3>
        <p className="text-sm text-text-muted line-clamp-2 mb-4 leading-relaxed">
          {dish.description}
        </p>
        <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" />
              {dish.cookTime} min
            </span>
            <span className="flex items-center gap-1">
              <FlameIcon className="w-3.5 h-3.5" />
              {dish.calories} kcal
            </span>
          </div>
        </div>
      </div>
    </motion.div>);

}