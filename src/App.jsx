
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext.jsx';
import Layout from '@/components/Layout.jsx';

const HomePage = lazy(() => import('@/pages/HomePage.jsx'));
const LoginPage = lazy(() => import('@/pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage.jsx'));
const JobSeekerDashboardPage = lazy(() => import('@/pages/JobSeekerDashboardPage.jsx'));
const EmployerDashboardPage = lazy(() => import('@/pages/EmployerDashboardPage.jsx'));
const CreateResumePage = lazy(() => import('@/pages/CreateResumePage.jsx'));
const ViewResumesPage = lazy(() => import('@/pages/ViewResumesPage.jsx'));
const CreateVacancyPage = lazy(() => import('@/pages/CreateVacancyPage.jsx'));
const ViewVacanciesPage = lazy(() => import('@/pages/ViewVacanciesPage.jsx'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage.jsx'));
const VacancyDetailsPage = lazy(() => import('@/pages/VacancyDetailsPage.jsx'));
const ResumeDetailsPage = lazy(() => import('@/pages/ResumeDetailsPage.jsx'));

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/vacancies" element={<ViewVacanciesPage />} />
              <Route path="/vacancies/:id" element={<VacancyDetailsPage />} />
              
              <Route path="/dashboard/job-seeker" element={<ProtectedRoute role="job_seeker"><JobSeekerDashboardPage /></ProtectedRoute>} />
              <Route path="/resumes/create" element={<ProtectedRoute role="job_seeker"><CreateResumePage /></ProtectedRoute>} />
              <Route path="/resumes/edit/:id" element={<ProtectedRoute role="job_seeker"><CreateResumePage /></ProtectedRoute>} />
              <Route path="/my-resumes" element={<ProtectedRoute role="job_seeker"><ViewResumesPage type="my" /></ProtectedRoute>} />


              <Route path="/dashboard/employer" element={<ProtectedRoute role="employer"><EmployerDashboardPage /></ProtectedRoute>} />
              <Route path="/vacancies/create" element={<ProtectedRoute role="employer"><CreateVacancyPage /></ProtectedRoute>} />
              <Route path="/vacancies/edit/:id" element={<ProtectedRoute role="employer"><CreateVacancyPage /></ProtectedRoute>} />
              <Route path="/my-vacancies" element={<ProtectedRoute role="employer"><ViewVacanciesPage type="my" /></ProtectedRoute>} />
              <Route path="/resumes" element={<ProtectedRoute role="employer"><ViewResumesPage type="all" /></ProtectedRoute>} />
              <Route path="/resumes/:id" element={<ProtectedRoute role="employer"><ResumeDetailsPage /></ProtectedRoute>} />

              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
