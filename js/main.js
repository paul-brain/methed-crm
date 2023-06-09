import {goods} from './goods.js';
import {renderGoods} from './modules/render.js';
import control from './modules/control.js';

const {
  modalControl,
  deleteControl,
  formControl,
  imgControl,
} = control;

const init = () => {
  const tableBody = document.querySelector('.products__list tbody');
  const addBtn = document.querySelector('.products__add-btn');
  const modalOverlay = document.querySelector('.overlay');
  const form = document.querySelector('.form');

  renderGoods(tableBody, goods);
  deleteControl(tableBody, goods);
  modalControl(addBtn, modalOverlay);
  formControl(tableBody, goods, form, modalOverlay);
  imgControl(tableBody);
};

init();
