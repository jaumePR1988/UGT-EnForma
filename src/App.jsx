import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { courseService } from './services/courseService';
import { studentService } from './services/studentService';
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ActiveCourses from './pages/ActiveCourses';
import CreateCourse from './pages/CreateCourse';
import Students from './pages/Students';
import Certificates from './pages/Certificates';
import Reports from './pages/Reports';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import EnrollStudent from './pages/EnrollStudent';
import PublicRegistration from './pages/PublicRegistration';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Centralized State
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadCourses();
    loadStudents();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };

  const handleSplashFinish = () => {
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/dashboard');
  };

  const navigateTo = (viewName) => {
    switch (viewName) {
      case 'splash': navigate('/'); break;
      case 'login': navigate('/login'); break;
      case 'dashboard': navigate('/dashboard'); break;
      case 'create-course': navigate('/create-course'); break;
      case 'active-courses': navigate('/courses'); break;
      case 'students': navigate('/students'); break;
      case 'enroll-student': navigate('/enroll-internal'); break;
      case 'certificates': navigate('/certificates'); break;
      case 'reports': navigate('/reports'); break;
      case 'calendar': navigate('/calendar'); break;
      case 'settings': navigate('/settings'); break;
      default: navigate('/dashboard');
    }
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  const handleAddCourse = async (newCourse) => {
    try {
      await courseService.addCourse(newCourse);
      await loadCourses();
      navigate('/courses');
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      await studentService.registerStudent(studentData);
      await loadStudents();
      navigate('/students');
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<SplashScreen onFinish={handleSplashFinish} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/dashboard" element={
        <Dashboard
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          courses={courses}
          students={students}
        />
      } />
      <Route path="/create-course" element={
        <CreateCourse
          onBack={() => navigate('/dashboard')}
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          onSave={handleAddCourse}
        />
      } />
      <Route path="/courses" element={
        <ActiveCourses
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          courses={courses}
        />
      } />
      <Route path="/students" element={
        <Students
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          students={students}
        />
      } />
      <Route path="/enroll-internal" element={
        <EnrollStudent
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          courses={courses}
          onSave={handleAddStudent}
        />
      } />
      <Route path="/certificates" element={
        <Certificates
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
        />
      } />
      <Route path="/reports" element={
        <Reports
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          courses={courses}
          students={students}
        />
      } />
      <Route path="/calendar" element={
        <Calendar
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          courses={courses}
        />
      } />
      <Route path="/settings" element={
        <Settings
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
        />
      } />

      {/* Public Route */}
      <Route path="/public/enroll/:courseId" element={<PublicRegistration />} />
    </Routes>
  );
}

export default App;
