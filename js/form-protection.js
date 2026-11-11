// Browser checks supplement Formspree's server-side filtering.
(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var phone = form.elements.phone;
  function validatePhone() {
    var digits = phone.value.replace(/\D/g, '');
    if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
    // 555-0100 through 555-0199 are fictional numbers used by this spam campaign.
    var fictional = /^\d{3}55501\d{2}$/.test(digits);
    var invalid = digits.length < 7 || digits.length > 15 || /^(\d)\1+$/.test(digits);
    phone.setCustomValidity(fictional || invalid ? 'Please enter a working phone number so we can discuss your project.' : '');
  }
  phone.addEventListener('input', validatePhone);
  // Capture runs before the site's AJAX handler, so invalid forms never send.
  form.addEventListener('submit', function (event) {
    validatePhone();
    if (form.elements._gotcha.value || !form.checkValidity()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      form.reportValidity();
    }
  }, true);
})();
