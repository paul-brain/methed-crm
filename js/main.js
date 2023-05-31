'use strict';

const modalHeader = document.querySelector('.modal__title');
const modalCloseBtn = document.querySelector('.modal__btn-close');
const goodId = document.querySelector('.modal__info');
const form = document.querySelector('.form');
const formTotalPrice = document.querySelector('.form__total-price');
//const discontCheckbox = document.getElementsByName('discont');
//const discontText = document.getElementsByName('discont_text');
const totalPrice = document.querySelector('.products__total-price');
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

const updateTotalPrice = () => {
  totalPrice.textContent = '$' + calcTotalPrice(goods);
};

// Рендеринг страницы

renderGoods(goods);
updateTotalPrice();

// Обработка событий: открыть/закрыть модальное окно

const addBtn = document.querySelector('.products__add-btn');
const modalOverlay = document.querySelector('.overlay');

addBtn.addEventListener('click', () => {
  modalOverlay.classList.add('overlay--show');
});

modalOverlay.addEventListener('click', e => {
  const target = e.target;

  if (target === modalOverlay || target.classList.contains('modal__btn-close')) {
    modalOverlay.classList.remove('overlay--show');
  }
});

// Обработка событий: удалить товар из базы и в таблице

tableBody.addEventListener('click', e => {
  const target = e.target;

  if (target.classList.contains('products__actions-btn--delete')) {
    const row = target.closest('tr');
    const productId = + row.firstElementChild.textContent;
    const id = goods.findIndex((good, i, array) => {
      return good.id === productId;
    });

    row.remove();

    if (id !== -1) {
      goods.splice(id, 1);
      console.log(goods);
    }

    updateTotalPrice();
  }
});

// Обработка событий формы: чекбоск Дисконт и цена/количество (итоговая сумма товаров)

form.addEventListener('change', e => {
  const target = e.target;

  if (target.classList.contains('checkbox__input')) {
    const discontTextInput = target.parentElement.nextElementSibling;

    if (discontTextInput.hasAttribute('disabled')) {
      discontTextInput.removeAttribute('disabled');
    } else {
      discontTextInput.value = '';
      discontTextInput.setAttribute('disabled', 'disabled');
    }
  }

  if (target === form.count || target === form.price) {
    formTotalPrice.textContent = '$' + form.price.value * form.count.value;
  }
});

// Обработка событий формы: добавить новый товар, обновить итоговую сумму

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const newProduct =  Object.fromEntries(formData);
  const newProductForTable = {
    id: newProduct.id = generateId(),
    title: newProduct.title,
    category: newProduct.category,
    units: newProduct.units,
    count: newProduct.count,
    price: newProduct.price,
  };

  goods.push(newProduct);
  tableBody.append(createRow(newProductForTable));
  updateTotalPrice();

  form.reset();
  modalOverlay.classList.remove('overlay--show');
});
