export default function Modal({ titulo, onClose, children }) {
  return (
    <div className="modal-fundo" onClick={onClose}>
      <div className="modal-caixa" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecalho">
          <h3>{titulo}</h3>
          <button className="modal-fechar" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        <div className="modal-corpo">{children}</div>
      </div>
    </div>
  );
}
