export default function Mensagem({ texto, tipo }) {
  if (!texto) return null;
  return <div className={`mensagem mensagem-${tipo || 'info'}`}>{texto}</div>;
}
