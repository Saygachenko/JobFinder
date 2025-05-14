
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { motion } from 'framer-motion';
import { FileText, User, Mail, Phone, Briefcase, BookOpen, Star, ArrowLeft, Download, MessageSquare } from 'lucide-react';

const ResumeDetailsPage = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth(); // For employer actions

  useEffect(() => {
    setIsLoading(true);
    const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    const foundResume = resumes.find(r => r.id === id);
    
    if (foundResume) {
      // Employers should only see resumes if they are not their own (unless admin in future)
      // For now, any employer can see any resume for demo purposes.
      setResume(foundResume);
    } else {
      toast({ title: 'Помилка', description: 'Резюме не знайдено.', variant: 'destructive' });
    }
    setIsLoading(false);
  }, [id, toast, user]);

  const handleInviteToInterview = () => {
    // Logic for inviting candidate to interview
    toast({ title: 'Запрошення надіслано (симуляція)', description: `Запрошення на співбесіду для ${resume.userName} надіслано.` });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Завантаження PDF",
      description: `Завантаження резюме "${resume.title}"... (Функціонал в розробці)`,
    });
    // Actual PDF generation logic would go here.
    alert(`Уявіть, що PDF для резюме "${resume.title}" завантажується.\n\nЦей функціонал потребує додаткових бібліотек або серверної частини для реалізації.`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (!resume) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-24 w-24 text-gray-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">Резюме не знайдено</h2>
        <p className="text-gray-400 mb-6">Можливо, його було видалено або посилання некоректне.</p>
        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <Link to="/resumes"><ArrowLeft className="mr-2 h-4 w-4" /> До бази резюме</Link>
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
        <Link to="/resumes"><ArrowLeft className="mr-2 h-4 w-4" /> Назад до резюме</Link>
      </Button>

      <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-2xl glassmorphism">
        <CardHeader className="border-b border-slate-700 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-1">{resume.title}</h1>
              <p className="text-xl text-gray-300 flex items-center"><User className="h-5 w-5 mr-2 text-gray-400" />{resume.userName}</p>
            </div>
            <FileText className="h-16 w-16 text-primary hidden md:block" />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 mt-4 text-sm">
            <div className="flex items-center"><Mail className="h-4 w-4 mr-2 text-blue-400" /> {resume.contactEmail}</div>
            {resume.contactPhone && <div className="flex items-center"><Phone className="h-4 w-4 mr-2 text-green-400" /> {resume.contactPhone}</div>}
          </div>
        </CardHeader>
        
        <CardContent className="py-6 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-3 flex items-center"><User className="h-6 w-6 mr-3 text-primary" />Про себе</h2>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{resume.summary}</p>
          </div>

          {resume.education && resume.education.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-4 flex items-center"><BookOpen className="h-6 w-6 mr-3 text-primary" />Освіта</h2>
              <ul className="space-y-3">
                {resume.education.map((edu, index) => (
                  <li key={index} className="text-gray-300 border-l-2 border-primary pl-4 py-1">
                    <p className="font-medium text-gray-200">{edu.degree} - {edu.institution}</p>
                    <p className="text-sm text-gray-400">{edu.year}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resume.experience && resume.experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-4 flex items-center"><Briefcase className="h-6 w-6 mr-3 text-primary" />Досвід роботи</h2>
              <ul className="space-y-4">
                {resume.experience.map((exp, index) => (
                  <li key={index} className="text-gray-300 border-l-2 border-primary pl-4 py-2">
                    <p className="font-medium text-lg text-gray-200">{exp.position} <span className="text-gray-400 text-base">в {exp.company}</span></p>
                    <p className="text-sm text-gray-400 mb-1">{exp.years}</p>
                    <p className="whitespace-pre-line text-sm">{exp.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {resume.skills && resume.skills.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-3 flex items-center"><Star className="h-6 w-6 mr-3 text-primary" />Навички</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span key={index} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-slate-700 pt-6 flex flex-col sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={handleDownloadPDF} className="border-green-500 text-green-400 hover:bg-green-500/10 w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Завантажити PDF
          </Button>
          <Button onClick={handleInviteToInterview} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg w-full sm:w-auto">
            <MessageSquare className="mr-2 h-4 w-4" /> Запросити на співбесіду
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ResumeDetailsPage;
