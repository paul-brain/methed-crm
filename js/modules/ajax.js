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

    const response = await fetch(url, options);
    const data = await response.json();

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
  const url = 'https://knowledgeable-mammoth-parka.glitch.me/api/goods';
  const options = {
    method: 'GET',
    callbackError: errorNotice,
  };
  const goods = fetchRequest(url, options);

  return goods;
};

export const addGood = (product) => {
  const url = 'https://knowledgeable-mammoth-parka.glitch.me/api/goods';
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

export const deleteGood = (id) => {
  const url = `https://knowledgeable-mammoth-parka.glitch.me/api/goods/${id}`;
  const options = {
    method: 'delete',
    callbackError: errorNotice,
  };
  fetchRequest(url, options);
};
