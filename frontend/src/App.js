import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import CreatePeriod from './pages/CreatePeriod';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

// Composant pour la redirection conditionnelle de la racine
const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/tasks' : '/login'} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/periods/new" 
          element={
            <ProtectedRoute>
              <CreatePeriod />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks/new" 
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks/:id/edit" 
          element={
            <ProtectedRoute>
              <EditTask />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
