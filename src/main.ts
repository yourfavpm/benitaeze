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
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px',
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
  const sections = document.querySelectorAll('.systems__grid, .projects__list, .exp__list');

  sections.forEach((section) => {
    const children = section.querySelectorAll<HTMLElement>('.reveal');
    children.forEach((child, index) => {
      child.style.setProperty('--delay', `${index * 0.07}s`);
    });
  });
}

// ============================================================
// Collapsible Case Studies & Project Entries
// ============================================================

function initExpandable(): void {
  // Case studies: collapse the .case-study__body, keep header visible
  document.querySelectorAll<HTMLElement>('.case-study').forEach((cs) => {
    const body = cs.querySelector<HTMLElement>('.case-study__body');
    const header = cs.querySelector<HTMLElement>('.case-study__header');
    if (!body || !header) return;

    // Measure full height
    body.style.overflow = 'hidden';
    const fullHeight = body.scrollHeight;
    // Collapse by default
    body.style.maxHeight = '0px';
    body.style.opacity = '0';
    body.style.transition = 'max-height 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease';

    // Create toggle button
    const btn = document.createElement('button');
    btn.className = 'expand-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = `<span class="expand-btn__label">Read case study</span><span class="expand-btn__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>`;

    header.appendChild(btn);

    let open = false;

    btn.addEventListener('click', () => {
      open = !open;
      btn.setAttribute('aria-expanded', String(open));

      if (open) {
        body.style.maxHeight = fullHeight + 64 + 'px';
        body.style.opacity = '1';
        btn.querySelector('.expand-btn__label')!.textContent = 'Collapse';
        btn.classList.add('is-open');
      } else {
        body.style.maxHeight = '0px';
        body.style.opacity = '0';
        btn.querySelector('.expand-btn__label')!.textContent = 'Read case study';
        btn.classList.remove('is-open');

        // Scroll back to case study header when closing
        setTimeout(() => {
          const top = cs.getBoundingClientRect().top + window.scrollY - 88;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 300);
      }
    });
  });

  // Project entries: collapse long descriptions after 2 lines
  document.querySelectorAll<HTMLElement>('.project-entry').forEach((entry) => {
    const desc = entry.querySelector<HTMLElement>('.project-entry__desc');
    if (!desc) return;

    // Only collapse if content is tall enough
    const lineHeight = parseFloat(getComputedStyle(desc).lineHeight) || 28;
    const threshold = lineHeight * 3;

    if (desc.scrollHeight <= threshold + 10) return;

    desc.classList.add('is-clamped');

    const btn = document.createElement('button');
    btn.className = 'clamp-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Show more';

    let open = false;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      open = !open;
      btn.setAttribute('aria-expanded', String(open));

      if (open) {
        desc.classList.remove('is-clamped');
        btn.textContent = 'Show less';
      } else {
        desc.classList.add('is-clamped');
        btn.textContent = 'Show more';
      }
    });

    desc.insertAdjacentElement('afterend', btn);
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
  initExpandable();
});
