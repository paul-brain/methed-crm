import {createPreload} from './createElements.js';
import {createModal} from './createElements.js';

export const APIURL = 'https://knowledgeable-mammoth-parka.glitch.me/api/goods';
// export const APIURL = 'http://localhost:3000/api/goods';

const fetchRequest = async (url, {
  method = 'GET',
  callback,
  callbackError,
  body,
  headers,
}) => {
  try {
    const options = {
      method,
    };

    if (body) options.body = JSON.stringify(body);
    if (headers) options.headers = headers;

    const preload = createPreload();
    document.body.append(preload);

    const response = await fetch(url, options);
    const data = await response.json();

    preload.remove();

    if (response.ok) {
      if (callback) callback(null, data);

      return data;
    }

    throw new Error(`Ошибка ${response.status}: ${data.message}`);
  } catch (err) {
    callbackError(err.message);

    return [];
  }
};

export const errorNotice = async (message) => {
  const modalOverlay = await createModal();
  const modalWrong = modalOverlay.querySelector('.modal-wrong');
  const modalText = modalOverlay.querySelector('.modal-wrong__text');

  if (message.includes('Ошибка')) {
    modalText.textContent = message;
  } else {
    modalText.textContent = 'Что-то пошло не так';
  }

  document.body.append(modalOverlay);
  modalOverlay.classList.add('overlay--show');
  modalWrong.classList.add('modal-wrong--show');
};

export const getGoods = (search = '') => {
  const url = new URL(APIURL);
  const options = {
    method: 'GET',
    callbackError: errorNotice,
  };

  if (search) {
    url.searchParams.append('search', search);
  }

  const goods = fetchRequest(url, options);

  return goods;
};

export const getGood = (id) => {
  const url = `${APIURL}/${id}`;
  const options = {
    method: 'GET',
    callbackError: errorNotice,
  };
  const good = fetchRequest(url, options);

  return good;
};

export const addGood = (product) => {
  const url = APIURL;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: product,
    callbackError: errorNotice,
  };
  const good = fetchRequest(url, options);

  return good;
};

export const editGood = (id, product) => {
  const url = `${APIURL}/${id}`;
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: product,
    callbackError: errorNotice,
  };
  const good = fetchRequest(url, options);

  return good;
};

export const deleteGood = (id) => {
  const url = `${APIURL}/${id}`;
  const options = {
    method: 'delete',
    callbackError: errorNotice,
  };
  fetchRequest(url, options);
};

export const getCategories = () => {
  const url = new URL(APIURL.replace('goods', 'category'));
  const options = {
    method: 'GET',
    callbackError: errorNotice,
  };

  const categories = fetchRequest(url, options);

  return categories;
};
