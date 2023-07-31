export const debounce = (callback, msec) => {
  let lastCall = 0;
  let lastCallTimer = NaN;

  return (...args) => {
    const previousCall = lastCall;

    lastCall = Date.now();

    if (previousCall && ((lastCall - previousCall) <= msec)) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout(() => callback(...args), msec);
  };
};
