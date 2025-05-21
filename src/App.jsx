import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';

// import SemesterCateogry from "./SemesterCateogry";
// import SemOneSubject from "./Subjects & chapters/sem1subject";
// import SemTwoSubject from "./Subjects & chapters/sem2subject";
// import SemThreeSubject from "./Subjects & chapters/sem3subject";
// import SemFourSubject from "./Subjects & chapters/sem4subject";
// import SemFiveSubject from "./Subjects & chapters/sem5subject";
// import SemSixSubject from "./Subjects & chapters/sem6subject";
// import SemSevSubject from "./Subjects & chapters/sem7subject";
// import SemEightSubject from './Subjects & chapters/sem8subject';
// import Chapters from "./Subjects & chapters/chapters";
// import Semchaptervideos from "./semester chapter videos/sem1chaptervideos";
// import Sem2chaptervideos from "./semester chapter videos/sem2chaptervideos";
// import Sem4chaptervideos from "./semester chapter videos/sem4chaptervideos";
// import Sem5chaptervideos from "./semester chapter videos/sem5chaptervideos";
// import Sem6chaptervideos from "./semester chapter videos/sem6chaptervideos";

import LandingPage from "./Landing Page/Landingpage";
import About from "./pages/about";
import Help from "./pages/help";
import Contact from "./pages/contact";
import Profile from "./pages/profile";
import Login from "./pages/login";
import SignupPage from "./pages/signup";
import Layout from "./Landing Page/Layout";
import ErrorBoundary from "./ErrorBoundary";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import Courses from "./pages/admin/Courses";
import Analytics from "./pages/admin/Analytics";
import DeleteProfileButtonq from './pages/DeleteProfileButton';
import AdminVideoManager from "./pages/admin/AdminVideoManager";
import Videos from "./pages/Videos";
import Settings from "./pages/admin/settings";
import PublicCourses from './pages/PublicCourses'; 
import CourseDetail from './pages/CourseDetail';
import Upgrade from './pages/Upgrade';
import AdminPayments from "./pages/admin/AdminPayments";
import PaymentHistory from './pages/PaymentHistory';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    const isAdmin = localStorage.getItem("role") === "admin";
    return isAdmin ? element : <Navigate to="/login" />;
  };
  
  function AuthenticatedRoute({ element }) {
    const isAuthenticated = localStorage.getItem("token");
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  }
  
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const router = createBrowserRouter([
        {
          path: '/',
          element: <Layout />,
          errorElement: <ErrorBoundary />,
          children: [
            { path: '/', element: <LandingPage /> },
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <SignupPage /> },
            { path: '/about', element: <About /> },
            { path: '/help', element: <Help /> },
            { path: '/contact', element: <Contact /> },
            { path: '/settings', element: <Settings />},
            
            { path: '/profile/:id', element: <AuthenticatedRoute element={<Profile />} /> },
            { path: '/delete-profile/:id', element: <AuthenticatedRoute element={<DeleteProfileButtonq />} /> },
            { path: '/videos', element: <AuthenticatedRoute element={<Videos />} /> },
            { path: '/PublicCourses',  element: <AuthenticatedRoute element={<PublicCourses />} /> },
            { path: '/courses/:id', element: <AuthenticatedRoute element={<CourseDetail />} /> },
            { path: '/payment-history', element: <AuthenticatedRoute element={<PaymentHistory />} /> },
            { path: '/upgrade', element: <Upgrade /> },
           
            // ✅ Admin-only Routes (Protected by role)
            { path: '/admin/dashboard', element: <PrivateRoute element={<AdminDashboard />} /> },
            { path: '/admin/AdminUsers', element: <PrivateRoute element={<AdminUsers />} /> },
            { path: '/admin/courses', element: <PrivateRoute element={<Courses />} /> },
            { path: '/admin/Analytics', element: <PrivateRoute element={<Analytics />} /> },
            { path: '/admin/AdminVideoManager', element: <PrivateRoute element={<AdminVideoManager />} /> },
            { path: '/admin/payments', element: <PrivateRoute element={<AdminPayments />} /> },

          ],
        },
      ]);

      const future = {
        v7_startTransition: true, // Opt-in to the React.startTransition feature early
        v7_relativeSplatPath: true,
      };
      

    return <RouterProvider router={router} future={future} />;
}

export default App;
