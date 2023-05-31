// Генерируем случайный ID товара - целое число из 9 цифр
const generateId = () => {
  const min = 100000000;
  const max = 999999999;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
