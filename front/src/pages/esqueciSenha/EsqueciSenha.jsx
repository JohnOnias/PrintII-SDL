import React, { useState } from 'react';
import { requestPasswordReset } from '../../services/authService';

function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const data = await requestPasswordReset(email);
      setMessage(data.message || 'Link de recuperação enviado!');
    } catch (err) {
      console.error("Erro no esqueci senha:", err);
      setError(err.message || 'Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Esqueci minha senha</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar link de recuperação'}
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><a href="/login">Voltar para o login</a></p>
    </div>
  );
}

export default EsqueciSenha;
