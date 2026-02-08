import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { courseService } from './services/courseService';
import { studentService } from './services/studentService';
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// import ActiveCourses from './pages/ActiveCourses';
import { Courses } from './pages/Courses';
import CreateCourse from './pages/CreateCourse';
import Students from './pages/Students';
import Certificates from './pages/Certificates';
import Reports from './pages/Reports';
import TeacherPortal from './pages/TeacherPortal';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import EnrollStudent from './pages/EnrollStudent';
import PublicRegistration from './pages/PublicRegistration';
import PublicAttendance from './pages/PublicAttendance';
import SessionFeedback from './pages/public/SessionFeedback';
import CourseFeedback from './pages/public/CourseFeedback';

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
    if (viewName.startsWith('edit-course/') || viewName.startsWith('edit-student/')) {
      navigate('/' + viewName);
      return;
    }

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
      case 'teachers': navigate('/teachers'); break;
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
      throw error; // Rethrow so component knows it failed
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      await studentService.registerStudent(studentData);
      await loadStudents();
      navigate('/students');
    } catch (error) {
      console.error("Error adding student:", error);
      alert(error.message);
      throw error;
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
          onBack={() => navigate('/courses')}
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          onSave={handleAddCourse}
        />
      } />
      <Route path="/edit-course/:courseId" element={
        <CreateCourse
          onBack={() => navigate('/courses')}
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          onSave={async (updatedCourse) => {
            await courseService.updateCourse(updatedCourse.id, updatedCourse);
            await loadCourses();
            navigate('/courses');
          }}
          isEditMode={true}
        />
      } />
      <Route path="/courses" element={
        <Courses
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
        />
      } />
      <Route path="/students" element={
        <Students
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          students={students}
          courses={courses}
          refreshStudents={loadStudents}
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
      <Route path="/edit-student/:studentId" element={
        <EnrollStudent
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          courses={courses}
          onSave={async (updatedStudent) => {
            await studentService.updateStudent(updatedStudent.id, updatedStudent);
            await loadStudents();
            navigate('/students');
          }}
          isEditMode={true}
        />
      } />
      <Route path="/certificates" element={
        <Certificates
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
          courses={courses}
          students={students}
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
      <Route path="/teachers" element={
        <TeacherPortal
          onNavigate={navigateTo}
          toggleDarkMode={toggleDarkMode}
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

      {/* Public Routes */}
      <Route path="/public/register/:courseId" element={<PublicRegistration />} />
      <Route path="/public/attendance/:courseId" element={<PublicAttendance />} />
      <Route path="/public/feedback/session/:sessionId" element={<SessionFeedback />} />
      <Route path="/public/feedback/course/:courseId" element={<CourseFeedback />} />
    </Routes>
  );
}

export default App;
