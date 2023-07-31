// Генерируем случайный ID товара - целое число из 9 цифр
export const generateId = () => {
  const min = 100000000;
  const max = 999999999;

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Вычисляем общую сумму всех товаров
export const calcTotalPrice = (goods) => goods.reduce(
    (sum, product) => sum + product.price * product.count, 0,
);

// Кодируем изображение в строку base64
export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.addEventListener('loadend', () => {
    resolve(reader.result);			// результат уже в формате base64
  });

  reader.addEventListener('error', err => {
    reject(err);
  });

  reader.readAsDataURL(file);
});
