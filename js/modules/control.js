import {updateTotalPrice} from './render.js';
import {addGood} from './ajax.js';
import {getGood} from './ajax.js';
import {editGood} from './ajax.js';
import {deleteGood} from './ajax.js';
import {createRow} from './createElements.js';
import {loadStyle} from './loadStyle.js';

const closeModal = (modalOverlay) => {
  const form = modalOverlay.querySelector('.form');

  modalOverlay.querySelector('.modal__info').textContent = '';
  modalOverlay.querySelector('.modal__title').textContent = 'Добавить товар';
  modalOverlay.classList.remove('overlay--show');

  for (let modal of modalOverlay.children) {
    modal.classList.remove('modal--show', 'modal-wrong--show');
  }

  form.id = '';
  form.discount_on.removeAttribute('checked');
  form.discount.setAttribute('disabled', 'disabled');
  form.reset();
};

// Обработка событий: открыть/закрыть модальное окно
const modalControl = (addBtn, modalOverlay) => {
  addBtn.addEventListener('click', async () => {
    await loadStyle('css/modal.css');
    document.body.append(modalOverlay);
    modalOverlay.classList.add('overlay--show');
    modalOverlay.firstElementChild.classList.add('modal--show');
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

// Обработка действий товара: показать картинку, редактировать, удалить
const actionsControl = (list, goods, form, overlay) => {
  list.addEventListener('click', async e => {
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

    // Редактирование товара
    if (target.classList.contains('products__actions-btn--edit')) {
      const row = target.closest('tr');
      const productId = row.firstElementChild.textContent;
      const good = await getGood(productId);

      overlay.querySelector('.modal__title').textContent = 'Редактировать товар';
      overlay.querySelector('.modal__info').textContent = 'id: ' + productId;

      form.id = good.id;
      form.title.value = good.title;
      form.category.value = good.category;
      form.units.value = good.units;
      form.description.value = good.description;
      form.count.value = good.count;
      form.price.value = good.price;

      if (good.discount) {
        form.discount.removeAttribute('disabled');
        form.discount.value = good.discount;
        form.discount_on.value = 'on';
        form.discount_on.setAttribute('checked', 'checked');
      }

      await loadStyle('css/modal.css');
      document.body.append(overlay);
      overlay.classList.add('overlay--show');
      overlay.firstElementChild.classList.add('modal--show');
    }

    // Удаление товара по кнопке из базы и в таблице
    if (target.classList.contains('products__actions-btn--delete')) {
      const row = target.closest('tr');
      const productId = row.firstElementChild.textContent;
      const id = goods.findIndex((good) => good.id === productId);

      if (id !== -1) {
        goods.splice(id, 1);
        deleteGood(productId);
        row.remove();
      }

      updateTotalPrice(goods);
    }
  });
};

const formControl = (list, goods, form, overlay) => {
  const formTotalPrice = form.querySelector('.form__total-price');

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
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const product = Object.fromEntries(formData);

    // Если есть ID товара, то редактируем. Иначе - создаем
    if (form.id) {
      if (! product.hasOwnProperty('discount')) {
        product.discount = 0;
      }

      const editedProduct = await editGood(form.id, product);
      const index = goods.findIndex((good) => good.id == form.id);
      const row = list.children[index + 1]; // index = 0 - это шапка th в таблице

      if (index !== -1) {
        goods[index] = editedProduct;
        row.replaceWith(createRow(editedProduct));
      }
    } else {
      const addedProduct = await addGood(product);
      list.append(createRow(addedProduct));
      goods.push(addedProduct);
    }

    updateTotalPrice(goods);
    closeModal(overlay);
  });
};

export default {
  modalControl,
  formControl,
  actionsControl,
};
