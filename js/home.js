'use strict';

/* GSAP — INTRO / HERO SECTION ANIMATIONS */
(function initIntroSection() {
  if (typeof gsap === 'undefined') return;

  const introSec = document.querySelector('.intro-section');
  if (!introSec) return;

  const topLabel = introSec.querySelector('.intro-top-label');
  const titleLines = introSec.querySelectorAll('.intro-title-line');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function runEntrance() {
    if (prefersReducedMotion) {
      /* Immediately show elements without animation for reduced-motion users */
      if (topLabel) { topLabel.style.opacity = 1; topLabel.style.transform = 'none'; }
      titleLines.forEach(function(line) { line.style.opacity = 1; line.style.transform = 'none'; });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (topLabel) {
      tl.to(topLabel, {
        opacity: 1,
        y: 0,
        duration: 0.9,
      }, 0);
    }

    if (titleLines.length) {
      tl.to(titleLines, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      }, topLabel ? 0.2 : 0);
    }
  }

  // Trigger entrance when loader completes or immediately if loader is already done/absent
  const loaderEl = document.getElementById('loader');
  if (loaderEl && !loaderEl.classList.contains('done')) {
    const observer = new MutationObserver(() => {
      if (loaderEl.classList.contains('done')) {
        observer.disconnect();
        setTimeout(runEntrance, 100);
      }
    });
    observer.observe(loaderEl, { attributes: true, attributeFilter: ['class'] });
  } else {
    runEntrance();
  }

  // GSAP ScrollTrigger for Scroll Micro-Interactions
  if (typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    /* Use matchMedia to disable hero parallax on mobile where it adds no value */
    ScrollTrigger.matchMedia({
      '(min-width: 769px)': function() {
        gsap.to(introSec, {
          y: -120,
          scale: 0.93,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: introSec,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });
  } else if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
})();

/* ACTIVE NAV LINK (highlight on scroll) */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === entry.target.id) link.classList.add('active');
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(sec => sectionObserver.observe(sec));


/* PROJECTS SECTION — Single horizontal scroll handler (consolidated) */
(function () {
  var outer = document.getElementById('psOuter');
  var track = document.getElementById('psTrack');

  if (!outer || !track) return;

  var maxTranslate = 0;
  var scrollHandler = null;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function recalc() {
    maxTranslate = Math.max(0, track.scrollWidth - track.clientWidth);

    var extraScreens = Math.max(1, Math.ceil(maxTranslate / window.innerHeight) + 1);
    outer.style.height = (extraScreens * 100) + 'vh';
  }

  function onScroll() {
    if (isMobile()) return;

    var rect = outer.getBoundingClientRect();
    var total = outer.offsetHeight - window.innerHeight;
    if (total <= 0) {
      track.style.transform = 'translateX(0px)';
      return;
    }

    var scrolled = -rect.top;
    var progress = scrolled / total;
    progress = Math.max(0, Math.min(1, progress));

    track.style.transform = 'translateX(-' + (progress * maxTranslate) + 'px)';
  }

  function setup() {
    if (isMobile()) {
      outer.style.height = 'auto';
      track.style.transform = 'none';
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
      }
      return;
    }
    recalc();
    if (!scrollHandler) {
      scrollHandler = onScroll;
      window.addEventListener('scroll', scrollHandler, { passive: true });
    }
    onScroll();
  }

  var images = track.querySelectorAll('img');
  var loaded = 0;
  var total = images.length;

  function onImgDone() {
    loaded++;
    if (loaded >= total) {
      setup();
    }
  }

  if (total === 0) {
    setup();
  } else {
    images.forEach(function (img) {
      if (img.complete) {
        onImgDone();
      } else {
        img.addEventListener('load', onImgDone);
        img.addEventListener('error', onImgDone);
      }
    });
  }

  window.addEventListener('load', setup);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 200);
  });
})();

/*  CERTIFICATES SLIDER — clone cards */
(function initCertSlider() {
  const track = document.querySelector('.slider-track');
  if (!track) return;
  Array.from(track.children).forEach(card => track.appendChild(card.cloneNode(true)));
})();


/* COPY EMAIL — Contact section */
(function initCopyEmail() {
  const copyBtn = document.getElementById('ctCopyBtn');
  const tooltip = document.getElementById('ctTooltip');
  const EMAIL   = 'mmhmdshamekh@gmail.com';
  let resetTimer = null;

  if (!copyBtn || !tooltip) return;

  function showCopied() {
    copyBtn.classList.add('copied');
    tooltip.classList.add('show');
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      copyBtn.classList.remove('copied');
      tooltip.classList.remove('show');
    }, 2200);
  }

  copyBtn.addEventListener('click', () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(showCopied).catch(fallback);
    } else {
      fallback();
    }
  });

  function fallback() {
    const ta = document.createElement('textarea');
    ta.value = EMAIL;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
    showCopied();
  }
})();


/* EXPERIENCE SECTION — Sticky card accordion */
(function () {
  'use strict';

  var SCROLL_PER_CARD = 800;   // px of scroll each card "owns" while active
  var END_BUFFER_RATIO = 0.4;  // extra scroll room after the last card (× viewport height)

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    var section = document.getElementById('experience');
    var stack   = document.getElementById('xpStack');
    if (!section || !stack) return;

    var cards    = Array.from(stack.querySelectorAll('.xp-card'));
    var numCards = cards.length;
    if (!numCards) return;

    cards.forEach(function (card) {
      var body = card.querySelector('.xp-card-body');
      if (!body) return;
      if (card.querySelector('.xp-card-body-outer')) return; // already wrapped

      var outer = document.createElement('div');
      outer.className = 'xp-card-body-outer';

      var inner = document.createElement('div');
      inner.className = 'xp-card-body-inner';

      body.parentNode.insertBefore(outer, body);
      outer.appendChild(inner);
      inner.appendChild(body);
    });

    cards.forEach(function (card) {
      if (card.parentNode && card.parentNode.classList.contains('xp-card-slot')) return; // already wrapped

      var slot = document.createElement('div');
      slot.className = 'xp-card-slot';
      slot.style.position = 'relative';

      card.parentNode.insertBefore(slot, card);
      slot.appendChild(card);
    });

    var slots = cards.map(function (card) { return card.parentNode; });

    function getStripHeight() {
      var strip = cards[0].querySelector('.xp-card-header');
      return (strip && strip.offsetHeight) || 90; // 90 = safe fallback
    }

    function layout() {
      var stripHeight = getStripHeight();
      var endBuffer    = window.innerHeight * END_BUFFER_RATIO;

      cards.forEach(function (card, i) {
        card.style.top    = (i * stripHeight) + 'px';
        card.style.zIndex = String(10 + i);

        var isLast = i === numCards - 1;
        slots[i].style.height = (SCROLL_PER_CARD + (isLast ? endBuffer : 0)) + 'px';
      });
    }

    layout();
    window.addEventListener('resize', layout, { passive: true });

    var activeIndex = -1;

    function setActive(index) {
      index = Math.max(0, Math.min(index, numCards - 1));
      if (index === activeIndex) return;
      activeIndex = index;

      cards.forEach(function (card, i) {
        card.classList.remove('xp-card--expanded', 'xp-card--collapsed');
        card.classList.add(i === index ? 'xp-card--expanded' : 'xp-card--collapsed');
      });
    }

    var ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    function update() {
      ticking = false;

      var sectionTop = section.getBoundingClientRect().top;
      var scrolledIn = -sectionTop;   /* negative = not reached yet */

      if (scrolledIn <= 0) {
        setActive(0);
        return;
      }

      var stripHeight = getStripHeight();
      var newIndex = 0;

      for (var i = 0; i < numCards; i++) {
        var slotTop = slots[i].getBoundingClientRect().top;
        if (slotTop <= (i * stripHeight) + 1) {
          newIndex = i;
        }
      }

      setActive(newIndex);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    update();
  }

})();