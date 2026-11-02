const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/Z4UC4HNQJ2';

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ');

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== hero window: draw the view from a balcony, flat ===== */
  const scene = (x0) => `
<svg viewBox="${x0} 0 200 480" preserveAspectRatio="none" aria-hidden="true">
  <rect x="0" y="0" width="400" height="480" fill="#f6e016"/>
  <rect x="24" y="24" width="352" height="432" fill="#d3e5da"/>
  <g class="sunrays"><circle cx="290" cy="132" r="42" fill="#f6e016"/>
    ${Array.from({ length: 12 }, (_, k) => `<rect x="287" y="58" width="6" height="22" fill="#f6e016" transform="rotate(${k * 30} 290 132)"/>`).join('')}</g>
  <g class="cloud cloud--1"><rect x="40" y="96" width="112" height="26" rx="13" fill="#f7f7f7"/><rect x="66" y="78" width="60" height="26" rx="13" fill="#f7f7f7"/></g>
  <g class="cloud cloud--2"><rect x="196" y="214" width="120" height="24" rx="12" fill="#f7f7f7"/><rect x="226" y="198" width="56" height="24" rx="12" fill="#f7f7f7"/></g>
  <g class="cloud cloud--3"><rect x="60" y="250" width="84" height="20" rx="10" fill="#f7f7f7"/></g>
  <rect x="24" y="318" width="64" height="138" fill="#9fc0ae"/><rect x="96" y="290" width="52" height="166" fill="#9fc0ae"/>
  <rect x="156" y="330" width="70" height="126" fill="#9fc0ae"/><rect x="236" y="300" width="58" height="156" fill="#9fc0ae"/>
  <rect x="302" y="336" width="74" height="120" fill="#9fc0ae"/>
  <rect x="24" y="372" width="86" height="84" fill="#437059"/><rect x="118" y="352" width="60" height="104" fill="#437059"/>
  <rect x="186" y="384" width="92" height="72" fill="#437059"/><rect x="286" y="360" width="90" height="96" fill="#437059"/>
  <g fill="#d3e5da"><rect x="36" y="388" width="12" height="12"/><rect x="60" y="388" width="12" height="12"/><rect x="36" y="414" width="12" height="12"/><rect x="60" y="414" width="12" height="12"/>
  <rect x="130" y="372" width="12" height="12"/><rect x="150" y="372" width="12" height="12"/><rect x="130" y="398" width="12" height="12"/><rect x="150" y="398" width="12" height="12"/>
  <rect x="300" y="378" width="12" height="12"/><rect x="324" y="378" width="12" height="12"/><rect x="300" y="404" width="12" height="12"/><rect x="324" y="404" width="12" height="12"/></g>
  <circle cx="226" cy="402" r="22" fill="#1f4a35"/><rect x="223" y="416" width="6" height="40" fill="#1f4a35"/>
  <rect x="0" y="296" width="400" height="14" fill="#f6e016"/>
  <rect x="${x0 === 0 ? 188 : 200}" y="0" width="12" height="480" fill="#f6e016"/>
  <rect x="${x0 === 0 ? 176 : 212}" y="204" width="8" height="64" fill="#0d2a1c"/>
</svg>`;
  const L = $('#leafL'), R = $('#leafR');
  if (L && R) { L.innerHTML = scene(0); R.innerHTML = scene(200); }
  const hero = $('#hero');

  /* ===== header, progress, burger ===== */
  const header = $('#header'), prog = $('#progress');
  const burger = $('#burger'), nav = $('#nav');
  const setMenu = open => {
    burger.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ===== reveal + counters + scroll-linked hinge ===== */
  const targets = [...$$('[data-r]'), ...$$('.plan'), ...$$('.card')];
  const counters = $$('.num[data-count]');
  counters.forEach(c => { c.dataset.final = c.textContent; });
  const counted = new WeakSet();
  const countUp = el => {
    if (counted.has(el)) return; counted.add(el);
    const to = +el.dataset.count;
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 1300;
    const tick = t => {
      const p = clamp((t - t0) / dur, 0, 1);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!reduce) counters.forEach(c => { c.textContent = '0'; });

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight;
    header?.classList.toggle('scrolled', y > 8);
    const docH = document.documentElement.scrollHeight - vh;
    if (prog) prog.style.transform = `scaleX(${docH > 0 ? clamp(y / docH, 0, 1) : 0})`;

    // casement leaves swing open as the page scrolls
    if (L && R && !reduce) {
      const p = clamp(y / (vh * 0.85), 0, 1);
      const a = p * 38;
      L.style.transform = `rotateY(${-a}deg)`;
      R.style.transform = `rotateY(${a}deg)`;
    }

    targets.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.94) {
        el.classList.add('in');
        el.querySelectorAll?.('.num[data-count]').forEach(countUp);
      }
    });
    counters.forEach(c => {
      if (counted.has(c)) return;
      if (!c.closest('[data-r]') && !c.closest('.plan')) {
        const r = c.getBoundingClientRect();
        if (r.top < vh * 0.94) countUp(c);
      }
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
  setTimeout(update, 400);

  // smooth anchor scroll with header offset
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href.length <= 1) return;
    const t = $(href);
    if (!t) return;
    e.preventDefault();
    const top = href === '#top' ? 0 : t.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ===== phone mask ===== */
  $$('input[type="tel"]').forEach(input => {
    input.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.startsWith('8')) v = '7' + v.slice(1);
      if (!v.startsWith('7')) v = '7' + v;
      v = v.slice(0, 11);
      let out = '+7';
      if (v.length > 1) out += ' (' + v.slice(1, 4);
      if (v.length >= 4) out += ') ' + v.slice(4, 7);
      if (v.length >= 7) out += '-' + v.slice(7, 9);
      if (v.length >= 9) out += '-' + v.slice(9, 11);
      e.target.value = out;
    });
  });

  /* ===== calculator: choose services, the house changes, the sum is honest "от" ===== */
  const items = $$('.calc__item');
  const layers = Object.fromEntries($$('[data-layer]').map(g => [g.dataset.layer, g]));
  const stepper = $('#stepper'), winCount = $('#winCount');
  const sumEl = $('#calcSum'), fromEl = $('#calcFrom'), curEl = $('#calcCur'), labelEl = $('#calcLabel');
  const names = { glaz: 'остекление балкона', fin: 'отделка балкона', win: 'окна', ver: 'веранда' };
  let wins = 1, shown = 0, rafId = 0;
  const calcState = () => {
    const sel = items.filter(b => b.getAttribute('aria-pressed') === 'true');
    let total = 0;
    sel.forEach(b => { total += (+b.dataset.price) * (b.dataset.key === 'win' ? wins : 1); });
    return { sel, total };
  };
  const animateSum = to => {
    cancelAnimationFrame(rafId);
    const from = shown, t0 = performance.now(), dur = reduce ? 0 : 600;
    const tick = t => {
      const p = dur ? clamp((t - t0) / dur, 0, 1) : 1;
      shown = from + (to - from) * (1 - Math.pow(1 - p, 3));
      sumEl.textContent = fmt(shown);
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  };
  const render = () => {
    const { sel, total } = calcState();
    items.forEach(b => layers[b.dataset.key]?.classList.toggle('on', b.getAttribute('aria-pressed') === 'true'));
    const has = sel.length > 0;
    fromEl.hidden = !has; curEl.hidden = !has;
    labelEl.textContent = has
      ? sel.map(b => b.dataset.key === 'win' && wins > 1 ? `окна ×${wins}` : names[b.dataset.key]).join(' + ')
      : 'Нажмите на нужные услуги слева';
    stepper.hidden = !items.find(b => b.dataset.key === 'win' && b.getAttribute('aria-pressed') === 'true');
    animateSum(total);
  };
  items.forEach(b => b.addEventListener('click', () => {
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    render();
  }));
  $('#winMinus')?.addEventListener('click', () => { wins = Math.max(1, wins - 1); winCount.textContent = wins; render(); });
  $('#winPlus')?.addEventListener('click', () => { wins = Math.min(12, wins + 1); winCount.textContent = wins; render(); });
  // starter state: glazing + finish selected so the visitor sees the idea at once
  items.filter(b => ['glaz', 'fin'].includes(b.dataset.key)).forEach(b => b.setAttribute('aria-pressed', 'true'));
  render();

  const service = $('#fService'), comment = $('#fComment');
  $('#calcSend')?.addEventListener('click', () => {
    const { sel, total } = calcState();
    if (sel.length) {
      const keys = sel.map(b => b.dataset.key);
      const has = k => keys.includes(k);
      const map = has('glaz') && has('fin') && keys.length === 2 ? 'Остекление и отделка вместе'
        : keys.length === 1 && has('glaz') ? 'Остекление балкона или лоджии'
        : keys.length === 1 && has('fin') ? 'Отделка балкона'
        : keys.length === 1 && has('win') ? 'Окна'
        : keys.length === 1 && has('ver') ? 'Веранда' : 'Другое';
      service.value = map;
      comment.value = `Расчёт на сайте: ${sel.map(b => b.dataset.key === 'win' ? `окна ×${wins}` : names[b.dataset.key]).join(' + ')}, от ${fmt(total)} ₽`;
    }
    $('#contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  $$('.plan__go').forEach(a => a.addEventListener('click', () => {
    const s = a.dataset.service;
    const opt = [...service.options].find(o => o.textContent === s);
    if (opt) service.value = opt.value;
  }));

  /* ===== accordion of stages ===== */
  const stages = $$('.stage');
  const openStage = st => {
    stages.forEach(s => {
      const on = s === st;
      s.classList.toggle('is-open', on);
      $('.stage__tab', s).setAttribute('aria-expanded', String(on));
    });
  };
  stages.forEach(s => $('.stage__tab', s).addEventListener('click', () => openStage(s)));

  /* ===== faq cards: one open at a time ===== */
  const cards = $$('.card');
  cards.forEach(c => $('.card__head', c).addEventListener('click', () => {
    const wasOpen = c.classList.contains('is-open');
    cards.forEach(x => { x.classList.remove('is-open'); $('.card__head', x).setAttribute('aria-expanded', 'false'); });
    if (!wasOpen) { c.classList.add('is-open'); $('.card__head', c).setAttribute('aria-expanded', 'true'); }
  }));

  /* ===== lead form -> relay -> Telegram ===== */
  const form = $('#leadForm');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('.coupon__submit', form), label = $('span', btn), orig = label.textContent;
    const payload = {};
    new FormData(form).forEach((v, k) => { payload[k] = v; });
    if (payload._gotcha) return;
    form.classList.remove('is-error');
    $$('input', form).forEach(i => i.classList.remove('bad'));
    const phoneDigits = (payload.phone || '').replace(/\D/g, '');
    if (!payload.name || phoneDigits.length < 11) {
      form.classList.add('is-error');
      if (!payload.name) $('#fName').classList.add('bad');
      if (phoneDigits.length < 11) $('#fPhone').classList.add('bad');
      label.textContent = 'Заполните имя и телефон';
      setTimeout(() => { label.textContent = orig; }, 2600);
      return;
    }
    payload.source = 'balkon-pro';
    btn.disabled = true; label.textContent = 'Отправляем...';
    try {
      const resp = await fetch(LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      label.textContent = 'Заявка отправлена, мы перезвоним';
      form.reset();
    } catch (err) {
      console.error(err);
      label.textContent = 'Ошибка, попробуйте ещё раз';
    } finally {
      setTimeout(() => { label.textContent = orig; btn.disabled = false; }, 3500);
    }
  });
})();
