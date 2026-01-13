import React from 'react';

function TrainerDashboard({ user, onLogout }) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Панель тренера
          </h1>
          <p className="text-gray-600">Добро пожаловать, {user.name}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          Выйти
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Мои занятия сегодня</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-bold">Йога для начинающих</p>
              <p className="text-gray-600">18:00-19:30 • Большой зал</p>
              <p className="text-gray-600">Записано: 14/20 человек</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Быстрые действия</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              📝 Добавить новое занятие
            </button>
            <button className="w-full text-left p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
              👥 Посмотреть список участников
            </button>
            <button className="w-full text-left p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              📊 Статистика посещений
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl">
        <h3 className="text-xl font-bold mb-4">📈 Ваша статистика</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-90">Всего занятий</p>
            <p className="text-3xl font-bold">42</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Средняя оценка</p>
            <p className="text-3xl font-bold">4.8 ★</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Посетителей</p>
            <p className="text-3xl font-bold">156</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Заполняемость</p>
            <p className="text-3xl font-bold">87%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainerDashboard;