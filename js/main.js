import {getGoods} from './modules/ajax.js';
import {renderGoods} from './modules/render.js';
import control from './modules/control.js';

const {
  modalControl,
  deleteControl,
  formControl,
  imgControl,
} = control;

const init = async () => {
  const goods = await getGoods();
  const tableBody = document.querySelector('.products__list tbody');
  const addBtn = document.querySelector('.products__add-btn');
  const modalOverlay = document.querySelector('.overlay');
  const form = document.querySelector('.form');

  // Для демонтсрации ошибки при удалении
  goods.unshift({
    id: '1234567890',
    title: 'Манго - для удаления',
    description: 'Сочный, вкусный',
    category: 'Фрукты',
    price: 3000,
    units: 'кг',
    count: 30,
  });

  renderGoods(tableBody, goods);
  deleteControl(tableBody, goods);
  modalControl(addBtn, modalOverlay);
  formControl(tableBody, goods, form, modalOverlay);
  imgControl(tableBody);
};

init();
