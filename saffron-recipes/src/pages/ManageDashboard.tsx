import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossedIcon,
  UsersIcon,
  PlusIcon,
  PencilIcon,
  CheckCircleIcon,
  Trash2Icon,
  ArrowUpRightIcon } from
'lucide-react';
import { useDb } from '../hooks/useDb';
import { Card } from '../components/ui/Card';
export function ManageDashboard() {
  const db = useDb();
  const navigate = useNavigate();
  const dishes = db.dishes.getAll();
  const users = db.users.getAll();
  const activities = db.activity.getAll().slice(0, 6);
  const stats = [
  {
    label: 'Total Dishes',
    value: dishes.length,
    icon: UtensilsCrossedIcon
  },
  {
    label: 'Total Users',
    value: users.length,
    icon: UsersIcon
  }];

  const quickActions = [
  {
    label: 'Add New Dish',
    description: 'Create a new recipe',
    icon: PlusIcon,
    path: '/manage/dishes/new'
  },
  {
    label: 'Manage Dishes',
    description: 'View all recipes',
    icon: UtensilsCrossedIcon,
    path: '/manage/dishes'
  },
  {
    label: 'Manage Users',
    description: 'User accounts',
    icon: UsersIcon,
    path: '/manage/users'
  }];

  const activityIcons: Record<string, any> = {
    create: {
      icon: CheckCircleIcon,
      color: 'text-forest',
      bg: 'bg-forest/10'
    },
    update: {
      icon: PencilIcon,
      color: 'text-accent',
      bg: 'bg-accent/10'
    },
    delete: {
      icon: Trash2Icon,
      color: 'text-tomato',
      bg: 'bg-tomato/10'
    }
  };
  return (
    <div>
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
        className="mb-8">
        
        <h1 className="text-3xl font-serif font-semibold text-text-dark mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-text-muted">An overview of your kitchen</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{
                opacity: 0,
                y: 12
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.05,
                duration: 0.3
              }}>
              
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-serif font-semibold text-text-dark">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-md bg-canvas border border-border flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </Card>
            </motion.div>);

        })}
      </div>

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
          delay: 0.15,
          duration: 0.3
        }}
        className="mb-10">
        
        <h2 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.label}
                className="p-5 cursor-pointer hover:shadow-card-hover hover:border-border-strong transition-all group"
                onClick={() => navigate(action.path)}>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-primary/5 border border-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowUpRightIcon className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                </div>
                <p className="font-serif font-semibold text-base text-text-dark mb-0.5">
                  {action.label}
                </p>
                <p className="text-sm text-text-muted">{action.description}</p>
              </Card>);

          })}
        </div>
      </motion.div>

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
          delay: 0.2,
          duration: 0.3
        }}>
        
        <h2 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
          Recent Activity
        </h2>
        <Card className="p-2">
          <div className="divide-y divide-border">
            {activities.map((activity) => {
              const config =
              activityIcons[activity.type] || activityIcons.update;
              const Icon = config.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 px-4 py-3">
                  
                  <div
                    className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-dark">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-text-muted">{activity.action}</span>{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                  </div>
                  <span className="text-xs text-text-muted flex-shrink-0">
                    {new Date(activity.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>);

            })}
          </div>
        </Card>
      </motion.div>
    </div>);

}