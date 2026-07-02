import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import Mensagem from '../components/Mensagem';

const LIVRO_VAZIO = {
  titulo: '', autor: '', editora: '', ano_publicacao: '', categoria: '', isbn: '', qtd_total: 1
};

export default function Livros() {
  const { usuario } = useAuth();
  const podeGerenciar = usuario.tipo === 'Administrador' || usuario.tipo === 'Bibliotecário';

  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // filtros
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [disponivel, setDisponivel] = useState('');

  // modal / formulário
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(LIVRO_VAZIO);
  const [mensagemForm, setMensagemForm] = useState('');

  async function carregarLivros() {
    setCarregando(true);
    setErro('');
    try {
      const params = {};
      if (busca) params.busca = busca;
      if (categoria) params.categoria = categoria;
      if (disponivel) params.disponivel = disponivel;

      const resposta = await api.get('/livros', { params });
      setLivros(resposta.data);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao carregar livros.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarLivros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function abrirNovo() {
    setEditandoId(null);
    setFormulario(LIVRO_VAZIO);
    setMensagemForm('');
    setModalAberto(true);
  }

  function abrirEdicao(livro) {
    setEditandoId(livro.id);
    setFormulario({
      titulo: livro.titulo || '',
      autor: livro.autor || '',
      editora: livro.editora || '',
      ano_publicacao: livro.ano_publicacao || '',
      categoria: livro.categoria || '',
      isbn: livro.isbn || '',
      qtd_total: livro.qtd_total ?? 1
    });
    setMensagemForm('');
    setModalAberto(true);
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagemForm('');
    try {
      if (editandoId) {
        await api.put(`/livros/${editandoId}`, formulario);
      } else {
        await api.post('/livros', formulario);
      }
      setModalAberto(false);
      carregarLivros();
    } catch (err) {
      setMensagemForm(err.response?.data?.erro || 'Erro ao salvar livro.');
    }
  }

  async function excluir(livro) {
    if (!window.confirm(`Excluir o livro "${livro.titulo}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await api.delete(`/livros/${livro.id}`);
      carregarLivros();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir livro.');
    }
  }

  return (
    <div className="pagina">
      <div className="pagina-cabecalho">
        <h1> Livros</h1>
        {podeGerenciar && (
          <button className="btn btn-primario" onClick={abrirNovo}>
            + Novo Livro
          </button>
        )}
      </div>

      <div className="barra-filtros">
        <input
          type="text"
          placeholder="Buscar por título, autor ou ISBN..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <input
          type="text"
          placeholder="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
        <select value={disponivel} onChange={(e) => setDisponivel(e.target.value)}>
          <option value="">Todos</option>
          <option value="true">Somente disponíveis</option>
          <option value="false">Somente indisponíveis</option>
        </select>
        <button className="btn btn-secundario" onClick={carregarLivros}>Filtrar</button>
      </div>

      <Mensagem texto={erro} tipo="erro" />

      {carregando ? (
        <p>Carregando livros...</p>
      ) : livros.length === 0 ? (
        <p className="texto-suave">Nenhum livro encontrado.</p>
      ) : (
        <div className="grid-cartoes">
          {livros.map((livro) => (
            <div className="cartao" key={livro.id}>
              <div className="cartao-topo">
                <h3>{livro.titulo}</h3>
                <span className={`selo ${livro.qtd_disponivel > 0 ? 'selo-sucesso' : 'selo-alerta'}`}>
                  {livro.qtd_disponivel > 0 ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
              <p><strong>Autor:</strong> {livro.autor}</p>
              {livro.editora && <p><strong>Editora:</strong> {livro.editora}</p>}
              {livro.ano_publicacao && <p><strong>Ano:</strong> {livro.ano_publicacao}</p>}
              {livro.categoria && <p><strong>Categoria:</strong> {livro.categoria}</p>}
              {livro.isbn && <p><strong>ISBN:</strong> {livro.isbn}</p>}
              <p><strong>Estoque:</strong> {livro.qtd_disponivel} / {livro.qtd_total}</p>

              {podeGerenciar && (
                <div className="cartao-acoes">
                  <button className="btn btn-secundario btn-pequeno" onClick={() => abrirEdicao(livro)}>Editar</button>
                  <button className="btn btn-perigo btn-pequeno" onClick={() => excluir(livro)}>Excluir</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalAberto && (
        <Modal titulo={editandoId ? 'Editar Livro' : 'Cadastrar Livro'} onClose={() => setModalAberto(false)}>
          <form onSubmit={salvar}>
            <div className="campo">
              <label>Título *</label>
              <input required value={formulario.titulo}
                onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })} />
            </div>
            <div className="campo">
              <label>Autor *</label>
              <input required value={formulario.autor}
                onChange={(e) => setFormulario({ ...formulario, autor: e.target.value })} />
            </div>
            <div className="grid-2">
              <div className="campo">
                <label>Editora</label>
                <input value={formulario.editora}
                  onChange={(e) => setFormulario({ ...formulario, editora: e.target.value })} />
              </div>
              <div className="campo">
                <label>Ano de publicação</label>
                <input type="number" value={formulario.ano_publicacao}
                  onChange={(e) => setFormulario({ ...formulario, ano_publicacao: e.target.value })} />
              </div>
            </div>
            <div className="grid-2">
              <div className="campo">
                <label>Categoria</label>
                <input value={formulario.categoria}
                  onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })} />
              </div>
              <div className="campo">
                <label>ISBN</label>
                <input value={formulario.isbn}
                  onChange={(e) => setFormulario({ ...formulario, isbn: e.target.value })} />
              </div>
            </div>
            <div className="campo">
              <label>Quantidade total de exemplares *</label>
              <input type="number" min="0" required value={formulario.qtd_total}
                onChange={(e) => setFormulario({ ...formulario, qtd_total: e.target.value })} />
            </div>

            <Mensagem texto={mensagemForm} tipo="erro" />

            <button type="submit" className="btn btn-primario btn-full">
              {editandoId ? 'Salvar alterações' : 'Cadastrar livro'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
