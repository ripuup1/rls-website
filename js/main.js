/* ============================================================
   RLS — Residential Land Services, PLLC
   main.js — Shared interactivity
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------
     1. STICKY NAVIGATION
     ---------------------------------------- */
  const nav = document.querySelector('.nav');

  function handleScroll() {
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  /* ----------------------------------------
     2. MOBILE MENU
     ---------------------------------------- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const navOverlay = document.querySelector('.nav-overlay');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking overlay
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ----------------------------------------
     3. SCROLL REVEAL ANIMATIONS
     ---------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ----------------------------------------
     4. ANIMATED STAT COUNTERS
     ---------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat__number[data-target]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (target - start) * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ----------------------------------------
     5. SMOOTH SCROLL FOR ANCHOR LINKS
     ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var offset = nav ? nav.offsetHeight : 0;
        var top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------
     6. ACTIVE NAV LINK
     ---------------------------------------- */
  var currentPath = window.location.pathname;
  var navLinkElements = document.querySelectorAll('.nav__link');

  navLinkElements.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    // Normalize: extract just the filename
    var linkPage = href.split('/').pop();
    var currentPage = currentPath.split('/').pop();

    // Handle root / index
    if (
      (currentPage === '' || currentPage === 'index.html') &&
      (linkPage === 'index.html' || href === '../index.html' || href === '/')
    ) {
      link.classList.add('nav__link--active');
    } else if (linkPage === currentPage && currentPage !== '' && currentPage !== 'index.html') {
      link.classList.add('nav__link--active');
    }
  });

  /* ----------------------------------------
     7. CONTACT FORM HANDLING
     ---------------------------------------- */
  var contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var originalBtnText = submitBtn ? submitBtn.textContent : '';

    contactForm.addEventListener('submit', function (e) {
      // Don't prevent default — let Formspree handle it
      // But add visual feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Re-enable after 3 seconds as fallback
        setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }, 3000);
      }
    });
  }

  /* ----------------------------------------
     8. CLIENT PORTAL REDIRECT
     ---------------------------------------- */
  var portalForm = document.querySelector('.portal-form');

  if (portalForm) {
    portalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.open('https://RLS-NC.sharefile.com', '_blank', 'noopener');
    });
  }

})();
