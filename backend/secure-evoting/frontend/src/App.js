import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar        from './components/Navbar';
import Footer        from './components/Footer';

import Home          from './pages/Home';
import Register      from './pages/Register';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Elections     from './pages/Elections';
import VotePage      from './pages/VotePage';
import VerifyVote    from './pages/VerifyVote';
import Results       from './pages/Results';
import ResultDetail  from './pages/ResultDetail';
import AdminDashboard     from './pages/admin/AdminDashboard';
import AdminElections     from './pages/admin/AdminElections';
import AdminVoters        from './pages/admin/AdminVoters';
import AdminCandidates    from './pages/admin/AdminCandidates';
import NotFound      from './pages/NotFound';

// Route guard — voter must be logged in
const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"/></div>;
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

// Route guard — must be admin
const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"/></div>;
  if (!isLoggedIn()) return <Navigate to="/login" />;
  if (!isAdmin())    return <Navigate to="/dashboard" />;
  return children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <main style={{ minHeight: '80vh' }}>
      <Routes>
        {/* Public */}
        <Route path="/"              element={<Home />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/results"       element={<Results />} />
        <Route path="/results/:id"   element={<ResultDetail />} />

        {/* Voter Protected */}
        <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/elections"       element={<PrivateRoute><Elections /></PrivateRoute>} />
        <Route path="/vote/:id"        element={<PrivateRoute><VotePage /></PrivateRoute>} />
        <Route path="/verify"          element={<PrivateRoute><VerifyVote /></PrivateRoute>} />

        {/* Admin Protected */}
        <Route path="/admin"                element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/elections"      element={<AdminRoute><AdminElections /></AdminRoute>} />
        <Route path="/admin/voters"         element={<AdminRoute><AdminVoters /></AdminRoute>} />
        <Route path="/admin/candidates/:id" element={<AdminRoute><AdminCandidates /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </Router>
    </AuthProvider>
  );
}

export default App;
