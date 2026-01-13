import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('user@mail.ru');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Проверка прямо в компоненте без запросов
    const users = [
      { id: 1, email: 'admin@mail.ru', password: 'admin123', role: 'admin', name: 'Администратор' },
      { id: 2, email: 'trainer@mail.ru', password: 'trainer123', role: 'trainer', name: 'Иван Тренеров' },
      { id: 3, email: 'user@mail.ru', password: 'user123', role: 'user', name: 'Петр Посетитель' }
    ];
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Сохраняем в localStorage для имитации сессии
      localStorage.setItem('sportUser', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }));
      
      // Передаем данные в App.js
      onLogin({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });
    } else {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          🏋️ СпортКомплекс
        </h1>
        <p className="text-center text-gray-600 mb-8">Демо-версия (работает офлайн)</p>
        
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition shadow-md"
            >
              Войти в демо-режим
            </button>

            <div className="text-sm text-gray-600 text-center space-y-2">
              <p className="font-bold text-gray-800">Тестовые аккаунты:</p>
              <div className="grid grid-cols-1 gap-1">
                <div className="p-2 bg-blue-50 rounded">
                  <span className="font-medium">Админ:</span> admin@mail.ru / admin123
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <span className="font-medium">Тренер:</span> trainer@mail.ru / trainer123
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <span className="font-medium">Пользователь:</span> user@mail.ru / user123
                </div>
              </div>
              <p className="mt-4 text-green-600 font-medium">
                ✅ Полностью офлайн • Не требует сервера
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;