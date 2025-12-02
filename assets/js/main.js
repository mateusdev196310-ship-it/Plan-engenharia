document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-list');
  const heroTopnav = document.querySelector('.hero-topnav');
  if (toggle) {
    // Desktop header menu
    if (nav) {
      toggle.addEventListener('click', () => nav.classList.toggle('open'));
      nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') nav.classList.remove('open');
      });
    } else if (heroTopnav) {
      // Mobile-only hero nav: toggles a global menu-open state
      const body = document.body;
      toggle.addEventListener('click', () => {
        const open = body.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      heroTopnav.addEventListener('click', (e) => {
        const t = e.target;
        if (t && t.tagName === 'A') {
          document.body.classList.remove('menu-open');
          toggle.setAttribute('aria-expanded','false');
        }
      });
    }
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
      }
    });
  });

  // Simple hero slider
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const prev = document.querySelector('.hero-controls .prev') || document.querySelector('.hero-panel .panel-controls .prev');
  const next = document.querySelector('.hero-controls .next') || document.querySelector('.hero-panel .panel-controls .next');
  let idx = 0;
  function show(i){
    slides.forEach((s,si)=>{
      s.style.opacity = si===i?1:0;
      s.style.transform = si===i? 'translateX(0)' : 'translateX(10px)';
      s.style.transition = 'opacity .6s ease, transform .6s ease';
      s.classList.toggle('active', si===i);
      const bgVar = getComputedStyle(s).getPropertyValue('--bg').trim();
      if (bgVar) {
        s.style.backgroundImage = `linear-gradient(rgba(5,12,20,.55),rgba(5,12,20,.55)), ${bgVar}`;
      }
      // Se não houver --bg, mantém o background-image definido inline no HTML
    });
  }
  if (slides.length){
    slides.forEach(s=>s.style.opacity=0);
    slides[idx].style.opacity=1;
    slides[idx].classList.add('active');
    prev?.addEventListener('click',()=>{idx=(idx-1+slides.length)%slides.length;show(idx)});
    next?.addEventListener('click',()=>{idx=(idx+1)%slides.length;show(idx)});
    setInterval(()=>{idx=(idx+1)%slides.length;show(idx)},5000);
  }
  // Guard: impedir qualquer ocorrência da imagem indesejada (duas mulheres)
  const banned = 'pexels.com/photos/2528118';
  const replacement = 'https://images.pexels.com/photos/256983/pexels-photo-256983.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080';
  Array.from(document.images).forEach(img=>{ if (img.src.includes(banned)) img.src = replacement; });
  Array.from(document.querySelectorAll('[style]')).forEach(el=>{
    const bg = el.style.backgroundImage;
    if (bg && bg.includes(banned)) el.style.backgroundImage = bg.replace('2528118','256983');
  });
});
// UI enhancements: progress bar, tilt effects, parallax, nav active
document.addEventListener('DOMContentLoaded', () => {
  // Scroll progress bar
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  const updateBar = () => {
    const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const sc = Math.max(0, Math.min(1, window.scrollY / h));
    bar.style.width = (sc * 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', updateBar, {passive:true});
  window.addEventListener('resize', updateBar);
  updateBar();

  // Nav active based on pathname
  const path = location.pathname.replace(/\\/g,'/');
  const navLinks = Array.from(document.querySelectorAll('.nav-list a, .hero-topnav a'));
  navLinks.forEach(a => {
    const href = a.getAttribute('href') || '';
    const match = href && path.endsWith(href);
    if (match) a.classList.add('active');
  });

  // Tilt effect on cards (subtle)
  const tiltEls = Array.from(document.querySelectorAll('.work-card, .card'));
  tiltEls.forEach(el => {
    let raf = null;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const max = 4; // degrees
      const rx = (-dy * max);
      const ry = (dx * max);
      if (!raf) {
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
          raf = null;
        });
      }
    };
    const onLeave = () => { el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });

  // Hero parallax (translate content slightly on scroll)
  const heroContent = document.querySelector('.hero-slide .hero-content') || document.querySelector('.page-hero .container');
  const onScroll = () => {
    if (!heroContent) return;
    // Desativa parallax para páginas internas (page-hero) em telas até 960px
    const inPageHero = !!heroContent.closest('.page-hero');
    if (inPageHero && window.matchMedia('(max-width: 960px)').matches) return;
    const offset = Math.min(24, window.scrollY * 0.06);
    heroContent.style.transform = `translateY(${offset}px)`;
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Parallax leve no herói (marca técnica e ornamento)
  const hero = document.querySelector('.hero');
  const mark = document.querySelector('.brand-mark');
  const ornament = document.querySelector('.hero-ornament');
  let rafMouse = null;
  const onMove = (e) => {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1..1
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    if (!rafMouse) {
      rafMouse = requestAnimationFrame(() => {
        const tx1 = (nx * 6).toFixed(2);
        const ty1 = (ny * 4).toFixed(2);
        const tx2 = (nx * -4).toFixed(2);
        const ty2 = (ny * -3).toFixed(2);
        if (mark) mark.style.transform = `translate3d(${tx1}px, ${ty1}px, 0)`;
        if (ornament) ornament.style.transform = `translate3d(${tx2}px, ${ty2}px, 0)`;
        rafMouse = null;
      });
    }
  };
  if (hero) {
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', () => {
      if (mark) mark.style.transform = 'translate3d(0,0,0)';
      if (ornament) ornament.style.transform = 'translate3d(0,0,0)';
    });
  }

  // Removido: tilt das engrenagens (reversão solicitada)
});

// Obras: carrossel estilo SIAN (slides com dots)
document.addEventListener('DOMContentLoaded', () => {
  // Sincroniza a largura exata do banner com a variável CSS --banner-w
  const setBannerVar = () => {
    const activeBanner = document.querySelector('.work-slide.active .banner-frame') || document.querySelector('.banner-frame');
    const container = document.querySelector('.works-carousel .container') || document.querySelector('.works-carousel');
    if (!activeBanner && !container) return;
    let w = activeBanner ? Math.round(activeBanner.getBoundingClientRect().width) : 0;
    if (!w || w < 10) {
      const cw = container ? Math.round(container.getBoundingClientRect().width) : 0;
      const vw = Math.round((document.documentElement.clientWidth || window.innerWidth) * 0.92);
      w = Math.max(320, cw || vw);
    }
    document.documentElement.style.setProperty('--banner-w', `${w}px`);
  };
  setBannerVar();
  window.addEventListener('load', setBannerVar);
  window.addEventListener('resize', setBannerVar);

  const carousel = document.querySelector('.works-carousel');
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('.work-slide'));
  const dots = Array.from(carousel.querySelectorAll('.dot'));
  let current = 0;
  const show = (i) => {
    current = Math.max(0, Math.min(i, slides.length - 1));
    slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    setBannerVar(); // atualizar var quando muda slide
  };
  dots.forEach((d) => {
    d.addEventListener('click', () => {
      const t = parseInt(d.getAttribute('data-target') || '0', 10);
      show(t);
    });
  });
  show(0);

  // Thumbnails horizontal scroller per slide (prev/next buttons)
  slides.forEach(slide => {
    const row = slide.querySelector('.thumbs-row');
    if (!row) return;
    const scroller = row.querySelector('.work-thumbs.scroller');
    const prev = row.querySelector('.thumbs-prev');
    const next = row.querySelector('.thumbs-next');
    if (scroller && prev && next) {
      const first = scroller.querySelector('img');
      const styles = getComputedStyle(scroller);
      const gap = parseFloat(styles.gap || styles.columnGap || '0');
      const base = first ? first.getBoundingClientRect().width : 240;
      const step = Math.max(120, Math.round(base + gap));
      prev.addEventListener('click', () => scroller.scrollBy({ left: -step, behavior: 'smooth' }));
      next.addEventListener('click', () => scroller.scrollBy({ left: step, behavior: 'smooth' }));
    }
    // Arraste com mouse/touch para deslizar thumbnails
    if (scroller) {
      let isDown = false, startX = 0, startScroll = 0;
      const onDown = (clientX) => { isDown = true; startX = clientX; startScroll = scroller.scrollLeft; scroller.classList.add('dragging'); };
      const onMove = (clientX) => { if (!isDown) return; const dx = clientX - startX; scroller.scrollLeft = startScroll - dx; };
      const onUp = () => { isDown = false; scroller.classList.remove('dragging'); };
      // Mouse
      scroller.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(e.clientX); });
      window.addEventListener('mousemove', (e) => onMove(e.clientX));
      window.addEventListener('mouseup', onUp);
      // Touch
      scroller.addEventListener('touchstart', (e) => { if (e.touches && e.touches[0]) onDown(e.touches[0].clientX); }, {passive:true});
      scroller.addEventListener('touchmove', (e) => { if (e.touches && e.touches[0]) onMove(e.touches[0].clientX); }, {passive:true});
      scroller.addEventListener('touchend', onUp);
      scroller.addEventListener('mouseleave', onUp);
    }
  });

  // Modal: abrir descrição da obra ao clicar em "Veja Mais"
  const openModal = (title, desc) => {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop show';
    backdrop.setAttribute('aria-hidden','false');
    const panel = document.createElement('div');
    panel.className = 'modal-panel';
    const h = document.createElement('h3');
    h.textContent = title || 'Detalhes da obra';
    const p = document.createElement('p');
    p.textContent = desc || 'Descrição indisponível.';
    const close = document.createElement('button');
    close.className = 'modal-close';
    close.type = 'button';
    close.textContent = 'Fechar';
    panel.appendChild(close);
    panel.appendChild(h);
    panel.appendChild(p);
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    const cleanup = () => {
      panel.remove();
      backdrop.remove();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
    const onKey = (e) => { if (e.key === 'Escape') cleanup(); };
    backdrop.addEventListener('click', cleanup);
    close.addEventListener('click', cleanup);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    close.focus();
  };
  slides.forEach(slide => {
    const btn = slide.querySelector('.banner-info .btn');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = slide.querySelector('.banner-info h3')?.textContent.trim();
      const desc = slide.querySelector('.banner-info p')?.textContent.trim();
      openModal(title, desc);
    });
  });
});
// Animations: reveal on scroll
document.addEventListener('DOMContentLoaded', () => {
  const candidates = Array.from(document.querySelectorAll(
    '.section, .section h2, .section-lead, .card, .mvv-card, .teaser, .news-item, .work-card, .media img, .gallery img, .btn'
  ));
  candidates.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  },{root:null, threshold:0.15});
  candidates.forEach(el=>io.observe(el));
  // Fallback: garantir que a primeira seção visível (acima da borda) não fique transparente
  const seedVisible = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    candidates.forEach(el => {
      const r = el.getBoundingClientRect();
      if (!el.classList.contains('in')) {
        const visible = r.top < vh * 0.95 && r.bottom > 0;
        if (visible) el.classList.add('in');
      }
    });
    const wc = document.querySelector('.works-carousel');
    if (wc) {
      const sec = wc.closest('.section');
      if (sec) sec.classList.add('in');
    }
  };
  seedVisible();
  window.addEventListener('load', seedVisible, { once: true });
});
  // Atividades: Galeria simples
  // Atividades: Carrossel horizontal com item central maior
  const actItems = Array.from(document.querySelectorAll('.act-carousel .act-item'));
  const actPrev = document.querySelector('.act-carousel .act-controls .prev');
  const actNext = document.querySelector('.act-carousel .act-controls .next');
  let actIdx = 2; // começar no meio
  function applyActClasses(){
    actItems.forEach((el, i) => {
      el.classList.remove('large','small');
      el.classList.add('small');
      if (i === actIdx) {
        el.classList.remove('small');
        el.classList.add('large');
      }
    });
  }
  // Versão 3 painéis (layout do print): mostra esquerda, centro, direita
  function renderThree(){
    const n = actItems.length;
    const left = (actIdx-1+n)%n;
    const right = (actIdx+1)%n;
    actItems.forEach((el,i)=>{
      el.classList.remove('left','right','center','off','large','small');
      if (i===actIdx) el.classList.add('center');
      else if (i===left) el.classList.add('left');
      else if (i===right) el.classList.add('right');
      else el.classList.add('off');
    });
  }
  if (document.querySelector('.act-carousel.act-3')){
    // Carrossel por páginas: mostra 3 itens por vez
    const n = actItems.length;
    let start = 0;
    function itemsPerView(){
      const w = window.innerWidth;
      // Mobile: 2 itens por visão; Tablet: 2; Desktop: 3
      return w<=680 ? 2 : (w<=960 ? 2 : 3);
    }
    function renderPage(){
      const k = itemsPerView();
      actItems.forEach((el,i)=>{
        let inWindow = false;
        for (let x=0; x<k; x++){
          if (i === (start + x) % n){ inWindow = true; break; }
        }
        el.classList.toggle('visible', inWindow);
      });
    }
    renderPage();
    window.addEventListener('resize', renderPage);
    actPrev?.addEventListener('click',()=>{ start = (start-1+n)%n; renderPage(); });
    actNext?.addEventListener('click',()=>{ start = (start+1)%n; renderPage(); });
    const actRow3 = document.querySelector('.act-carousel.act-3 .act-row');
    actRow3?.addEventListener('click',(e)=>{
      const rect = actRow3.getBoundingClientRect();
      const mid = rect.left + rect.width/2;
      start = (start + (e.clientX<mid?-1:1) + n) % n;
      renderPage();
    });
    // ensure visible items are revealed
    setTimeout(()=>{
      document.querySelectorAll('.act-carousel.act-3 .act-item.visible').forEach(el=>{
        el.classList.add('reveal'); el.classList.add('in');
      });
    }, 50);
  } else if (actItems.length){
    // fallback para carrossel com item central maior
    applyActClasses();
    actPrev?.addEventListener('click',()=>{ actIdx = (actIdx-1+actItems.length)%actItems.length; applyActClasses(); });
    actNext?.addEventListener('click',()=>{ actIdx = (actIdx+1)%actItems.length; applyActClasses(); });
    const actRow = document.querySelector('.act-carousel .act-row');
    actRow?.addEventListener('click',(e)=>{
      const rect = actRow.getBoundingClientRect();
      const mid = rect.left + rect.width/2;
      actIdx = (actIdx + (e.clientX<mid?-1:1) + actItems.length) % actItems.length;
      applyActClasses();
    });
    setInterval(()=>{ actIdx = (actIdx+1)%actItems.length; applyActClasses(); }, 6000);
  }
  // Timeline horizontal: navegação e arraste
(function(){
  const track = document.querySelector('.timeline-track .timeline.horiz');
  const prev = document.querySelector('.timeline-prev');
  const next = document.querySelector('.timeline-next');
  if (!track) return;

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= (maxScroll - 2);
  };

  const scrollAmount = () => Math.min(340, track.clientWidth * 0.8);

  prev && prev.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });
  next && next.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  let isDown = false, startX = 0, scrollLeft = 0;
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.classList.add('dragging');
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX);
    track.scrollLeft = scrollLeft - walk;
  });

  track.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();
})();
