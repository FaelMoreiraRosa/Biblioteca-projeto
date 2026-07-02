import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  if (!usuario) return null;

  function sair() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="navbar-marca"> Biblioteca</div>

      <nav className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          Início
        </NavLink>
        <NavLink to="/livros" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          Livros
        </NavLink>
        {(usuario.tipo === 'Administrador' || usuario.tipo === 'Bibliotecário') && (
          <NavLink to="/leitores" className={({ isActive }) => (isActive ? 'ativo' : '')}>
            Leitores
          </NavLink>
        )}
        {usuario.tipo === 'Administrador' && (
          <NavLink to="/usuarios" className={({ isActive }) => (isActive ? 'ativo' : '')}>
            Usuários
          </NavLink>
        )}
        <NavLink to="/emprestimos" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          Empréstimos
        </NavLink>
      </nav>

      <div className="navbar-usuario">
        <span>
          {usuario.nome} <small>({usuario.tipo})</small>
        </span>
        <button className="btn btn-perigo" onClick={sair}>
          Sair
        </button>
      </div>
    </header>
  );
}
