import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  UploadIcon,
  ImageIcon,
  ArrowLeftIcon,
  XIcon } from
'lucide-react';
import { useDb } from '../hooks/useDb';
import { Dish } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { AiParserModal } from '../components/dishes/AiParserModal';
import { IngredientEditor } from '../components/dishes/IngredientEditor';
import { InstructionEditor } from '../components/dishes/InstructionEditor';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
const emptyForm: Partial<Dish> = {
  title: '',
  description: '',
  category: 'Dinner',
  cookTime: 30,
  calories: 300,
  image: '',
  tags: [],
  ingredients: [],
  instructions: [],
  chefNotes: '',
  additionalDetails: '',
  accessGroups: []
};
export function CreateEditDish() {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const db = useDb();
  const { toasts, showToast, removeToast } = useToast();
  const [showAiModal, setShowAiModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!id;
  // Initialize form once; only re-init when the id changes (not on every render)
  const [formData, setFormData] = useState<Partial<Dish>>(() => {
    if (id) {
      const existing = db.dishes.getById(id);
      if (existing) return existing;
    }
    return emptyForm;
  });
  // Track which dish id is currently loaded so we re-init when navigating between edit pages
  const loadedIdRef = useRef<string | undefined>(id);
  useEffect(() => {
    if (id !== loadedIdRef.current) {
      loadedIdRef.current = id;
      if (id) {
        const existing = db.dishes.getById(id);
        if (existing) setFormData(existing);
      } else {
        setFormData(emptyForm);
      }
    }
  }, [id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      showToast('Please enter a dish title', 'error');
      return;
    }
    const dishData: Dish = {
      id: isEdit ? id! : `dish-${Date.now()}`,
      title: formData.title,
      description: formData.description || '',
      category: formData.category || 'Dinner',
      cookTime: formData.cookTime || 30,
      calories: formData.calories || 300,
      image:
      formData.image ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      tags: formData.tags || [],
      ingredients: formData.ingredients || [],
      instructions: formData.instructions || [],
      chefNotes: formData.chefNotes || '',
      additionalDetails: formData.additionalDetails || '',
      accessGroups: formData.accessGroups || [],
      createdBy: 'admin',
      createdAt: (formData as Dish).createdAt || new Date().toISOString()
    };
    try {
      if (isEdit) {
        await db.dishes.update(id!, dishData);
        db.activity.log({
          user: 'admin',
          action: 'updated dish',
          target: dishData.title,
          type: 'update'
        });
        showToast('Dish updated successfully', 'success');
      } else {
        await db.dishes.create(dishData);
        db.activity.log({
          user: 'admin',
          action: 'created dish',
          target: dishData.title,
          type: 'create'
        });
        showToast('Dish created successfully', 'success');
      }
      setTimeout(() => navigate('/manage/dishes'), 400);
    } catch (err: any) {
      showToast(err?.message || 'Failed to save dish', 'error');
    }
  };
  const handleAiParse = (parsedData: Partial<Dish>) => {
    setFormData((prev) => {
      const next = {
        ...prev
      };
      // Only overwrite fields that have parsed content; preserve existing for empty parses
      if (parsedData.title && parsedData.title !== 'Untitled Recipe')
      next.title = parsedData.title;
      if (parsedData.description) next.description = parsedData.description;
      if (parsedData.ingredients && parsedData.ingredients.length)
      next.ingredients = parsedData.ingredients;
      if (parsedData.instructions && parsedData.instructions.length)
      next.instructions = parsedData.instructions;
      if (parsedData.chefNotes) next.chefNotes = parsedData.chefNotes;
      if (parsedData.additionalDetails)
      next.additionalDetails = parsedData.additionalDetails;
      if (parsedData.cookTime && parsedData.cookTime !== 30)
      next.cookTime = parsedData.cookTime;
      if (parsedData.calories && parsedData.calories !== 350)
      next.calories = parsedData.calories;
      if (parsedData.tags && parsedData.tags.length) next.tags = parsedData.tags;
      if (parsedData.category) next.category = parsedData.category;
      return next;
    });
    showToast('Recipe parsed — review and edit before saving', 'success');
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be smaller than 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        image: dataUrl
      }));
      showToast('Image uploaded', 'success');
    };
    reader.onerror = () => {
      showToast('Failed to read image', 'error');
    };
    reader.readAsDataURL(file);
  };
  const handleTagsChange = (value: string) => {
    const tags = value.
    split(',').
    map((t) => t.trim()).
    filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      tags
    }));
  };
  const SectionHeader = ({
    number,
    title



  }: {number: string;title: string;}) =>
  <div className="flex items-baseline gap-3 mb-6 pb-3 border-b border-border">
      <span className="font-serif text-xl text-primary font-semibold">
        {number}
      </span>
      <h2 className="text-xl font-serif font-semibold text-text-dark">
        {title}
      </h2>
    </div>;

  return (
    <>
      <div className="max-w-4xl">
        <button
          onClick={() => navigate('/manage/dishes')}
          className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted hover:text-text-dark transition-colors mb-6">
          
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          Back to Dishes
        </button>

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
          className="flex items-end justify-between mb-8">
          
          <div>
            <h1 className="text-3xl font-serif font-semibold text-text-dark mb-1">
              {isEdit ? 'Edit Dish' : 'Create New Dish'}
            </h1>
            <p className="text-sm text-text-muted">
              {isEdit ?
              'Refine the details of this recipe' :
              'Add a new recipe to your collection'}
            </p>
          </div>
          <Button
            onClick={() => setShowAiModal(true)}
            variant="outline"
            type="button"
            className="flex items-center gap-2">
            
            <SparklesIcon className="w-4 h-4 text-accent" />
            AI Recipe Parser
          </Button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Card className="p-7">
            <SectionHeader number="01" title="Basic Information" />

            <div className="grid md:grid-cols-2 gap-7">
              <div className="space-y-4">
                <Input
                  label="Dish Title *"
                  placeholder="e.g., Grilled Salmon with Lemon"
                  value={formData.title || ''}
                  onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value
                  }))
                  }
                  required />
                
                <Textarea
                  label="Description"
                  placeholder="Brief description of the dish..."
                  value={formData.description || ''}
                  onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value
                  }))
                  }
                  rows={4} />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Cook Time (min)"
                    type="number"
                    value={formData.cookTime ?? ''}
                    onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cookTime: parseInt(e.target.value) || 0
                    }))
                    } />
                  
                  <Input
                    label="Calories"
                    type="number"
                    value={formData.calories ?? ''}
                    onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      calories: parseInt(e.target.value) || 0
                    }))
                    } />
                  
                </div>
                <Select
                  label="Category"
                  value={formData.category || 'Dinner'}
                  onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as Dish['category']
                  }))
                  }
                  options={[
                  {
                    value: 'Breakfast',
                    label: 'Breakfast'
                  },
                  {
                    value: 'Lunch',
                    label: 'Lunch'
                  },
                  {
                    value: 'Dinner',
                    label: 'Dinner'
                  },
                  {
                    value: 'Dessert',
                    label: 'Dessert'
                  },
                  {
                    value: 'Snack',
                    label: 'Snack'
                  }]
                  } />
                
                <Input
                  label="Tags (comma separated)"
                  placeholder="healthy, quick, dinner, ..."
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleTagsChange(e.target.value)} />
                
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">
                  Dish Image
                </label>
                <div className="border-2 border-dashed border-border rounded-md p-4 text-center bg-canvas/40">
                  {formData.image ?
                  <div className="relative mb-3">
                      <img
                      src={formData.image}
                      alt="Dish preview"
                      className="w-full h-56 object-cover rounded" />
                    
                      <button
                      type="button"
                      onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        image: ''
                      }))
                      }
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface/95 backdrop-blur-sm border border-border flex items-center justify-center text-text-muted hover:text-tomato transition-colors shadow-sm"
                      aria-label="Remove image">
                      
                        <XIcon className="w-3.5 h-3.5" />
                      </button>
                    </div> :

                  <div className="flex flex-col items-center justify-center h-56 text-text-muted">
                      <ImageIcon
                      className="w-10 h-10 mb-2"
                      strokeWidth={1.25} />
                    
                      <p className="text-xs uppercase tracking-wider">
                        No image selected
                      </p>
                    </div>
                  }
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden" />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5">
                    
                    <UploadIcon className="w-3.5 h-3.5" />
                    {formData.image ? 'Change Image' : 'Upload Image'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-7">
            <SectionHeader number="02" title="Ingredients" />
            <IngredientEditor
              ingredients={formData.ingredients || []}
              onChange={(ingredients) =>
              setFormData((prev) => ({
                ...prev,
                ingredients
              }))
              } />
            
          </Card>

          <Card className="p-7">
            <SectionHeader number="03" title="Instructions" />
            <InstructionEditor
              instructions={formData.instructions || []}
              onChange={(instructions) =>
              setFormData((prev) => ({
                ...prev,
                instructions
              }))
              } />
            
          </Card>

          <Card className="p-7 bg-accent/[0.04] border-accent/20">
            <SectionHeader number="04" title="Chef's Notes" />
            <Textarea
              placeholder="Share tips, variations, or personal insights about this dish..."
              value={formData.chefNotes || ''}
              onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chefNotes: e.target.value
              }))
              }
              rows={4} />
            
          </Card>

          <Card className="p-7 bg-forest/[0.04] border-forest/20">
            <SectionHeader number="05" title="Additional Details" />
            <Textarea
              placeholder="Serving suggestions, pairing ideas, storage tips..."
              value={formData.additionalDetails || ''}
              onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                additionalDetails: e.target.value
              }))
              }
              rows={4} />
            
          </Card>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/manage/dishes')}>
              
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update Dish' : 'Save Dish'}
            </Button>
          </div>
        </form>
      </div>

      <AiParserModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onParse={handleAiParse} />
      
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>);

}