const slides = [...document.querySelectorAll('.slide')];
const count = document.querySelector('#current-slide');
const progress = document.querySelector('.progress');
let active = 0;
let timer;
function showSlide(next) {
  if (!slides.length) return;
  active = (next + slides.length) % slides.length;
  slides.forEach((slide, index) => {
    slide.classList.toggle('is-active', index === active);
    slide.setAttribute('aria-hidden', index === active ? 'false' : 'true');
  });
  if (count) count.textContent = String(active + 1).padStart(2, '0');
  if (progress) {
    progress.classList.remove('run');
    void progress.offsetWidth;
    progress.classList.add('run');
  }
  clearTimeout(timer);
  timer = setTimeout(() => showSlide(active + 1), 6500);
}
document.querySelector('.prev')?.addEventListener('click', () => showSlide(active - 1));
document.querySelector('.next')?.addEventListener('click', () => showSlide(active + 1));
if (slides.length) showSlide(0);

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const productNav = document.querySelector('.nav-product');
const productMenuToggle = document.querySelector('.product-menu-toggle');
const productDropdown = document.querySelector('.product-dropdown');
let productMenuTimer;
function positionProductMenu() {
  if (!productNav || !productDropdown) return;
  if (window.innerWidth <= 600) {
    productDropdown.style.removeProperty('--product-menu-offset');
    return;
  }
  const anchorLeft = productNav.getBoundingClientRect().left;
  const menuWidth = productDropdown.offsetWidth;
  const left = Math.max(24, Math.min(anchorLeft, window.innerWidth - menuWidth - 24));
  productDropdown.style.setProperty('--product-menu-offset', `${left - anchorLeft}px`);
}
function setProductMenu(open) {
  clearTimeout(productMenuTimer);
  if (open) positionProductMenu();
  productNav?.classList.toggle('is-open', open);
  productMenuToggle?.setAttribute('aria-expanded', String(open));
  productMenuToggle?.setAttribute('aria-label', open ? 'Đóng danh mục sản phẩm' : 'Mở danh mục sản phẩm');
  if (productDropdown) productDropdown.inert = !open;
}
window.addEventListener('resize', () => {
  if (productNav?.classList.contains('is-open')) positionProductMenu();
});
productNav?.addEventListener('pointerenter', event => {
  if (event.pointerType === 'mouse') setProductMenu(true);
});
productNav?.addEventListener('pointerleave', event => {
  if (event.pointerType === 'mouse' && !productNav.contains(document.activeElement)) {
    productMenuTimer = setTimeout(() => setProductMenu(false), 140);
  }
});
productMenuToggle?.addEventListener('click', () => {
  setProductMenu(productMenuToggle.getAttribute('aria-expanded') !== 'true');
});
productNav?.addEventListener('focusout', event => {
  if (!productNav.contains(event.relatedTarget)) setProductMenu(false);
});
document.addEventListener('click', event => {
  if (!productNav?.contains(event.target)) setProductMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && productNav?.classList.contains('is-open')) {
    setProductMenu(false);
    productMenuToggle?.focus();
  }
});
productDropdown?.addEventListener('click', event => {
  if (event.target.closest('a')) {
    setProductMenu(false);
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
});
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  nav?.classList.toggle('open', !expanded);
  if (!expanded) setSearchOpen(false);
  if (expanded) setProductMenu(false);
});

const params = new URLSearchParams(location.search);
const searchInput = document.querySelector('.search input');
if (searchInput) searchInput.value = params.get('q') || '';
const searchForm = document.querySelector('.search');
const searchButton = searchForm?.querySelector('button');
const mobileSearch = window.matchMedia('(max-width: 600px)');
function setSearchOpen(open, focus = false) {
  searchForm?.classList.toggle('is-open', open);
  if (mobileSearch.matches) {
    searchButton?.setAttribute('aria-expanded', String(open));
    searchButton?.setAttribute('aria-label', open ? 'Tìm kiếm' : 'Mở tìm kiếm');
  } else {
    searchButton?.removeAttribute('aria-expanded');
    searchButton?.setAttribute('aria-label', 'Tìm kiếm');
  }
  if (focus) searchInput?.focus();
}
searchButton?.addEventListener('click', event => {
  if (mobileSearch.matches && !searchForm.classList.contains('is-open')) {
    event.preventDefault();
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    setProductMenu(false);
    setSearchOpen(true, true);
  }
});
searchForm?.addEventListener('submit', event => {
  if (!searchInput.value.trim() || mobileSearch.matches && !searchForm.classList.contains('is-open')) {
    event.preventDefault();
    event.stopImmediatePropagation();
    setSearchOpen(mobileSearch.matches, true);
  }
}, true);
document.addEventListener('click', event => {
  if (!searchForm?.contains(event.target)) setSearchOpen(false);
});
searchForm?.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileSearch.matches) {
    setSearchOpen(false);
    searchButton?.focus();
  }
});
mobileSearch.addEventListener('change', () => setSearchOpen(false));
setSearchOpen(false);

const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  const updateBackToTop = () => { backToTop.hidden = window.scrollY < 300; };
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  window.addEventListener('pageshow', updateBackToTop);
  backToTop.addEventListener('click', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    document.querySelector('.brand')?.focus({ preventScroll: true });
  });
  updateBackToTop();
}
