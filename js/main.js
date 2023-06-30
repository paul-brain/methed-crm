import {getGoods} from './modules/ajax.js';
import {renderGoods} from './modules/render.js';
import control from './modules/control.js';
import {createModal} from './modules/createElements.js';

const {
  modalControl,
  formControl,
  actionsControl,
} = control;

const init = async () => {
  const goods = await getGoods();
  const tableBody = document.querySelector('.products__list tbody');
  const addBtn = document.querySelector('.products__add-btn');
  // const modalOverlay = document.querySelector('.overlay');
  const modalOverlay = createModal();
  const form = modalOverlay.querySelector('.form');

  renderGoods(tableBody, goods);
  modalControl(addBtn, modalOverlay);
  formControl(tableBody, goods, form, modalOverlay);
  actionsControl(tableBody, goods, form, modalOverlay);
};

init();
