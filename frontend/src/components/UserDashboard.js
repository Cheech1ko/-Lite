import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard({ user, onLogout }) {
  const [schedule, setSchedule] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Для демо на GitHub Pages используем моковые данные
      if (process.env.NODE_ENV === 'production') {
        setSchedule([
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
          }
        ]);
        setBookings([
          {
            id: 1,
            schedule: { title: 'Йога для начинающих', date: '2024-05-20', time: '18:00' },
            hall: { name: 'Большой зал' },
            trainer: { name: 'Анна Петрова' }
          }
        ]);
      } else {
        // Для локальной разработки используем реальный API
        const [scheduleRes, bookingsRes] = await Promise.all([
          axios.get('/schedule'),
          axios.get(`/user/bookings/${user.id}`)
        ]);
        setSchedule(scheduleRes.data);
        setBookings(bookingsRes.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setMessage('Ошибка подключения к серверу. Используем демо-данные.');
      // Показываем демо-данные при ошибке
      setSchedule([
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (scheduleId) => {
    try {
      if (process.env.NODE_ENV === 'production') {
        setMessage('Запись успешно создана! (Демо-режим)');
        // В демо-режиме просто добавляем новую запись
        setBookings(prev => [...prev, {
          id: prev.length + 1,
          schedule: schedule.find(s => s.id === scheduleId),
          bookingDate: new Date().toISOString(),
          status: 'confirmed'
        }]);
      } else {
        const response = await axios.post('/book', {
          userId: user.id,
          scheduleId
        });
        setMessage(response.data.message);
        fetchData();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Ошибка бронирования');
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Вы уверены, что хотите отменить запись?')) {
      try {
        if (process.env.NODE_ENV === 'production') {
          setMessage('Бронь отменена! (Демо-режим)');
          setBookings(prev => prev.filter(b => b.id !== bookingId));
        } else {
          await axios.delete(`/bookings/${bookingId}`);
          setMessage('Бронь отменена');
          fetchData();
        }
      } catch (error) {
        setMessage('Ошибка отмены');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Шапка */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Добро пожаловать, {user.name}!
          </h1>
          <p className="text-gray-600">Панель управления записями</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Расписание
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Мои записи
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            Выйти
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            Доступные занятия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schedule.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow border hover:shadow-md transition">
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 mt-2">
                    📍 {item.hall?.name} | 👤 {item.trainer?.name}
                  </p>
                  <p className="text-gray-600">
                    📅 {item.date} | 🕒 {item.time} | ⏱ {item.duration} мин
                  </p>
                  <p className="text-gray-600">
                    👥 {item.currentParticipants}/{item.maxParticipants} | 💰 {item.price} руб.
                  </p>
                  <button
                    onClick={() => handleBooking(item.id)}
                    disabled={item.currentParticipants >= item.maxParticipants}
                    className={`mt-4 w-full py-3 rounded-lg font-medium ${
                      item.currentParticipants >= item.maxParticipants
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {item.currentParticipants >= item.maxParticipants ? 'Мест нет' : 'Записаться'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            Мои записи
          </h2>
          {bookings.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow border text-center">
              <p className="text-gray-500 text-lg">У вас нет активных записей</p>
              <p className="text-gray-400 mt-2">Выберите занятие из расписания</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white p-6 rounded-xl shadow border">
                  <h4 className="font-bold text-lg">{booking.schedule?.title}</h4>
                  <p className="text-gray-600 mt-2">
                    {booking.schedule?.date} {booking.schedule?.time}
                  </p>
                  <p className="text-gray-600">
                    {booking.hall?.name} | {booking.trainer?.name}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Дата записи: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="mt-4 w-full py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  >
                    Отменить запись
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