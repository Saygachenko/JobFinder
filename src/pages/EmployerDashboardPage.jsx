
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Briefcase, Users, FileText, PlusCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const EmployerDashboardPage = () => {
  const { user } = useAuth();

  const StatCard = ({ title, value, icon, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={`bg-slate-800/70 border-slate-700 text-gray-100 shadow-lg hover:shadow-${color}-500/30 transition-shadow duration-300 glassmorphism`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
          {React.cloneElement(icon, { className: `h-5 w-5 text-${color}-400`})}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold text-${color}-400`}>{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2">Вітаємо, <span className="gradient-text">{user?.name || 'Роботодавець'}!</span></h1>
        <p className="text-lg text-gray-400">Ваш особистий кабінет для управління вакансіями та пошуку кандидатів.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Активних вакансій" value="2" icon={<Briefcase />} color="primary" delay={0.1} />
        <StatCard title="Нових відгуків" value="7" icon={<Users />} color="green" delay={0.2} />
        <StatCard title="Переглянуто резюме" value="15" icon={<FileText />} color="yellow" delay={0.3} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-lg glassmorphism">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">Мої вакансії</CardTitle>
              <CardDescription className="text-gray-400">Керуйте своїми вакансіями, створюйте нові або редагуйте існуючі.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">У вас є 2 активні вакансії.</p>
              <div className="flex space-x-3">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/my-vacancies"><Briefcase className="mr-2 h-4 w-4" />Переглянути вакансії</Link>
                </Button>
                <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
                  <Link to="/vacancies/create"><PlusCircle className="mr-2 h-4 w-4" />Створити нову</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-lg glassmorphism">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">Пошук кандидатів</CardTitle>
              <CardDescription className="text-gray-400">Знайдіть найкращих спеціалістів для вашої команди.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">Переглядайте базу резюме та знаходьте таланти.</p>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Link to="/resumes"><Search className="mr-2 h-4 w-4" />Знайти кандидатів</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
        <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-lg glassmorphism">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">Останні відгуки</CardTitle>
            <CardDescription className="text-gray-400">Перегляньте кандидатів, які відгукнулися на ваші вакансії.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Наразі немає нових відгуків. Очікуйте на заявки від кандидатів.</p>
            {/* Placeholder for recent applications list */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmployerDashboardPage;
