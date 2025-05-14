
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { motion } from 'framer-motion';
import { FilePlus2, Save, Trash2, PlusCircle } from 'lucide-react';

const CreateResumePage = () => {
  const { id: resumeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [education, setEducation] = useState([{ institution: '', degree: '', year: '' }]);
  const [experience, setExperience] = useState([{ company: '', position: '', years: '', description: '' }]);
  const [skills, setSkills] = useState(''); // Comma-separated string
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (resumeId) {
      const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      const existingResume = resumes.find(r => r.id === resumeId && r.userId === user.id);
      if (existingResume) {
        setTitle(existingResume.title);
        setSummary(existingResume.summary);
        setEducation(existingResume.education);
        setExperience(existingResume.experience);
        setSkills(existingResume.skills.join(', '));
        setContactEmail(existingResume.contactEmail);
        setContactPhone(existingResume.contactPhone);
      } else {
        toast({ title: 'Помилка', description: 'Резюме не знайдено або у вас немає доступу.', variant: 'destructive' });
        navigate('/my-resumes');
      }
    }
  }, [resumeId, user, navigate, toast]);

  const handleAddItem = (section, setSection) => {
    if (section === 'education') {
      setSection([...education, { institution: '', degree: '', year: '' }]);
    } else if (section === 'experience') {
      setSection([...experience, { company: '', position: '', years: '', description: '' }]);
    }
  };

  const handleRemoveItem = (index, section, setSection) => {
    const list = [...section];
    list.splice(index, 1);
    setSection(list);
  };

  const handleInputChange = (index, event, section, setSection) => {
    const { name, value } = event.target;
    const list = [...section];
    list[index][name] = value;
    setSection(list);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !summary || !skills || !contactEmail) {
      toast({ title: 'Помилка валідації', description: 'Будь ласка, заповніть усі обов\'язкові поля.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    const resumeData = {
      id: resumeId || Date.now().toString(),
      userId: user.id,
      userName: user.name,
      title,
      summary,
      education,
      experience,
      skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      contactEmail,
      contactPhone,
      createdAt: resumeId ? undefined : new Date().toISOString(), 
      updatedAt: new Date().toISOString(),
    };
    
    setTimeout(() => {
      let resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      if (resumeId) {
        resumes = resumes.map(r => r.id === resumeId ? { ...r, ...resumeData, updatedAt: new Date().toISOString() } : r);
      } else {
        resumes.push(resumeData);
      }
      localStorage.setItem('resumes', JSON.stringify(resumes));

      toast({ title: `Резюме ${resumeId ? 'оновлено' : 'створено'}`, description: 'Ваше резюме успішно збережено.' });
      setIsSubmitting(false);
      navigate('/my-resumes');
    }, 1000);
  };

  const inputClass = "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-2xl glassmorphism">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FilePlus2 className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold gradient-text">{resumeId ? 'Редагувати резюме' : 'Створити резюме'}</CardTitle>
              <CardDescription className="text-gray-400">Заповніть інформацію про себе, щоб привернути увагу роботодавців.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300 text-lg">Назва резюме / Бажана посада*</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Наприклад, Frontend Developer" required className={inputClass} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary" className="text-gray-300 text-lg">Короткий опис / Про себе*</Label>
              <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Розкажіть про свої ключові навички та кар'єрні цілі" required className={inputClass} rows={4}/>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-gray-300 text-lg">Контактний Email*</Label>
              <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="your.email@example.com" required className={inputClass} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-gray-300 text-lg">Контактний телефон</Label>
              <Input id="contactPhone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+380 XX XXX XX XX" className={inputClass} />
            </div>

            <section>
              <h3 className="text-xl font-semibold mb-3 text-gray-200">Освіта</h3>
              {education.map((edu, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y:10 }} animate={{ opacity:1, y:0 }} transition={{delay: index * 0.1}}
                  className="space-y-3 p-4 border border-slate-600 rounded-md mb-3 relative"
                >
                  <Input name="institution" value={edu.institution} onChange={(e) => handleInputChange(index, e, education, setEducation)} placeholder="Навчальний заклад" className={inputClass} />
                  <Input name="degree" value={edu.degree} onChange={(e) => handleInputChange(index, e, education, setEducation)} placeholder="Спеціальність / Ступінь" className={inputClass} />
                  <Input name="year" value={edu.year} onChange={(e) => handleInputChange(index, e, education, setEducation)} placeholder="Рік закінчення" className={inputClass} />
                  {education.length > 1 && (
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveItem(index, education, setEducation)} className="absolute top-2 right-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
              <Button type="button" variant="outline" onClick={() => handleAddItem('education', setEducation)} className="border-primary text-primary hover:bg-primary/10">
                <PlusCircle className="mr-2 h-4 w-4" /> Додати освіту
              </Button>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 text-gray-200">Досвід роботи</h3>
              {experience.map((exp, index) => (
                 <motion.div 
                  key={index}
                  initial={{ opacity: 0, y:10 }} animate={{ opacity:1, y:0 }} transition={{delay: index * 0.1}}
                  className="space-y-3 p-4 border border-slate-600 rounded-md mb-3 relative"
                >
                  <Input name="company" value={exp.company} onChange={(e) => handleInputChange(index, e, experience, setExperience)} placeholder="Компанія" className={inputClass} />
                  <Input name="position" value={exp.position} onChange={(e) => handleInputChange(index, e, experience, setExperience)} placeholder="Посада" className={inputClass} />
                  <Input name="years" value={exp.years} onChange={(e) => handleInputChange(index, e, experience, setExperience)} placeholder="Роки роботи (наприклад, 2020-2023)" className={inputClass} />
                  <Textarea name="description" value={exp.description} onChange={(e) => handleInputChange(index, e, experience, setExperience)} placeholder="Опис обов'язків та досягнень" className={inputClass} />
                  {experience.length > 1 && (
                     <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveItem(index, experience, setExperience)} className="absolute top-2 right-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
              <Button type="button" variant="outline" onClick={() => handleAddItem('experience', setExperience)} className="border-primary text-primary hover:bg-primary/10">
                <PlusCircle className="mr-2 h-4 w-4" /> Додати досвід
              </Button>
            </section>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-gray-300 text-lg">Навички*</Label>
              <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Введіть навички через кому (наприклад, React, JavaScript, HTML, CSS)" required className={inputClass} />
              <p className="text-xs text-gray-500">Розділяйте навички комою.</p>
            </div>
            
            {/* Placeholder for template selection - future feature */}
            {/* <div className="space-y-2">
              <Label htmlFor="template" className="text-gray-300 text-lg">Шаблон резюме</Label>
              <Select>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Оберіть шаблон" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-gray-100">
                  <SelectItem value="classic">Класичний</SelectItem>
                  <SelectItem value="modern">Сучасний</SelectItem>
                  <SelectItem value="creative">Креативний</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg py-3 text-lg" disabled={isSubmitting}>
              <Save className="mr-2 h-5 w-5" /> {isSubmitting ? (resumeId ? 'Збереження...' : 'Створення...') : (resumeId ? 'Зберегти зміни' : 'Створити резюме')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateResumePage;
