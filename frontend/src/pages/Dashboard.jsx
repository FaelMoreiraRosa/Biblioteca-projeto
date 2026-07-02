import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [resumo, setResumo] = useState({ livros: 0, leitores: 0, emprestimosAbertos: 0, atrasados: 0 });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [livrosResp, emprestimosResp] = await Promise.all([
          api.get('/livros'),
          api.get('/emprestimos')
        ]);

        let leitores = 0;
        if (usuario.tipo !== 'Leitor') {
          const leitoresResp = await api.get('/leitores');
          leitores = leitoresResp.data.length;
        }

        const emprestimosAbertos = emprestimosResp.data.filter((e) => e.status === 'Em aberto').length;
        const atrasados = emprestimosResp.data.filter((e) => e.status === 'Atrasado').length;

        setResumo({ livros: livrosResp.data.length, leitores, emprestimosAbertos, atrasados });
      } catch (err) {
        console.error('Erro ao carregar resumo do dashboard', err);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [usuario.tipo]);

  return (
    <div className="pagina">
      <h1>Bem-vindo(a), {usuario.nome}! </h1>
      <p className="texto-suave">Perfil: {usuario.tipo}</p>

      {carregando ? (
        <p>Carregando resumo...</p>
      ) : (
        <div className="grid-cartoes-resumo">
          <div className="cartao-resumo cartao-terracota">
            <span className="cartao-resumo-numero">{resumo.livros}</span>
            <span className="cartao-resumo-label">Livros no acervo</span>
          </div>

          {usuario.tipo !== 'Leitor' && (
            <div className="cartao-resumo cartao-marrom">
              <span className="cartao-resumo-numero">{resumo.leitores}</span>
              <span className="cartao-resumo-label">Leitores cadastrados</span>
            </div>
          )}

          <div className="cartao-resumo cartao-oliva">
            <span className="cartao-resumo-numero">{resumo.emprestimosAbertos}</span>
            <span className="cartao-resumo-label">Empréstimos em aberto</span>
          </div>

          <div className="cartao-resumo cartao-alerta">
            <span className="cartao-resumo-numero">{resumo.atrasados}</span>
            <span className="cartao-resumo-label">Empréstimos atrasados</span>
          </div>
        </div>
      )}

      <div className="atalhos">
        <Link to="/livros" className="btn btn-secundario"> Ver livros</Link>
        {usuario.tipo !== 'Leitor' && <Link to="/leitores" className="btn btn-secundario"> Ver leitores</Link>}
        {usuario.tipo === 'Administrador' && <Link to="/usuarios" className="btn btn-secundario"> Usuários do sistema</Link>}
        <Link to="/emprestimos" className="btn btn-secundario"> Ver empréstimos</Link>
      </div>
    </div>
  );
}
