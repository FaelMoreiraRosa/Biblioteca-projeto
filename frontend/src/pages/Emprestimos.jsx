import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import Mensagem from '../components/Mensagem';

const EMPRESTIMO_VAZIO = { leitor_id: '', livro_id: '', data_devolucao_prevista: '' };

const SELOS_STATUS = {
  'Em aberto': 'selo-info',
  Devolvido: 'selo-sucesso',
  Atrasado: 'selo-alerta'
};

export default function Emprestimos() {
  const { usuario } = useAuth();
  const podeGerenciar = usuario.tipo === 'Administrador' || usuario.tipo === 'Bibliotecário';

  const [emprestimos, setEmprestimos] = useState([]);
  const [livros, setLivros] = useState([]);
  const [leitores, setLeitores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [statusFiltro, setStatusFiltro] = useState('');
  const [leitorFiltro, setLeitorFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState(EMPRESTIMO_VAZIO);
  const [mensagemForm, setMensagemForm] = useState('');

  async function carregarEmprestimos() {
    setCarregando(true);
    setErro('');
    try {
      const params = {};
      if (statusFiltro) params.status = statusFiltro;
      if (podeGerenciar && leitorFiltro) params.leitor_id = leitorFiltro;
      if (dataInicio) params.data_inicio = dataInicio;
      if (dataFim) params.data_fim = dataFim;

      const resposta = await api.get('/emprestimos', { params });
      setEmprestimos(resposta.data);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao carregar empréstimos.');
    } finally {
      setCarregando(false);
    }
  }

  async function carregarListasApoio() {
    if (!podeGerenciar) return;
    try {
      const [livrosResp, leitoresResp] = await Promise.all([
        api.get('/livros', { params: { disponivel: 'true' } }),
        api.get('/leitores', { params: { status: 'Ativo' } })
      ]);
      setLivros(livrosResp.data);
      setLeitores(leitoresResp.data);
    } catch (err) {
      console.error('Erro ao carregar livros/leitores para o formulário', err);
    }
  }

  useEffect(() => {
    carregarEmprestimos();
    carregarListasApoio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function abrirNovo() {
    setFormulario(EMPRESTIMO_VAZIO);
    setMensagemForm('');
    carregarListasApoio();
    setModalAberto(true);
  }

  async function registrar(e) {
    e.preventDefault();
    setMensagemForm('');
    try {
      await api.post('/emprestimos', formulario);
      setModalAberto(false);
      carregarEmprestimos();
    } catch (err) {
      setMensagemForm(err.response?.data?.erro || 'Erro ao registrar empréstimo.');
    }
  }

  async function devolver(emprestimo) {
    if (!window.confirm(`Confirmar devolução do livro "${emprestimo.livro?.titulo || ''}"?`)) return;
    try {
      await api.put(`/emprestimos/${emprestimo.id}/devolucao`);
      carregarEmprestimos();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao registrar devolução.');
    }
  }

  return (
    <div className="pagina">
      <div className="pagina-cabecalho">
        <h1> Empréstimos</h1>
        {podeGerenciar && (
          <button className="btn btn-primario" onClick={abrirNovo}>+ Novo Empréstimo</button>
        )}
      </div>

      <div className="barra-filtros">
        {podeGerenciar && (
          <select value={leitorFiltro} onChange={(e) => setLeitorFiltro(e.target.value)}>
            <option value="">Todos os leitores</option>
            {leitores.map((leitor) => (
              <option key={leitor.id} value={leitor.id}>
                {leitor.nome} ({leitor.cpf_ra})
              </option>
            ))}
          </select>
        )}
        <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="Em aberto">Em aberto</option>
          <option value="Devolvido">Devolvido</option>
          <option value="Atrasado">Atrasado</option>
        </select>
        <label className="filtro-data">
          De: <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </label>
        <label className="filtro-data">
          Até: <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </label>
        <button className="btn btn-secundario" onClick={carregarEmprestimos}>Filtrar</button>
      </div>

      <Mensagem texto={erro} tipo="erro" />

      {carregando ? (
        <p>Carregando empréstimos...</p>
      ) : emprestimos.length === 0 ? (
        <p className="texto-suave">Nenhum empréstimo encontrado.</p>
      ) : (
        <div className="tabela-container">
          <table className="tabela">
            <thead>
              <tr>
                <th>Livro</th>
                {podeGerenciar && <th>Leitor</th>}
                <th>Empréstimo</th>
                <th>Previsão</th>
                <th>Devolução</th>
                <th>Status</th>
                {podeGerenciar && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {emprestimos.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.livro?.titulo || `Livro #${emp.livro_id}`}</td>
                  {podeGerenciar && <td>{emp.leitor?.nome || `Leitor #${emp.leitor_id}`}</td>}
                  <td>{emp.data_emprestimo ? new Date(emp.data_emprestimo).toLocaleDateString('pt-BR') : '—'}</td>
                  <td>{emp.data_devolucao_prevista ? new Date(emp.data_devolucao_prevista).toLocaleDateString('pt-BR') : '—'}</td>
                  <td>{emp.data_devolucao_real ? new Date(emp.data_devolucao_real).toLocaleDateString('pt-BR') : '—'}</td>
                  <td><span className={`selo ${SELOS_STATUS[emp.status] || 'selo-neutro'}`}>{emp.status}</span></td>
                  {podeGerenciar && (
                    <td>
                      {emp.status !== 'Devolvido' && (
                        <button className="btn btn-secundario btn-pequeno" onClick={() => devolver(emp)}>
                          Registrar devolução
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAberto && (
        <Modal titulo="Registrar Empréstimo" onClose={() => setModalAberto(false)}>
          <form onSubmit={registrar}>
            <div className="campo">
              <label>Leitor *</label>
              <select required value={formulario.leitor_id}
                onChange={(e) => setFormulario({ ...formulario, leitor_id: e.target.value })}>
                <option value="">Selecione um leitor ativo...</option>
                {leitores.map((l) => (
                  <option key={l.id} value={l.id}>{l.nome} ({l.cpf_ra})</option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Livro *</label>
              <select required value={formulario.livro_id}
                onChange={(e) => setFormulario({ ...formulario, livro_id: e.target.value })}>
                <option value="">Selecione um livro disponível...</option>
                {livros.map((l) => (
                  <option key={l.id} value={l.id}>{l.titulo} — {l.qtd_disponivel} disponível(is)</option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Data prevista de devolução *</label>
              <input type="date" required value={formulario.data_devolucao_prevista}
                onChange={(e) => setFormulario({ ...formulario, data_devolucao_prevista: e.target.value })} />
            </div>

            <Mensagem texto={mensagemForm} tipo="erro" />

            <button type="submit" className="btn btn-primario btn-full">Registrar empréstimo</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
