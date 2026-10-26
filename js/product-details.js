(() => {
  const id = new URLSearchParams(location.search).get('id');
  const product = catalogData.getProduct(id);
  const detail = document.querySelector('#product-detail');
  const unavailable = document.querySelector('#product-unavailable');
  if (!product) {
    unavailable.hidden = false;
    document.title = 'Không tìm thấy sản phẩm — Chương Phi';
    return;
  }
  const back = document.querySelector('#product-back');
  back.href = `san-pham.html#${product.categoryId}`;
  const breadcrumb = document.querySelector('#product-breadcrumb');
  product.path.forEach(category => {
    const separator = document.createElement('span');
    separator.textContent = '/';
    separator.setAttribute('aria-hidden', 'true');
    const link = document.createElement('a');
    link.href = `san-pham.html#${category.id}`;
    link.textContent = category.label;
    breadcrumb.append(separator, link);
  });
  const separator = document.createElement('span');
  separator.textContent = '/';
  separator.setAttribute('aria-hidden', 'true');
  const current = document.createElement('span');
  current.textContent = product.name;
  current.setAttribute('aria-current', 'page');
  breadcrumb.append(separator, current);
  document.querySelector('#product-detail-name').textContent = product.name;
  document.querySelector('#product-detail-category').textContent = product.path.at(-1)?.label || 'Sản phẩm';
  if (product.image) {
    const image = document.createElement('img');
    image.id = 'product-detail-image';
    image.src = product.image;
    image.alt = product.name;
    image.width = 960;
    image.height = 1280;
    document.querySelector('#product-detail-photo').replaceChildren(image);
  }
  const content = document.querySelector('#product-detail-fields');
  if (product.details) {
    product.details.fields.forEach(field => {
      const section = document.createElement('section');
      section.className = 'product-detail-field';
      const title = document.createElement('h2');
      title.textContent = field.label;
      section.append(title);
      let list;
      field.content.forEach(item => {
        if (item.kind === 'heading') {
          const subheading = document.createElement('h3');
          subheading.textContent = item.text;
          section.append(subheading);
          list = null;
        } else {
          if (!list) {
            list = document.createElement('ul');
            section.append(list);
          }
          const line = document.createElement('li');
          line.textContent = item.text;
          list.append(line);
        }
      });
      if (!field.content.length) {
        const pending = document.createElement('p');
        pending.className = 'detail-pending';
        pending.textContent = 'Đang cập nhật.';
        section.append(pending);
      }
      content.append(section);
    });
  } else {
    const pending = document.createElement('p');
    pending.className = 'detail-pending';
    pending.textContent = 'Thông tin chi tiết sản phẩm đang được cập nhật.';
    content.append(pending);
  }
  detail.hidden = false;
  document.title = `${product.name} — CTY TNHH TMDV CHƯƠNG PHI`;
  document.querySelector('meta[name="description"]').content = `Thông tin sản phẩm ${product.name} tại Chương Phi.`;
})();
