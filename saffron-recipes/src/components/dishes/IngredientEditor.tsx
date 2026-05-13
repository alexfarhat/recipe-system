import React from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { Ingredient } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
interface IngredientEditorProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}
export function IngredientEditor({
  ingredients,
  onChange
}: IngredientEditorProps) {
  const addIngredient = () => {
    onChange([
    ...ingredients,
    {
      id: `ing-${Date.now()}`,
      name: '',
      amount: '',
      unit: '',
      note: ''
    }]
    );
  };
  const updateIngredient = (
  id: string,
  field: keyof Ingredient,
  value: string) =>
  {
    onChange(
      ingredients.map((ing) =>
      ing.id === id ?
      {
        ...ing,
        [field]: value
      } :
      ing
      )
    );
  };
  const removeIngredient = (id: string) => {
    onChange(ingredients.filter((ing) => ing.id !== id));
  };
  return (
    <div className="space-y-2">
      {ingredients.map((ing) =>
      <div key={ing.id} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-12 gap-2">
            <div className="col-span-5">
              <Input
              placeholder="Ingredient name"
              value={ing.name}
              onChange={(e) =>
              updateIngredient(ing.id, 'name', e.target.value)
              } />
            
            </div>
            <div className="col-span-2">
              <Input
              placeholder="Amount"
              value={ing.amount}
              onChange={(e) =>
              updateIngredient(ing.id, 'amount', e.target.value)
              } />
            
            </div>
            <div className="col-span-2">
              <Input
              placeholder="Unit"
              value={ing.unit}
              onChange={(e) =>
              updateIngredient(ing.id, 'unit', e.target.value)
              } />
            
            </div>
            <div className="col-span-3">
              <Input
              placeholder="Note (optional)"
              value={ing.note || ''}
              onChange={(e) =>
              updateIngredient(ing.id, 'note', e.target.value)
              } />
            
            </div>
          </div>
          <button
          type="button"
          onClick={() => removeIngredient(ing.id)}
          className="p-2 text-text-muted hover:text-tomato transition-colors mt-1">
          
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      )}
      {ingredients.length === 0 &&
      <p className="text-sm text-text-muted italic py-2">
          No ingredients added yet.
        </p>
      }
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addIngredient}
        className="flex items-center gap-1.5 mt-3">
        
        <PlusIcon className="w-3.5 h-3.5" />
        Add Ingredient
      </Button>
    </div>);

}