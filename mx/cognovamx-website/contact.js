/**
 * Contact form handler for CogNovaMX contact page.
 * Validates form fields and opens the user's email client
 * with a pre-filled mailto: link. No data leaves the browser.
 *
 * @file contact.js
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags contact, form
 */

(function contactFormInit() {
  const CONTACT_EMAIL = 'info@cognovamx.com';

  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function handleSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(function removeError(el) {
      el.remove();
    });
    form.querySelectorAll('.invalid').forEach(function clearInvalid(el) {
      el.classList.remove('invalid');
    });

    var name = document.getElementById('contact-name').value.trim();
    var email = document.getElementById('contact-email').value.trim();
    var company = document.getElementById('contact-company').value.trim();
    var website = document.getElementById('contact-website').value.trim();
    var service = document.getElementById('contact-service').value;
    var message = document.getElementById('contact-message').value.trim();
    var budget = document.getElementById('contact-budget').value;

    // Validate required fields
    var valid = true;

    if (!name) {
      showError('contact-name', 'Please enter your name.');
      valid = false;
    }
    if (!email || !isValidEmail(email)) {
      showError('contact-email', 'Please enter a valid email address.');
      valid = false;
    }
    if (!company) {
      showError('contact-company', 'Please enter your company name.');
      valid = false;
    }
    if (!service) {
      showError('contact-service', 'Please select how we can help.');
      valid = false;
    }
    if (!message) {
      showError('contact-message', 'Please tell us about your needs.');
      valid = false;
    }

    if (!valid) {
      // Focus the first invalid field
      var firstError = form.querySelector('.invalid');
      if (firstError) firstError.focus();
      return;
    }

    // Build email body
    var subject = 'MX Enquiry: ' + service + ' — ' + company;

    var body = 'Name: ' + name + '\n';
    body += 'Email: ' + email + '\n';
    body += 'Company: ' + company + '\n';
    if (website) {
      body += 'Website: ' + website + '\n';
    }
    body += 'Service: ' + service + '\n';
    if (budget) {
      body += 'Budget: ' + budget + '\n';
    }
    body += '\n---\n\n';
    body += message;
    body += '\n\n---\n';
    body += 'Sent from: https://allabout.network/mx/cognovamx-website/contact.html\n';

    // Open email client
    var mailto = 'mailto:' + CONTACT_EMAIL
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);

    window.location.href = mailto;
  });

  function isValidEmail(addr) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);
  }

  function showError(fieldId, msg) {
    var field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add('invalid');
    var error = document.createElement('span');
    error.className = 'field-error';
    error.setAttribute('role', 'alert');
    error.textContent = msg;
    field.parentNode.appendChild(error);
  }
})();
