import { useState, useEffect } from 'react';
import { apiFetch } from './useApi';

interface User {
  id: number;
  email: string;
  role: string;
  full_name: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    apiFetch('/api/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('role', data.role);
    setUser(data);
    return data;
  };

  const signup = async (email: string, password: string, role: string, fullName?: string, institution?: string) => {
    const data = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, full_name: fullName, institution_name: institution }),
    });
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('role', data.role);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return { user, loading, login, signup, logout };
}