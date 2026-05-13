import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, LoaderIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { parseRecipe } from '../../lib/recipeParser';
import { Dish } from '../../types';
interface AiParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParse: (data: Partial<Dish>) => void;
}
export function AiParserModal({
  isOpen,
  onClose,
  onParse
}: AiParserModalProps) {
  const [recipeText, setRecipeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleParse = async () => {
    if (!recipeText.trim()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const parsedData = parseRecipe(recipeText);
    onParse(parsedData);
    setIsLoading(false);
    setRecipeText('');
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Recipe Parser" size="lg">
      <div className="space-y-4">
        <p className="text-text-muted">
          Paste your recipe here — title, description, ingredients,
          instructions, anything goes. Our AI will intelligently parse and fill
          out the form for you.
        </p>
        <Textarea
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
          placeholder="Paste your recipe here...&#10;&#10;Example:&#10;Creamy Tomato Pasta&#10;&#10;A quick and delicious pasta with a creamy tomato sauce.&#10;&#10;Ingredients:&#10;- 8 oz pasta&#10;- 2 cups cherry tomatoes&#10;- 1/2 cup heavy cream&#10;- 2 cloves garlic, minced&#10;- Fresh basil&#10;&#10;Instructions:&#10;1. Cook pasta according to package directions.&#10;2. Sauté garlic and tomatoes until soft.&#10;3. Add cream and simmer.&#10;4. Toss with pasta and garnish with basil."
          rows={12}
          className="font-mono text-sm" />
        
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleParse}
            disabled={!recipeText.trim() || isLoading}
            className="flex items-center gap-2">
            
            {isLoading ?
            <>
                <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }}>
                
                  <LoaderIcon className="w-5 h-5" />
                </motion.div>
                Parsing...
              </> :

            <>
                <SparklesIcon className="w-5 h-5" />
                Parse with AI
              </>
            }
          </Button>
        </div>
      </div>
    </Modal>);

}