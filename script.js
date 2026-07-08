
  // ---- product data ----
  const products = [
    { id:1, name:'کاناپه وکتور', cat:'نشیمن', price:58000000, oldPrice:null, rating:5, icon:'sofa', cls:'pi1', badge:null },
    { id:2, name:'صندلی پالس', cat:'ناهارخوری', price:9400000, oldPrice:12000000, rating:4, icon:'chair', cls:'pi2', badge:'sale' },
    { id:3, name:'میز آرک', cat:'ناهارخوری', price:39000000, oldPrice:null, rating:5, icon:'table', cls:'pi3', badge:'پرفروش' },
    { id:4, name:'تخت دماوند', cat:'اتاق‌خواب', price:54000000, oldPrice:66000000, rating:4, icon:'bed', cls:'pi4', badge:'sale' },
    { id:5, name:'مبل تک لوپ', cat:'نشیمن', price:22000000, oldPrice:null, rating:5, icon:'sofa', cls:'pi5', badge:null },
    { id:6, name:'میز کار اسپن', cat:'اداری', price:18500000, oldPrice:null, rating:4, icon:'table', cls:'pi6', badge:'جدید' },
  ];

  const icons = {
    sofa: `<path d="M14 55 v-16 a10 10 0 0 1 10-10 h72 a10 10 0 0 1 10 10 v16"/><path d="M10 55 h100 v18 a5 5 0 0 1-5 5 h-6 a5 5 0 0 1-5-5 v-8 h-68 v8 a5 5 0 0 1-5 5 h-6 a5 5 0 0 1-5-5 z"/><path d="M24 29 c-5 8 -5 18 2 26"/><path d="M96 29 c5 8 5 18 -2 26"/>`,
    chair: `<path d="M22 10 v40 a6 6 0 0 0 6 6 h34 a6 6 0 0 0 6-6 v-40"/><path d="M22 24 h46"/><path d="M28 56 l-6 34"/><path d="M62 56 l6 34"/><path d="M34 56 l-3 34"/><path d="M56 56 l3 34"/>`,
    table: `<path d="M8 20 h94 l-10 14 h-74 z"/><path d="M18 34 v40"/><path d="M92 34 v40"/>`,
    bed: `<path d="M6 40 h98 v30 h-98 z"/><path d="M6 40 v-14 a6 6 0 0 1 6-6 h20 a6 6 0 0 1 6 6 v14"/><path d="M10 70 v14 M100 70 v14"/>`
  };

  const fmt = n => n.toLocaleString('fa-IR');

  const grid = document.getElementById('productGrid');
  function renderProducts(filter='all'){
    grid.innerHTML = '';
    products.filter(p => filter==='all' || p.cat===filter).forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'p-card reveal';
      el.style.transitionDelay = (i%3)*0.08 + 's';
      el.innerHTML = `
        ${p.badge ? `<span class="p-badge ${p.badge==='sale'?'sale':''}">${p.badge==='sale'?'تخفیف':p.badge}</span>` : ''}
        <div class="p-img ${p.cls}"><svg viewBox="0 0 110 90" fill="none">${icons[p.icon]}</svg></div>
        <div class="p-body">
          <span class="p-cat">${p.cat}</span>
          <h4>${p.name}</h4>
          <div class="stars">${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</div>
          <div class="p-meta">
            <div class="price-block">
              ${p.oldPrice ? `<span class="price old en">${fmt(p.oldPrice)}</span>` : ''}
              <span class="price en">${fmt(p.price)} ت</span>
            </div>
            <button class="add-btn" data-id="${p.id}">+</button>
          </div>
        </div>`;
      grid.appendChild(el);
    });
    observeReveal();
    grid.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        addToCart(parseInt(btn.dataset.id));
        btn.classList.add('added');
        btn.textContent = '✓';
        setTimeout(() => { btn.classList.remove('added'); btn.textContent = '+'; }, 900);
      });
    });
  }

  // ---- cart state ----
  let cart = [];
  function addToCart(id){
    const existing = cart.find(c => c.id === id);
    if(existing) existing.qty++;
    else cart.push({ id, qty:1 });
    renderCart();
    const badge = document.getElementById('cartBadge');
    badge.textContent = cart.reduce((s,c)=>s+c.qty,0);
    badge.classList.remove('pulse'); void badge.offsetWidth; badge.classList.add('pulse');
  }
  function changeQty(id, delta){
    const item = cart.find(c => c.id === id);
    if(!item) return;
    item.qty += delta;
    if(item.qty <= 0) cart = cart.filter(c => c.id !== id);
    renderCart();
    document.getElementById('cartBadge').textContent = cart.reduce((s,c)=>s+c.qty,0);
  }
  function removeItem(id){
    cart = cart.filter(c => c.id !== id);
    renderCart();
    document.getElementById('cartBadge').textContent = cart.reduce((s,c)=>s+c.qty,0);
  }
  function renderCart(){
    const body = document.getElementById('cartBody');
    const footer = document.getElementById('cartFooter');
    if(cart.length === 0){
      body.innerHTML = `<div class="empty-state">سبد خرید شما خالیه<br><br>یک محصول اضافه کنید تا اینجا نشونش بدیم.</div>`;
      footer.innerHTML = '';
      return;
    }
    body.innerHTML = cart.map(c => {
      const p = products.find(pp => pp.id === c.id);
      return `
      <div class="cart-item">
        <div class="thumb ${p.cls}"><svg viewBox="0 0 110 90" fill="none">${icons[p.icon]}</svg></div>
        <div class="info">
          <h5>${p.name}</h5>
          <span class="price en">${fmt(p.price)} ت</span>
          <div class="qty-row">
            <button class="qty-btn" onclick="changeQty(${c.id},-1)">−</button>
            <span class="en">${c.qty}</span>
            <button class="qty-btn" onclick="changeQty(${c.id},1)">+</button>
            <button class="remove-btn" onclick="removeItem(${c.id})">حذف</button>
          </div>
        </div>
      </div>`;
    }).join('');
    const subtotal = cart.reduce((s,c) => s + products.find(p=>p.id===c.id).price * c.qty, 0);
    footer.innerHTML = `
      <div class="subtotal-row"><span>جمع کل</span><span class="amt en">${fmt(subtotal)} تومان</span></div>
      <button class="checkout-btn">ادامه فرآیند خرید</button>`;
  }
  renderCart();
  renderProducts();

  // ---- filters ----
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderProducts(chip.dataset.filter);
    });
  });

  // ---- drawers ----
  const overlay = document.getElementById('overlay');
  function openDrawer(which){
    overlay.classList.add('show');
    document.getElementById(which === 'cart' ? 'cartDrawer' : 'accountDrawer').classList.add('open');
    if(which === 'account') animateAccountPanel();
  }
  function closeDrawers(){
    overlay.classList.remove('show');
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('accountDrawer').classList.remove('open');
  }
  overlay.addEventListener('click', closeDrawers);

  // account tabs with sliding indicator
  const tabIndicator = document.querySelector('.tab-indicator');
  function moveIndicator(tabEl){
    if(!tabEl || !tabIndicator) return;
    tabIndicator.style.width = tabEl.offsetWidth + 'px';
    tabIndicator.style.left = tabEl.offsetLeft + 'px';
  }
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      moveIndicator(tab);
    });
  });

  // toggle switches
  document.querySelectorAll('[data-toggle]').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });

  function animateAccountPanel(){
    const activeTab = document.querySelector('.tab.active');
    setTimeout(() => moveIndicator(activeTab), 50);
    setTimeout(() => {
      const loyaltyFill = document.getElementById('loyaltyFill');
      if(loyaltyFill) loyaltyFill.style.width = '82%';
      document.querySelectorAll('.order-track .fill').forEach(f => {
        f.style.width = f.dataset.progress + '%';
      });
    }, 150);
  }

  // ---- hero slider ----
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dotsWrap = document.getElementById('sliderDots');
  const bar = document.getElementById('sliderBar');
  let current = 0;
  let sliderTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 's-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = document.querySelectorAll('.s-dot');

  function goToSlide(i){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    restartBar();
  }
  function nextSlide(){ goToSlide(current + 1); }
  function prevSlide(){ goToSlide(current - 1); }
  function restartBar(){
    bar.classList.remove('animate');
    void bar.offsetWidth;
    bar.classList.add('animate');
    clearTimeout(sliderTimer);
    sliderTimer = setTimeout(nextSlide, 5000);
  }
  document.getElementById('nextSlide').addEventListener('click', () => { nextSlide(); });
  document.getElementById('prevSlide').addEventListener('click', () => { prevSlide(); });
  restartBar();

  // header solid + reveal
  const hd = document.getElementById('hd');
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    hd.classList.toggle('solid', window.scrollY > 40);
    toTop.classList.toggle('show', window.scrollY > 600);
  });
  toTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  function observeReveal(){
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.12});
    els.forEach(el => io.observe(el));
  }
  observeReveal();