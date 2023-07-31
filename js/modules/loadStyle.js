export const loadStyle = (url) => new Promise((resolve) => {
  const link = document.createElement('link');

  link.rel = 'stylesheet';
  link.href = url;
  link.addEventListener('load', () => {
    resolve();
  });
  document.head.append(link);
});
