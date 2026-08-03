const form = document.querySelector('#request');
const error = document.querySelector('#form-error');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const zip = String(data.get('zip') || '').trim();
  if (!form.checkValidity() || !/^\d{5}$/.test(zip)) {
    error.hidden = false;
    form.reportValidity();
    return;
  }

  error.hidden = true;
  const message = [
    'Water heater replacement request',
    `Name: ${String(data.get('name')).trim()}`,
    `Phone: ${String(data.get('phone')).trim()}`,
    `ZIP: ${zip}`,
    `Current heater: ${String(data.get('heater')).trim()}`,
    data.get('message') ? `Details: ${String(data.get('message')).trim()}` : '',
  ].filter(Boolean).join('\n');

  window.location.href = `sms:+19162657756?&body=${encodeURIComponent(message)}`;
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
