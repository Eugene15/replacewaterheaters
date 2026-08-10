document.querySelectorAll('form.request-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const error = form.querySelector('.form-error');
    const data = new FormData(form);
    const zip = String(data.get('zip') || '').trim();
    if (!form.checkValidity() || !/^\d{5}$/.test(zip)) {
      if (error) error.hidden = false;
      form.reportValidity();
      return;
    }

    if (error) error.hidden = true;
    const message = [
      'Water heater replacement request',
      data.get('address') ? `Address: ${String(data.get('address')).trim()}` : '',
      `Name: ${String(data.get('name')).trim()}`,
      `Phone: ${String(data.get('phone')).trim()}`,
      `ZIP: ${zip}`,
      `Current heater: ${String(data.get('heater')).trim()}`,
      data.get('message') ? `Details: ${String(data.get('message')).trim()}` : '',
    ].filter(Boolean).join('\n');

    window.location.href = `sms:+19162657756?&body=${encodeURIComponent(message)}`;
  });
});

document.querySelectorAll('.address-micro, .oc-resolve').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const address = String(new FormData(form).get('address') || '').trim();
    const request = document.querySelector('#request');
    const addressField = request?.querySelector('input[name="address"]');
    if (addressField) addressField.value = address;
    request?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    addressField?.focus();
  });
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
