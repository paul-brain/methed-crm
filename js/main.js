'use strict';

/* const modalHeader = document.querySelector('.modal__title');
const modalCloseBtn = document.querySelector('.modal__btn-close');
const goodId = document.querySelector('.modal__info');
const form = document.querySelector('.form');
const discontCheckbox = document.getElementsByName('discont');
const discontText = document.getElementsByName('discont_text');
const totalPrice = document.querySelector('.form__total-price'); */
const tableBody = document.querySelector('.products__list tbody');

const createRow = (product) => {
  const tr = document.createElement('tr');
  let tdItems = ['id', 'title', 'category', 'units', 'count', 'price', 'total', 'btns'];

  tdItems = tdItems.map((item) => {
    const td = document.createElement('td');

    if (item === 'total') {
      td.append(product.price * product.count);
    } else if (item === 'btns') {
      td.insertAdjacentHTML('afterBegin', `<div class="products__actions">
        <button class="products__actions-btn"></button>
        <button class="products__actions-btn products__actions-btn--edit"></button>
        <button class="products__actions-btn products__actions-btn--delete"></button>
      </div>`);
    } else {
      td.append(product[item]);
    }

    return td;
  });

  tdItems.forEach((item) => {
    tr.append(item);
  });

  return tr;
};

const renderGoods = (goods) => {
  goods.forEach((good) => {
    tableBody.append(createRow(good));
  });
};

renderGoods(goods);
