import {createPreload} from './createElements.js';

const URL = 'https://knowledgeable-mammoth-parka.glitch.me/api/goods';

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
  }
};

export const errorNotice = (message) => {
  const modal = document.querySelector('.modal-wrong');
  const modalText = document.querySelector('.modal-wrong__text');
  const modalOverlay = document.querySelector('.overlay');

  if (message.includes('Ошибка')) {
    modalText.textContent = message;
  } else {
    modalText.textContent = 'Что-то пошло не так';
  }

  modalOverlay.classList.add('overlay--show');
  modal.classList.add('modal-wrong--show');
};

export const getGoods = () => {
  const url = URL;
  const options = {
    method: 'GET',
    callbackError: errorNotice,
  };
  const goods = fetchRequest(url, options);

  return goods;
};

export const getGood = (id) => {
  const url = `${URL}/${id}`;
  const options = {
    method: 'GET',
    callbackError: errorNotice,
  };
  const good = fetchRequest(url, options);

  return good;
};

export const addGood = (product) => {
  const url = URL;
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
  const url = `${URL}/${id}`;
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
  const url = `${URL}/${id}`;
  const options = {
    method: 'delete',
    callbackError: errorNotice,
  };
  fetchRequest(url, options);
};
