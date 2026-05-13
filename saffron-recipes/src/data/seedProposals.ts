import { Proposal } from '../types';

export const seedProposals: Proposal[] = [
{
  id: 'proposal-1',
  title: 'Grilled Peach & Prosciutto Salad',
  submitter: 'foodie_sam',
  submittedAt: '2026-05-10T14:00:00Z',
  status: 'pending',
  dish: {
    title: 'Grilled Peach & Prosciutto Salad',
    description:
    'Sweet grilled peaches with salty prosciutto, arugula, and burrata.',
    category: 'Lunch',
    cookTime: 20,
    calories: 320,
    tags: ['summer', 'salad', 'quick']
  }
},
{
  id: 'proposal-2',
  title: 'Spicy Korean Beef Bowl',
  submitter: 'recipe_lover',
  submittedAt: '2026-05-11T16:30:00Z',
  status: 'pending',
  dish: {
    title: 'Spicy Korean Beef Bowl',
    description:
    'Gochujang-marinated beef with kimchi, pickled vegetables, and rice.',
    category: 'Dinner',
    cookTime: 30,
    calories: 480,
    tags: ['korean', 'spicy', 'bowl']
  }
}];