/* ============================================ */
/* SIRCLE AGENCY — Main JavaScript             */
/* GSAP + ScrollTrigger + Lenis                */
/* ============================================ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ---- LENIS SMOOTH SCROLL ----
const lenis = new Lenis({
  duration: 1.0,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
  autoResize: true,
});

// Use GSAP ticker for Lenis (single RAF loop, no conflict)
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Sync scroll updates with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// ---- LOADER ----
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      initAnimations();
    }, 2000);
  } else {
    // No loader (subpages) — init immediately
    setTimeout(initAnimations, 100);
  }
});

// Fallback: if animations haven't fired after 3s, force them
setTimeout(() => {
  document.querySelectorAll('.reveal-up').forEach(el => {
    if (getComputedStyle(el).opacity === '0') {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.transition = 'opacity 0.5s, transform 0.5s';
    }
  });
  document.querySelectorAll('.reveal-clip').forEach(el => {
    if (getComputedStyle(el).opacity === '0') {
      el.style.opacity = '1';
      el.style.clipPath = 'inset(0)';
      el.style.transition = 'opacity 0.5s, clip-path 0.5s';
    }
  });
}, 3500);

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (window.innerWidth > 767) {
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    gsap.to(cursor, { x: cursorX, y: cursorY, duration: 0.1 });
  });

  // Smooth follower
  function animateFollower() {
    followerX += (cursorX - followerX) * 0.12;
    followerY += (cursorY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverElements = document.querySelectorAll('a, button, .case-card, .video-container');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
}

// ---- NAVIGATION ----
const nav = document.getElementById('nav');
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

// Scroll state — solid nav kicks in early for logo visibility
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile menu toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// Smooth scroll to anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    }
  });
});

// ---- ANIMATIONS ----
function initAnimations() {

  // --- Hero animations ---
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .from('.nav-logo-img', { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out' })
    .from('.nav-links a', { y: -15, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    .from('.hero-title .line', {
      y: '100%',
      opacity: 0,
      stagger: 0.15,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-sub', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .from('.hero-cta', { y: 20, opacity: 0, scale: 0.95, duration: 0.6, ease: 'power2.out' }, '-=0.2')
    .from('.scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.1');

  // Hero parallax on scroll
  gsap.to('.hero-bg-img', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
    }
  });

  gsap.to('.hero-content', {
    y: -80,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: '60% top',
      end: 'bottom top',
      scrub: 0.5,
    }
  });

  // --- Reveal animations for .reveal-up ---
  document.querySelectorAll('.reveal-up').forEach(el => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  });

  // --- Reveal animations for .reveal-clip ---
  document.querySelectorAll('.reveal-clip').forEach(el => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.to(el, {
      clipPath: 'inset(0 0 0 0)',
      opacity: 1,
      duration: 1.0,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  // --- Pain cards parallax ---
  document.querySelectorAll('.pain-card').forEach((card, i) => {
    gsap.to(card, {
      y: -10 - (i * 5),
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      }
    });
  });

  // --- Video container scale ---
  gsap.from('.video-container', {
    scale: 0.92,
    borderRadius: '32px',
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.video-container',
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  });

  // --- SIRCLE Model image reveal ---
  const modelImg = document.querySelector('.model-image');
  if (modelImg) {
    gsap.from(modelImg, {
      scale: 0.85,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.sircle-model',
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });
  }

  // --- Case cards hover effect on image ---
  document.querySelectorAll('.case-card').forEach(card => {
    const img = card.querySelector('img');
    card.addEventListener('mouseenter', () => {
      gsap.to(img, { scale: 1.06, duration: 0.6, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
    });
  });

  // --- Marquee continuous scroll ---
  const track = document.querySelector('.marquee-track');
  if (track) {
    // Duplicate content for seamless loop
    track.innerHTML += track.innerHTML;
  }

  // --- Quote parallax ---
  gsap.to('.quote-bg .bg-texture', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.quote-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
    }
  });

  // --- About image parallax ---
  const aboutImg = document.querySelector('.about-image img');
  if (aboutImg) {
    gsap.to(aboutImg, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-image',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      }
    });
  }

  // --- Model phases parallax bg ---
  document.querySelectorAll('.model-phase').forEach(phase => {
    const bg = phase.querySelector('.bg-texture');
    if (bg) {
      gsap.to(bg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: phase,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        }
      });
    }

    // Phase content reveal
    const content = phase.querySelector('.phase-content');
    gsap.from(content, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: phase,
        start: 'top 70%',
        toggleActions: 'play none none none',
      }
    });
  });

  // --- CTA magnetic hover ---
  const ctaBtn = document.querySelector('.final-cta .btn-primary');
  if (ctaBtn && window.innerWidth > 767) {
    ctaBtn.addEventListener('mousemove', (e) => {
      const rect = ctaBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(ctaBtn, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    ctaBtn.addEventListener('mouseleave', () => {
      gsap.to(ctaBtn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
    });
  }

  // --- Footer stagger ---
  gsap.from('.footer-grid > *', {
    y: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      toggleActions: 'play none none none',
    }
  });

  gsap.from('.footer-socials a', {
    scale: 0,
    stagger: 0.1,
    duration: 0.4,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '.footer-socials',
      start: 'top 95%',
      toggleActions: 'play none none none',
    }
  });
}

// ---- TESTIMONIAL CAROUSEL ----
const dots = document.querySelectorAll('.carousel-dots .dot');
const testimonials = document.querySelectorAll('.testimonial');
let currentSlide = 0;
let autoAdvance;

function showSlide(n) {
  testimonials.forEach(t => t.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  testimonials[n].classList.add('active');
  dots[n].classList.add('active');
  currentSlide = n;
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    showSlide(parseInt(dot.dataset.slide));
    resetAutoAdvance();
  });
});

function resetAutoAdvance() {
  clearInterval(autoAdvance);
  autoAdvance = setInterval(() => {
    showSlide((currentSlide + 1) % testimonials.length);
  }, 5000);
}

resetAutoAdvance();

// ---- MOCKUP TILT (Desktop) ----
if (window.innerWidth > 900) {
  const mockup = document.querySelector('.mockup-img');
  const wrapper = document.querySelector('.mockup-wrapper');

  if (wrapper && mockup) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(mockup, {
        rotateY: x * 15,
        rotateX: -y * 10,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    wrapper.addEventListener('mouseleave', () => {
      gsap.to(mockup, {
        rotateY: -5,
        rotateX: 0,
        duration: 0.8,
        ease: 'elastic.out(1,0.7)',
      });
    });
  }
}

// ---- FORM SUBMIT ----
const form = document.querySelector('.lead-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    const input = form.querySelector('.lead-input');
    btn.innerHTML = '✓ Check je inbox!';
    btn.style.background = 'var(--mid-green)';
    btn.style.color = 'var(--white)';
    input.value = '';
    setTimeout(() => {
      btn.innerHTML = 'Download gratis <span class="btn-arrow">→</span>';
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  });
}

// ---- SECTION BG TRANSITIONS (smooth color blends) ----
// The sections alternate between dark and cream — CSS handles this
// But we add subtle opacity transitions for extra smoothness

document.querySelectorAll('.section').forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    onEnter: () => section.style.opacity = 1,
  });
});
