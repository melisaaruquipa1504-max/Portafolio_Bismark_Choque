/* ===================================================
   slider.js — Lógica del slider de fotos
   
   Cómo agregar fotos:
   1. Copia tus imágenes a la carpeta /slider/
   2. Edita el array SLIDES abajo con nombre de archivo,
      título y descripción de cada foto.
   =================================================== */

(function () {

  /* ---- CONFIGURA TUS FOTOS AQUÍ ---- */
  const SLIDES = [
    {
      src: 'slider/Foto1.jpeg',
      title: 'Laboratorio de Control, facultad de Ingeniería Electrónica',
      desc: 'Prácticas en el laboratorio de la Facultad de Ingeniería – UMSA'
    },
    {
      src: 'slider/Foto2.jpeg',
      title: 'Laboratorio de Control, facultad de Ingeniería Electrónica',
      desc: 'Prácticas en el laboratorio de la Facultad de Ingeniería – UMSA'
    },
    {
      src: 'slider/Foto3.jpeg',
      title: 'Proyecto diseñado',
      desc: 'Proyecto presentado para la Facultad de Ingeniería – UMSA'
    },
    {
      src: 'slider/Foto4.jpeg',
      title: 'Laboratorio de Control, facultad de Ingeniería Electrónica',
      desc: 'Prácticas en el laboratorio de la Facultad de Ingeniería – UMSA'
    },
    {
      src: 'slider/Foto5.jpeg',
      title: 'Laboratorio de Control, facultad de Ingeniería Electrónica',
      desc: 'Prácticas en el laboratorio de la Facultad de Ingeniería – UMSA'
    },
    {
      src: 'slider/Foto6.jpeg',
      title: 'Proyectos con Arduino',
      desc: 'Desarrollo de sistemas embebidos y automatización'
    },
    {
      src: 'slider/Foto7.jpeg',
      title: 'Proyectos con Arduino',
      desc: 'Desarrollo de sistemas embebidos y automatización'
    },
    {
      src: 'slider/Foto8.jpeg',
      title: 'Mi espacio de trabajo',
      desc: 'Desarrollo de sistemas embebidos y automatización'
    },
    {
      src: 'slider/Foto9.jpeg',
      title: 'Mi espacio de trabajo',
      desc: 'Desarrollo de sistemas embebidos y automatización'
    },
    {
      src: 'slider/Foto10.jpeg',
      title: 'Mi espacio de trabajo',
      desc: 'Desarrollo de sistemas embebidos y automatización'
    },
    {
      src: 'slider/Foto11.jpeg',
      title: 'Mi espacio de trabajo',
      desc: 'Desarrollo de sistemas embebidos y automatización'
    },
    {
      src: 'slider/Foto12.jpeg',
      title: 'Mi espacio de trabajo',
      desc: 'Desarrollo de sistemas embebidos y automatización'
    },
  ];
  /* ---- FIN CONFIGURACIÓN ---- */

  const AUTOPLAY_MS = 4500; // milisegundos entre slides

  let current = 0;
  let autoplayTimer = null;
  let isPlaying = true;

  /* Elementos del DOM */
  const track = document.getElementById('sliderTrack');
  const dotsWrap = document.getElementById('sliderDots');
  const thumbs = document.getElementById('sliderThumbs');
  const counter = document.getElementById('slideCounter');
  const autoBtn = document.getElementById('autoplayBtn');

  if (!track) return; // Si no existe el slider en la página, salir

  /* ---- Construir slides ---- */
  SLIDES.forEach((slide, i) => {
    // Slide principal
    const div = document.createElement('div');
    div.className = 'slide';

    const img = document.createElement('img');
    img.alt = slide.title;
    img.loading = i === 0 ? 'eager' : 'lazy';

    // Manejar error de imagen → mostrar placeholder
    img.onerror = function () {
      div.innerHTML = `
        <div class="slide-placeholder">
          <i class="fa fa-image"></i>
          <span>${slide.title}</span>
          <small style="font-size:0.72rem;opacity:0.5">Coloca la imagen en /slider/</small>
        </div>
        <div class="slide-caption">
          <h3>${slide.title}</h3>
          <p>${slide.desc}</p>
        </div>`;
    };
    img.src = slide.src;

    const caption = document.createElement('div');
    caption.className = 'slide-caption';
    caption.innerHTML = `<h3>${slide.title}</h3><p>${slide.desc}</p>`;

    div.appendChild(img);
    div.appendChild(caption);
    track.appendChild(div);

    // Dot
    const dot = document.createElement('button');
    dot.className = 'dot-indicator' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir a foto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);

    // Thumbnail
    if (thumbs) {
      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'slider-thumb' + (i === 0 ? ' active' : '');
      thumbDiv.addEventListener('click', () => goTo(i));

      const tImg = document.createElement('img');
      tImg.src = slide.src;
      tImg.alt = slide.title;
      tImg.loading = 'lazy';
      tImg.onerror = function () {
        thumbDiv.style.background = 'var(--card)';
        tImg.style.display = 'none';
      };

      thumbDiv.appendChild(tImg);
      thumbs.appendChild(thumbDiv);
    }
  });

  /* ---- Ir a slide N ---- */
  function goTo(n) {
    current = (n + SLIDES.length) % SLIDES.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    // Actualizar dots
    document.querySelectorAll('.dot-indicator').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    // Actualizar thumbs
    if (thumbs) {
      thumbs.querySelectorAll('.slider-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === current);
      });
      // Centrar el thumb activo SOLO dentro del strip (sin afectar el scroll de la página).
      // No usamos scrollIntoView porque puede hacer scroll de toda la ventana, no solo
      // del contenedor de thumbnails — eso era lo que causaba que la página "saltara"
      // de vuelta a la sección Galería cada vez que el autoplay cambiaba de foto.
      const activThumb = thumbs.querySelectorAll('.slider-thumb')[current];
      if (activThumb) {
        const target = activThumb.offsetLeft - (thumbs.clientWidth / 2) + (activThumb.clientWidth / 2);
        thumbs.scrollTo({ left: target, behavior: 'smooth' });
      }
    }

    // Actualizar contador
    if (counter) counter.textContent = `${current + 1} / ${SLIDES.length}`;
  }

  /* ---- Controles prev / next ---- */
  document.getElementById('sliderPrev')?.addEventListener('click', () => {
    stopAutoplay();
    goTo(current - 1);
  });

  document.getElementById('sliderNext')?.addEventListener('click', () => {
    stopAutoplay();
    goTo(current + 1);
  });

  /* ---- Teclado ---- */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { stopAutoplay(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { stopAutoplay(); goTo(current + 1); }
  });

  /* ---- Swipe táctil ---- */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      stopAutoplay();
      dx < 0 ? goTo(current + 1) : goTo(current - 1);
    }
  });

  /* ---- Autoplay ---- */
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
    isPlaying = true;
    if (autoBtn) {
      autoBtn.innerHTML = '<i class="fa fa-pause"></i> Auto';
      autoBtn.classList.add('playing');
    }
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    isPlaying = false;
    if (autoBtn) {
      autoBtn.innerHTML = '<i class="fa fa-play"></i> Auto';
      autoBtn.classList.remove('playing');
    }
  }

  autoBtn?.addEventListener('click', () => {
    isPlaying ? stopAutoplay() : startAutoplay();
  });

  /* ---- Pausar al pasar el mouse ---- */
  track.parentElement.addEventListener('mouseenter', () => {
    if (isPlaying) clearInterval(autoplayTimer);
  });
  track.parentElement.addEventListener('mouseleave', () => {
    if (isPlaying) startAutoplay();
  });

  /* ---- Pausar autoplay cuando la sección Galería no está visible -----
     Esto evita que el slider siga cambiando de foto (y moviendo el strip
     de thumbnails) mientras el usuario navegó a otra sección del sitio. */
  const sliderSection = document.getElementById('slider-section');
  if (sliderSection && 'IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (isPlaying) startAutoplay();
        } else {
          clearInterval(autoplayTimer);
        }
      });
    }, { threshold: 0.2 });
    visibilityObserver.observe(sliderSection);
  }

  /* ---- Init ---- */
  goTo(0);
  startAutoplay();

})();
