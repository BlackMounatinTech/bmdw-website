// Black Mountain Dirt Works — Main JS

(function () {
  'use strict';

  // --- Mobile Nav Toggle ---
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close nav when a link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- Header scroll shadow ---
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Contact Form (sends via Formspree) ---
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.6';

      var data = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      }).then(function (response) {
        if (response.ok) {
          btn.textContent = 'Sent!';
          form.reset();
          setTimeout(function () {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
          }, 3000);
        } else {
          btn.textContent = 'Error — try calling instead';
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      }).catch(function () {
        btn.textContent = 'Error — try calling instead';
        btn.disabled = false;
        btn.style.opacity = '1';
      });
    });
  }

  // --- Fade-in on scroll ---
  // Only apply to elements that aren't already visible in the viewport
  var fadeEls = document.querySelectorAll('section, .service-card, .stat-item, .project-card');

  fadeEls.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    // If element is already in view on page load, don't hide it
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
    el.classList.add('fade-in');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '50px' });

  fadeEls.forEach(function (el) {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });

})();
