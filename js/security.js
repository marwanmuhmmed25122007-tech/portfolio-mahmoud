(function () {
  'use strict';

  var LOCK_KEY = 'dt_restricted_lock';
  var CHECK_INTERVAL = 1000; // ms
  var SIZE_THRESHOLD = 160;
  var overlay = null;
  var removedNodes = [];

  // ---------- Lock state helpers ----------
  function isLocked() {
    return sessionStorage.getItem(LOCK_KEY) === 'true';
  }
  function setLocked(v) {
    if (v) sessionStorage.setItem(LOCK_KEY, 'true');
    else sessionStorage.removeItem(LOCK_KEY);
  }

  // ---------- Overlay UI ----------
  function buildOverlay() {
    if (overlay) return overlay;

    var style = document.createElement('style');
    style.textContent =
      '@keyframes dtPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.7;transform:scale(1.06);}}' +
      '@keyframes dtFadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}';
    document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.id = '__access_restricted_overlay__';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'width:100vw', 'height:100vh',
      'z-index:2147483647', 'display:none', 'align-items:center',
      'justify-content:center', 'padding:24px', 'box-sizing:border-box',
      'background:radial-gradient(circle at 50% 35%, #1a0f0f 0%, #0a0a0a 60%, #050505 100%)',
      'font-family:"Segoe UI",system-ui,-apple-system,Roboto,sans-serif'
    ].join(';');

    overlay.innerHTML =
      '<div style="' + [
        'display:flex', 'flex-direction:column', 'align-items:center',
        'text-align:center', 'max-width:440px', 'width:100%',
        'padding:56px 44px',
        'background:rgba(255,255,255,0.03)',
        'border:1px solid rgba(255,80,80,0.18)',
        'backdrop-filter:blur(14px)',
        '-webkit-backdrop-filter:blur(14px)',
        'border-radius:20px',
        'box-shadow:0 25px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset',
        'animation:dtFadeUp .5s ease-out'
      ].join(';') + '">' +

        '<div style="' + [
          'width:72px', 'height:72px', 'border-radius:50%',
          'display:flex', 'align-items:center', 'justify-content:center',
          'background:rgba(255,76,76,0.1)',
          'border:1px solid rgba(255,76,76,0.35)',
          'margin-bottom:26px',
          'animation:dtPulse 2.2s ease-in-out infinite'
        ].join(';') + '">' +
          '<span style="font-size:32px;line-height:1;">&#9888;&#65039;</span>' +
        '</div>' +

        '<div style="' + [
          'color:#f5f5f5', 'font-size:24px', 'font-weight:700',
          'letter-spacing:1.5px', 'margin-bottom:12px'
        ].join(';') + '">ACCESS RESTRICTED</div>' +

        '<div style="' + [
          'color:#ff5c5c', 'font-size:11px', 'font-weight:700',
          'letter-spacing:3px', 'text-transform:uppercase',
          'margin-bottom:22px'
        ].join(';') + '">Dev Tools Detected</div>' +

        '<div style="' + [
          'width:48px', 'height:1px',
          'background:rgba(255,255,255,0.15)',
          'margin-bottom:22px'
        ].join(';') + '"></div>' +

        '<div style="' + [
          'color:rgba(255,255,255,0.6)', 'font-size:14.5px',
          'line-height:1.6'
        ].join(';') + '">Close Developer Tools and refresh the page<br>to continue.</div>' +

      '</div>';

    return overlay;
  }

  function ensureOverlayAttached() {
    if (document.body && overlay && !document.body.contains(overlay)) {
      document.body.appendChild(overlay);
    }
  }

  // ---------- Show / Hide (actually removes nodes from DOM) ----------
  function showRestriction() {
    if (!document.body) return;
    ensureOverlayAttached();

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    if (removedNodes.length === 0) {
      var children = Array.prototype.slice.call(document.body.children);
      children.forEach(function (el) {
        if (el === overlay) return;
        removedNodes.push({ el: el, nextSibling: el.nextSibling });
        document.body.removeChild(el);
      });
    }

    overlay.style.display = 'flex';
  }

  function hideRestriction() {
    if (!document.body) return;

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    removedNodes.forEach(function (item) {
      if (item.nextSibling && document.body.contains(item.nextSibling)) {
        document.body.insertBefore(item.el, item.nextSibling);
      } else {
        document.body.appendChild(item.el);
      }
    });
    removedNodes = [];

    if (overlay) overlay.style.display = 'none';
  }

  // ---------- Detection ----------
  function checkBySize() {
    var widthDiff = window.outerWidth - window.innerWidth > SIZE_THRESHOLD;
    var heightDiff = window.outerHeight - window.innerHeight > SIZE_THRESHOLD;
    return widthDiff || heightDiff;
  }

  function checkByTiming() {
    var start = performance.now();
    debugger;
    var end = performance.now();
    return (end - start) > 100;
  }

  function detectDevTools() {
    var detected = checkBySize();
    if (!detected) {
      try {
        detected = checkByTiming();
      } catch (e) {
        detected = false;
      }
    }
    return detected;
  }

  function runCheck() {
    var open = detectDevTools();
    if (open) {
      setLocked(true);
      showRestriction();
    } else if (isLocked()) {
      setLocked(false);
      hideRestriction();
    }
  }

  // ---------- Extra UX deterrents (no freezing) ----------
  function blockContextMenu() {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, true);
  }

  function blockDragSelect() {
    document.addEventListener('dragstart', function (e) {
      e.preventDefault();
    }, true);
  }

  function blockShortcuts() {
    document.addEventListener('keydown', function (e) {
      var key = e.key ? e.key.toLowerCase() : '';
      var ctrlOrCmd = e.ctrlKey || e.metaKey;

      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return;
      }
      if (ctrlOrCmd && e.shiftKey && ['i', 'j', 'c', 'k', 'e'].indexOf(key) !== -1) {
        e.preventDefault();
        return;
      }
      if (ctrlOrCmd && ['u', 's', 'p'].indexOf(key) !== -1) {
        e.preventDefault();
        return;
      }
    }, true);
  }

  // ---------- Init ----------
  function init() {
    buildOverlay();
    blockContextMenu();
    blockDragSelect();
    blockShortcuts();

    if (isLocked()) {
      if (checkBySize()) {
        showRestriction();
      } else {
        setLocked(false);
      }
    }

    setInterval(runCheck, CHECK_INTERVAL);
    runCheck();
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();