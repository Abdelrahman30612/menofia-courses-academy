import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AboutSection from './components/AboutSection';
import CoursesSection from './components/CoursesSection';
import Footer from './components/Footer';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import RegistrationModal from './components/RegistrationModal';
import LoadingAnimation from './components/LoadingAnimation';
import { Course, TeamData, RegistrationData, Accreditation } from './types';
import { fetchCourses, fetchTeamData, submitRegistration, fetchAccreditations } from './utils/api';

export type Tab = 'home' | 'courses' | 'team';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [courses, setCourses] = useState<Course[]>([]);
  const [teamData, setTeamData] = useState<TeamData>({ team: [], volunteers: [] });
  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [coursesData, teamDataResult, accreditationsData] = await Promise.all([
          fetchCourses(),
          fetchTeamData(),
          fetchAccreditations(),
        ]);
        setCourses(coursesData);
        setTeamData(teamDataResult);
        setAccreditations(accreditationsData);
      } catch (err) {
        console.error("Failed to load initial data:", err);
        setError("فشل تحميل بعض البيانات. قد يتم عرض بيانات احتياطية.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRegisterClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  const handleFormSubmit = async (formData: Omit<RegistrationData, 'courseTitle'>) => {
    if (!selectedCourse) return;
    const registrationData: RegistrationData = {
        ...formData,
        courseTitle: selectedCourse.title,
    };
    await submitRegistration(registrationData);
  };


  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8 pt-24 flex-grow">
        {error && <p className="text-center text-yellow-500 mb-4">{error}</p>}
        {activeTab === 'home' && (
          <>
            <AboutSection accreditations={accreditations} />
            <ContactSection />
          </>
        )}
        {activeTab === 'courses' && <CoursesSection courses={courses} onRegisterClick={handleRegisterClick} />}
        {activeTab === 'team' && <TeamSection data={teamData} />}
      </main>
      <Footer />

      {selectedCourse && (
        <RegistrationModal 
            course={selectedCourse} 
            onClose={handleCloseModal}
            onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default App;