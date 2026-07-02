import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Mensagem from '../components/Mensagem';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fazer login.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="tela-login">
      <div className="cartao-login">
        <h1 className="titulo-app"> Biblioteca</h1>
        <p className="subtitulo-app">Sistema de Gerenciamento</p>

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@biblioteca.com"
            />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
            />
          </div>

          <button type="submit" className="btn btn-primario btn-full" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <Mensagem texto={erro} tipo="erro" />

        <div className="login-dica">
          <strong>Contas de demonstração</strong> (senha: <code>123456</code>)
          <ul>
            <li>admin@biblioteca.com — Administrador</li>
            <li>bibliotecario@biblioteca.com — Bibliotecário</li>
            <li>ana.souza@aluno.com — Leitor</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
