/**
 * TomoTrip Landing Page v2 - JavaScript
 * Mobile-first, conversion-optimized interactions
 */

(function() {
  'use strict';

  // ===================================================================
  // ANALYTICS TRACKING HOOK
  // ===================================================================
  /**
   * Analytics tracking function
   * TODO: Integrate with actual analytics platform (GA4, GTM, etc.)
   */
  window.ttTrack = window.ttTrack || function(eventName, eventData) {
    if (typeof console !== 'undefined' && console.log) {
      console.log('[TomoTrip Analytics]', eventName, eventData);
    }
    
    // Example integration points:
    // if (window.gtag) {
    //   gtag('event', eventName, eventData);
    // }
    // if (window.dataLayer) {
    //   window.dataLayer.push({
    //     event: eventName,
    //     ...eventData
    //   });
    // }
  };

  // ===================================================================
  // VIDEO MODAL
  // ===================================================================
  const videoModal = document.getElementById('videoModal');
  const videoIframe = document.getElementById('videoIframe');
  const openVideoBtn = document.getElementById('openVideoModalBtn');
  const closeVideoBtn = document.getElementById('closeVideoModal');
  const videoModalOverlay = document.getElementById('videoModalOverlay');

  // Video Player Modal elements
  const videoPlayerModal = document.getElementById('videoPlayerModal');
  const videoPlayerOverlay = document.getElementById('videoPlayerOverlay');
  const closeVideoPlayerBtn = document.getElementById('closeVideoPlayer');
  const videoContainer = document.getElementById('videoContainer');

  function openVideoModal() {
    if (!videoModal) return;
    
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    window.ttTrack('video_selection_open', {
      source: 'hero_button'
    });
    
    closeVideoBtn?.focus();
  }

  function closeVideoModal() {
    if (!videoModal) return;
    
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
    
    window.ttTrack('video_selection_close', {});
    
    openVideoBtn?.focus();
  }

  function openVideoPlayer(videoUrl) {
    if (!videoPlayerModal || !videoContainer) return;
    
    // Close selection modal first
    closeVideoModal();
    
    // Extract video ID and create embed URL
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch')) {
      const videoId = new URL(videoUrl).searchParams.get('v');
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    // Insert iframe
    videoContainer.innerHTML = `
      <iframe
        src="${embedUrl}"
        title="TomoTrip 紹介動画"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="width: 100%; height: 100%; min-height: 300px;">
      </iframe>
    `;
    
    videoPlayerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    window.ttTrack('video_play', {
      video_url: videoUrl
    });
  }

  function closeVideoPlayer() {
    if (!videoPlayerModal || !videoContainer) return;
    
    videoPlayerModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear video to stop playback
    videoContainer.innerHTML = '';
    
    window.ttTrack('video_close', {});
  }

  // Video selection card clicks
  const videoOptionCards = document.querySelectorAll('#videoModal .option-card');
  videoOptionCards.forEach(card => {
    card.addEventListener('click', function() {
      const videoUrl = this.getAttribute('data-video-url');
      if (videoUrl) {
        openVideoPlayer(videoUrl);
      }
    });
  });

  // Close video player
  if (closeVideoPlayerBtn) {
    closeVideoPlayerBtn.addEventListener('click', closeVideoPlayer);
  }

  if (videoPlayerOverlay) {
    videoPlayerOverlay.addEventListener('click', closeVideoPlayer);
  }

  // Event listeners for video modal
  if (openVideoBtn) {
    openVideoBtn.addEventListener('click', openVideoModal);
  }

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', closeVideoModal);
  }

  if (videoModalOverlay) {
    videoModalOverlay.addEventListener('click', closeVideoModal);
  }

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (videoPlayerModal?.classList.contains('active')) {
        closeVideoPlayer();
      } else if (videoModal?.classList.contains('active')) {
        closeVideoModal();
      }
      if (lineModal?.classList.contains('active')) {
        closeLineModal();
      }
    }
  });

  // ===================================================================
  // LINE MODAL
  // ===================================================================
  const lineModal = document.getElementById('lineModal');
  const closeLineModalBtn = document.getElementById('closeLineModal');
  const lineModalOverlay = document.getElementById('lineModalOverlay');
  const openLineModalBtn = document.getElementById('openLineModalBtn');
  const openLineModalBtns = document.querySelectorAll('.open-line-modal');

  function openLineModal() {
    if (!lineModal) return;
    
    lineModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    window.ttTrack('line_modal_open', {
      source: 'button_click'
    });
    
    closeLineModalBtn?.focus();
  }

  function closeLineModal() {
    if (!lineModal) return;
    
    lineModal.classList.remove('active');
    document.body.style.overflow = '';
    
    window.ttTrack('line_modal_close', {});
  }

  // Event listeners for LINE modal
  if (openLineModalBtn) {
    openLineModalBtn.addEventListener('click', openLineModal);
  }

  openLineModalBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openLineModal();
    });
  });

  if (closeLineModalBtn) {
    closeLineModalBtn.addEventListener('click', closeLineModal);
  }

  if (lineModalOverlay) {
    lineModalOverlay.addEventListener('click', closeLineModal);
  }

  // Handle LINE registration option card clicks
  const optionCards = document.querySelectorAll('#lineModal .option-card');
  optionCards.forEach(card => {
    card.addEventListener('click', function() {
      const keyword = this.getAttribute('data-keyword');
      
      window.ttTrack('registration_click', {
        type: keyword
      });
      
      if (keyword === '観光客') {
        closeLineModal();
        window.location.href = 'https://app.tomotrip.com/tourist-registration-simple.html';
      } else if (keyword === 'ガイド') {
        closeLineModal();
        window.location.href = 'https://app.tomotrip.com/guide-registration-v2.html';
      } else if (keyword === '協賛店') {
        closeLineModal();
        var sponsorSection = document.getElementById('sponsor-section');
        if (sponsorSection) {
          sponsorSection.scrollIntoView({ behavior: 'smooth' });
          var heroBlock = sponsorSection.querySelector('.sponsor-hero');
          if (heroBlock) {
            setTimeout(function () {
              heroBlock.classList.add('is-highlighted');
              heroBlock.addEventListener('animationend', function () {
                heroBlock.classList.remove('is-highlighted');
              }, { once: true });
            }, 600);
          }
        }
      }
    });
  });

  // ===================================================================
  // AUDIENCE TABS
  // ===================================================================
  const tabs = document.querySelectorAll('[role="tab"]');
  const tabPanels = document.querySelectorAll('[role="tabpanel"]');

  /**
   * Get initial audience from URL parameters or hash
   * Supports: ?audience=student or #audience=student
   */
  function getInitialAudience() {
    // Check URL search params first
    const urlParams = new URLSearchParams(window.location.search);
    const audienceParam = urlParams.get('audience');
    if (audienceParam && ['student', 'night', 'homemaker', 'pro'].includes(audienceParam)) {
      return audienceParam;
    }
    
    // Check URL hash
    const hash = window.location.hash;
    if (hash.startsWith('#audience=')) {
      const hashAudience = hash.replace('#audience=', '');
      if (['student', 'night', 'homemaker', 'pro'].includes(hashAudience)) {
        return hashAudience;
      }
    }
    
    // Default to student
    return 'student';
  }

  /**
   * Set active audience tab
   * @param {string} audience - 'student', 'night', or 'pro'
   */
  window.setAudience = function(audience) {
    if (!['student', 'night', 'homemaker', 'pro'].includes(audience)) {
      console.warn('[TomoTrip] Invalid audience:', audience);
      return;
    }

    // Update tabs
    tabs.forEach(tab => {
      const isActive = tab.getAttribute('data-audience') === audience;
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      
      if (isActive) {
        tab.classList.add('tab--active');
      } else {
        tab.classList.remove('tab--active');
      }
    });

    // Update panels
    tabPanels.forEach(panel => {
      const panelId = panel.id;
      const shouldShow = panelId === `panel-${audience}`;
      
      if (shouldShow) {
        panel.hidden = false;
      } else {
        panel.hidden = true;
      }
    });

    // Update URL without page reload
    const newUrl = `${window.location.pathname}?audience=${audience}${window.location.hash}`;
    if (window.history.replaceState) {
      window.history.replaceState({ audience }, '', newUrl);
    }

    // Track audience view
    window.ttTrack('audience_view', {
      audience: audience,
      source: 'tab_click'
    });

    // Update hero content for pro audience
    updateHeroForAudience(audience);
  };

  /**
   * Update hero button and card text based on audience
   * @param {string} audience - Current audience type
   */
  function updateHeroForAudience(audience) {
    const heroBtn = document.querySelector('#openLineModalBtn');
    const heroCard = document.querySelector('.hero-cta-card');
    const heroCardTitle = document.querySelector('.hero-cta-card__lead');
    const heroCardDesc = document.querySelector('.hero-cta-card__subnote');

    if (!heroBtn) return;

    // Get other buttons that need to be updated
    const campaignBtn = document.querySelector('[data-testid="button-line-register-campaign"]');
    const sponsorRegBtn = document.querySelector('[data-testid="button-sponsor-register"]');
    const sponsorCtaBtn = document.querySelector('[data-testid="button-sponsor-cta"]');
    const mobileCtaBtn = document.querySelector('[data-testid="button-line-register-mobile"]');
    const sponsorNotes = document.querySelectorAll('.sponsor-hero__note');

    const btnIcon = heroBtn.querySelector('.btn__icon');
    const btnSubtitle = heroBtn.querySelector('.btn__subtitle');
    if (btnIcon) {
      heroBtn.innerHTML = '';
      heroBtn.appendChild(btnIcon);
      heroBtn.appendChild(document.createTextNode(' あなたの立場で始める '));
      if (btnSubtitle) {
        btnSubtitle.textContent = '観光客・ガイド・店舗、それぞれの入口あり';
        heroBtn.appendChild(btnSubtitle);
      }
    }

    if (heroCardTitle) {
      heroCardTitle.textContent = '観光客・ガイド・店舗、それぞれに最適な入口をご用意しています';
    }
    if (heroCardDesc) {
      heroCardDesc.textContent = 'ご不明な点はLINEでもご相談いただけます。';
    }

    if (campaignBtn) {
      const icon = campaignBtn.querySelector('.btn__icon');
      if (icon) {
        campaignBtn.innerHTML = '';
        campaignBtn.appendChild(icon);
        campaignBtn.appendChild(document.createTextNode(' あなたの立場で始める'));
      }
    }

    if (sponsorRegBtn) {
      sponsorRegBtn.textContent = 'まずは内容を確認する';
    }

    if (sponsorCtaBtn) {
      sponsorCtaBtn.textContent = '協賛店登録ページへ進む';
    }

    if (mobileCtaBtn) {
      const icon = mobileCtaBtn.querySelector('.btn__icon');
      if (icon) {
        mobileCtaBtn.innerHTML = '';
        mobileCtaBtn.appendChild(icon);
        mobileCtaBtn.appendChild(document.createTextNode(' あなたの立場で始める'));
      }
    }

    sponsorNotes.forEach((note, index) => {
      if (index === 0) {
        note.textContent = '※LINEで内容確認やご相談ができます。';
      } else {
        note.innerHTML = '※ご不明な点は<a href="https://lin.ee/rsHMnPA" target="_blank" rel="noopener noreferrer" style="color: #2e8b57; text-decoration: underline;">LINE</a>でもご案内できます。';
      }
    });
  }

  /**
   * Initialize tabs with keyboard navigation
   */
  function initTabs() {
    const initialAudience = getInitialAudience();
    window.setAudience(initialAudience);

    tabs.forEach((tab, index) => {
      // Click handler
      tab.addEventListener('click', function() {
        const audience = this.getAttribute('data-audience');
        window.setAudience(audience);
      });

      // Keyboard navigation
      tab.addEventListener('keydown', function(e) {
        let targetTab = null;

        // Arrow key navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (index + 1) % tabs.length;
          targetTab = tabs[nextIndex];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (index - 1 + tabs.length) % tabs.length;
          targetTab = tabs[prevIndex];
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetTab = tabs[0];
        } else if (e.key === 'End') {
          e.preventDefault();
          targetTab = tabs[tabs.length - 1];
        }

        if (targetTab) {
          targetTab.focus();
          const audience = targetTab.getAttribute('data-audience');
          window.setAudience(audience);
        }
      });
    });
  }

  // Initialize tabs when DOM is ready
  if (tabs.length > 0) {
    initTabs();
  }

  // ===================================================================
  // I18N (INTERNATIONALIZATION) - Future Implementation
  // ===================================================================
  /**
   * Language switcher stub
   * TODO: Implement full i18n with translation JSON files
   * @param {string} lang - Language code (e.g., 'ja', 'en', 'zh')
   */
  window.setLang = function(lang) {
    console.log('[TomoTrip i18n] Language switch requested:', lang);
    
    // Future implementation:
    // 1. Load translation JSON file for the language
    // 2. Find all elements with data-i18n attribute
    // 3. Replace text content with translated values
    // 4. Update HTML lang attribute
    // 5. Store preference in localStorage
    // 6. Track language change event
    
    /*
    Example structure:
    
    const translations = {
      ja: {
        'hero.title': 'あなたの知っている街、それだけで価値になる',
        'hero.subtitle': '観光客・ガイド・店舗、それぞれに合った関わり方があります'
      },
      en: {
        'hero.title': 'Your City Becomes Your Workplace',
        'hero.subtitle': 'TomoTrip - Earn income as a local guide on your schedule'
      }
    };
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = translations[lang]?.[key];
      if (translation) {
        el.textContent = translation;
      }
    });
    
    document.documentElement.lang = lang;
    localStorage.setItem('tt_lang', lang);
    */
    
    window.ttTrack('language_change', { language: lang });
  };

  // ===================================================================
  // CTA CLICK TRACKING
  // ===================================================================
  /**
   * Track all CTA button clicks
   */
  function initCTATracking() {
    const ctaButtons = document.querySelectorAll('a[href*="lin.ee"], a[data-testid*="line-register"]');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const buttonId = this.getAttribute('data-testid') || 'unknown';
        const buttonText = this.textContent.trim();
        const buttonLocation = getButtonLocation(this);
        
        window.ttTrack('cta_click', {
          button_id: buttonId,
          button_text: buttonText,
          button_location: buttonLocation,
          destination_url: this.href
        });
      });
    });
  }

  /**
   * Helper to determine button location on page
   */
  function getButtonLocation(element) {
    if (element.closest('#hero')) return 'hero';
    if (element.closest('#campaign')) return 'campaign';
    if (element.closest('.mobile-cta')) return 'mobile_cta';
    return 'unknown';
  }

  // ===================================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ===================================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#" or for tab anchors
        if (href === '#' || href.startsWith('#audience=')) {
          return;
        }
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const yOffset = -80; // Offset for fixed headers if any
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
          
          // Update URL hash
          if (window.history.pushState) {
            window.history.pushState(null, null, href);
          }
          
          // Move focus to target for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    });
  }

  // ===================================================================
  // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
  // ===================================================================
  function initScrollAnimations() {
    // Only apply if user hasn't requested reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
      // Skip hero section
      if (index === 0) return;
      
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  }

  // ===================================================================
  // FAQ ACCORDION TRACKING
  // ===================================================================
  function initFAQTracking() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      item.addEventListener('toggle', function() {
        if (this.open) {
          const question = this.querySelector('.faq-item__question')?.textContent.trim();
          const faqId = this.getAttribute('data-testid') || 'unknown';
          
          window.ttTrack('faq_open', {
            faq_id: faqId,
            question: question
          });
        }
      });
    });
  }

  // ===================================================================
  // PAGE VIEW TRACKING
  // ===================================================================
  function trackPageView() {
    const audience = getInitialAudience();
    const referrer = document.referrer || 'direct';
    
    window.ttTrack('page_view', {
      page_url: window.location.href,
      page_title: document.title,
      initial_audience: audience,
      referrer: referrer,
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    });
  }

  // ===================================================================
  // MOBILE CTA BAR VISIBILITY
  // ===================================================================
  function initMobileCTA() {
    const mobileCTA = document.getElementById('mobileCTA');
    if (!mobileCTA) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateCTAVisibility() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show CTA after scrolling down 300px
      // Hide when near bottom (within 200px of footer)
      const showCTA = scrollY > 300 && (scrollY + windowHeight) < (documentHeight - 200);
      
      if (showCTA) {
        mobileCTA.style.display = 'block';
      } else {
        mobileCTA.style.display = 'none';
      }
      
      lastScrollY = scrollY;
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateCTAVisibility);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    updateCTAVisibility(); // Initial check
  }

  // ===================================================================
  // FORM VALIDATION (if forms are added later)
  // ===================================================================
  /**
   * Basic form validation helper
   * Can be extended when contact/registration forms are added
   */
  window.validateEmail = function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  window.validatePhone = function(phone) {
    // Japanese phone number format
    const re = /^[\d\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  // ===================================================================
  // PERFORMANCE MONITORING
  // ===================================================================
  function trackPerformance() {
    if ('PerformanceObserver' in window) {
      // Track Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          window.ttTrack('performance_lcp', {
            value: lastEntry.renderTime || lastEntry.loadTime,
            element: lastEntry.element?.tagName
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Silently fail if not supported
      }

      // Track First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            window.ttTrack('performance_fid', {
              value: entry.processingStart - entry.startTime,
              name: entry.name
            });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Silently fail if not supported
      }
    }

    // Track page load time
    window.addEventListener('load', function() {
      setTimeout(function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        
        window.ttTrack('performance_load', {
          page_load_time: pageLoadTime,
          dom_ready_time: domReadyTime,
          dns_time: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp_time: perfData.connectEnd - perfData.connectStart,
          response_time: perfData.responseEnd - perfData.requestStart
        });
      }, 0);
    });
  }

  // ===================================================================
  // ERROR TRACKING
  // ===================================================================
  window.addEventListener('error', function(e) {
    window.ttTrack('javascript_error', {
      message: e.message,
      filename: e.filename,
      line: e.lineno,
      column: e.colno,
      stack: e.error?.stack
    });
  });

  // ===================================================================
  // INITIALIZATION
  // ===================================================================
  function init() {
    // Track initial page view
    trackPageView();
    
    // Initialize all features
    initCTATracking();
    initSmoothScroll();
    initScrollAnimations();
    initFAQTracking();
    initMobileCTA();
    trackPerformance();
    
    console.log('[TomoTrip] Landing page initialized successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ===================================================================
  // UTILITY FUNCTIONS (exposed globally)
  // ===================================================================
  
  /**
   * Scroll to top utility
   */
  window.scrollToTop = function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  /**
   * Check if element is in viewport
   */
  window.isInViewport = function(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

})();


