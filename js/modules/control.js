import {updateTotalPrice} from './render.js';
import {addGood} from './ajax.js';
import {getGood} from './ajax.js';
import {editGood} from './ajax.js';
import {deleteGood} from './ajax.js';
import {APIURL} from './ajax.js';
import {createModal} from './createElements.js';
import {debounce} from './debounce.js';
import {getGoods} from './ajax.js';
import {renderGoods} from './render.js';
import {toBase64} from './helpers.js';

const closeModal = (modalOverlay) => {
  const form = modalOverlay.querySelector('.form');
  const previewWrapper = form.querySelector('.form__downloads-inner');

  form.querySelector('.form__total-price').textContent = '$0';
  modalOverlay.querySelector('.modal__info').textContent = '';
  modalOverlay.querySelector('.modal__title').textContent = 'Добавить товар';
  modalOverlay.classList.remove('overlay--show');
  previewWrapper.innerHTML = '';

  for (const modal of modalOverlay.children) {
    modal.classList.remove('modal--show', 'modal-wrong--show');
  }

  form.id = '';
  form.discount_on.removeAttribute('checked');
  form.discount.setAttribute('disabled', 'disabled');
  form.reset();
};

// Обработка событий: открыть/закрыть модальное окно
const modalControl = async (addBtn) => {
  const modalOverlay = await createModal();

  addBtn.addEventListener('click', (e) => {
    document.body.append(modalOverlay);
    modalOverlay.classList.add('overlay--show');
    modalOverlay.firstElementChild.classList.add('modal--show');
    // console.log(e.target);
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

// Обработка действий товара в таблице: показать картинку, редактировать, удалить
export const actionsControl = (list) => {
  list.removeEventListener('click', actionsHandler);
  list.addEventListener('click', actionsHandler);
};

async function actionsHandler(e) {
  const target = e.target;

  // Нажали на кнопку «изображение» – показать картинку
  if (target.classList.contains('products__actions-btn--img')) {
    const tr = target.closest('tr');
    // const imgUrl = location.origin + '/' + tr.dataset.pic;
    const imgUrl =  APIURL.replace('api/goods', '') + tr.dataset.pic;

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
    const modalOverlay = await createModal();
    const form = modalOverlay.querySelector('.form');

    modalOverlay.querySelector('.modal__title').textContent = 'Редактировать товар';
    modalOverlay.querySelector('.modal__info').textContent = 'id: ' + productId;
    form.querySelector('.form__total-price').textContent = '$' + good.price * good.count;

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

    // Отобразить изображение товара:
    if (row.dataset.pic !== 'image/notimage.jpg') {
      const imgUrl =  APIURL.replace('api/goods', '') + row.dataset.pic;
      const btnText = form.querySelector('.btn-file__text');
      const previewWrapper = form.querySelector('.form__downloads-inner');
      const preview = document.createElement('img');
      // const src = URL.createObjectURL(imgUrl);
      preview.src = imgUrl;
      previewWrapper.append(preview);
      btnText.textContent = 'Изменить изображение';
    }

    document.body.append(modalOverlay);
    modalOverlay.classList.add('overlay--show');
    modalOverlay.firstElementChild.classList.add('modal--show');
  }

  // Удаление товара по кнопке из базы и в таблице
  if (target.classList.contains('products__actions-btn--delete')) {
    const confirmation = confirm('Вы действительно хотите удалить этот товар?');

    if (confirmation) {
      const row = target.closest('tr');
      const productId = row.firstElementChild.textContent;
      // const id = goods.findIndex((good) => good.id === productId);

      /* if (id !== -1) {
        goods.splice(id, 1); */
        deleteGood(productId);
        row.remove();
      // }

      const goods = await getGoods();
      updateTotalPrice(goods);
    }
  }
};

// Работа с формой в модальном окне
export const formControl = async (overlay) => {
  const form = overlay.querySelector('.form');
  const formTotalPrice = form.querySelector('.form__total-price');
  const list = document.querySelector('.products__list tbody');
  const notice = form.querySelector('.form__notice');
  const previewWrapper = form.querySelector('.form__downloads-inner');

  // Сбрасываем выбор файла при клике на Wrapper
  previewWrapper.addEventListener('click', () => {
    const inputFile = form.querySelector('.btn-file__input');
    inputFile.value = ""; // target.files.length = 0
    previewWrapper.textContent = '';
    notice.textContent = '';
    inputFile.nextElementSibling.textContent = 'Добавить изображение';
  });

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

    // Обновление итоговой суммы на лету при добавлении товара
    if (target === form.count || target === form.price) {
      formTotalPrice.textContent = '$' + form.price.value * form.count.value;
    }

    // Работа с кнопкой «Добавить изображение»
    if (target.classList.contains('btn-file') && target.files.length > 0) {
      console.log('target: ', target);
      const image = target.files[0];  // Экземпляр класса File
      const btnText = target.nextElementSibling; // span ниже input file
      const preview = document.createElement('img');
      const src = URL.createObjectURL(image);

      if (image.size > 1048576) {
        notice.textContent = 'Изображение не должно превышать размер 1 Мб';
        target.value = ""; // сброс input file
      } else {
        notice.textContent = '';
        preview.src = src;
        previewWrapper.innerHTML = '';
        previewWrapper.append(preview);
        btnText.textContent = image.name;
      }
    }
  });

  // Работа с полями: запрещаем ввод не валидных значений
  form.addEventListener('input', e => {
    const target = e.target;

    if (
      target.classList.contains('form__field-text') ||
      target.classList.contains('form__description')
    ) {
      if (['title', 'category', 'description'].includes(target.name)) {
        target.value = target.value.replace(/[^а-яё ]+/gi, ''); // только кириллица и пробел
      }

      if (['discount', 'count', 'price'].includes(target.name)) {
        target.value = target.value.replace(/\D+/gi, ''); // только цифры
      }

      if (target.name === 'units') {
        target.value = target.value.replace(/[^а-яё]+/gi, ''); // только кириллица
      }
    }
  });

  // Обработка событий формы: добавить новый товар, обновить итоговую сумму
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const product = Object.fromEntries(formData);
    const notice = form.querySelector('.form__notice');

    if (product.description.length < 80) {
      notice.textContent = 'Описание должно быть не менее 80 символов';
    } else {
      notice.textContent = '';

      if (product.image.size > 0 && product.image.size < 1048576) {
        product.image = await toBase64(product.image);
      }
      console.log(product.image);

      // Если есть ID товара, то редактируем. Иначе - создаем
      if (form.id) {
        if (!product.hasOwnProperty('discount')) {
          product.discount = 0;
        }

        const editedProduct = await editGood(form.id, product);
        console.log('editedProduct: ', editedProduct);

        /* const index = goods.findIndex((good) => good.id == form.id);
        const row = list.children[index + 1]; // index = 0 - это шапка th в таблице

        if (index !== -1) {
          goods[index] = editedProduct;
          row.replaceWith(createRow(editedProduct));
        } */
      } else {
        const addedProduct = await addGood(product);
        console.log('addedProduct: ', addedProduct);
        /* list.append(createRow(addedProduct));
        goods.push(addedProduct); */
      }

      const goods = await getGoods();

      renderGoods(list, goods);
      updateTotalPrice(goods);
      closeModal(overlay);
    }
  });
};

// Работа с поиском
const searchControl = (list) => {
  const searchForm = document.querySelector('.products__search');

  // Живой поиск товаров, задержка 300мс
  searchForm.addEventListener('input', debounce(async () => {
    const goods = await getGoods(searchForm.search.value);

    renderGoods(list, goods);
  }, 300));

  // Нажали на кнопку «отправить» – ничего не делаем
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
  });
};

export default {
  modalControl,
  formControl,
  actionsControl,
  searchControl,
};
