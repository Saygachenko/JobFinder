
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('job_seeker'); 
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || (role === 'job_seeker' ? '/dashboard/job-seeker' : '/dashboard/employer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Помилка валідації',
        description: 'Будь ласка, заповніть усі поля.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await login(email, password, role);
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
            <LogIn className="mx-auto h-16 w-16 mb-4 text-primary"/>
          </motion.div>
          <CardTitle className="text-3xl font-bold gradient-text">Вхід до системи</CardTitle>
          <CardDescription className="text-gray-400">Увійдіть, щоб продовжити</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="job_seeker" onValueChange={setRole} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="job_seeker" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Я шукач</TabsTrigger>
              <TabsTrigger value="employer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Я роботодавець</TabsTrigger>
            </TabsList>
          </Tabs>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg" disabled={loading}>
              {loading ? 'Вхід...' : 'Увійти'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link to="#" className="text-sm text-primary hover:underline">
            Забули пароль?
          </Link>
          <p className="text-sm text-gray-400">
            Немає акаунту?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Зареєструватися
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginPage;
