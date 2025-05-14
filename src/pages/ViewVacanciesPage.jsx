
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/components/ui/use-toast.jsx';
import { motion } from 'framer-motion';
import { Briefcase, Search, PlusCircle, Filter } from 'lucide-react';
import { Label } from "@/components/ui/label";
import VacancyCard from '@/components/VacancyCard.jsx'; 
import VacancyFilters from '@/components/VacancyFilters.jsx';

const ViewVacanciesPage = ({ type = 'all' }) => {
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    locationFilter: '',
    employmentTypeFilter: '',
    salaryMin: '',
    sortBy: 'newest',
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isMyVacanciesPage = type === 'my';

  useEffect(() => {
    const storedVacancies = JSON.parse(localStorage.getItem('vacancies') || '[]');
    if (isMyVacanciesPage && user) {
      setVacancies(storedVacancies.filter(v => v.employerId === user.id));
    } else {
      setVacancies(storedVacancies);
    }
  }, [isMyVacanciesPage, user]);

  const applyFilters = useCallback(() => {
    let tempVacancies = [...vacancies];

    if (filters.searchTerm) {
      tempVacancies = tempVacancies.filter(v =>
        v.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        v.companyName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        v.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    if (filters.locationFilter) {
      tempVacancies = tempVacancies.filter(v => v.location.toLowerCase().includes(filters.locationFilter.toLowerCase()));
    }
    if (filters.employmentTypeFilter) {
      tempVacancies = tempVacancies.filter(v => v.employmentType === filters.employmentTypeFilter);
    }
    if (filters.salaryMin) {
       tempVacancies = tempVacancies.filter(v => {
        const salaryStr = String(v.salary).replace(/\D/g, ''); 
        if (!salaryStr) return false;
        return parseInt(salaryStr, 10) >= parseInt(filters.salaryMin, 10);
      });
    }

    if (filters.sortBy === 'newest') {
      tempVacancies.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (filters.sortBy === 'oldest') {
      tempVacancies.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    } else if (filters.sortBy === 'title') {
      tempVacancies.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredVacancies(tempVacancies);
  }, [vacancies, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const handleEdit = (id) => {
    navigate(`/vacancies/edit/${id}`);
  };

  const handleDelete = (id) => {
    const updatedVacancies = vacancies.filter(v => v.id !== id);
    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));
    setVacancies(updatedVacancies); // This will trigger re-filtering
    toast({ title: 'Вакансію видалено', description: 'Вашу вакансію було успішно видалено.' });
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              {isMyVacanciesPage ? 'Мої вакансії' : 'Пошук вакансій'}
            </h1>
            <p className="text-lg text-gray-400">
              {isMyVacanciesPage ? 'Керуйте своїми вакансіями тут.' : 'Знайдіть роботу своєї мрії.'}
            </p>
          </div>
          {isMyVacanciesPage && (
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
              <Link to="/vacancies/create"><PlusCircle className="mr-2 h-5 w-5" /> Створити нову вакансію</Link>
            </Button>
          )}
        </div>
      </motion.div>

      <VacancyFilters filters={filters} onFilterChange={handleFilterChange} />

      {filteredVacancies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              onEdit={() => handleEdit(vacancy.id)}
              onDelete={() => handleDelete(vacancy.id)}
              isOwner={isMyVacanciesPage || (user && vacancy.employerId === user.id)}
            />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <Briefcase className="mx-auto h-24 w-24 text-gray-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            {isMyVacanciesPage ? 'У вас ще немає вакансій' : 'Вакансій не знайдено'}
          </h2>
          <p className="text-gray-400 mb-6">
            {isMyVacanciesPage ? 'Створіть свою першу вакансію, щоб знайти кандидатів.' : 'Спробуйте змінити параметри пошуку або перевірте пізніше.'}
          </p>
          {isMyVacanciesPage && (
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/vacancies/create"><PlusCircle className="mr-2 h-4 w-4" /> Створити вакансію</Link>
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ViewVacanciesPage;
