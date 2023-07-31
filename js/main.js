import {getGoods} from './modules/ajax.js';
import {renderGoods} from './modules/render.js';
import control from './modules/control.js';

const {
  modalControl,
  searchControl,
} = control;

const init = async () => {
  const goods = await getGoods();
  const tableBody = document.querySelector('.products__list tbody');
  const addBtn = document.querySelector('.products__add-btn');

  renderGoods(tableBody, goods);
  modalControl(addBtn);
  searchControl(tableBody);
};

init();
