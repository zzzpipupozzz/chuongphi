(() => {
  const sidebar = document.querySelector('#catalog-tree');
  const results = document.querySelector('#product-results');
  if (!sidebar || !results) return;
  const heading = document.querySelector('#catalog-title');
  const breadcrumb = document.querySelector('#catalog-breadcrumb');
  const resultCount = document.querySelector('#product-count');
  const searchForm = document.querySelector('.search');
  const searchField = searchForm.querySelector('input');
  let search = new URLSearchParams(location.search).get('q') || '';
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  function categoryLink(node) {
    return `<a href="#${node.id}" data-category="${node.id}">${escape(node.label)}</a>`;
  }
  function tree(nodes, depth = 0) {
    return `<ul class="toc-level toc-level-${depth}">${nodes.map(node => `<li>${node.children
      ? `<details data-branch="${node.id}"${depth === 0 ? ' open' : ''}><summary>${categoryLink(node)}<span class="toc-expand" aria-hidden="true">+</span></summary>${tree(node.children, depth + 1)}</details>`
      : categoryLink(node)}</li>`).join('')}</ul>`;
  }
  sidebar.innerHTML = `<a class="toc-all" href="#tat-ca" data-category="tat-ca">Tất cả sản phẩm <span aria-hidden="true"><svg class="link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 3h6v6M21 3l-9 9"/><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/></svg></span></a>${tree(catalogData.categories)}`;
  function productCard(product) {
    if (product.presentation === 'image-name') {
      const visual = product.image
        ? `<img src="${product.image}" alt="${escape(product.name)}" width="960" height="1280" loading="lazy">`
        : '<span class="product-image-pending">Đang cập nhật</span>';
      return `<article class="product-card product-card-simple" id="product-${product.id}">
        <a class="product-card-image product-detail-link" href="chi-tiet-san-pham.html?id=${encodeURIComponent(product.id)}" aria-label="Xem chi tiết ${escape(product.name)}">${visual}</a>
        <div class="product-card-info"><h2>${escape(product.name)}</h2></div>
      </article>`;
    }
    return `<article class="product-card" id="product-${product.id}">
      <div class="product-card-image"><img src="${product.image}" alt="${escape(`${product.name} — ${product.option}`)}" width="960" height="1280" loading="lazy"></div>
      <div class="product-card-info"><span class="category-label">YẾN SÀO</span><h2>${escape(product.name)}</h2><p class="product-option">${escape(product.option)}</p><a class="contact-price" href="lien-he.html" aria-label="Liên hệ báo giá ${escape(product.name)}">${escape(product.price)}</a></div>
    </article>`;
  }
  function render() {
    const view = catalogData.getView(location.hash.slice(1), search);
    heading.textContent = search.trim() ? `Kết quả tìm kiếm: “${search}”` : view.label;
    breadcrumb.replaceChildren();
    const home = document.createElement('a');
    home.href = 'index.html';
    home.textContent = 'Trang chủ';
    breadcrumb.append(home);
    const labels = ['Sản phẩm', ...view.path.map(node => node.label)];
    labels.forEach(label => {
      const separator = document.createElement('span');
      separator.textContent = '/';
      separator.setAttribute('aria-hidden', 'true');
      const item = document.createElement('span');
      item.textContent = label;
      breadcrumb.append(separator, item);
    });
    sidebar.querySelectorAll('[data-category]').forEach(link => {
      const active = link.dataset.category === view.id;
      link.classList.toggle('is-selected', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    sidebar.querySelectorAll('[data-branch]').forEach(branch => {
      if (view.path.some(node => node.id === branch.dataset.branch)) branch.open = true;
    });
    resultCount.textContent = `${view.products.length} sản phẩm`;
    if (view.products.length) {
      results.innerHTML = `<div class="product-list">${view.products.map(productCard).join('')}</div>`;
    } else {
      results.innerHTML = `<div class="catalog-empty"><span class="empty-leaf" aria-hidden="true">❧</span><h2>${search.trim() ? 'Chưa tìm thấy sản phẩm phù hợp' : 'Sản phẩm đang được cập nhật'}</h2><p>${search.trim() ? 'Bạn có thể thử từ khóa khác hoặc chọn một danh mục bên trái.' : 'Danh mục này hiện chưa có sản phẩm.'}</p>${view.matchingCategories.length ? `<div class="matching-categories"><p>Danh mục phù hợp</p>${view.matchingCategories.map(categoryLink).join('')}</div>` : ''}</div>`;
    }
    document.title = `${view.label} — Cty TNHH TMDV Chương Phi`;
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || !catalogData.getView(url.hash.slice(1)).path.length && url.hash !== '#tat-ca') return;
    event.preventDefault();
    search = '';
    searchField.value = '';
    history.pushState(null, '', `${location.pathname}${url.hash}`);
    render();
    if (link.closest('.catalog-sidebar, #product-results')) {
      document.querySelector('.catalog-results').scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  });
  function updateSearch() {
    search = searchField.value.trim();
    const url = new URL(location.href);
    url.search = '';
    if (search) url.searchParams.set('q', search);
    url.hash = '';
    history.replaceState(null, '', url);
    render();
  }
  searchField.addEventListener('input', event => {
    if (!event.isComposing) updateSearch();
  });
  searchField.addEventListener('compositionend', updateSearch);
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    updateSearch();
    document.querySelector('.catalog-results').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  const restore = () => {
    search = new URLSearchParams(location.search).get('q') || '';
    searchField.value = search;
    render();
  };
  window.addEventListener('popstate', restore);
  window.addEventListener('hashchange', restore);
  restore();
})();
