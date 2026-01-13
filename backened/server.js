const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Временная "база данных" в памяти
let users = [
  { id: 1, email: 'admin@mail.ru', password: 'admin123', role: 'admin', name: 'Администратор' },
  { id: 2, email: 'trainer@mail.ru', password: 'trainer123', role: 'trainer', name: 'Иван Тренеров' },
  { id: 3, email: 'user@mail.ru', password: 'user123', role: 'user', name: 'Петр Посетитель' }
];

let halls = [
  { id: 1, name: 'Большой зал', capacity: 30, description: 'Для групповых занятий' },
  { id: 2, name: 'Тренажерный зал', capacity: 20, description: 'Кардио и силовые тренажеры' },
  { id: 3, name: 'Бассейн', capacity: 15, description: '25-метровый бассейн' }
];

let schedule = [
  { 
    id: 1, 
    hallId: 1, 
    trainerId: 2, 
    title: 'Йога для начинающих', 
    date: '2024-05-20', 
    time: '18:00', 
    duration: 60, 
    maxParticipants: 20,
    currentParticipants: 5,
    price: 500
  },
  { 
    id: 2, 
    hallId: 2, 
    trainerId: 2, 
    title: 'Силовая тренировка', 
    date: '2024-05-20', 
    time: '19:00', 
    duration: 90,
    maxParticipants: 15,
    currentParticipants: 10,
    price: 700
  }
];

let bookings = [];

// Аутентификация
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Неверные данные' });
  }
});

// Получение данных
app.get('/api/schedule', (req, res) => {
  const scheduleWithDetails = schedule.map(item => ({
    ...item,
    hall: halls.find(h => h.id === item.hallId),
    trainer: users.find(u => u.id === item.trainerId)
  }));
  res.json(scheduleWithDetails);
});

app.get('/api/halls', (req, res) => {
  res.json(halls);
});

app.get('/api/trainers', (req, res) => {
  const trainers = users.filter(u => u.role === 'trainer');
  res.json(trainers);
});

// Бронирование
app.post('/api/book', (req, res) => {
  const { userId, scheduleId } = req.body;
  
  // Проверяем, есть ли уже бронь
  const existingBooking = bookings.find(b => 
    b.userId === userId && b.scheduleId === scheduleId
  );
  
  if (existingBooking) {
    return res.status(400).json({ success: false, message: 'Вы уже записаны' });
  }
  
  // Находим занятие
  const scheduleItem = schedule.find(s => s.id === scheduleId);
  if (!scheduleItem) {
    return res.status(404).json({ success: false, message: 'Занятие не найдено' });
  }
  
  // Проверяем свободные места
  if (scheduleItem.currentParticipants >= scheduleItem.maxParticipants) {
    return res.status(400).json({ success: false, message: 'Мест нет' });
  }
  
  // Создаем бронь
  const newBooking = {
    id: bookings.length + 1,
    userId,
    scheduleId,
    bookingDate: new Date().toISOString(),
    status: 'confirmed'
  };
  
  bookings.push(newBooking);
  scheduleItem.currentParticipants += 1;
  
  res.json({ 
    success: true, 
    booking: newBooking,
    message: 'Вы успешно записаны!'
  });
});

// Получение броней пользователя
app.get('/api/user/bookings/:userId', (req, res) => {
  const userBookings = bookings.filter(b => b.userId == req.params.userId);
  const detailedBookings = userBookings.map(booking => {
    const scheduleItem = schedule.find(s => s.id === booking.scheduleId);
    return {
      ...booking,
      schedule: scheduleItem,
      hall: halls.find(h => h.id === scheduleItem.hallId),
      trainer: users.find(u => u.id === scheduleItem.trainerId)
    };
  });
  res.json(detailedBookings);
});

// Отмена брони
app.delete('/api/bookings/:bookingId', (req, res) => {
  const bookingIndex = bookings.findIndex(b => b.id == req.params.bookingId);
  
  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, message: 'Бронь не найдена' });
  }
  
  const booking = bookings[bookingIndex];
  const scheduleItem = schedule.find(s => s.id === booking.scheduleId);
  
  if (scheduleItem) {
    scheduleItem.currentParticipants = Math.max(0, scheduleItem.currentParticipants - 1);
  }
  
  bookings.splice(bookingIndex, 1);
  res.json({ success: true, message: 'Бронь отменена' });
});

// Статистика для админа
app.get('/api/admin/stats', (req, res) => {
  const stats = {
    totalHalls: halls.length,
    totalTrainers: users.filter(u => u.role === 'trainer').length,
    totalUsers: users.filter(u => u.role === 'user').length,
    totalBookings: bookings.length,
    totalRevenue: bookings.length * 500, // упрощенный расчет
    popularHall: halls[0]?.name || 'Нет данных',
    upcomingSessions: schedule.filter(s => new Date(s.date) >= new Date()).length
  };
  res.json(stats);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});