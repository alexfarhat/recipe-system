import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  EyeIcon,
  EyeOffIcon,
  ShieldCheckIcon,
  UserIcon } from
'lucide-react';
import { useDb } from '../hooks/useDb';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { User } from '../types';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
interface FormState {
  username: string;
  password: string;
  role: 'admin' | 'user';
}
const emptyForm: FormState = {
  username: '',
  password: '',
  role: 'user'
};
export function ManageUsers() {
  const db = useDb();
  const { toasts, showToast, removeToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>>(
    {});
  const users = db.users.getAll();
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (
    !editingUser &&
    users.some(
      (u) => u.username.toLowerCase() === formData.username.toLowerCase()
    ))
    {
      newErrors.username = 'Username already exists';
    } else if (
    editingUser &&
    users.some(
      (u) =>
      u.id !== editingUser.id &&
      u.username.toLowerCase() === formData.username.toLowerCase()
    ))
    {
      newErrors.username = 'Username already exists';
    }
    // Password required for new users; optional when editing (only update if provided)
    if (!editingUser) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const openCreate = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setErrors({});
    setShowPassword(false);
    setShowModal(true);
  };
  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role
    });
    setErrors({});
    setShowPassword(false);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData(emptyForm);
    setErrors({});
    setShowPassword(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (editingUser) {
        const updates: Partial<User> = {
          username: formData.username.trim(),
          role: formData.role
        };
        if (formData.password) updates.password = formData.password;
        await db.users.update(editingUser.id, updates);
        db.activity.log({
          user: 'admin',
          action: 'updated user',
          target: formData.username.trim(),
          type: 'update'
        });
        showToast('User updated successfully', 'success');
      } else {
        const newUser: User = {
          id: `user-${Date.now()}`,
          username: formData.username.trim(),
          password: formData.password,
          role: formData.role,
          createdAt: new Date().toISOString()
        };
        await db.users.create(newUser);
        db.activity.log({
          user: 'admin',
          action: 'added user',
          target: newUser.username,
          type: 'create'
        });
        showToast(`User "${newUser.username}" created`, 'success');
      }
      closeModal();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save user', 'error');
    }
  };
  const handleDelete = async (user: User) => {
    if (
    window.confirm(`Are you sure you want to delete user "${user.username}"?`))
    {
      try {
        await db.users.delete(user.id);
        db.activity.log({
          user: 'admin',
          action: 'deleted user',
          target: user.username,
          type: 'delete'
        });
        showToast('User deleted successfully', 'success');
      } catch (err: any) {
        showToast(err?.message || 'Failed to delete user', 'error');
      }
    }
  };
  return (
    <>
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
          className="flex items-center justify-between mb-8">
          
          <div>
            <h1 className="text-3xl font-serif font-semibold text-text-dark mb-1">
              Users
            </h1>
            <p className="text-sm text-text-muted">
              Manage user accounts and access
            </p>
          </div>
          <Button onClick={openCreate} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Add New User
          </Button>
        </motion.div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-canvas/50 border-b border-border">
                  <th className="py-3 px-6 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Username
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Role
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Created
                  </th>
                  <th className="py-3 px-6 text-right text-xs font-semibold text-text-muted uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) =>
                <motion.tr
                  key={user.id}
                  initial={{
                    opacity: 0,
                    y: 6
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: index * 0.03,
                    duration: 0.25
                  }}
                  className="border-b border-border last:border-b-0 hover:bg-canvas/40 transition-colors group">
                  
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-forest/10 text-forest'}`}>
                        
                          {user.role === 'admin' ?
                        <ShieldCheckIcon className="w-4 h-4" /> :

                        <UserIcon className="w-4 h-4" />
                        }
                        </div>
                        <span className="font-medium text-text-dark">
                          {user.username}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                      variant={user.role === 'admin' ? 'primary' : 'forest'}>
                      
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-text-muted text-sm">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                        onClick={() => openEdit(user)}
                        className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded transition-colors"
                        aria-label={`Edit ${user.username}`}>
                        
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleDelete(user)}
                        className="p-2 text-text-muted hover:text-tomato hover:bg-tomato/5 rounded transition-colors"
                        aria-label={`Delete ${user.username}`}>
                        
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingUser ? `Edit ${editingUser.username}` : 'Add New User'}>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            placeholder="e.g., chef_maria"
            value={formData.username}
            onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              username: e.target.value
            }))
            }
            error={errors.username}
            autoFocus />
          

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              {editingUser ?
              'New Password (leave blank to keep current)' :
              'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={editingUser ? '••••••••' : 'At least 6 characters'}
                value={formData.password}
                onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value
                }))
                }
                className={`w-full pl-3 pr-10 py-2 bg-surface border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${errors.password ? 'border-tomato' : 'border-border-strong'}`} />
              
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-text-dark transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                
                {showPassword ?
                <EyeOffIcon className="w-4 h-4" /> :

                <EyeIcon className="w-4 h-4" />
                }
              </button>
            </div>
            {errors.password &&
            <p className="mt-1 text-sm text-tomato">{errors.password}</p>
            }
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  role: 'user'
                }))
                }
                className={`flex items-center gap-3 px-4 py-3 rounded-md border-2 transition-all text-left ${formData.role === 'user' ? 'border-forest bg-forest/5' : 'border-border bg-surface hover:border-border-strong'}`}>
                
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.role === 'user' ? 'bg-forest text-white' : 'bg-canvas text-text-muted'}`}>
                  
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-dark">User</p>
                  <p className="text-xs text-text-muted">View recipes only</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  role: 'admin'
                }))
                }
                className={`flex items-center gap-3 px-4 py-3 rounded-md border-2 transition-all text-left ${formData.role === 'admin' ? 'border-primary bg-primary/5' : 'border-border bg-surface hover:border-border-strong'}`}>
                
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.role === 'admin' ? 'bg-primary text-white' : 'bg-canvas text-text-muted'}`}>
                  
                  <ShieldCheckIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-dark">Admin</p>
                  <p className="text-xs text-text-muted">Full access</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>);

}