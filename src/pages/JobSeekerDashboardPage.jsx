
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { FileText, Search, Briefcase, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const JobSeekerDashboardPage = () => {
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
        <h1 className="text-4xl font-bold mb-2">Вітаємо, <span className="gradient-text">{user?.name || 'Шукач'}!</span></h1>
        <p className="text-lg text-gray-400">Ваш особистий кабінет для управління резюме та пошуку роботи.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Створено резюме" value="1" icon={<FileText />} color="primary" delay={0.1} />
        <StatCard title="Активних відгуків" value="3" icon={<Briefcase />} color="green" delay={0.2} />
        <StatCard title="Збережених вакансій" value="5" icon={<Search />} color="yellow" delay={0.3} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-lg glassmorphism">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">Мої резюме</CardTitle>
              <CardDescription className="text-gray-400">Керуйте своїми резюме, створюйте нові або редагуйте існуючі.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">У вас є 1 активне резюме.</p>
              <div className="flex space-x-3">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/my-resumes"><FileText className="mr-2 h-4 w-4" />Переглянути резюме</Link>
                </Button>
                <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
                  <Link to="/resumes/create"><PlusCircle className="mr-2 h-4 w-4" />Створити нове</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-lg glassmorphism">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">Пошук вакансій</CardTitle>
              <CardDescription className="text-gray-400">Знайдіть ідеальну роботу серед тисяч пропозицій.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">Почніть пошук роботи мрії вже зараз!</p>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Link to="/vacancies"><Search className="mr-2 h-4 w-4" />Знайти вакансії</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
        <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-lg glassmorphism">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">Рекомендовані вакансії</CardTitle>
            <CardDescription className="text-gray-400">На основі вашого профілю та інтересів.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Наразі немає рекомендованих вакансій. Заповніть свій профіль та резюме, щоб отримувати персоналізовані пропозиції.</p>
            {/* Placeholder for recommended vacancies list */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default JobSeekerDashboardPage;
