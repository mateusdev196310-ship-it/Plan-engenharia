document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-list');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
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
    function renderPage(){
      actItems.forEach((el,i)=>{
        const inWindow = (i===start) || (i===(start+1)%n) || (i===(start+2)%n);
        el.classList.toggle('visible', inWindow);
      });
    }
    renderPage();
    actPrev?.addEventListener('click',()=>{ start = (start-3+n)%n; renderPage(); });
    actNext?.addEventListener('click',()=>{ start = (start+3)%n; renderPage(); });
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