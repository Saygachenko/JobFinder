
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('job_seeker');
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleFromQuery = params.get('role');
    if (roleFromQuery === 'employer' || roleFromQuery === 'job_seeker') {
      setRole(roleFromQuery);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Помилка валідації',
        description: 'Будь ласка, заповніть усі поля.',
        variant: 'destructive',
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: 'Помилка валідації',
        description: 'Паролі не співпадають.',
        variant: 'destructive',
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: 'Помилка валідації',
        description: 'Пароль повинен містити щонайменше 6 символів.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await register({ name, email, password, role });
      const from = role === 'job_seeker' ? '/dashboard/job-seeker' : '/dashboard/employer';
      navigate(from, { replace: true });
    } catch (error) {
      // Toast is handled in AuthContext
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12"
    >
      <Card className="w-full max-w-md bg-slate-800/70 border-slate-700 text-gray-100 shadow-2xl glassmorphism">
        <CardHeader className="text-center">
          <motion.div initial={{ scale:0 }} animate={{ scale:1}} transition={{delay:0.2, type: 'spring', stiffness:150}}>
            <UserPlus className="mx-auto h-16 w-16 mb-4 text-primary"/>
          </motion.div>
          <CardTitle className="text-3xl font-bold gradient-text">Створити акаунт</CardTitle>
          <CardDescription className="text-gray-400">Зареєструйтесь, щоб отримати доступ до всіх можливостей</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={setRole} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="job_seeker" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Я шукач</TabsTrigger>
              <TabsTrigger value="employer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Я роботодавець</TabsTrigger>
            </TabsList>
          </Tabs>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-gray-300">Повне ім'я</Label>
              <Input
                id="name"
                type="text"
                placeholder="Іван Іванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-300">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Мінімум 6 символів"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-gray-300">Підтвердіть пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторіть пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg" disabled={loading}>
              {loading ? 'Реєстрація...' : 'Зареєструватися'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Вже маєте акаунт?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Увійти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RegisterPage;
