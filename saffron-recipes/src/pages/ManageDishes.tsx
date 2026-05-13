import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { useDb } from '../hooks/useDb';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DishRow } from '../components/dishes/DishRow';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
export function ManageDishes() {
  const db = useDb();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const dishes = db.dishes.getAll();
  const filteredDishes = dishes.filter((dish) =>
  dish.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      try {
        const dish = db.dishes.getById(id);
        await db.dishes.delete(id);
        db.activity.log({
          user: 'admin',
          action: 'deleted dish',
          target: dish?.title || 'Unknown',
          type: 'delete'
        });
        showToast('Dish deleted successfully', 'success');
      } catch (err: any) {
        showToast(err?.message || 'Failed to delete dish', 'error');
      }
    }
  };
  return (
    <>
      <div className="w-full">
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
          className="flex items-center justify-between mb-8">
          
          <div>
            <h1 className="text-3xl font-serif font-semibold text-text-dark mb-1">
              Dishes
            </h1>
            <p className="text-sm text-text-muted">
              Manage your recipe collection
            </p>
          </div>
          <Button
            onClick={() => navigate('/manage/dishes/new')}
            className="flex items-center gap-2">
            
            <PlusIcon className="w-4 h-4" />
            Add New Dish
          </Button>
        </motion.div>

        <Card className="w-full overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-canvas border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-canvas/50 border-b border-border">
                  <th className="py-3 px-6 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Dish
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDishes.map((dish, index) =>
                <DishRow
                  key={dish.id}
                  dish={dish}
                  index={index}
                  onEdit={(id) => navigate(`/manage/dishes/${id}/edit`)}
                  onDelete={handleDelete} />

                )}
              </tbody>
            </table>

            {filteredDishes.length === 0 &&
            <div className="text-center py-16">
                <p className="text-sm text-text-muted">No dishes found.</p>
              </div>
            }
          </div>
        </Card>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>);

}