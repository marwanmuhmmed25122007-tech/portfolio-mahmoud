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

      "use strict";

    let devToolsDetected = false;

    function neutralizePage() {
        if (devToolsDetected) return;

        devToolsDetected = true;

        try {
            console.clear();
        } catch (_) {}

        document.documentElement.innerHTML = `
            <html>
            <head>
                <title>Access Denied</title>
            </head>
            <body style="
                margin:0;
                display:flex;
                justify-content:center;
                align-items:center;
                min-height:100vh;
                background:#0b0f19;
                color:#fff;
                font-family:Arial,sans-serif;
                text-align:center;
            ">
                <div>
                    <h1 style="
                        color:#ff4d4d;
                        font-size:34px;
                        margin-bottom:12px;
                    ">
                        ⚠️ Access Denied
                    </h1>

                    <p style="
                        color:#ccc;
                        font-size:18px;
                        max-width:500px;
                        line-height:1.6;
                    ">
                        DevTools inspection is disabled on this site
                        to protect intellectual property.
                    </p>

                    <p style="
                        color:#777;
                        font-size:14px;
                        margin-top:25px;
                    ">
                        Please close Developer Tools and refresh the page.
                    </p>
                </div>
            </body>
            </html>
        `;
    }

    function checkDevTools() {

        // Method 1: Docked DevTools
        const widthDifference =
            window.outerWidth - window.innerWidth;

        const heightDifference =
            window.outerHeight - window.innerHeight;

        if (
            widthDifference > 160 ||
            heightDifference > 160
        ) {
            neutralizePage();
            return;
        }

        // Method 2: debugger timing detection
        const start = performance.now();

        debugger;

        const elapsed = performance.now() - start;

        if (elapsed > 100) {
            neutralizePage();
            return;
        }
    }

    // IMPORTANT:
    // Run immediately when the page loads.
    checkDevTools();

    // Keep checking continuously.
    setInterval(function () {
        if (!devToolsDetected) {
            checkDevTools();
        }
    }, 500);

    // Clear console periodically.
    setInterval(function () {
        try {
            console.clear();
        } catch (_) {}
    }, 1000);

})();
