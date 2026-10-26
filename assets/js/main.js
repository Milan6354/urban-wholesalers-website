/* Urban Wholesalers Properties LTD: small progressive enhancements.
   The page works without this file: every link is a normal anchor. */
(function () {
  'use strict';

  var doc = document;

  /* Mobile navigation ---------------------------------------------------- */
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('site-nav');

  if (toggle && nav) {
    var label = toggle.querySelector('.nav-toggle__label');
    var isOpen = function () { return toggle.getAttribute('aria-expanded') === 'true'; };
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
      if (label) { label.textContent = open ? 'Close' : 'Menu'; }
    };

    toggle.addEventListener('click', function () { setOpen(!isOpen()); });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) { setOpen(false); }
    });

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    doc.addEventListener('click', function (event) {
      if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false);
      }
    });

    var wide = window.matchMedia('(min-width: 900px)');
    var onWide = function (event) { if (event.matches) { setOpen(false); } };
    if (wide.addEventListener) { wide.addEventListener('change', onWide); }
    else if (wide.addListener) { wide.addListener(onWide); }
  }

  /* Current year in the footer ------------------------------------------- */
  var year = doc.querySelector('[data-year]');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  /* How it works: step tabs ---------------------------------------------- */
  var tablist = doc.querySelector('.howto__steps');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panel = doc.getElementById('howto-panel');
    var shots = Array.prototype.slice.call(panel.querySelectorAll('.howto__shot'));
    var current = panel.querySelector('[data-howto-current]');
    var currentTitle = panel.querySelector('[data-howto-title]');

    var select = function (tab, moveFocus) {
      var step = tab.getAttribute('data-step');
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
      });
      shots.forEach(function (s) { s.hidden = s.getAttribute('data-step') !== step; });
      panel.setAttribute('aria-labelledby', tab.id);
      if (current) { current.textContent = step; }
      if (currentTitle) { currentTitle.textContent = tab.querySelector('.howto__title').textContent; }
      if (moveFocus) { tab.focus(); }
    };

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { next = tabs[(index + 1) % tabs.length]; }
        else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { next = tabs[(index - 1 + tabs.length) % tabs.length]; }
        else if (event.key === 'Home') { next = tabs[0]; }
        else if (event.key === 'End') { next = tabs[tabs.length - 1]; }
        if (next) { event.preventDefault(); select(next, true); }
      });
    });
  }

  /* Screenshot lightbox --------------------------------------------------- */
  var dialog = doc.querySelector('.lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') { return; }

  var media = dialog.querySelector('.lightbox__media');
  var bigImg = doc.createElement('img');
  bigImg.className = 'lightbox__img';
  bigImg.alt = '';
  media.appendChild(bigImg);
  var caption = dialog.querySelector('.lightbox__caption');
  var closeBtn = dialog.querySelector('.lightbox__close');
  var opener = null;

  Array.prototype.forEach.call(doc.querySelectorAll('[data-lightbox]'), function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      opener = link;
      var thumb = link.querySelector('img');
      var card = link.closest('.app-card');
      var title = card ? card.querySelector('.app-card__title') : null;
      var text = card ? card.querySelector('.app-card__text') : null;
      bigImg.src = link.getAttribute('href');
      bigImg.alt = thumb ? thumb.alt : '';
      caption.textContent = (title ? title.textContent.trim() + '. ' : '') + (text ? text.textContent.trim() : '');
      dialog.showModal();
      closeBtn.focus();
    });
  });

  closeBtn.addEventListener('click', function () { dialog.close(); });

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) { dialog.close(); }
  });

  dialog.addEventListener('close', function () {
    bigImg.removeAttribute('src');
    if (opener) { opener.focus(); }
  });
})();
