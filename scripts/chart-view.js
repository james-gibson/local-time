/* Stories of the past and future — the dials.
 *
 * Vanilla ES2020, no framework, no network. It re-reads the embedded spec, keeps one
 * `view` (a window in data coordinates plus the reader's origin), and reflects it into
 * the SVG's viewBox and the entries' classes.
 *
 * The projection below mirrors `src/query/stories-chart.ts`. That duplication is real
 * and deliberate for now: the page must dial without shipping a bundler or a second
 * build. If it grows, generate this file from the TypeScript instead — a test currently
 * guards the URL shape, not the arithmetic.
 */
(() => {
  'use strict';

  const svg = document.querySelector('svg.stories-chart');
  const specNode = document.getElementById('chart-spec');
  if (!svg || !specNode) return;
  const spec = JSON.parse(specNode.textContent);

  const W = 1400;
  const H = 900;
  const M = { top: 96, right: 64, bottom: 84, left: 112 };
  const PW = W - M.left - M.right;
  const PH = H - M.top - M.bottom;

  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const signedLog = (v) => Math.sign(v) * Math.log10(1 + Math.abs(v));

  function project(value, scale) {
    const { min, max } = scale.domain;
    if (max === min) return 0.5;
    if (scale.mode === 'linear') return clamp01((value - min) / (max - min));
    if (scale.mode === 'log') {
      const cap = Math.max(Math.abs(min), Math.abs(max));
      return cap <= 0 ? 0.5 : clamp01(0.5 + signedLog(value) / (2 * Math.log10(1 + cap)));
    }
    const breaks = (scale.breaks || []).slice().sort((a, b) => a.value - b.value);
    if (breaks.length < 2) return clamp01(signedLog(value - min) / Math.log10(1 + max - min));
    if (value <= breaks[0].value) return clamp01(breaks[0].position);
    for (let i = 1; i < breaks.length; i += 1) {
      const lo = breaks[i - 1];
      const hi = breaks[i];
      if (value <= hi.value) {
        const span = hi.value - lo.value;
        return clamp01(lo.position + (span === 0 ? 0 : ((value - lo.value) / span) * (hi.position - lo.position)));
      }
    }
    return clamp01(breaks[breaks.length - 1].position);
  }

  function unproject(position, scale) {
    const { min, max } = scale.domain;
    if (scale.mode === 'linear') return min + clamp01(position) * (max - min);
    if (scale.mode === 'log') {
      const cap = Math.max(Math.abs(min), Math.abs(max));
      const s = (clamp01(position) - 0.5) * 2 * Math.log10(1 + cap);
      return Math.sign(s) * (Math.pow(10, Math.abs(s)) - 1);
    }
    const breaks = (scale.breaks || []).slice().sort((a, b) => a.position - b.position);
    if (breaks.length < 2) return min + Math.pow(10, clamp01(position) * Math.log10(1 + max - min)) - 1;
    for (let i = 1; i < breaks.length; i += 1) {
      const lo = breaks[i - 1];
      const hi = breaks[i];
      if (position <= hi.position) {
        const span = hi.position - lo.position;
        return lo.value + (span === 0 ? 0 : ((position - lo.position) / span) * (hi.value - lo.value));
      }
    }
    return breaks[breaks.length - 1].value;
  }

  const xPix = (year) => M.left + project(year, spec.scales.x) * PW;
  const yPix = (offset) => M.top + (1 - project(offset, spec.scales.y)) * PH;

  // --- view ------------------------------------------------------------------
  const domainOf = (s) => ({ min: s.domain.min, max: s.domain.max });

  function readUrl() {
    const params = new URLSearchParams(window.location.search);
    const pair = (key) => {
      const raw = params.get(key);
      if (!raw) return null;
      const [a, b] = raw.split('..').map(Number);
      return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : null;
    };
    const origin = Number(params.get('origin'));
    if (!Number.isFinite(origin)) return null;
    return {
      x: pair('x') || [domainOf(spec.scales.x).min, domainOf(spec.scales.x).max],
      y: pair('y') || [-Math.abs(domainOf(spec.scales.y).max), Math.abs(domainOf(spec.scales.y).max)],
      now: origin,
      custom: params.get('view') === 'custom',
    };
  }

  let view =
    readUrl() || {
      x: [domainOf(spec.scales.x).min, domainOf(spec.scales.x).max],
      y: [-Math.abs(domainOf(spec.scales.y).max), Math.abs(domainOf(spec.scales.y).max)],
      now: spec.viewerNow,
      custom: false,
    };

  const fmtYear = (y) => (y < 0 ? Math.round(-y) + ' BCE' : String(Math.round(y)));
  const fmtSpan = (v) => {
    const a = Math.abs(v);
    if (a >= 1e9) return (a / 1e9).toFixed(1) + ' Gyr';
    if (a >= 1e6) return (a / 1e6).toFixed(1) + ' Myr';
    if (a >= 1e3) return (a / 1e3).toFixed(1) + ' kyr';
    return Math.round(a) + 'y';
  };

  function writeUrl() {
    const params = new URLSearchParams();
    const r = (v) => (Math.abs(v) >= 1000 ? Math.round(v) : Math.round(v * 100) / 100);
    params.set('x', r(view.x[0]) + '..' + r(view.x[1]));
    params.set('y', r(view.y[0]) + '..' + r(view.y[1]));
    params.set('origin', String(Math.round(view.now)));
    if (view.custom) params.set('view', 'custom');
    const next = window.location.pathname + '?' + params.toString() + window.location.hash;
    window.history.replaceState(null, '', next);
  }

  function applyView() {
    const px0 = Math.max(0, Math.min(W, xPix(view.x[0])));
    const px1 = Math.max(0, Math.min(W, xPix(view.x[1])));
    const py0 = Math.max(0, Math.min(H, yPix(view.y[1])));
    const py1 = Math.max(0, Math.min(H, yPix(view.y[0])));
    const w = Math.max(40, Math.abs(px1 - px0));
    const h = Math.max(40, Math.abs(py1 - py0));
    svg.setAttribute('viewBox', `${Math.min(px0, px1)} ${Math.min(py0, py1)} ${w} ${h}`);
    const stamp = document.getElementById('chart-stamp');
    if (stamp) stamp.textContent = `drawn for ${fmtYear(view.now)}${view.custom ? ' · custom' : ''}`;
    writeUrl();
  }

  // --- classes: the reader's origin decides the verdict, not the data ---------
  const entryGroups = Array.from(svg.querySelectorAll('g.entry'));

  function classify(year, min, max, side, now) {
    if (side === 'future') return year + max <= now ? 'obsolete' : 'still_possible';
    return Math.abs(min) < now - year ? 'period_piece' : 'recognizable';
  }

  function reclassify() {
    for (const g of entryGroups) {
      const year = Number(g.dataset.year);
      const min = Number(g.dataset.min);
      const max = Number(g.dataset.max);
      const side = max > 0 ? 'future' : 'past';
      const cls = classify(year, min, max, side, view.now);
      g.setAttribute('class', g.getAttribute('class').replace(/\b(obsolete|still_possible|period_piece|recognizable)\b/, cls));
      const label = g.querySelector('.label');
      if (label) label.setAttribute('class', 'label ' + cls);
      g.dataset.cls = cls;
    }
    const counts = { obsolete: 0, still_possible: 0, period_piece: 0, recognizable: 0 };
    for (const g of entryGroups) counts[g.dataset.cls] = (counts[g.dataset.cls] || 0) + 1;
    const countsNode = document.getElementById('chart-counts');
    if (countsNode) {
      countsNode.textContent = `${entryGroups.length} entries · ${counts.obsolete} obsolete · ${counts.still_possible} still possible · ${counts.period_piece} former period pieces · ${counts.recognizable} recognisable`;
    }
    svg.setAttribute(
      'aria-label',
      `Stories of the past and future, read from ${fmtYear(view.now)}: ${counts.obsolete} obsolete, ${counts.still_possible} still possible, ${counts.period_piece} former period pieces.`,
    );
  }

  // --- pointer conversion -----------------------------------------------------
  function toSvg(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  const toData = (p) => ({
    year: unproject(clamp01((p.x - M.left) / PW), spec.scales.x),
    offset: unproject(clamp01(1 - (p.y - M.top) / PH), spec.scales.y),
  });

  let drag = null;
  svg.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a')) return;
    drag = toSvg(e);
    svg.setPointerCapture(e.pointerId);
    svg.style.cursor = 'grabbing';
  });
  svg.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const p = toSvg(e);
    const a = toData(drag);
    const b = toData(p);
    const dx = a.year - b.year;
    const dy = a.offset - b.offset;
    view.x = [view.x[0] + dx, view.x[1] + dx];
    view.y = [view.y[0] + dy, view.y[1] + dy];
    view.custom = true;
    drag = p;
    applyView();
  });
  const endDrag = () => {
    drag = null;
    svg.style.cursor = '';
  };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  svg.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const p = toSvg(e);
      const at = toData(p);
      const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      const zoom = (range, centre) => {
        const lo = centre + (range[0] - centre) * factor;
        const hi = centre + (range[1] - centre) * factor;
        return [lo, hi];
      };
      view.x = zoom(view.x, at.year);
      view.y = zoom(view.y, at.offset);
      view.custom = true;
      applyView();
    },
    { passive: false },
  );

  svg.addEventListener('keydown', (e) => {
    const stepX = (view.x[1] - view.x[0]) * 0.1;
    const stepY = (view.y[1] - view.y[0]) * 0.1;
    const zoom = (f) => {
      view.x = [view.x[0] * f, view.x[1] * f];
      view.y = [view.y[0] * f, view.y[1] * f];
      view.custom = true;
      applyView();
    };
    switch (e.key) {
      case 'ArrowLeft':
        view.x = [view.x[0] - stepX, view.x[1] - stepX];
        break;
      case 'ArrowRight':
        view.x = [view.x[0] + stepX, view.x[1] + stepX];
        break;
      case 'ArrowUp':
        view.y = [view.y[0] + stepY, view.y[1] + stepY];
        break;
      case 'ArrowDown':
        view.y = [view.y[0] - stepY, view.y[1] - stepY];
        break;
      case '+':
      case '=':
        zoom(1 / 1.15);
        return;
      case '-':
      case '_':
        zoom(1.15);
        return;
      case 'Home':
      case '0':
        preset('canonical');
        return;
      default:
        return;
    }
    e.preventDefault();
    view.custom = true;
    applyView();
  });

  // --- presets ---------------------------------------------------------------
  function preset(name) {
    const now = view.now;
    const full = {
      x: [domainOf(spec.scales.x).min, domainOf(spec.scales.x).max],
      y: [-Math.abs(domainOf(spec.scales.y).max), Math.abs(domainOf(spec.scales.y).max)],
    };
    if (name === 'century') {
      view.x = [now - 120, now + 10];
      view.y = [-120, 120];
    } else if (name === 'decades') {
      view.x = [now - 80, now + 10];
      view.y = [-80, 80];
    } else {
      view.x = full.x;
      view.y = full.y;
    }
    view.custom = name !== 'canonical';
    for (const b of document.querySelectorAll('[data-preset]')) {
      b.setAttribute('aria-pressed', String(b.dataset.preset === name));
    }
    applyView();
  }

  for (const b of document.querySelectorAll('[data-preset]')) {
    b.addEventListener('click', () => preset(b.dataset.preset));
  }

  const originInput = document.getElementById('origin');
  if (originInput) {
    originInput.addEventListener('change', () => {
      const next = Number(originInput.value);
      if (!Number.isFinite(next)) return;
      view.now = next;
      reclassify();
      applyView();
    });
  }

  // --- theme -----------------------------------------------------------------
  const themeButton = document.getElementById('theme');
  const stored = window.localStorage.getItem('local-time-chart-theme');
  if (stored === 'dark' || stored === 'light') document.documentElement.dataset.theme = stored;
  const paintTheme = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.textContent = dark ? 'light' : 'dark';
    }
  };
  if (themeButton) {
    paintTheme();
    themeButton.addEventListener('click', () => {
      const dark = document.documentElement.dataset.theme === 'dark';
      document.documentElement.dataset.theme = dark ? 'light' : 'dark';
      window.localStorage.setItem('local-time-chart-theme', dark ? 'light' : 'dark');
      paintTheme();
    });
  }

  // --- the edges the plane collapses -----------------------------------------
  //
  // A plane cannot draw a reference: it has two axes and an edge needs a third
  // relation. So the static chart counts them and the interactive one draws them on
  // demand — focus or click an entry and its references appear, labelled with the
  // types the corpus declares.
  const overlay = document.getElementById('ref-edges');

  function markerXY(g) {
    const circle = g.querySelector('circle.marker');
    if (circle) return [Number(circle.getAttribute('cx')), Number(circle.getAttribute('cy'))];
    const line = g.querySelector('line.marker');
    if (line) {
      const x = Number(line.getAttribute('x1'));
      const y1 = Number(line.getAttribute('y1'));
      const y2 = Number(line.getAttribute('y2'));
      return [x, (y1 + y2) / 2];
    }
    return null;
  }

  function clearEdges() {
    if (overlay) overlay.textContent = '';
  }

  function drawEdges(g) {
    if (!overlay) return;
    clearEdges();
    const refs = (g.dataset.refs || '').split(' ').filter(Boolean);
    const from = markerXY(g);
    if (!from || !refs.length) return;
    for (const id of refs) {
      const target = document.getElementById('u-' + id);
      const to = target && markerXY(target);
      if (!to) continue;
      const midX = (from[0] + to[0]) / 2;
      const midY = (from[1] + to[1]) / 2 - Math.min(90, Math.abs(to[0] - from[0]) * 0.18);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${from[0]} ${from[1]} Q ${midX} ${midY} ${to[0]} ${to[1]}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'var(--accent)');
      path.setAttribute('stroke-width', '1.2');
      path.setAttribute('stroke-dasharray', '4 3');
      path.setAttribute('opacity', '0.65');
      overlay.appendChild(path);
    }
  }

  for (const g of entryGroups) {
    if (!g.dataset.refs) continue;
    g.addEventListener('focus', () => drawEdges(g));
    g.addEventListener('blur', clearEdges);
    g.addEventListener('click', () => drawEdges(g));
  }

  // --- deep links ------------------------------------------------------------
  function revealHash() {
    const m = /^#u-(.+)$/.exec(window.location.hash);
    if (!m) return;
    const target = document.getElementById('u-' + m[1]);
    if (!target) return;
    target.focus({ preventScroll: true });
    target.classList.add('targeted');
    drawEdges(target);
  }
  window.addEventListener('hashchange', revealHash);

  reclassify();
  applyView();
  revealHash();
})();
