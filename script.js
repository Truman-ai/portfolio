// ── Nav scroll
const nav = document.getElementById('site-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Counter animation
const easeOut = t => 1 - Math.pow(1 - t, 3);

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1200;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const val = target * easeOut(progress);
      el.textContent = val.toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ── Image sliders
document.querySelectorAll('.img-slider').forEach(slider => {
  const track = slider.querySelector('.slider-track');
  const slides = slider.querySelectorAll('.slider-slide');
  const dots = slider.querySelectorAll('.slider-dot');
  let current = 0;

  const syncHeight = idx => {
    const img = slides[idx];
    const setH = () => { slider.style.height = img.offsetHeight + 'px'; };
    img.complete ? setH() : img.addEventListener('load', setH, { once: true });
  };

  const go = n => {
    current = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    syncHeight(current);
  };

  syncHeight(0);
  window.addEventListener('resize', () => syncHeight(current), { passive: true });

  slider.querySelector('.slider-prev').addEventListener('click', () => go(current - 1));
  slider.querySelector('.slider-next').addEventListener('click', () => go(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
});

// ── Fade-in on scroll
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
