import './style.css';

// ============================================================
// Scroll Reveal — Intersection Observer
// ============================================================

function initScrollReveal(): void {
  const revealElements = document.querySelectorAll<HTMLElement>('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// ============================================================
// Navigation — Mobile Toggle
// ============================================================

function initNavigation(): void {
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  const body = document.body;

  if (!toggle || !mobileMenu) return;

  function closeMenu(): void {
    toggle!.classList.remove('is-active');
    mobileMenu!.classList.remove('is-open');
    body.style.overflow = '';
  }

  function openMenu(): void {
    toggle!.classList.add('is-active');
    mobileMenu!.classList.add('is-open');
    body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

// ============================================================
// Smooth Scroll — Anchor Links
// ============================================================

function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = 72;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

// ============================================================
// Nav Background Enhancement on Scroll
// ============================================================

function initNavScroll(): void {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  let ticking = false;

  function updateNav(): void {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      nav!.style.background = 'rgba(11, 11, 12, 0.92)';
    } else {
      nav!.style.background = 'rgba(11, 11, 12, 0.7)';
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
}

// ============================================================
// Stagger Delays for Grouped Reveals
// ============================================================

function initStaggerDelays(): void {
  const sections = document.querySelectorAll('.case-study__body, .systems__grid, .projects__list');

  sections.forEach((section) => {
    const children = section.querySelectorAll<HTMLElement>('.reveal');
    children.forEach((child, index) => {
      child.style.setProperty('--delay', `${index * 0.08}s`);
    });
  });
}

// ============================================================
// Initialize
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initStaggerDelays();
  initScrollReveal();
  initNavigation();
  initSmoothScroll();
  initNavScroll();
});
