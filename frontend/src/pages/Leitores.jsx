import { useEffect, useState } from 'react';
import api from '../api/api';
import Modal from '../components/Modal';
import Mensagem from '../components/Mensagem';

const LEITOR_VAZIO = { nome: '', email: '', cpf_ra: '', telefone: '', endereco: '', senha: '' };

export default function Leitores() {
  const [leitores, setLeitores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(LEITOR_VAZIO);
  const [mensagemForm, setMensagemForm] = useState('');

  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [leitorHistorico, setLeitorHistorico] = useState(null);

  async function carregarLeitores() {
    setCarregando(true);
    setErro('');
    try {
      const params = {};
      if (busca) params.busca = busca;
      if (statusFiltro) params.status = statusFiltro;

      const resposta = await api.get('/leitores', { params });
      setLeitores(resposta.data);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao carregar leitores.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarLeitores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function abrirNovo() {
    setEditandoId(null);
    setFormulario(LEITOR_VAZIO);
    setMensagemForm('');
    setModalAberto(true);
  }

  function abrirEdicao(leitor) {
    setEditandoId(leitor.id);
    setFormulario({
      nome: leitor.nome || '',
      email: leitor.email || '',
      cpf_ra: leitor.cpf_ra || '',
      telefone: leitor.telefone || '',
      endereco: leitor.endereco || '',
      senha: ''
    });
    setMensagemForm('');
    setModalAberto(true);
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagemForm('');
    try {
      const dados = { ...formulario };
      if (!dados.senha) delete dados.senha;

      if (editandoId) {
        await api.put(`/leitores/${editandoId}`, dados);
      } else {
        await api.post('/leitores', dados);
      }
      setModalAberto(false);
      carregarLeitores();
    } catch (err) {
      setMensagemForm(err.response?.data?.erro || 'Erro ao salvar leitor.');
    }
  }

  async function alternarStatus(leitor) {
    try {
      await api.patch(`/leitores/${leitor.id}/inativar`);
      carregarLeitores();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao alterar status do leitor.');
    }
  }

  async function excluir(leitor) {
    if (!window.confirm(`Excluir o leitor "${leitor.nome}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await api.delete(`/leitores/${leitor.id}`);
      carregarLeitores();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir leitor.');
    }
  }

  async function verHistorico(leitor) {
    setLeitorHistorico(leitor);
    setHistoricoAberto(true);
    try {
      const resposta = await api.get(`/leitores/${leitor.id}/emprestimos`);
      setHistorico(resposta.data);
    } catch (err) {
      console.error(err);
      setHistorico([]);
    }
  }

  return (
    <div className="pagina">
      <div className="pagina-cabecalho">
        <h1> Leitores</h1>
        <button className="btn btn-primario" onClick={abrirNovo}>+ Novo Leitor</button>
      </div>

      <div className="barra-filtros">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF/RA..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="Ativo">Ativos</option>
          <option value="Inativo">Inativos</option>
        </select>
        <button className="btn btn-secundario" onClick={carregarLeitores}>Filtrar</button>
      </div>

      <Mensagem texto={erro} tipo="erro" />

      {carregando ? (
        <p>Carregando leitores...</p>
      ) : leitores.length === 0 ? (
        <p className="texto-suave">Nenhum leitor encontrado.</p>
      ) : (
        <div className="tabela-container">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF/RA</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {leitores.map((leitor) => (
                <tr key={leitor.id}>
                  <td>{leitor.nome}</td>
                  <td>{leitor.cpf_ra}</td>
                  <td>{leitor.email}</td>
                  <td>{leitor.telefone || '—'}</td>
                  <td>
                    <span className={`selo ${leitor.status === 'Ativo' ? 'selo-sucesso' : 'selo-alerta'}`}>
                      {leitor.status}
                    </span>
                  </td>
                  <td className="tabela-acoes">
                    <button className="btn btn-secundario btn-pequeno" onClick={() => abrirEdicao(leitor)}>Editar</button>
                    <button className="btn btn-secundario btn-pequeno" onClick={() => verHistorico(leitor)}>Histórico</button>
                    <button className="btn btn-alerta btn-pequeno" onClick={() => alternarStatus(leitor)}>
                      {leitor.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                    </button>
                    <button className="btn btn-perigo btn-pequeno" onClick={() => excluir(leitor)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAberto && (
        <Modal titulo={editandoId ? 'Editar Leitor' : 'Cadastrar Leitor'} onClose={() => setModalAberto(false)}>
          <form onSubmit={salvar}>
            <div className="campo">
              <label>Nome completo *</label>
              <input required value={formulario.nome}
                onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })} />
            </div>
            <div className="grid-2">
              <div className="campo">
                <label>E-mail *</label>
                <input type="email" required value={formulario.email}
                  onChange={(e) => setFormulario({ ...formulario, email: e.target.value })} />
              </div>
              <div className="campo">
                <label>CPF ou RA *</label>
                <input required value={formulario.cpf_ra}
                  onChange={(e) => setFormulario({ ...formulario, cpf_ra: e.target.value })} />
              </div>
            </div>
            <div className="grid-2">
              <div className="campo">
                <label>Telefone</label>
                <input value={formulario.telefone}
                  onChange={(e) => setFormulario({ ...formulario, telefone: e.target.value })} />
              </div>
              <div className="campo">
                <label>Senha {editandoId ? '(deixe em branco para manter)' : '(padrão: CPF/RA)'}</label>
                <input type="password" value={formulario.senha}
                  onChange={(e) => setFormulario({ ...formulario, senha: e.target.value })} />
              </div>
            </div>
            <div className="campo">
              <label>Endereço</label>
              <input value={formulario.endereco}
                onChange={(e) => setFormulario({ ...formulario, endereco: e.target.value })} />
            </div>

            <Mensagem texto={mensagemForm} tipo="erro" />

            <button type="submit" className="btn btn-primario btn-full">
              {editandoId ? 'Salvar alterações' : 'Cadastrar leitor'}
            </button>
          </form>
        </Modal>
      )}

      {historicoAberto && (
        <Modal titulo={`Histórico de ${leitorHistorico?.nome}`} onClose={() => setHistoricoAberto(false)}>
          {historico.length === 0 ? (
            <p className="texto-suave">Nenhum empréstimo registrado para este leitor.</p>
          ) : (
            <table className="tabela">
              <thead>
                <tr>
                  <th>Livro</th>
                  <th>Empréstimo</th>
                  <th>Previsão</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((h) => (
                  <tr key={h.id}>
                    <td>{h.livro?.titulo || `#${h.livro_id}`}</td>
                    <td>{h.data_emprestimo ? new Date(h.data_emprestimo).toLocaleDateString('pt-BR') : '—'}</td>
                    <td>{h.data_devolucao_prevista ? new Date(h.data_devolucao_prevista).toLocaleDateString('pt-BR') : '—'}</td>
                    <td><span className="selo selo-neutro">{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal>
      )}
    </div>
  );
}
