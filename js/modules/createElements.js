export const createRow = (product) => {
  const tr = document.createElement('tr');
  let tdItems = [
    'id', 'title', 'category', 'units', 'count', 'price', 'total', 'btns',
  ];

  tdItems = tdItems.map((item) => {
    const td = document.createElement('td');

    if (item === 'total') {
      td.append(product.price * product.count);
    } else if (item === 'btns') {
      td.insertAdjacentHTML('afterBegin', `<div class="products__actions">
        <button class="products__actions-btn products__actions-btn--img">
        </button>
        <button class="products__actions-btn products__actions-btn--edit">
        </button>
        <button class="products__actions-btn products__actions-btn--delete">
        </button>
      </div>`);
    } else {
      td.append(product[item]);
    }

    return td;
  });

  tdItems.forEach((item) => {
    tr.append(item);
  });

  // tr.setAttribute('data-pic', 'url');
  tr.dataset.pic = 'img/promo-item-3.jpg';

  return tr;
};

export const createModal = () => {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.insertAdjacentHTML('beforeend', `
  <div class="modal">
    <div class="modal__headers">
      <h3 class="modal__title">Добавить товар</h3>
      <div class="modal__info"></div>
    </div>
    <button class="modal__btn-close"></button>
    <form class="form" action="https://jsonplaceholder.typicode.com/posts" method="post">
      <fieldset class="form__inner">
        <label class="form__label form__label--name">
          <span class="form__label-text">Наименование</span>
          <input class="form__field-text" type="text" name="title" required value="">
        </label>
        <label class="form__label form__label--category">
          <span class="form__label-text">Категория</span>
          <input class="form__field-text" type="text" name="category" required value="">
        </label>
        <label class="form__label form__label--units">
          <span class="form__label-text">Единицы измерения</span>
          <input class="form__field-text" type="text" name="units" required value="">
        </label>

        <div class="form__discont">
          <label class="form__label" for="discont">
            <span class="form__label-text">Дисконт</span>
          </label>
          <label class="checkbox">
            <input class="checkbox__input" type="checkbox" name="discount_on">
          </label>
          <input class="form__field-text" type="number" name="discount" id="discont" disabled required>
        </div>

        <label class="form__label form__label--description">
          <span class="form__label-text">Описание</span>
          <textarea class="form__description" name="description" cols="20" rows="2" required></textarea>
        </label>
        <label class="form__label form__label--count">
          <span class="form__label-text">Количество</span>
          <input class="form__field-text" type="number" name="count" required value="">
        </label>
        <label class="form__label form__label--price">
          <span class="form__label-text">Цена</span>
          <input class="form__field-text" type="number" name="price" required value="">
        </label>
        <div class="form__notice">
          Изображение не должно превышать размер 1 Мб
        </div>
        <button class="form__btn btn form__btn--add-img" type="submit">Добавить изображение</button>
        <div class="form__downloads">
          <div class="form__downloads-inner">
            <img class="form__downloads-image" src="img/product-photo.jpg" alt="product photo">
          </div>
        </div>
        <!-- <input type="file" name="image"> -->
        <!-- <input type="hidden" name="id" value="101"> -->
      </fieldset>
      <fieldset class="form__outer">
        <div class="form__total">
          Итоговая стоимость:
          <p class="form__total-price">$900.00</p>
        </div>
        <button class="form__btn btn" type="submit">Отправить</button>
      </fieldset>
    </form>
  </div>
  <!-- Модальное окно: что-то пошло не так -->
  <div class="modal-wrong">
    <button class="modal__btn-close"></button>
    <img class="modal-wrong__img" src="img/wrong.svg" alt="Something went wrong">
    <div class="modal-wrong__text">Что-то пошло не так</div>
  </div>
  `);

  return overlay;
};
