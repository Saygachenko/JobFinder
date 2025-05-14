
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Users, CalendarDays, ArrowLeft, Send, Bookmark } from 'lucide-react';

const VacancyDetailsPage = () => {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    const vacancies = JSON.parse(localStorage.getItem('vacancies') || '[]');
    const foundVacancy = vacancies.find(v => v.id === id);
    
    if (foundVacancy) {
      setVacancy(foundVacancy);
    } else {
      toast({ title: 'Помилка', description: 'Вакансію не знайдено.', variant: 'destructive' });
    }
    setIsLoading(false);
  }, [id, toast]);

  const handleApply = () => {
    if (!user) {
      toast({ title: 'Потрібна авторизація', description: 'Будь ласка, увійдіть або зареєструйтесь, щоб відгукнутися.', variant: 'default' });
      // Potentially redirect to login page with state to return here
      return;
    }
    if (user.role !== 'job_seeker') {
      toast({ title: 'Дія недоступна', description: 'Тільки шукачі можуть відгукуватися на вакансії.', variant: 'destructive' });
      return;
    }
    // Logic for applying to vacancy (e.g., open modal to select resume, send application)
    toast({ title: 'Відгук надіслано (симуляція)', description: `Ваш відгук на вакансію "${vacancy.title}" успішно надіслано.` });
  };

  const handleSaveVacancy = () => {
     if (!user) {
      toast({ title: 'Потрібна авторизація', description: 'Будь ласка, увійдіть або зареєструйтесь, щоб зберегти вакансію.', variant: 'default' });
      return;
    }
    // Logic for saving vacancy
    toast({ title: 'Вакансію збережено (симуляція)', description: `Вакансія "${vacancy.title}" додана до ваших збережених.` });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (!vacancy) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-24 w-24 text-gray-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">Вакансію не знайдено</h2>
        <p className="text-gray-400 mb-6">Можливо, її було видалено або посилання некоректне.</p>
        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <Link to="/vacancies"><ArrowLeft className="mr-2 h-4 w-4" /> До списку вакансій</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Button asChild variant="outline" className="mb-6 border-primary text-primary hover:bg-primary/10">
        <Link to="/vacancies"><ArrowLeft className="mr-2 h-4 w-4" /> Назад до вакансій</Link>
      </Button>

      <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-2xl glassmorphism">
        <CardHeader className="border-b border-slate-700 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-1">{vacancy.title}</h1>
              <p className="text-xl text-gray-300">{vacancy.companyName}</p>
            </div>
            <Briefcase className="h-16 w-16 text-primary hidden md:block" />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 mt-4 text-sm">
            <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-yellow-400" /> {vacancy.location}</div>
            {vacancy.salary && <div className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-green-400" /> {vacancy.salary}</div>}
            <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-blue-400" /> {vacancy.employmentType ? vacancy.employmentType.charAt(0).toUpperCase() + vacancy.employmentType.slice(1).replace('-', ' ') : 'N/A'}</div>
            <div className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-purple-400" /> Опубліковано: {new Date(vacancy.postedDate).toLocaleDateString()}</div>
          </div>
        </CardHeader>
        
        <CardContent className="py-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-3">Опис вакансії</h2>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{vacancy.description}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-3">Вимоги</h2>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{vacancy.requirements}</p>
          </div>
          {/* Placeholder for company info, benefits etc. */}
        </CardContent>

        <CardFooter className="border-t border-slate-700 pt-6 flex flex-col sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={handleSaveVacancy} className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 w-full sm:w-auto">
            <Bookmark className="mr-2 h-4 w-4" /> Зберегти вакансію
          </Button>
          <Button onClick={handleApply} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" /> Відгукнутися
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default VacancyDetailsPage;
