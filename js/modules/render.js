import {createRow} from './createElements.js';
import {calcTotalPrice} from './helpers.js';

export const updateTotalPrice = (goods) => {
  const totalPrice = document.querySelector('.products__total-price');

  totalPrice.textContent = '$' + calcTotalPrice(goods);
};

export const renderGoods = (list, goods) => {
  goods.forEach((good) => {
    list.append(createRow(good));
  });

  updateTotalPrice(goods);
};
