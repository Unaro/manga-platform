'use client';

import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [token, setToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Загружаем токен из localStorage при монтировании компонента
    const savedToken = localStorage.getItem('auth-token');
    if (savedToken) {
      setToken(savedToken);
      // Декодируем JWT для получения user ID (только для тестирования!)
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        if (payload.sub) {
          setUserId(payload.sub);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleFetchProfile = async () => {
    if (!userId.trim()) {
      setResult({ success: false, error: 'User ID is required' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setToken('');
    setUserId('');
    setResult(null);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h1>Профиль пользователя</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label htmlFor="token">Auth Token:</label>
          <textarea
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ width: '100%', height: '100px', padding: '0.5rem', marginTop: '0.25rem', fontSize: '0.75rem' }}
            placeholder="Вставьте JWT токен сюда или войдите через /auth/login"
          />
        </div>

        <div>
          <label htmlFor="userId">User ID:</label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            placeholder="UUID пользователя"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleFetchProfile}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: loading ? '#ccc' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Загрузка...' : 'Получить профиль'}
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
            }}
          >
            Выйти
          </button>
        </div>
      </div>

      {result && (
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}>
          <h3>Результат API:</h3>
          <pre style={{ fontSize: '0.875rem', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/auth/login" style={{ color: '#007bff', textDecoration: 'none' }}>
          Войти
        </a>
        {' | '}
        <a href="/auth/register" style={{ color: '#007bff', textDecoration: 'none' }}>
          Зарегистрироваться
        </a>
      </div>
    </div>
  );
}
