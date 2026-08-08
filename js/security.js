/**
 * Advanced Website Security & DevTools Neutralizer Script
 * Prevents inspection, blocks F12/shortcuts, and freezes DevTools if opened.
 */
(function () {
  'use strict';

  // 1. Disable Context Menu (Right Click)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  }, true);

  // 2. Disable Keyboard Shortcuts for DevTools & View Source
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    const isControl = e.ctrlKey || e.metaKey;

    if (isControl) {
      // Shift combination keys
      if (e.shiftKey) {
        // Ctrl + Shift + I / J / C / E / K
        if (
          e.key === 'I' || e.key === 'i' || e.keyCode === 73 ||
          e.key === 'J' || e.key === 'j' || e.keyCode === 74 ||
          e.key === 'C' || e.key === 'c' || e.keyCode === 67 ||
          e.key === 'K' || e.key === 'k' || e.keyCode === 75 ||
          e.key === 'E' || e.key === 'e' || e.keyCode === 69
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      // Ctrl + U (View Source), Ctrl + S (Save Page), Ctrl + P (Print)
      if (
        e.key === 'U' || e.key === 'u' || e.keyCode === 85 ||
        e.key === 'S' || e.key === 's' || e.keyCode === 83 ||
        e.key === 'P' || e.key === 'p' || e.keyCode === 80
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, true);

  // 3. Disable Drag & Select
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
  }, true);

  // 4. DevTools Neutralizer & Freeze Trap
  function devToolsTrap() {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    // Detect if DevTools window is docked/opened
    if (widthThreshold || heightThreshold) {
      neutralizePage();
    }

    // Timing-based Debugger Trap
    const start = performance.now();
    (function () {
      return false;
    })['constructor']('debugger')();
    const end = performance.now();

    if (end - start > 100) {
      neutralizePage();
    }
  }

  function neutralizePage() {
    try {
      console.clear();
    } catch (_) {}
    document.body.innerHTML = `
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background:#0b0f19;color:#ff4d4d;font-family:sans-serif;text-align:center;padding:20px;">
        <h1 style="font-size:32px;margin-bottom:10px;">⚠️ Access Denied</h1>
        <p style="font-size:18px;color:#cccccc;max-width:500px;">DevTools inspection is disabled on this site to protect intellectual property.</p>
      </div>
    `;
    // Infinite loop to freeze DevTools console & network inspector
    while (true) {
      (function () {
        return false;
      })['constructor']('debugger')();
    }
  }

  // Run protection loops
  setInterval(devToolsTrap, 500);

  // Console Wipe
  setInterval(function () {
    try { console.clear(); } catch (_) {}
  }, 1000);

})();
