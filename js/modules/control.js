import {updateTotalPrice} from './render.js';
import {addGood} from './ajax.js';
import {deleteGood} from './ajax.js';
import {createRow} from './createElements.js';

const closeModal = (modalOverlay) => {
  modalOverlay.classList.remove('overlay--show');

  for (let modal of modalOverlay.children) {
    modal.classList.remove('modal--show', 'modal-wrong--show');
  }
};

// Обработка событий: открыть/закрыть модальное окно
const modalControl = (addBtn, modalOverlay) => {
  addBtn.addEventListener('click', () => {
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

// Удаление товара по кнопке из базы и в таблице
const deleteControl = (list, goods) => {
  list.addEventListener('click', e => {
    const target = e.target;

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
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const productToAdd = Object.fromEntries(formData);
    const addedProduct = await addGood(productToAdd);
    list.append(createRow(addedProduct));
    goods.push(addedProduct);
    updateTotalPrice(goods);
    console.log(addedProduct);
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
