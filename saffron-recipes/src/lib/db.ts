import { Dish, User, Activity } from '../types';
import { seedActivity } from '../data/seedActivity';

type Listener = () => void;

// Resolve API base — works whether app is at /, /sub/, or hash-routed
const API_BASE = (() => {
  // Strip trailing slash from pathname (excluding the hash part)
  const path = window.location.pathname.replace(/\/$/, '');
  // If the page is served from a subfolder (e.g. /saffron/index.html), API is /saffron/api
  // Otherwise it's /api
  return path && path !== '' ? `${path}/api` : '/api';
})();

async function apiRequest<T>(
url: string,
options: RequestInit = {})
: Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data && data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

class Database {
  private listeners: Listener[] = [];
  private cache: {dishes: Dish[];users: User[];} = {
    dishes: [],
    users: []
  };
  private _ready = false;
  private _error: string | null = null;
  private _readyPromise: Promise<void> | null = null;

  get ready() {
    return this._ready;
  }
  get error() {
    return this._error;
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

  /**
   * Loads dishes + users from the server into the in-memory cache.
   * Components keep reading synchronously from the cache via getAll().
   */
  init(): Promise<void> {
    if (this._readyPromise) return this._readyPromise;
    this._readyPromise = (async () => {
      try {
        const [dishes, users] = await Promise.all([
        apiRequest<Dish[]>(`${API_BASE}/dishes.php`),
        apiRequest<User[]>(`${API_BASE}/users.php`)]
        );
        this.cache.dishes = dishes;
        this.cache.users = users;
        this._error = null;
      } catch (e: any) {
        this._error = e?.message || 'Failed to load data from server';
        console.error('[db] init failed:', e);
      } finally {
        this._ready = true;
        this.notify();
      }
    })();
    return this._readyPromise;
  }

  async refresh() {
    this._readyPromise = null;
    this._ready = false;
    return this.init();
  }

  // ============ DISHES ============
  dishes = {
    getAll: (): Dish[] => this.cache.dishes,

    getById: (id: string): Dish | undefined =>
    this.cache.dishes.find((d) => d.id === id),

    create: async (dish: Dish): Promise<Dish> => {
      const saved = await apiRequest<Dish>(`${API_BASE}/dishes.php`, {
        method: 'POST',
        body: JSON.stringify(dish)
      });
      this.cache.dishes = [saved, ...this.cache.dishes];
      this.notify();
      return saved;
    },

    update: async (id: string, updates: Partial<Dish>): Promise<Dish> => {
      const current = this.cache.dishes.find((d) => d.id === id);
      const merged = { ...current, ...updates, id } as Dish;
      const saved = await apiRequest<Dish>(
        `${API_BASE}/dishes.php?id=${encodeURIComponent(id)}`,
        {
          method: 'PUT',
          body: JSON.stringify(merged)
        }
      );
      this.cache.dishes = this.cache.dishes.map((d) =>
      d.id === id ? saved : d
      );
      this.notify();
      return saved;
    },

    delete: async (id: string): Promise<void> => {
      await apiRequest(`${API_BASE}/dishes.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      this.cache.dishes = this.cache.dishes.filter((d) => d.id !== id);
      this.notify();
    }
  };

  // ============ USERS ============
  users = {
    getAll: (): User[] => this.cache.users,

    create: async (user: User): Promise<User> => {
      const saved = await apiRequest<User>(`${API_BASE}/users.php`, {
        method: 'POST',
        body: JSON.stringify(user)
      });
      this.cache.users = [...this.cache.users, saved];
      this.notify();
      return saved;
    },

    update: async (id: string, updates: Partial<User>): Promise<User> => {
      const saved = await apiRequest<User>(
        `${API_BASE}/users.php?id=${encodeURIComponent(id)}`,
        {
          method: 'PUT',
          body: JSON.stringify(updates)
        }
      );
      this.cache.users = this.cache.users.map((u) => u.id === id ? saved : u);
      this.notify();
      return saved;
    },

    delete: async (id: string): Promise<void> => {
      await apiRequest(`${API_BASE}/users.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      this.cache.users = this.cache.users.filter((u) => u.id !== id);
      this.notify();
    },

    // ---- AUTH ----
    login: async (username: string, password: string): Promise<User> => {
      return await apiRequest<User>(`${API_BASE}/users.php?action=login`, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
    }
  };

  // ============ ACTIVITY (local-only, per-browser) ============
  // Activity log stays in localStorage — it's a personal recent-actions feed,
  // not shared data. Keeps the server simple.
  activity = {
    getAll: (): Activity[] => {
      const data = localStorage.getItem('saffron_activity');
      if (data) return JSON.parse(data);
      // Lazy-seed on first read
      localStorage.setItem('saffron_activity', JSON.stringify(seedActivity));
      return seedActivity;
    },
    log: (activity: Omit<Activity, 'id' | 'timestamp'>) => {
      const activities = this.activity.getAll();
      const newActivity: Activity = {
        ...activity,
        id: `activity-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      activities.unshift(newActivity);
      localStorage.setItem(
        'saffron_activity',
        JSON.stringify(activities.slice(0, 50))
      );
      this.notify();
    }
  };
}

export const db = new Database();