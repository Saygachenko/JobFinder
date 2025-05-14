
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('jobfinder_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('jobfinder_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password, role) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
        const existingUser = users.find(u => u.email === email);

        if (existingUser && existingUser.password === password) {
          if (existingUser.role !== role) {
             toast({
              title: 'Помилка входу',
              description: `Цей обліковий запис зареєстровано як ${existingUser.role === 'job_seeker' ? 'шукач' : 'роботодавець'}. Будь ласка, увійдіть з відповідною роллю.`,
              variant: 'destructive',
            });
            setLoading(false);
            reject(new Error('Role mismatch'));
            return;
          }
          setUser(existingUser);
          localStorage.setItem('jobfinder_user', JSON.stringify(existingUser));
          toast({
            title: 'Вхід успішний',
            description: `Ласкаво просимо, ${existingUser.name || existingUser.email}!`,
          });
          setLoading(false);
          resolve(existingUser);
        } else {
          toast({
            title: 'Помилка входу',
            description: 'Неправильний email або пароль.',
            variant: 'destructive',
          });
          setLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = (userData) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
        if (users.find(u => u.email === userData.email)) {
          toast({
            title: 'Помилка реєстрації',
            description: 'Користувач з таким email вже існує.',
            variant: 'destructive',
          });
          setLoading(false);
          reject(new Error('User already exists'));
          return;
        }
        
        const newUser = { ...userData, id: Date.now().toString() };
        users.push(newUser);
        localStorage.setItem('jobfinder_users', JSON.stringify(users));
        
        setUser(newUser);
        localStorage.setItem('jobfinder_user', JSON.stringify(newUser));
        toast({
          title: 'Реєстрація успішна',
          description: `Вітаємо, ${newUser.name || newUser.email}! Ваш акаунт створено.`,
        });
        setLoading(false);
        resolve(newUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobfinder_user');
    toast({
      title: 'Вихід',
      description: 'Ви успішно вийшли з системи.',
    });
  };
  
  const updateUserProfile = (updatedData) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          setLoading(false);
          reject(new Error("User not logged in"));
          return;
        }
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('jobfinder_user', JSON.stringify(updatedUser));

        let users = JSON.parse(localStorage.getItem('jobfinder_users') || '[]');
        users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        localStorage.setItem('jobfinder_users', JSON.stringify(users));
        
        toast({
          title: 'Профіль оновлено',
          description: 'Ваші дані успішно збережено.',
        });
        setLoading(false);
        resolve(updatedUser);
      }, 500);
    });
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
