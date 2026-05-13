export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  note?: string;
}

export interface Instruction {
  id: string;
  step: number;
  text: string;
}

export interface Dish {
  id: string;
  title: string;
  description: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Snack';
  cookTime: number;
  calories: number;
  image: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  chefNotes: string;
  additionalDetails: string;
  accessGroups: string[];
  createdBy: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
}

export interface Permission {
  groupId: string;
  viewDishes: boolean;
  createDish: boolean;
  editDish: boolean;
  deleteDish: boolean;
  manageUsers: boolean;
}

export interface Proposal {
  id: string;
  title: string;
  submitter: string;
  submittedAt: string;
  dish: Partial<Dish>;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete';
}