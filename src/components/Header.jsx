
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { LogOut, User, Briefcase, Building, Search, FileText, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="bg-slate-800/50 backdrop-blur-md shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold gradient-text">
          JobFinder
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="link" asChild className="text-gray-300 hover:text-white transition-colors">
            <Link to="/vacancies"><Search className="mr-2 h-4 w-4" />Вакансії</Link>
          </Button>
          
          {user ? (
            <>
              {user.role === 'job_seeker' && (
                <Button variant="link" asChild className="text-gray-300 hover:text-white transition-colors">
                  <Link to="/dashboard/job-seeker"><LayoutDashboard className="mr-2 h-4 w-4" />Кабінет шукача</Link>
                </Button>
              )}
              {user.role === 'employer' && (
                <>
                  <Button variant="link" asChild className="text-gray-300 hover:text-white transition-colors">
                    <Link to="/dashboard/employer"><LayoutDashboard className="mr-2 h-4 w-4" />Кабінет роботодавця</Link>
                  </Button>
                  <Button variant="link" asChild className="text-gray-300 hover:text-white transition-colors">
                    <Link to="/resumes"><FileText className="mr-2 h-4 w-4" />Резюме</Link>
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src={user.avatarUrl || ''} alt={user.name || user.email} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-700 border-slate-600 text-gray-200" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || 'Користувач'}</p>
                      <p className="text-xs leading-none text-muted-foreground text-gray-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-600" />
                  <DropdownMenuItem className="hover:bg-slate-600 focus:bg-slate-600" onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Профіль
                  </DropdownMenuItem>
                  {user.role === 'job_seeker' && (
                    <DropdownMenuItem className="hover:bg-slate-600 focus:bg-slate-600" onClick={() => navigate('/my-resumes')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Мої резюме
                    </DropdownMenuItem>
                  )}
                  {user.role === 'employer' && (
                     <DropdownMenuItem className="hover:bg-slate-600 focus:bg-slate-600" onClick={() => navigate('/my-vacancies')}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Мої вакансії
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-slate-600" />
                  <DropdownMenuItem className="hover:bg-red-500/20 focus:bg-red-500/30 text-red-400 focus:text-red-300" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Вийти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={() => navigate('/login')}>
                Увійти
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" onClick={() => navigate('/register')}>
                Реєстрація
              </Button>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
