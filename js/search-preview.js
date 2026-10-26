(() => {
  const form = document.querySelector('.search');
  const input = form?.querySelector('input');
  if (!input || typeof catalogData === 'undefined') return;

  form.classList.add('search-with-preview');
  const panel = document.createElement('section');
  panel.id = 'search-preview';
  panel.className = 'search-preview';
  panel.setAttribute('aria-label', 'Kết quả tìm kiếm sản phẩm');
  panel.hidden = true;
  const status = document.createElement('p');
  status.className = 'search-preview-status';
  status.setAttribute('role', 'status');
  const list = document.createElement('ul');
  panel.append(status, list);
  form.append(panel);
  input.setAttribute('aria-controls', panel.id);
  input.setAttribute('autocomplete', 'off');

  function close() {
    panel.hidden = true;
  }
  function render() {
    const query = input.value.trim();
    if (!query) {
      list.replaceChildren();
      status.textContent = '';
      close();
      return;
    }
    const products = catalogData.getView('tat-ca', query).products;
    list.replaceChildren();
    status.textContent = products.length ? `${products.length} sản phẩm` : 'Chưa tìm thấy sản phẩm phù hợp';
    products.forEach(product => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = product.presentation === 'image-name'
        ? `chi-tiet-san-pham.html?id=${encodeURIComponent(product.id)}`
        : `san-pham.html#${encodeURIComponent(product.categoryId)}`;
      if (product.image) {
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = '';
        image.width = 48;
        image.height = 60;
        image.loading = 'lazy';
        link.append(image);
      }
      const name = document.createElement('span');
      name.textContent = [product.name, product.option].filter(Boolean).join(' — ');
      link.append(name);
      item.append(link);
      list.append(item);
    });
    panel.hidden = false;
  }
  input.addEventListener('input', event => {
    if (!event.isComposing) render();
  });
  input.addEventListener('compositionend', render);
  input.addEventListener('focus', render);
  form.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowDown' && event.target === input && !panel.hidden) {
      const first = list.querySelector('a');
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  form.addEventListener('focusout', event => {
    // Mobile taps can blur the input with no relatedTarget before the link's
    // click fires. Keep results available; the outside-click handler closes them.
    if (event.relatedTarget && !form.contains(event.relatedTarget)) close();
  });
  document.addEventListener('click', event => {
    if (!form.contains(event.target)) close();
  });
})();
