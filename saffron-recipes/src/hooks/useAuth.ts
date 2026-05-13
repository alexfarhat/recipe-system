import { useEffect, useState } from 'react';
import { auth } from '../lib/auth';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => auth.getCurrentUser());

  useEffect(() => {
    const unsubscribe = auth.subscribe(() => {
      setUser(auth.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login: (username: string, password: string) =>
    auth.login(username, password),
    logout: () => auth.logout()
  };
}