/* ===================================================
   main.js — Lógica principal del portafolio v2
   =================================================== */

/* ===== TYPEWRITER ===== */
(function () {
  const phrases = [
    'Ing. Electrónica · UMSA',
    'Sistemas Embebidos & Control',
    'Arduino · ESP32 · MATLAB',
    'Automatización Industrial',
  ];
  let pi = 0, ci = 0, deleting = false;
  const el = document.getElementById('typewriter');
  if (!el) return;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 45 : 90);
  }
  tick();
})();


/* ===== NAVBAR SCROLL ===== */
const nav     = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', function () {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
    backTop.classList.add('visible');
  } else {
    nav.classList.remove('scrolled');
    backTop.classList.remove('visible');
  }

  // Marcar enlace activo sin forzar scroll
  const sections = document.querySelectorAll('section[id]');
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
});


/* ===== MOBILE MENU ===== */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () =>
    document.getElementById('navLinks').classList.remove('open')
  );
});


/* ===== INTERSECTION OBSERVER: REVEALS + SKILL BARS + STAT NUMBERS ===== */
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    el.classList.add('visible');

    if (el.classList.contains('skill-fill')) {
      const w = el.getAttribute('data-width');
      el.style.width = w + '%';
    }

    if (el.classList.contains('stat-value')) {
      const target = parseInt(el.getAttribute('data-target'));
      if (isNaN(target)) return; // evitar NaN
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 1500, steps = 60;
      const inc = target / steps;
      const timer = setInterval(function () {
        current += inc;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + suffix;
      }, duration / steps);
    }

    if (el.classList.contains('tl-item')) {
      el.style.transitionDelay = '0.1s';
    }

    observer.unobserve(el);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .skill-fill, .stat-value, .tl-item, .cert-card').forEach(el => {
  observer.observe(el);
});


/* ===== CONTADOR DE VISITAS ===== */
const COUNTER_URL = 'php/contador.php';

async function loadVisitCount() {
  try {
    const res = await fetch(COUNTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'increment' })
    });
    const data = await res.json();
    if (data.success && !isNaN(parseInt(data.count))) {
      setVisitDisplay(parseInt(data.count));
    }
  } catch (e) {
    // Fallback localStorage
    let v = parseInt(localStorage.getItem('bch_visits') || '0') + 1;
    localStorage.setItem('bch_visits', v);
    setVisitDisplay(v);
  }
}

function setVisitDisplay(count) {
  const el1 = document.getElementById('visitCount');
  if (el1) el1.textContent = count;
}

async function resetVisits() {
  if (!confirm('¿Reiniciar el contador de visitas?')) return;
  try {
    const res = await fetch(COUNTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' })
    });
    const data = await res.json();
    if (data.success) setVisitDisplay(0);
  } catch (e) {
    localStorage.setItem('bch_visits', '0');
    setVisitDisplay(0);
  }
}

loadVisitCount();


/* ===== CUENTA REGRESIVA ===== */
(function () {
  const end = new Date('2026-06-30T23:59:59').getTime();

  function tick() {
    const dist = end - Date.now();
    if (dist <= 0) {
      ['cd-days', 'cd-hours', 'cd-min', 'cd-sec'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2, '0');
    };
    set('cd-days',  Math.floor(dist / 86400000));
    set('cd-hours', Math.floor((dist % 86400000) / 3600000));
    set('cd-min',   Math.floor((dist % 3600000) / 60000));
    set('cd-sec',   Math.floor((dist % 60000) / 1000));
  }

  tick();
  setInterval(tick, 1000);
})();


/* ===== FORMULARIO DE CONTACTO =====
   Usamos Web3Forms (servicio externo gratuito) en vez de un script PHP propio.
   Esto funciona de inmediato, incluso abriendo el archivo localmente con doble
   clic, y sin necesitar un hosting con PHP configurado.

   PASO REQUERIDO ANTES DE PUBLICAR EL SITIO:
   1. Ir a https://web3forms.com/
   2. Escribir el correo donde quieres recibir los mensajes (sin necesidad
      de crear cuenta) y presionar "Create Access Key".
   3. Llega una Access Key al instante a ese correo.
   4. Reemplazar el valor de WEB3FORMS_ACCESS_KEY abajo con esa key.
   Sin ese paso, el formulario seguirá mostrando error al enviar. */
const WEB3FORMS_ACCESS_KEY = 'TU_ACCESS_KEY_AQUI';

async function submitForm() {
  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const subject = document.getElementById('f-subject').value.trim();
  const message = document.getElementById('f-message').value.trim();
  const status  = document.getElementById('form-status');
  const btn     = document.querySelector('[onclick="submitForm()"]');

  if (!name || !email || !subject || !message) {
    showStatus(status, 'error', 'Por favor completá todos los campos.');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus(status, 'error', 'El email no tiene un formato válido.');
    return;
  }

  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'TU_ACCESS_KEY_AQUI') {
    showStatus(status, 'error', 'El formulario aún no está configurado. Mientras tanto, escribime por WhatsApp o Email (botones de arriba).');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Enviando...';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name,
        email,
        subject: '[Portafolio] ' + subject,
        message
      })
    });
    const data = await res.json();

    if (data.success) {
      showStatus(status, 'success', '¡Mensaje enviado correctamente! Te contactaremos pronto.');
      ['f-name', 'f-email', 'f-subject', 'f-message'].forEach(id => {
        document.getElementById(id).value = '';
      });
    } else {
      showStatus(status, 'error', data.message || 'Error al enviar el mensaje.');
    }
  } catch (e) {
    showStatus(status, 'error', 'No se pudo conectar con el servidor. Intentá más tarde.');
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fa fa-paper-plane"></i> Enviar Mensaje';
}

function showStatus(el, type, msg) {
  el.className = 'form-status ' + type;
  el.textContent = msg;
  setTimeout(() => { el.className = 'form-status'; }, 6000);
}


/* ===== AÑO EN EL FOOTER ===== */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();
