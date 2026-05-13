import { Activity } from '../types';

export const seedActivity: Activity[] = [
{
  id: 'activity-1',
  user: 'chef_maria',
  action: 'added user',
  target: 'recipe_lover',
  timestamp: '2026-05-13T10:30:00Z',
  type: 'create'
},
{
  id: 'activity-2',
  user: 'admin',
  action: 'updated dish',
  target: 'Smoked Paprika Lamb Tagine',
  timestamp: '2026-05-12T15:45:00Z',
  type: 'update'
},
{
  id: 'activity-3',
  user: 'admin',
  action: 'created dish',
  target: 'Coconut Lime Shrimp',
  timestamp: '2026-05-11T09:00:00Z',
  type: 'create'
},
{
  id: 'activity-4',
  user: 'chef_maria',
  action: 'updated dish',
  target: 'Brown Butter Sage Gnocchi',
  timestamp: '2026-05-10T14:20:00Z',
  type: 'update'
},
{
  id: 'activity-5',
  user: 'admin',
  action: 'deleted user',
  target: 'old_account',
  timestamp: '2026-05-09T11:00:00Z',
  type: 'delete'
}];