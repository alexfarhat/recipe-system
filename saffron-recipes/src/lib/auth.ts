import { User } from '../types';
import { db } from './db';

type Listener = () => void;

const SESSION_KEY = 'saffron_session';

class Auth {
  private listeners: Listener[] = [];

  constructor() {
    // Re-validate session whenever the user store changes (e.g. admin deletes the current user)
    db.subscribe(() => {
      const id = sessionStorage.getItem(SESSION_KEY);
      if (id) {
        const exists = db.users.getAll().some((u) => u.id === id);
        // Only invalidate once initial data has loaded — avoids clobbering during cold-start
        if (db.ready && !exists) {
          sessionStorage.removeItem(SESSION_KEY);
          this.notify();
        }
      }
    });
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  getCurrentUser(): User | null {
    const id = sessionStorage.getItem(SESSION_KEY);
    if (!id) return null;
    const user = db.users.getAll().find((u) => u.id === id);
    if (!user) {
      // If the cache hasn't loaded yet, don't wipe the session — let the
      // subscribe handler decide once db.ready becomes true.
      if (db.ready) {
        sessionStorage.removeItem(SESSION_KEY);
      }
      return null;
    }
    return user;
  }

  async login(
  username: string,
  password: string)
  : Promise<{ok: true;user: User;} | {ok: false;error: string;}> {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      return { ok: false, error: 'Please enter both username and password' };
    }
    try {
      const user = await db.users.login(trimmedUsername, password);
      sessionStorage.setItem(SESSION_KEY, user.id);
      this.notify();
      return { ok: true, user };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Login failed' };
    }
  }

  logout() {
    sessionStorage.removeItem(SESSION_KEY);
    this.notify();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }
}

export const auth = new Auth();