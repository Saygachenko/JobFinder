
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserCircle, Save, Mail, Phone, Building, Briefcase } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile, loading } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Email is generally not editable, but shown
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [companyName, setCompanyName] = useState(''); // For employers
  const [jobTitle, setJobTitle] = useState(''); // For job seekers
  const [avatarUrl, setAvatarUrl] = useState(''); // For avatar preview

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
      if (user.role === 'employer') {
        setCompanyName(user.companyName || '');
      } else if (user.role === 'job_seeker') {
        setJobTitle(user.jobTitle || '');
      }
    }
  }, [user]);

  const getInitials = (nameStr) => {
    if (!nameStr) return 'U';
    const names = nameStr.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = {
      name,
      phone,
      bio,
      avatarUrl, // This would be an actual URL if uploaded to a service
    };
    if (user.role === 'employer') {
      profileData.companyName = companyName;
    } else if (user.role === 'job_seeker') {
      profileData.jobTitle = jobTitle;
    }

    try {
      await updateUserProfile(profileData);
    } catch (error) {
      toast({ title: 'Помилка', description: 'Не вдалося оновити профіль.', variant: 'destructive' });
    }
  };
  
  const inputClass = "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary";

  if (!user) {
    return <div className="text-center py-12 text-gray-300">Завантаження профілю...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-2xl glassmorphism">
        <CardHeader className="text-center">
          <UserCircle className="mx-auto h-20 w-20 mb-4 text-primary" />
          <CardTitle className="text-3xl font-bold gradient-text">Мій профіль</CardTitle>
          <CardDescription className="text-gray-400">Оновіть свою особисту інформацію.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-32 w-32 border-4 border-primary">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <Input 
                id="avatar" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className={`${inputClass} max-w-xs text-xs`}
              />
               <p className="text-xs text-gray-500">Рекомендований розмір: 200x200px. Макс. 2MB.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-gray-300">Повне ім'я</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-gray-300">Email (не редагується)</Label>
                <Input id="email" type="email" value={email} readOnly disabled className={`${inputClass} opacity-70 cursor-not-allowed`} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-gray-300">Телефон</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 XX XXX XX XX" className={`${inputClass} pl-10`} />
              </div>
            </div>
            
            {user.role === 'employer' && (
              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="text-gray-300">Назва компанії</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Назва вашої компанії" className={`${inputClass} pl-10`} />
                </div>
              </div>
            )}

            {user.role === 'job_seeker' && (
              <div className="space-y-1.5">
                <Label htmlFor="jobTitle" className="text-gray-300">Посада / Спеціалізація</Label>
                 <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Наприклад, Frontend Developer" className={`${inputClass} pl-10`} />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-gray-300">Про себе</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Розкажіть трохи про себе або свою компанію" className={inputClass} rows={4} />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg py-3 text-lg" disabled={loading}>
              <Save className="mr-2 h-5 w-5" /> {loading ? 'Збереження...' : 'Зберегти зміни'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;
