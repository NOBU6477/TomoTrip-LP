(function () {
  'use strict';

  var APP_BASE = 'https://app.tomotrip.com';

  var URLS = {
    tourist: APP_BASE + '/tourist-registration-simple-en.html',
    guide:   APP_BASE + '/guide-registration-v2-en.html',
    sponsor: APP_BASE + '/sponsor-registration-en.html'
  };

  /* ── Modal helpers ── */
  function openModal(el) {
    if (!el) return;
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(el) {
    if (!el) return;
    el.classList.remove('active');
    document.body.style.overflow = '';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal').forEach(function (m) {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }

  /* ── DOM ready ── */
  document.addEventListener('DOMContentLoaded', function () {

    var typeModal  = document.getElementById('enTypeModal');
    var videoModal = document.getElementById('enVideoModal');

    /* Open user-type modal */
    document.querySelectorAll('.en-open-type-modal').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeAllModals();
        openModal(typeModal);
      });
    });

    /* Open video modal */
    document.querySelectorAll('.en-open-video-modal').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeAllModals();
        openModal(videoModal);
      });
    });

    /* Close buttons */
    document.querySelectorAll('.modal__close').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var modal = btn.closest('.modal');
        closeModal(modal);
      });
    });

    /* Overlay click to close */
    document.querySelectorAll('.modal__overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function () {
        var modal = overlay.closest('.modal');
        closeModal(modal);
      });
    });

    /* ESC key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllModals();
    });

    /* User-type cards */
    document.querySelectorAll('.en-type-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var type = card.dataset.type;
        var url = URLS[type];
        if (url) {
          closeAllModals();
          window.location.href = url;
        }
      });
    });

    /* FAQ accordion */
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var summary = item.querySelector('.faq-item__question');
      if (summary) {
        summary.addEventListener('click', function () {
          var isOpen = item.classList.contains('is-open');
          document.querySelectorAll('.faq-item').forEach(function (i) {
            i.classList.remove('is-open');
          });
          if (!isOpen) item.classList.add('is-open');
        });
      }
    });

    /* Mobile CTA visibility */
    var mobileCTA = document.getElementById('enMobileCTA');
    if (mobileCTA) {
      var heroCTA = document.querySelector('.hero-cta-card');
      function updateMobileCTA() {
        if (!heroCTA) return;
        var rect = heroCTA.getBoundingClientRect();
        mobileCTA.style.display = rect.bottom < 0 ? 'block' : 'none';
      }
      window.addEventListener('scroll', updateMobileCTA, { passive: true });
      updateMobileCTA();
    }

    /* Smooth scroll for anchor links */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

  });
})();
