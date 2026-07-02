import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ perfisPermitidos, children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (perfisPermitidos && !perfisPermitidos.includes(usuario.tipo)) {
    return (
      <div className="aviso-acesso-negado">
        <h2>Acesso negado</h2>
        <p>Seu perfil ({usuario.tipo}) não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return children;
}
