import {updateTotalPrice} from './render.js';
import {generateId} from './helpers.js';
import {createRow} from './createElements.js';

const closeModal = (modalOverlay) => {
  modalOverlay.classList.remove('overlay--show');
};

// Обработка событий: открыть/закрыть модальное окно
const modalControl = (addBtn, modalOverlay) => {
  addBtn.addEventListener('click', () => {
    modalOverlay.classList.add('overlay--show');
  });

  modalOverlay.addEventListener('click', e => {
    const target = e.target;

    if (
      target === modalOverlay ||
      target.classList.contains('modal__btn-close')
    ) {
      closeModal(modalOverlay);
    }
  });
};

// Удаление товара по кнопке из базы и в таблице
const deleteControl = (list, goods) => {
  list.addEventListener('click', e => {
    const target = e.target;

    if (target.classList.contains('products__actions-btn--delete')) {
      const row = target.closest('tr');
      const productId = +row.firstElementChild.textContent;
      const id = goods.findIndex((good) => good.id === productId);

      row.remove();

      if (id !== -1) {
        goods.splice(id, 1);
        console.log(goods);
      }

      updateTotalPrice(goods);
    }
  });
};

// Просмотр картинки
const imgControl = (list) => {
  list.addEventListener('click', e => {
    const target = e.target;

    // Нажали на кнопку изображения
    if (target.classList.contains('products__actions-btn--img')) {
      const tr = target.closest('tr');
      const imgUrl = location.origin + '/' + tr.dataset.pic;

      const windowX = 'left=' + (screen.width / 2 - 300);
      const windowY = 'top=' + (screen.height / 2 - 300);
      const windowParams = `width=600,height=600,${windowX},${windowY}`;
      const imgWindow = open('about:blank', '', windowParams);

      imgWindow.document.body.innerHTML = `
        <img src="${imgUrl}" style="max-width: 100%;max-height: 100%">
      `;
    }
  });
};

const formControl = (list, goods, form, overlay) => {
  const formTotalPrice = document.querySelector('.form__total-price');

  form.addEventListener('change', e => {
    const target = e.target;

    // Работа с полем Дисконт
    if (target.classList.contains('checkbox__input')) {
      const discontTextInput = target.parentElement.nextElementSibling;

      if (discontTextInput.hasAttribute('disabled')) {
        discontTextInput.removeAttribute('disabled');
      } else {
        discontTextInput.value = '';
        discontTextInput.setAttribute('disabled', 'disabled');
      }
    }

    // Обновление суммы на лету при добавлении товара
    if (target === form.count || target === form.price) {
      formTotalPrice.textContent = '$' + form.price.value * form.count.value;
    }
  });

  // Обработка событий формы: добавить новый товар, обновить итоговую сумму
  form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newProduct = Object.fromEntries(formData);
    const newProductForTable = {
      id: newProduct.id = generateId(),
      title: newProduct.title,
      category: newProduct.category,
      units: newProduct.units,
      count: newProduct.count,
      price: newProduct.price,
    };

    goods.push(newProduct);
    list.append(createRow(newProductForTable));
    updateTotalPrice(goods);

    form.reset();
    closeModal(overlay);
  });
};

export default {
  modalControl,
  deleteControl,
  formControl,
  imgControl,
};
