const catalogData = (() => {
  const brands = [
    ['vinh-phat-nong', 'VINH PHÁT NÔNG'], ['tan-thanh', 'TÂN THÀNH'],
    ['thon-trang', 'THÔN TRANG'], ['thd', 'THD'], ['viet-trung', 'VIỆT TRUNG']
  ];
  const brandGroup = (id, label) => ({ id, label, children: brands.map(([slug, name]) => ({ id: `${id}-${slug}`, label: name })) });
  const nestCategory = { id: 'yen-sao', label: 'Yến sào', children: [
    { id: 'yen-tho', label: 'Yến Thô' },
    { id: 'yen-tinh-khiet', label: 'Yến Tinh Khiết' }
  ] };
  const categories = [
    { id: 'vat-tu', label: 'Vật tư nông nghiệp', children: [brandGroup('thuoc-benh', 'Thuốc Bệnh'), brandGroup('thuoc-duong', 'Thuốc Dưỡng')] },
    { id: 'thuc-pham', label: 'Thực phẩm', children: [nestCategory] }
  ];
  const paths = new Map();
  function index(nodes, ancestors = []) {
    nodes.forEach(node => {
      const path = [...ancestors, node];
      paths.set(node.id, path);
      if (node.children) index(node.children, path);
    });
  }
  index(categories);
  const agriculturalProducts = [
    ['bo-doi-bom-nguyen-tu', 'BỘ ĐÔI BOM NGUYÊN TỬ', 'image/sanpham/BOMNGTU.png'],
    ['vifilia-xtra', 'VIFILIA XTRA', 'image/sanpham/VIFILIA XTRA.png'],
    ['vista-bis-100g', 'VISTA BIS 100G', 'image/sanpham/VISTAR BIS.png'],
    ['vitabim-usa-100g', 'VITABIM USA 100G', 'image/sanpham/VITABIM.png'],
    ['vitatop-xtra-250ml', 'VITATOP XTRA 250ML', 'image/sanpham/VITATOP XTRA.png'],
    ['vitracool-xtra', 'VITRACOOL XTRA', 'image/sanpham/VITRACOL XTRA.png'],
    ['vitrasumin-xtra', 'VITRASUMIN XTRA', 'image/sanpham/VIASUMIN XTRA.png']
  ].map(([id, name, image]) => ({
    id, name, categoryId: 'thuoc-benh-vinh-phat-nong',
    image, presentation: 'image-name'
  }));
  const nutritionProducts = [
    ['agrigood-620-500ml', 'AGRIGOOD 620 500ML', 'image/sanpham/AGRIGOOD.png'],
    ['duong-dong-thai', 'DƯỠNG ĐỒNG THÁI', 'image/sanpham/DUONGDONG.png'],
    ['giai-phap-lun-cay', 'GIẢI PHÁP LÙN CÂY'],
    ['humate-usa-mien-tim', 'HUMATE USA MIEN TÍM', 'image/sanpham/HUMATEUSA.png'],
    ['kali-huu-co-c33-500ml', 'KALI HỮU CƠ C33 500ML', 'image/sanpham/KALIC33.png'],
    ['nano-kem-usa-250ml', 'NANO KẼM USA 250ML'],
    ['nano-max-k-plus-plus', 'NANO MAX K++'],
    ['de-nhat-lun-cay-500ml', 'ĐỆ NHẤT LÙN CÂY 500ML'],
    ['de-nhat-vo-gao-lon', 'Nano flower top (Đệ Nhất Vo Gạo)', 'image/sanpham/DENHATVOGAO.png'],
    ['dong-to-bong-keo-250', 'ĐỒNG TỌ - BÔNG KẸO 250', 'image/sanpham/DONGTOBONGKEO.png'],
    ['rootbooast-500ml-ra-re', 'ROOTBOOAST 500ML - RA RỄ', 'image/sanpham/ROOTBOOAST.png'],
    ['sieu-nang-ky-500ml', 'SIÊU NẶNG KÝ 500ML', 'image/sanpham/SIEUNANGKY.png'],
    ['sua-thai-lun-cay-500ml', 'SỮA THÁI LÙN CÂY 500ML'],
    ['tro-thoat-thai', 'TRỔ THOÁT THÁI', 'image/sanpham/TROTHOAT.png'],
    ['ut-tracer', 'UT Tracers (Giải Pháp Lùn Cây)', 'image/sanpham/UTTRACERS.png']
  ].map(([id, name, image = null]) => ({
    id, name, categoryId: 'thuoc-duong-vinh-phat-nong',
    image, presentation: 'image-name'
  }));
  const nestProducts = nestCategory.children.map(type => ({
    id: type.id, categoryId: type.id, name: type.label, option: 'Sỉ/Lẻ',
    image: type.id === 'yen-tinh-khiet' ? 'image/sanpham/yen-tinh-khiet.png' : 'image/sanpham/yen-tho-tach-nen.png',
    price: 'Giá liên hệ'
  }));
  // Tạm ẩn cho đến khi bổ sung đủ thông tin, hình ảnh và được yêu cầu hiện lại.
  // Để hiện lại một sản phẩm, xóa ID tương ứng khỏi danh sách này.
  const hiddenProductIds = new Set([
    'giai-phap-lun-cay',
    'nano-kem-usa-250ml',
    'nano-max-k-plus-plus',
    'de-nhat-lun-cay-500ml',
    'sua-thai-lun-cay-500ml'
  ]);
  const products = [...agriculturalProducts, ...nutritionProducts, ...nestProducts];
  if (typeof productDetailsData !== 'undefined') {
    products.forEach(product => {
      const details = productDetailsData[product.id];
      if (details) {
        product.name = details.title;
        product.details = details;
      }
    });
  }
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLocaleLowerCase('vi').trim();
  const matches = (value, search) => normalize(search).split(/\s+/).every(term => normalize(value).includes(term));
  function getView(id = 'tat-ca', search = '') {
    // Previously shared Gram/Kg links still open the corresponding product.
    const categoryId = id.replace(/^(yen-(?:tho|tinh-khiet))-(?:gram|kg)$/, '$1');
    const path = paths.get(categoryId) || [];
    const selected = path.length ? categoryId : 'tat-ca';
    const withinSelection = candidate => selected === 'tat-ca' || paths.get(candidate).some(node => node.id === selected);
    return {
      id: selected, label: path.at(-1)?.label || 'Tất cả sản phẩm', path,
      products: products.filter(product => !hiddenProductIds.has(product.id) && withinSelection(product.categoryId) && matches(product.name, search)),
      matchingCategories: search.trim() ? [...paths.entries()].filter(([slug, nodes]) => withinSelection(slug) && matches(nodes.map(node => node.label).join(' '), search)).map(([, nodes]) => nodes.at(-1)) : []
    };
  }
  function getProduct(id) {
    const product = products.find(item => item.id === id && !hiddenProductIds.has(item.id));
    return product ? { ...product, path: paths.get(product.categoryId) || [] } : null;
  }
  return { categories, products, getView, getProduct };
})();
