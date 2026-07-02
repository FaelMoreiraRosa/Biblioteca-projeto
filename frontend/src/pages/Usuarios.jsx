import { useEffect, useState } from 'react';
import api from '../api/api';
import Modal from '../components/Modal';
import Mensagem from '../components/Mensagem';

const USUARIO_VAZIO = { nome: '', email: '', senha: '', tipo: 'Bibliotecário' };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(USUARIO_VAZIO);
  const [mensagemForm, setMensagemForm] = useState('');

  async function carregarUsuarios() {
    setCarregando(true);
    setErro('');
    try {
      const resposta = await api.get('/usuarios');
      setUsuarios(resposta.data);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao carregar usuários.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function abrirNovo() {
    setEditandoId(null);
    setFormulario(USUARIO_VAZIO);
    setMensagemForm('');
    setModalAberto(true);
  }

  function abrirEdicao(usuario) {
    setEditandoId(usuario.id);
    setFormulario({ nome: usuario.nome, email: usuario.email, senha: '', tipo: usuario.tipo });
    setMensagemForm('');
    setModalAberto(true);
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagemForm('');
    try {
      if (editandoId) {
        const dados = { ...formulario };
        if (!dados.senha) delete dados.senha;
        await api.put(`/usuarios/${editandoId}`, dados);
      } else {
        if (!formulario.senha) {
          setMensagemForm('A senha é obrigatória para novos usuários.');
          return;
        }
        await api.post('/auth/registrar', formulario);
      }
      setModalAberto(false);
      carregarUsuarios();
    } catch (err) {
      setMensagemForm(err.response?.data?.erro || 'Erro ao salvar usuário.');
    }
  }

  async function excluir(usuario) {
    if (!window.confirm(`Excluir o usuário "${usuario.nome}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await api.delete(`/usuarios/${usuario.id}`);
      carregarUsuarios();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir usuário.');
    }
  }

  return (
    <div className="pagina">
      <div className="pagina-cabecalho">
        <h1> Usuários do Sistema</h1>
        <button className="btn btn-primario" onClick={abrirNovo}>+ Novo Usuário</button>
      </div>
      <p className="texto-suave">Administradores e Bibliotecários. Para cadastrar leitores, use a página Leitores.</p>

      <Mensagem texto={erro} tipo="erro" />

      {carregando ? (
        <p>Carregando usuários...</p>
      ) : (
        <div className="tabela-container">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td><span className="selo selo-neutro">{u.tipo}</span></td>
                  <td className="tabela-acoes">
                    <button className="btn btn-secundario btn-pequeno" onClick={() => abrirEdicao(u)}>Editar</button>
                    <button className="btn btn-perigo btn-pequeno" onClick={() => excluir(u)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAberto && (
        <Modal titulo={editandoId ? 'Editar Usuário' : 'Cadastrar Usuário'} onClose={() => setModalAberto(false)}>
          <form onSubmit={salvar}>
            <div className="campo">
              <label>Nome completo *</label>
              <input required value={formulario.nome}
                onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })} />
            </div>
            <div className="campo">
              <label>E-mail *</label>
              <input type="email" required value={formulario.email}
                onChange={(e) => setFormulario({ ...formulario, email: e.target.value })} />
            </div>
            <div className="grid-2">
              <div className="campo">
                <label>Tipo de conta *</label>
                <select value={formulario.tipo}
                  onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value })}>
                  <option value="Bibliotecário">Bibliotecário</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <div className="campo">
                <label>Senha {editandoId ? '(deixe em branco para manter)' : ''}</label>
                <input type="password" value={formulario.senha}
                  onChange={(e) => setFormulario({ ...formulario, senha: e.target.value })} />
              </div>
            </div>

            <Mensagem texto={mensagemForm} tipo="erro" />

            <button type="submit" className="btn btn-primario btn-full">
              {editandoId ? 'Salvar alterações' : 'Cadastrar usuário'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
