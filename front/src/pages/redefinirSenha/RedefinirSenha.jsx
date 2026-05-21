import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from '../../services/authService';

function RedefinirSenha() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState('');
  const [token, setToken] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    setUid(query.get('uid') || '');
    setToken(query.get('token') || '');
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!uid || !token) {
      setError('Link de redefinição inválido ou incompleto.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const data = await confirmPasswordReset(uid, token, newPassword);
      setMessage(data.message || 'Senha alterada com sucesso!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      setError(err.message || 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Criar nova senha</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <input
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </div>
      </form>
      {message && <p style={{ color: 'green' }}>{message}. Redirecionando para o login...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default RedefinirSenha;
