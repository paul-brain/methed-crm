import {createRow} from './createElements.js';
import {calcTotalPrice} from './helpers.js';
import {actionsControl} from './control.js';

export const updateTotalPrice = (goods) => {
  const totalPrice = document.querySelector('.products__total-price');

  totalPrice.textContent = '$' + calcTotalPrice(goods);
};

export const renderGoods = (list, goods) => {
  list.innerHTML = '';
  list.insertAdjacentHTML('afterBegin', `
    <tr class="products__list-header">
    <td>ID</td>
    <td>Наименование</td>
    <td>Категория</td>
    <td>Ед/изм</td>
    <td>Количество</td>
    <td>Цена</td>
    <td>Итог</td>
    <td></td>
  </tr>
  `);
  goods.forEach((good) => {
    list.append(createRow(good));
  });

  updateTotalPrice(goods);
  actionsControl(list);
};
