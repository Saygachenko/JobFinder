
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Briefcase, Save, DollarSign, MapPin, Users } from 'lucide-react';

const CreateVacancyPage = () => {
  const { id: vacancyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [companyName, setCompanyName] = useState(user?.companyName || user?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (vacancyId) {
      const vacancies = JSON.parse(localStorage.getItem('vacancies') || '[]');
      const existingVacancy = vacancies.find(v => v.id === vacancyId && v.employerId === user.id);
      if (existingVacancy) {
        setTitle(existingVacancy.title);
        setDescription(existingVacancy.description);
        setRequirements(existingVacancy.requirements);
        setSalary(existingVacancy.salary);
        setLocation(existingVacancy.location);
        setEmploymentType(existingVacancy.employmentType);
        setCompanyName(existingVacancy.companyName);
      } else {
        toast({ title: 'Помилка', description: 'Вакансію не знайдено або у вас немає доступу.', variant: 'destructive' });
        navigate('/my-vacancies');
      }
    }
  }, [vacancyId, user, navigate, toast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !description || !requirements || !location || !employmentType || !companyName) {
      toast({ title: 'Помилка валідації', description: 'Будь ласка, заповніть усі обов\'язкові поля.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    const vacancyData = {
      id: vacancyId || Date.now().toString(),
      employerId: user.id,
      employerName: user.name,
      title,
      description,
      requirements,
      salary,
      location,
      employmentType,
      companyName,
      postedDate: vacancyId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      let vacancies = JSON.parse(localStorage.getItem('vacancies') || '[]');
      if (vacancyId) {
        vacancies = vacancies.map(v => v.id === vacancyId ? { ...v, ...vacancyData, updatedAt: new Date().toISOString() } : v);
      } else {
        vacancies.push(vacancyData);
      }
      localStorage.setItem('vacancies', JSON.stringify(vacancies));

      toast({ title: `Вакансію ${vacancyId ? 'оновлено' : 'створено'}`, description: 'Вашу вакансію успішно збережено.' });
      setIsSubmitting(false);
      navigate('/my-vacancies');
    }, 1000);
  };
  
  const inputClass = "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-2xl glassmorphism">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Briefcase className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold gradient-text">{vacancyId ? 'Редагувати вакансію' : 'Створити вакансію'}</CardTitle>
              <CardDescription className="text-gray-400">Надайте детальну інформацію про вакансію, щоб залучити найкращих кандидатів.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-gray-300 text-lg">Назва вакансії*</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Наприклад, Senior Python Developer" required className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="text-gray-300 text-lg">Назва компанії*</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Назва вашої компанії" required className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-gray-300 text-lg">Опис вакансії*</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Детально опишіть обов'язки, проекти та культуру компанії" required className={inputClass} rows={5} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="requirements" className="text-gray-300 text-lg">Вимоги до кандидата*</Label>
              <Textarea id="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Перелічіть необхідні навички, досвід та освіту" required className={inputClass} rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="salary" className="text-gray-300 text-lg">Заробітна плата</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Наприклад, 50000 грн або За результатами співбесіди" className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-gray-300 text-lg">Місцезнаходження*</Label>
                 <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Наприклад, Київ або Віддалено" required className={`${inputClass} pl-10`} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="employmentType" className="text-gray-300 text-lg">Тип зайнятості*</Label>
              <Select value={employmentType} onValueChange={setEmploymentType} >
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Оберіть тип зайнятості" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-gray-100">
                  <SelectItem value="full-time">Повна зайнятість</SelectItem>
                  <SelectItem value="part-time">Часткова зайнятість</SelectItem>
                  <SelectItem value="remote">Віддалена робота</SelectItem>
                  <SelectItem value="contract">Контракт</SelectItem>
                  <SelectItem value="internship">Стажування</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg py-3 text-lg" disabled={isSubmitting}>
              <Save className="mr-2 h-5 w-5" /> {isSubmitting ? (vacancyId ? 'Збереження...' : 'Публікація...') : (vacancyId ? 'Зберегти зміни' : 'Опублікувати вакансію')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateVacancyPage;
