const styles = new Map();

export const loadStyle = (url) => {
  if (styles.has(url)) {
    return styles.get(url);
  }

  const p = new Promise((resolve) => {
    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;
    link.addEventListener('load', () => {
      resolve();
    });
    document.head.append(link);
  });

  styles.set(url, p);

  return p;
};
