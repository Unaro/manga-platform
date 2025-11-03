export default function HomePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h1>Manga Platform - User Service MVP</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <p>Добро пожаловать в тестовую среду User Service модуля платформы манги.</p>
        <p>Этот MVP демонстрирует функциональность регистрации, аутентификации и управления профилем.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
          <h3>🔐 Аутентификация</h3>
          <p>Протестируйте регистрацию и вход пользователей</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <a 
              href="/auth/register" 
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#007bff', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            >
              Регистрация
            </a>
            <a 
              href="/auth/login" 
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#28a745', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            >
              Вход
            </a>
          </div>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
          <h3>👤 Профиль</h3>
          <p>Просмотр и управление профилем пользователя</p>
          <a 
            href="/profile" 
            style={{ 
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.5rem 1rem', 
              backgroundColor: '#17a2b8', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          >
            Мой профиль
          </a>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
          <h3>🔧 API Endpoints</h3>
          <p>Доступные API маршруты:</p>
          <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            <li>POST /api/auth/register</li>
            <li>POST /api/auth/login</li>
            <li>GET /api/users/:id</li>
          </ul>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
          <h3>📚 Технологии</h3>
          <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            <li>Next.js 14 (App Router)</li>
            <li>TypeScript (strict)</li>
            <li>Supabase (PostgreSQL)</li>
            <li>JWT Authentication</li>
            <li>Zod Validation</li>
            <li>Event-driven Architecture</li>
          </ul>
        </div>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '0.5rem',
        fontSize: '0.875rem'
      }}>
        <h4>⚠️ Настройка окружения</h4>
        <p>Перед тестированием убедитесь, что:</p>
        <ol>
          <li>Создан .env.local на основе .env.example</li>
          <li>Настроен проект Supabase с таблицей users</li>
          <li>Добавлены корректные API ключи</li>
        </ol>
      </div>
    </div>
  );
}
