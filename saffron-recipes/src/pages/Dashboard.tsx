import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpenIcon, ArrowRightIcon, ChefHatIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/Logo';
export function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 16
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="text-center max-w-2xl">
        
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: 0.1,
            duration: 0.4
          }}
          className="inline-flex items-center justify-center mb-8">
          
          <Logo className="w-16 h-16" />
        </motion.div>
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-4">
          Welcome to Saffron
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-semibold text-text-dark mb-4 tracking-tight">
          Recipes, refined
        </h1>
        <p className="text-base text-text-muted mb-10 max-w-xl mx-auto leading-relaxed">
          A curated culinary platform for managing, discovering, and sharing
          recipes — crafted with care, served with purpose.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/recipes')}
            className="flex items-center gap-2">
            
            <BookOpenIcon className="w-4 h-4" />
            Browse Recipes
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/manage/dashboard')}
            className="flex items-center gap-2">
            
            <ChefHatIcon className="w-4 h-4" />
            Manage Kitchen
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>);

}