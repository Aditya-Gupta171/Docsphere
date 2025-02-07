import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Editor from '../pages/Editor';
import DocumentList from '../components/editor/DocumentList';
import JoinDocument from '../pages/JoinDocument';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <DocumentList />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/document/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <Editor />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/join/:documentId/:token" element={
          <ProtectedRoute>
            <JoinDocument />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRoutes;