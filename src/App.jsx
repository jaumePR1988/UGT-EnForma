import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { courseService } from './services/courseService';
import { studentService } from './services/studentService';
import { notificationService } from './services/notificationService';
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
import Users from './pages/Users';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import EnrollStudent from './pages/EnrollStudent';
import PublicRegistration from './pages/PublicRegistration';
import PublicAttendance from './pages/PublicAttendance';
import SessionFeedback from './pages/public/SessionFeedback';
import CourseFeedback from './pages/public/CourseFeedback';
import StudentPortal from './pages/public/StudentPortal';
import { useNotifications } from './context/NotificationContext';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

function App() {
  const { showNotification } = useNotifications();
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("App state check:", {
    userId: user?.uid,
    role,
    authLoading,
    path: location.pathname
  });

  // Centralized State
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (user) {
      loadCourses();
      loadStudents();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const loadCourses = async () => {
    try {
      let data = await courseService.getCourses();

      // If teacher, filter only their courses
      if (role === 'teacher' && user) {
        // We match by instructor name (simple match for now as per current data structure)
        // In a more robust system, we'd use instructorId
        data = data.filter(c =>
          c.instructor?.toLowerCase() === user.displayName?.toLowerCase() ||
          c.instructor?.toLowerCase() === user.email?.split('@')[0].toLowerCase()
        );
      }

      console.log("Loaded courses:", data?.length);
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
      showNotification("Error al cargar los cursos", "error");
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
      case 'users': navigate('/users'); break;
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

      // Trigger automatic welcome email
      const course = courses.find(c => c.id === studentData.courseId);
      if (course) {
        await notificationService.sendWelcomeEmail(studentData, course);
      }

      await loadStudents();
      navigate('/students');
    } catch (error) {
      console.error("Error adding student:", error);
      showNotification(error.message, "error");
      throw error;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<SplashScreen onFinish={handleSplashFinish} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      {/* Protected Layout Routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout
            currentView={location.pathname.replace('/', '') || 'dashboard'}
            onNavigate={navigateTo}
          />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={
          <Dashboard
            onNavigate={navigateTo}
            toggleDarkMode={toggleDarkMode}
            courses={courses}
            students={students}
          />
        } />
        <Route path="/create-course" element={
          <ProtectedRoute requiredRole="admin">
            <CreateCourse
              onBack={() => navigate('/courses')}
              onNavigate={navigateTo}
              toggleDarkMode={toggleDarkMode}
              onSave={handleAddCourse}
            />
          </ProtectedRoute>
        } />
        <Route path="/edit-course/:courseId" element={
          <ProtectedRoute requiredRole="admin">
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
          </ProtectedRoute>
        } />
        <Route path="/courses" element={
          <Courses
            onNavigate={navigateTo}
            toggleDarkMode={toggleDarkMode}
          />
        } />
        <Route path="/students" element={
          <ProtectedRoute requiredRole="admin">
            <Students
              onNavigate={navigateTo}
              toggleDarkMode={toggleDarkMode}
              students={students}
              courses={courses}
              refreshStudents={loadStudents}
            />
          </ProtectedRoute>
        } />
        <Route path="/enroll-internal" element={
          <ProtectedRoute requiredRole="admin">
            <EnrollStudent
              onNavigate={navigateTo}
              toggleDarkMode={toggleDarkMode}
              courses={courses}
              onSave={handleAddStudent}
            />
          </ProtectedRoute>
        } />
        <Route path="/edit-student/:studentId" element={
          <ProtectedRoute requiredRole="admin">
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
          </ProtectedRoute>
        } />
        <Route path="/certificates" element={
          <ProtectedRoute requiredRole="admin">
            <Certificates
              onNavigate={navigateTo}
              toggleDarkMode={toggleDarkMode}
              courses={courses}
              students={students}
            />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute requiredRole="admin">
            <Reports
              onNavigate={navigateTo}
              toggleDarkMode={toggleDarkMode}
              courses={courses}
              students={students}
            />
          </ProtectedRoute>
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
          <ProtectedRoute requiredRole="admin">
            <Settings
              onNavigate={navigateTo}
              toggleDarkMode={toggleDarkMode}
            />
          </ProtectedRoute>
        } />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <Users
                onNavigate={navigateTo}
              />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Public Routes */}
      <Route path="/public/register/:courseId" element={<PublicRegistration />} />
      <Route path="/public/enroll/:courseId" element={<PublicRegistration />} />
      <Route path="/public/attendance/:courseId" element={<PublicAttendance />} />
      <Route path="/public/feedback/session/:sessionId" element={<SessionFeedback />} />
      <Route path="/public/feedback/course/:courseId" element={<CourseFeedback />} />
      <Route path="/portal" element={<StudentPortal />} />
      <Route path="/alumnes" element={<StudentPortal />} />
    </Routes>
  );
}

export default App;
