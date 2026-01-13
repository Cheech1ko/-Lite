import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('user@mail.ru');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      if (response.data.success) {
        onLogin(response.data.user);
      } else {
        setError('Ошибка входа');
      }
    } catch (err) {
      setError('Сервер не отвечает. Запустили ли вы бэкенд? (node server.js)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          СпортКомплекс
        </h1>
        <p className="text-center text-gray-600 mb-8">Войдите в систему</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Войти
            </button>

            <div className="text-sm text-gray-600 text-center">
              <p>Тестовые аккаунты:</p>
              <p>Админ: admin@mail.ru / admin123</p>
              <p>Тренер: trainer@mail.ru / trainer123</p>
              <p>Пользователь: user@mail.ru / user123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;