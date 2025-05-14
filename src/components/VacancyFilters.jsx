
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const VacancyFilters = ({ filters, onFilterChange }) => {
  const employmentTypes = ["full-time", "part-time", "remote", "contract", "internship"];
  const employmentTypeLabels = {
    "full-time": "Повна зайнятість",
    "part-time": "Часткова зайнятість",
    "remote": "Віддалена робота",
    "contract": "Контракт",
    "internship": "Стажування"
  };

  const handleInputChange = (e) => {
    onFilterChange({ [e.target.id]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    // Ensure that if "Будь-який тип" is selected, we pass an empty string or a specific "all" value
    // For Radix Select, an empty string value for SelectItem is problematic.
    // We use a specific value like "all_types" for the "any type" option.
    const actualValue = value === "all_types" ? "" : value;
    onFilterChange({ [name]: actualValue });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 bg-slate-800/50 rounded-lg shadow-md glassmorphism space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="relative flex-grow lg:col-span-2">
          <Label htmlFor="searchTerm" className="text-sm font-medium text-gray-300">Ключові слова</Label>
          <Search className="absolute left-3 top-[calc(50%+8px)] -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="searchTerm"
            type="text"
            placeholder="Назва, компанія, опис..."
            value={filters.searchTerm}
            onChange={handleInputChange}
            className="pl-10 bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary w-full"
          />
        </div>
        <div>
          <Label htmlFor="locationFilter" className="text-sm font-medium text-gray-300">Місцезнаходження</Label>
          <Input
            id="locationFilter"
            type="text"
            placeholder="Місто або 'віддалено'"
            value={filters.locationFilter}
            onChange={handleInputChange}
            className="bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary"
          />
        </div>
        <div>
          <Label htmlFor="salaryMin" className="text-sm font-medium text-gray-300">Мін. зарплата (грн)</Label>
          <Input
            id="salaryMin"
            type="number"
            placeholder="Наприклад, 20000"
            value={filters.salaryMin}
            onChange={handleInputChange}
            className="bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-grow">
          <Label className="text-sm font-medium text-gray-300 mb-1 block">Тип зайнятості</Label>
          <Select 
            value={filters.employmentTypeFilter === "" ? "all_types" : filters.employmentTypeFilter} 
            onValueChange={(value) => handleSelectChange('employmentTypeFilter', value)}
          >
            <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-gray-100 focus:border-primary">
              <SelectValue placeholder="Будь-який тип" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-gray-100">
              <SelectItem value="all_types">Будь-який тип</SelectItem>
              {employmentTypes.map(type => (
                <SelectItem key={type} value={type}>{employmentTypeLabels[type]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-grow">
          <Label className="text-sm font-medium text-gray-300 mb-1 block">Сортувати за</Label>
          <Select value={filters.sortBy} onValueChange={(value) => handleSelectChange('sortBy', value)}>
            <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-gray-100 focus:border-primary">
              <SelectValue placeholder="Сортувати за..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-gray-100">
              <SelectItem value="newest">Спочатку новіші</SelectItem>
              <SelectItem value="oldest">Спочатку старіші</SelectItem>
              <SelectItem value="title">За назвою</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
};

export default VacancyFilters;
