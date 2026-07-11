/* Black Mountain Dirt Works — Premium motion + interactions
   GSAP + ScrollTrigger loaded via CDN before this file.
   Everything degrades gracefully: if GSAP is missing, content still shows. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';

  /* ---------------- Mobile nav ---------------- */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  /* ---------------- Hero video: fade in only when ready ---------------- */
  var heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    var showVideo = function () { heroVideo.classList.add('is-ready'); };
    if (heroVideo.readyState >= 3) showVideo();
    else {
      heroVideo.addEventListener('canplay', showVideo, { once: true });
      heroVideo.addEventListener('loadeddata', showVideo, { once: true });
    }
    // Nudge autoplay (some browsers need an explicit play call)
    var p = heroVideo.play && heroVideo.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* ---------------- Header scroll state ---------------- */
  var header = document.querySelector('header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Contact form (Formspree) ---------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...'; btn.disabled = true; btn.style.opacity = '0.6';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (r.ok) {
            btn.textContent = 'Sent!'; form.reset();
            setTimeout(function () { btn.textContent = originalText; btn.disabled = false; btn.style.opacity = '1'; }, 3000);
          } else { btn.textContent = 'Error — try calling instead'; btn.disabled = false; btn.style.opacity = '1'; }
        })
        .catch(function () { btn.textContent = 'Error — try calling instead'; btn.disabled = false; btn.style.opacity = '1'; });
    });
  }

  /* ---------------- Fallback: if no GSAP or reduced motion, just show everything ---------------- */
  function showAll() {
    document.querySelectorAll('.reveal, .reveal-stagger > *').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    document.querySelectorAll('.rise, .slide-l, .slide-r, .clip-reveal').forEach(function (el) {
      el.classList.add('is-in');
    });
  }
  if (!hasGSAP || reduceMotion) { showAll(); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Hero headline: word-by-word rise (no paid SplitText) ---------------- */
  var splitEl = document.querySelector('[data-split]');
  if (splitEl) {
    var walk = function (node, out) {
      node.childNodes.forEach(function (child) {
        if (child.nodeType === 3) {
          child.textContent.split(/(\s+)/).forEach(function (tok) {
            if (tok.trim() === '') { out.push(document.createTextNode(tok)); return; }
            var w = document.createElement('span');
            w.style.display = 'inline-block'; w.style.willChange = 'transform';
            w.className = '__word'; w.textContent = tok;
            out.push(w);
          });
        } else if (child.nodeType === 1) {
          // Styled spans (e.g. accent-text gradient) animate as one unit —
          // don't split their words, or the gradient text-clip breaks.
          child.style.display = 'inline-block';
          child.style.willChange = 'transform';
          child.classList.add('__word');
          out.push(child);
        }
      });
    };
    var collected = [];
    walk(splitEl, collected);
    splitEl.innerHTML = '';
    collected.forEach(function (n) { splitEl.appendChild(n); });
    var words = splitEl.querySelectorAll('.__word');
    gsap.set(words, { yPercent: 115, opacity: 0 });
    gsap.to(words, { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.055, delay: 0.15 });
  }

  /* ---------------- Hero supporting elements fade up ---------------- */
  gsap.to('.hero .reveal', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.5,
    onStart: function () { document.querySelectorAll('.hero .reveal').forEach(function (e) { e.style.transform = 'translateY(0)'; }); }
  });
  gsap.set('.hero .reveal', { y: 24 });

  /* ---------------- Scroll reveals ---------------- */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    if (el.closest('.hero')) return; // hero handled above
    gsap.fromTo(el, { opacity: 0, y: 34 }, {
      opacity: 1, y: 0, duration: 0.95, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ---------------- Staggered groups ---------------- */
  gsap.utils.toArray('.reveal-stagger').forEach(function (group) {
    var kids = group.children;
    gsap.fromTo(kids, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true }
    });
  });

  /* ---------------- Interior page-hero: reveal on load (above the fold) ---------------- */
  var pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    gsap.fromTo(pageHero.querySelectorAll('.reveal'),
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.15 });
  }

  /* ---------------- Extra motion variants: rise / slide-l / slide-r / clip-reveal ---------------- */
  gsap.utils.toArray('.rise, .slide-l, .slide-r, .clip-reveal').forEach(function (el) {
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: function () { el.classList.add('is-in'); }
    });
  });

  /* ---------------- Masonry / gallery images: subtle scale-in as they enter ---------------- */
  gsap.utils.toArray('.pcard img, .detail-gallery img').forEach(function (img) {
    gsap.fromTo(img, { scale: 1.12 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: img, start: 'top 95%', end: 'top 40%', scrub: 0.8 }
    });
  });

  /* ---------------- Parallax layers (hero video, showcase) ---------------- */
  gsap.utils.toArray('[data-parallax]').forEach(function (el) {
    var depth = parseFloat(el.getAttribute('data-parallax')) || 0.15;
    gsap.to(el, {
      yPercent: depth * 100, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  });

  /* ---------------- Stat count-up ---------------- */
  gsap.utils.toArray('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target, duration: 1.6, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(obj.v) + suffix; }
        });
      }
    });
  });

})();
