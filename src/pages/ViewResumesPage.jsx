
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/components/ui/use-toast.jsx';
import { motion } from 'framer-motion';
import { FileText, Search, Edit, Trash2, PlusCircle, Eye, Download } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ResumeCard = ({ resume, onEdit, onDelete, isOwner, onDownload }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-lg hover:shadow-primary/30 transition-shadow duration-300 glassmorphism h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl gradient-text">{resume.title}</CardTitle>
            <CardDescription className="text-gray-400">
              {isOwner ? `Створено: ${new Date(resume.createdAt).toLocaleDateString()}` : `Кандидат: ${resume.userName}`}
            </CardDescription>
          </div>
          <FileText className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-300 line-clamp-3 mb-2">{resume.summary}</p>
        <p className="text-sm text-gray-400"><strong>Навички:</strong> {resume.skills.slice(0, 5).join(', ')}{resume.skills.length > 5 ? '...' : ''}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-end">
        {isOwner ? (
          <>
            <Button variant="outline" size="sm" onClick={onEdit} className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
              <Edit className="mr-2 h-4 w-4" /> Редагувати
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Видалити
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-100">
                <AlertDialogHeader>
                  <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Цю дію неможливо скасувати. Це остаточно видалить ваше резюме.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-slate-700">Скасувати</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Видалити</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <Link to={`/resumes/${resume.id}`}><Eye className="mr-2 h-4 w-4" /> Переглянути</Link>
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onDownload(resume)} className="border-green-500 text-green-400 hover:bg-green-500/10">
          <Download className="mr-2 h-4 w-4" /> PDF
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);


const ViewResumesPage = ({ type = 'all' }) => {
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isMyResumesPage = type === 'my';

  useEffect(() => {
    const storedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    if (isMyResumesPage) {
      setResumes(storedResumes.filter(r => r.userId === user.id));
    } else {
      setResumes(storedResumes);
    }
  }, [isMyResumesPage, user]);

  useEffect(() => {
    let tempResumes = [...resumes];

    if (searchTerm) {
      tempResumes = tempResumes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.skills.join(' ').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (!isMyResumesPage && r.userName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sortBy === 'newest') {
      tempResumes.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    } else if (sortBy === 'oldest') {
      tempResumes.sort((a, b) => new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt));
    } else if (sortBy === 'title') {
      tempResumes.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredResumes(tempResumes);
  }, [resumes, searchTerm, sortBy, isMyResumesPage]);

  const handleEdit = (id) => {
    navigate(`/resumes/edit/${id}`);
  };

  const handleDelete = (id) => {
    const updatedResumes = resumes.filter(r => r.id !== id);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    setResumes(updatedResumes);
    toast({ title: 'Резюме видалено', description: 'Ваше резюме було успішно видалено.' });
  };
  
  const handleDownloadPDF = (resume) => {
    toast({
      title: "Завантаження PDF",
      description: `Завантаження резюме "${resume.title}"... (Функціонал в розробці)`,
    });
    // Actual PDF generation logic would go here.
    // For now, it's a placeholder.
    console.log("Downloading PDF for resume:", resume);
    alert(`Уявіть, що PDF для резюме "${resume.title}" завантажується.\n\nЦей функціонал потребує додаткових бібліотек або серверної частини для реалізації.`);
  };


  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              {isMyResumesPage ? 'Мої резюме' : 'База резюме'}
            </h1>
            <p className="text-lg text-gray-400">
              {isMyResumesPage ? 'Керуйте своїми резюме тут.' : 'Знаходьте талановитих кандидатів.'}
            </p>
          </div>
          {isMyResumesPage && (
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
              <Link to="/resumes/create"><PlusCircle className="mr-2 h-5 w-5" /> Створити нове резюме</Link>
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 p-4 bg-slate-800/50 rounded-lg shadow-md glassmorphism"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder={isMyResumesPage ? "Пошук за назвою або навичками..." : "Пошук за назвою, навичками, кандидатом..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary w-full"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] bg-slate-700 border-slate-600 text-gray-100 focus:border-primary">
            <SelectValue placeholder="Сортувати за..." />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600 text-gray-100">
            <SelectItem value="newest">Спочатку новіші</SelectItem>
            <SelectItem value="oldest">Спочатку старіші</SelectItem>
            <SelectItem value="title">За назвою</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume, index) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onEdit={() => handleEdit(resume.id)}
              onDelete={() => handleDelete(resume.id)}
              onDownload={handleDownloadPDF}
              isOwner={isMyResumesPage || resume.userId === user?.id}
            />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <FileText className="mx-auto h-24 w-24 text-gray-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            {isMyResumesPage ? 'У вас ще немає резюме' : 'Резюме не знайдено'}
          </h2>
          <p className="text-gray-400 mb-6">
            {isMyResumesPage ? 'Створіть своє перше резюме, щоб почати пошук роботи.' : 'Спробуйте змінити параметри пошуку або перевірте пізніше.'}
          </p>
          {isMyResumesPage && (
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/resumes/create"><PlusCircle className="mr-2 h-4 w-4" /> Створити резюме</Link>
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ViewResumesPage;
