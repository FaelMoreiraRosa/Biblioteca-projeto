import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Livros from './pages/Livros';
import Leitores from './pages/Leitores';
import Usuarios from './pages/Usuarios';
import Emprestimos from './pages/Emprestimos';

const STAFF = ['Administrador', 'Bibliotecário'];
const TODOS = ['Administrador', 'Bibliotecário', 'Leitor'];

export default function App() {
  const { usuario } = useAuth();

  return (
    <>
      <Navbar />
      <main className="conteudo">
        <Routes>
          <Route
            path="/"
            element={usuario ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute perfisPermitidos={TODOS}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/livros"
            element={
              <ProtectedRoute perfisPermitidos={TODOS}>
                <Livros />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leitores"
            element={
              <ProtectedRoute perfisPermitidos={STAFF}>
                <Leitores />
              </ProtectedRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <ProtectedRoute perfisPermitidos={['Administrador']}>
                <Usuarios />
              </ProtectedRoute>
            }
          />

          <Route
            path="/emprestimos"
            element={
              <ProtectedRoute perfisPermitidos={TODOS}>
                <Emprestimos />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
