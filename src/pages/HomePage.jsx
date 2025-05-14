
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, Search, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-slate-800/70 p-6 rounded-xl shadow-2xl hover:shadow-primary/50 transition-shadow duration-300 glassmorphism"
  >
    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary to-pink-500 text-white">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-semibold text-gray-100">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          Знайди <span className="gradient-text">роботу</span> своєї мрії
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Провідна платформа для пошуку вакансій та талановитих кандидатів. Розпочніть свій кар'єрний шлях або знайдіть ідеального співробітника вже сьогодні!
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link to="/vacancies">
              Шукати вакансії <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link to="/register?role=employer">
              Розмістити вакансію
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mb-12">
        <FeatureCard 
          icon={<Search size={32} />} 
          title="Легкий пошук" 
          description="Знаходьте вакансії за ключовими словами, категоріями, локацією та зарплатою."
          delay={0.2}
        />
        <FeatureCard 
          icon={<Briefcase size={32} />} 
          title="Для роботодавців" 
          description="Публікуйте вакансії, знаходьте найкращих кандидатів та керуйте відгуками."
          delay={0.4}
        />
        <FeatureCard 
          icon={<Users size={32} />} 
          title="Для шукачів" 
          description="Створюйте професійні резюме, відгукуйтесь на вакансії та отримуйте запрошення."
          delay={0.6}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="w-full max-w-4xl p-8 bg-slate-800/50 rounded-xl shadow-2xl glassmorphism"
      >
        <h2 className="text-3xl font-bold mb-6 gradient-text">Приєднуйтесь до нас!</h2>
        <p className="text-gray-300 mb-6">
          Незалежно від того, чи ви шукаєте нові кар'єрні можливості, чи прагнете знайти кваліфікованих спеціалістів для своєї команди, JobFinder надасть вам усі необхідні інструменти для досягнення успіху.
        </p>
        <Button size="lg" asChild className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <Link to="/register">
            Зареєструватися зараз <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>

      <div className="mt-16 w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Наші партнери</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
          <img  alt="Company Logo 1" class="h-12 filter grayscale hover:grayscale-0 transition-all duration-300" src="https://images.unsplash.com/photo-1701383287245-5c4096b68564" />
          <img  alt="Company Logo 2" class="h-12 filter grayscale hover:grayscale-0 transition-all duration-300" src="https://images.unsplash.com/photo-1581094003044-1769c1db6283" />
          <img  alt="Company Logo 3" class="h-12 filter grayscale hover:grayscale-0 transition-all duration-300" src="https://images.unsplash.com/photo-1681992894234-6db66a592c29" />
          <img  alt="Company Logo 4" class="h-12 filter grayscale hover:grayscale-0 transition-all duration-300" src="https://images.unsplash.com/photo-1585065799297-ce07d1855c01" />
          <img  alt="Company Logo 5" class="h-12 filter grayscale hover:grayscale-0 transition-all duration-300" src="https://images.unsplash.com/photo-1690721694936-fd4b6f249126" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
