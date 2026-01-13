import React, { useState } from 'react';

function UserDashboard({ user, onLogout }) {
  const [schedule, setSchedule] = useState([
    { 
      id: 1, 
      title: 'Йога для начинающих', 
      hall: { name: 'Большой зал' },
      trainer: { name: 'Анна Петрова' },
      date: '2024-05-20', 
      time: '18:00', 
      duration: 60,
      currentParticipants: 14,
      maxParticipants: 20,
      price: 500
    },
    { 
      id: 2, 
      title: 'Силовая тренировка', 
      hall: { name: 'Тренажерный зал' },
      trainer: { name: 'Иван Сидоров' },
      date: '2024-05-20', 
      time: '19:00', 
      duration: 90,
      currentParticipants: 12,
      maxParticipants: 15,
      price: 700
    },
    { 
      id: 3, 
      title: 'Плавание для всех', 
      hall: { name: 'Бассейн' },
      trainer: { name: 'Мария Волкова' },
      date: '2024-05-21', 
      time: '20:00', 
      duration: 60,
      currentParticipants: 8,
      maxParticipants: 10,
      price: 800
    }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: 1,
      schedule: { 
        title: 'Йога для начинающих', 
        date: '2024-05-20', 
        time: '18:00',
        duration: 60,
        price: 500
      },
      hall: { name: 'Большой зал' },
      trainer: { name: 'Анна Петрова' },
      bookingDate: '2024-05-19T10:30:00Z'
    }
  ]);

  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('schedule');

  const handleBooking = (scheduleId) => {
    const scheduleItem = schedule.find(s => s.id === scheduleId);
    
    if (scheduleItem.currentParticipants >= scheduleItem.maxParticipants) {
      setMessage('Извините, все места заняты!');
      return;
    }

    // Обновляем расписание
    setSchedule(prev => prev.map(item => 
      item.id === scheduleId 
        ? { ...item, currentParticipants: item.currentParticipants + 1 }
        : item
    ));

    // Добавляем бронь
    const newBooking = {
      id: bookings.length + 1,
      schedule: { 
        title: scheduleItem.title,
        date: scheduleItem.date,
        time: scheduleItem.time,
        duration: scheduleItem.duration,
        price: scheduleItem.price
      },
      hall: scheduleItem.hall,
      trainer: scheduleItem.trainer,
      bookingDate: new Date().toISOString()
    };

    setBookings(prev => [...prev, newBooking]);
    setMessage(`✅ Вы успешно записались на "${scheduleItem.title}"!`);
  };

  const handleCancel = (bookingId) => {
    if (window.confirm('Вы уверены, что хотите отменить запись?')) {
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        // Находим занятие и освобождаем место
        const scheduleItem = schedule.find(s => s.title === booking.schedule.title);
        if (scheduleItem) {
          setSchedule(prev => prev.map(item => 
            item.title === scheduleItem.title
              ? { ...item, currentParticipants: Math.max(0, item.currentParticipants - 1) }
              : item
          ));
        }
        
        // Удаляем бронь
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        setMessage('❌ Бронь отменена');
      }
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Шапка */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            👋 Добро пожаловать, {user.name}!
          </h1>
          <p className="text-gray-600">Демо-режим • Все изменения сохраняются в браузере</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'schedule' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            📅 Расписание
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            📋 Мои записи
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            👋 Выйти
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
          {message}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            🏋️ Доступные занятия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedule.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {item.price} ₽
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">📍</span> {item.hall.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">👤</span> {item.trainer.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">📅</span> {item.date} | <span className="font-medium">🕒</span> {item.time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">⏱</span> {item.duration} мин.
                  </p>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Места:</span>
                    <span className={`font-bold ${item.currentParticipants >= item.maxParticipants ? 'text-red-600' : 'text-green-600'}`}>
                      {item.currentParticipants}/{item.maxParticipants}
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.currentParticipants >= item.maxParticipants ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${(item.currentParticipants / item.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(item.id)}
                  disabled={item.currentParticipants >= item.maxParticipants}
                  className={`w-full py-3 rounded-lg font-medium transition ${item.currentParticipants >= item.maxParticipants 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 shadow'}`}
                >
                  {item.currentParticipants >= item.maxParticipants ? '❌ Мест нет' : '✅ Записаться'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            📋 Мои записи ({bookings.length})
          </h2>
          {bookings.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow border text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">У вас нет активных записей</p>
              <p className="text-gray-400 mt-2">Выберите занятие из расписания</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white p-6 rounded-xl shadow border hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{booking.schedule.title}</h4>
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium">📅</span> {booking.schedule.date} | <span className="font-medium">🕒</span> {booking.schedule.time}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">📍</span> {booking.hall.name} | <span className="font-medium">👤</span> {booking.trainer.name}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">⏱</span> {booking.schedule.duration} мин. | <span className="font-medium">💰</span> {booking.schedule.price} ₽
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      ✔️ Активно
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Запись создана: {new Date(booking.bookingDate).toLocaleDateString('ru-RU')}
                  </p>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="w-full py-3 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition border border-red-200"
                  >
                    ❌ Отменить запись
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;