import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchStats();
    // Здесь можно добавить загрузку пользователей и бронирований
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  if (!stats) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Панель администратора
          </h1>
          <p className="text-gray-600">Управление спортивным комплексом</p>
        </div>
        <button
          onClick={onLogout}
          className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          Выйти
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-600">Всего залов</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalHalls}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-600">Тренеры</p>
          <p className="text-3xl font-bold text-green-600">{stats.totalTrainers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-600">Пользователи</p>
          <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-600">Бронирований</p>
          <p className="text-3xl font-bold text-orange-600">{stats.totalBookings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Левая колонка */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Быстрые действия</h2>
          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              ✏️ Добавить новое занятие
            </button>
            <button className="w-full text-left p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
              👥 Управление пользователями
            </button>
            <button className="w-full text-left p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              📊 Сформировать отчет
            </button>
            <button className="w-full text-left p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
              🔔 Отправить уведомление
            </button>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Финансы</h2>
          <div className="space-y-6">
            <div>
              <p className="text-gray-600">Общая выручка</p>
              <p className="text-4xl font-bold text-green-600">{stats.totalRevenue} руб.</p>
            </div>
            <div>
              <p className="text-gray-600">Предстоящие занятия</p>
              <p className="text-3xl font-bold">{stats.upcomingSessions}</p>
            </div>
            <div>
              <p className="text-gray-600">Самый популярный зал</p>
              <p className="text-2xl font-bold">{stats.popularHall}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        Админ-панель | Всего элементов управления: 8 | Версия 1.0
      </div>
    </div>
  );
}

export default AdminDashboard;