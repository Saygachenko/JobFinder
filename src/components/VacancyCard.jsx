
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Edit, Trash2, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const VacancyCard = ({ vacancy, onEdit, onDelete, isOwner }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="h-full"
  >
    <Card className="bg-slate-800/70 border-slate-700 text-gray-100 shadow-lg hover:shadow-primary/30 transition-shadow duration-300 glassmorphism h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl gradient-text">{vacancy.title}</CardTitle>
            <CardDescription className="text-gray-400">{vacancy.companyName}</CardDescription>
          </div>
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-sm text-gray-300 line-clamp-3">{vacancy.description}</p>
        <div className="flex items-center text-sm text-gray-400">
          <MapPin className="h-4 w-4 mr-1 text-yellow-400" /> {vacancy.location}
        </div>
        {vacancy.salary && (
          <div className="flex items-center text-sm text-gray-400">
            <DollarSign className="h-4 w-4 mr-1 text-green-400" /> {vacancy.salary}
          </div>
        )}
        <div className="text-xs text-gray-500 pt-1">
          Опубліковано: {new Date(vacancy.postedDate).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-end">
        <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
          <Link to={`/vacancies/${vacancy.id}`}><Eye className="mr-2 h-4 w-4" /> Детальніше</Link>
        </Button>
        {isOwner && (
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
                    Цю дію неможливо скасувати. Це остаточно видалить вашу вакансію.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-slate-700">Скасувати</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Видалити</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardFooter>
    </Card>
  </motion.div>
);

export default VacancyCard;
