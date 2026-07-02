import { createContext, useContext, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipo');
    const nome = localStorage.getItem('nome');
    const id = localStorage.getItem('id');
    return token ? { token, tipo, nome, id } : null;
  });

  async function login(email, senha) {
    const resposta = await api.post('/auth/login', { email, senha });
    const { token, tipo, nome, id } = resposta.data;

    localStorage.setItem('token', token);
    localStorage.setItem('tipo', tipo);
    localStorage.setItem('nome', nome);
    localStorage.setItem('id', id);

    setUsuario({ token, tipo, nome, id });
    return tipo;
  }

  function logout() {
    localStorage.clear();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
