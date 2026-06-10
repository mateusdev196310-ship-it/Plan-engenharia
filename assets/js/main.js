document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-list');
  const heroTopnav = document.querySelector('.hero-topnav');
  if (toggle) {
    toggle.setAttribute('aria-expanded', 'false');
    if (nav) {
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    } else if (heroTopnav) {
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
    });
  }
  if (slides.length){
    slides.forEach(s=>s.style.opacity=0);
    slides[idx].style.opacity=1;
    slides[idx].classList.add('active');
    prev?.addEventListener('click',()=>{idx=(idx-1+slides.length)%slides.length;show(idx)});
    next?.addEventListener('click',()=>{idx=(idx+1)%slides.length;show(idx)});
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(()=>{idx=(idx+1)%slides.length;show(idx)},5000);
    }
  }
  const banned = 'pexels.com/photos/2528118';
  const replacement = 'https://images.pexels.com/photos/256983/pexels-photo-256983.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080';
  Array.from(document.images).forEach(img=>{ if (img.src.includes(banned)) img.src = replacement; });
  Array.from(document.querySelectorAll('[style]')).forEach(el=>{
    const bg = el.style.backgroundImage;
    if (bg && bg.includes(banned)) el.style.backgroundImage = bg.replace('2528118','256983');
  });

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

  const path = location.pathname.replace(/\\/g,'/');
  const navLinks = Array.from(document.querySelectorAll('.nav-list a, .hero-topnav a'));
  navLinks.forEach(a => {
    const href = a.getAttribute('href') || '';
    const match = href && path.endsWith(href);
    if (match) a.classList.add('active');
  });

  const tiltEls = Array.from(document.querySelectorAll('.work-card, .card'));
  tiltEls.forEach(el => {
    let raf = null;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const max = 4;
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

  const heroContent = document.querySelector('.hero-slide .hero-content') || document.querySelector('.page-hero .container');
  const onScroll = () => {
    if (!heroContent) return;
    const inPageHero = !!heroContent.closest('.page-hero');
    if (inPageHero && window.matchMedia('(max-width: 960px)').matches) return;
    const offset = Math.min(24, window.scrollY * 0.06);
    heroContent.style.transform = `translateY(${offset}px)`;
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  const hero = document.querySelector('.hero');
  const mark = document.querySelector('.brand-mark');
  const ornament = document.querySelector('.hero-ornament');
  let rafMouse = null;
  const onMouseMove = (e) => {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
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
    hero.addEventListener('mousemove', onMouseMove);
    hero.addEventListener('mouseleave', () => {
      if (mark) mark.style.transform = 'translate3d(0,0,0)';
      if (ornament) ornament.style.transform = 'translate3d(0,0,0)';
    });
  }

  document.querySelectorAll('[data-modal-target]').forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.dataset.modalTarget;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal.active');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  document.querySelectorAll('[data-carousel-track]').forEach(track => {
    const slides = Array.from(track.children);
    const nav = track.closest('.carousel-wrapper').querySelector('[data-carousel-nav]');
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let translateX = 0;
    let isDragging = false;
    let isDown = false;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      nav.appendChild(dot);
    });

    const dots = nav.querySelectorAll('button');
    updateCarousel();

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      translateX = -currentIndex * track.offsetWidth;
      track.classList.add('dragging');
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      isDragging = true;
      currentX = e.pageX - track.offsetLeft;
      const diff = currentX - startX;
      track.style.transform = `translateX(${translateX + diff}px)`;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      track.classList.remove('dragging');
      isDown = false;

      if (isDragging) {
        const diff = currentX - startX;
        const threshold = track.offsetWidth * 0.2;

        if (diff > threshold && currentIndex > 0) {
          goToSlide(currentIndex - 1);
        } else if (diff < -threshold && currentIndex < slides.length - 1) {
          goToSlide(currentIndex + 1);
        } else {
          updateCarousel();
        }
      }
      isDragging = false;
    });

    track.addEventListener('touchstart', (e) => {
      isDown = true;
      startX = e.touches[0].clientX - track.offsetLeft;
      translateX = -currentIndex * track.offsetWidth;
      track.classList.add('dragging');
      e.preventDefault();
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      isDragging = true;
      currentX = e.touches[0].clientX - track.offsetLeft;
      const diff = currentX - startX;
      track.style.transform = `translateX(${translateX + diff}px)`;
    });

    window.addEventListener('touchend', () => {
      if (!isDown) return;
      track.classList.remove('dragging');
      isDown = false;

      if (isDragging) {
        const diff = currentX - startX;
        const threshold = track.offsetWidth * 0.2;

        if (diff > threshold && currentIndex > 0) {
          goToSlide(currentIndex - 1);
        } else if (diff < -threshold && currentIndex < slides.length - 1) {
          goToSlide(currentIndex + 1);
        } else {
          updateCarousel();
        }
      }
      isDragging = false;
    });

    track.closest('.modal-content').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
      }
    });

    track.style.userSelect = 'none';
  });

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

  const worksCarousel = document.querySelector('.works-carousel');
  if (worksCarousel) {
    const wSlides = Array.from(worksCarousel.querySelectorAll('.work-slide'));
    const dots = Array.from(worksCarousel.querySelectorAll('.dot'));
    let current = 0;
    const showWork = (i) => {
      current = Math.max(0, Math.min(i, wSlides.length - 1));
      wSlides.forEach((s, idx) => s.classList.toggle('active', idx === current));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
      setBannerVar();
    };
    dots.forEach((d) => {
      d.addEventListener('click', () => {
        const t = parseInt(d.getAttribute('data-target') || '0', 10);
        showWork(t);
      });
    });
    showWork(0);

    wSlides.forEach(slide => {
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
      if (scroller) {
        let isDown = false, startX = 0, startScroll = 0;
        const onDown = (clientX) => { isDown = true; startX = clientX; startScroll = scroller.scrollLeft; scroller.classList.add('dragging'); };
        const onMove = (clientX) => { if (!isDown) return; const dx = clientX - startX; scroller.scrollLeft = startScroll - dx; };
        const onUp = () => { isDown = false; scroller.classList.remove('dragging'); };
        scroller.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(e.clientX); });
        window.addEventListener('mousemove', (e) => onMove(e.clientX));
        window.addEventListener('mouseup', onUp);
        scroller.addEventListener('touchstart', (e) => { if (e.touches && e.touches[0]) onDown(e.touches[0].clientX); }, {passive:true});
        scroller.addEventListener('touchmove', (e) => { if (e.touches && e.touches[0]) onMove(e.touches[0].clientX); }, {passive:true});
        scroller.addEventListener('touchend', onUp);
        scroller.addEventListener('mouseleave', onUp);
      }
    });

    const openModal = (title, desc) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop show';
      backdrop.setAttribute('aria-hidden','false');
      const panel = document.createElement('div');
      panel.className = 'modal-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
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
    wSlides.forEach(slide => {
      const btn = slide.querySelector('.banner-info .btn');
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = slide.querySelector('.banner-info h3')?.textContent.trim();
        const desc = slide.querySelector('.banner-info p')?.textContent.trim();
        openModal(title, desc);
      });
    });
  }

  const candidates = Array.from(document.querySelectorAll(
    '.section, .section h2, .section-lead, .card, .mvv-card, .teaser, .news-item, .work-card, .media img, .gallery img, .btn'
  ));
  candidates.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },{root:null, threshold:0.15});
    candidates.forEach(el=>io.observe(el));
  } else {
    candidates.forEach(el => el.classList.add('in'));
  }
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

  const actItems = Array.from(document.querySelectorAll('.act-carousel .act-item'));
  const actPrev = document.querySelector('.act-carousel .act-controls .prev');
  const actNext = document.querySelector('.act-carousel .act-controls .next');
  let actIdx = 2;
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
    const n = actItems.length;
    let start = 0;
    function itemsPerView(){
      const w = window.innerWidth;
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
    setTimeout(()=>{
      document.querySelectorAll('.act-carousel.act-3 .act-item.visible').forEach(el=>{
        el.classList.add('reveal'); el.classList.add('in');
      });
    }, 50);
  } else if (actItems.length){
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
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(()=>{ actIdx = (actIdx+1)%actItems.length; applyActClasses(); }, 6000);
    }
  }

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

  const form = document.getElementById('jobsForm');
  if (form) {
    const to = 'plan@planengenharialtda.com.br';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const fd = new FormData(form);
      const nome = (fd.get('nome') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const telefone = (fd.get('telefone') || '').toString().trim();
      const cidade = (fd.get('cidade') || '').toString().trim();
      const area = (fd.get('area') || '').toString().trim();
      const cargo = (fd.get('cargo') || '').toString().trim();
      const mensagem = (fd.get('mensagem') || '').toString().trim();
      const subject = 'Candidatura - ' + area + ' - ' + nome;
      const su = encodeURIComponent(subject);
      const bodyText = 'Nome: ' + nome + '\nEmail: ' + email + '\nTelefone: ' + telefone + '\nCidade/Estado: ' + cidade + '\nÁrea: ' + area + '\nCargo: ' + cargo + '\n\n' + mensagem + '\n\nObservação: após abrir o e-mail, anexe seu currículo em PDF. A anexação é realizada no e-mail, não nesta página.';
      const body = encodeURIComponent(bodyText);
      const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) + '&su=' + su + '&body=' + body;
      const mailtoUrl = 'mailto:' + to + '?subject=' + su + '&body=' + body;
      const w = window.open(gmailUrl, '_blank');
      setTimeout(() => {
        if (!w || w.closed) {
          window.location.href = mailtoUrl;
        }
      }, 300);
    });
  }
});
