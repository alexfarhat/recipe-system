import { User } from '../types';

export const seedUsers: User[] = [
{
  id: 'user-1',
  username: 'admin',
  password: 'admin123',
  role: 'admin',
  createdAt: '2026-02-20T10:00:00Z'
},
{
  id: 'user-2',
  username: 'chef_maria',
  password: 'changeme',
  role: 'admin',
  createdAt: '2026-03-15T14:30:00Z'
},
{
  id: 'user-3',
  username: 'foodie_sam',
  password: 'changeme',
  role: 'user',
  createdAt: '2026-04-01T09:00:00Z'
},
{
  id: 'user-4',
  username: 'recipe_lover',
  password: 'changeme',
  role: 'user',
  createdAt: '2026-04-10T16:45:00Z'
}];