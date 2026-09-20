(() => {
  'use strict';

  const form = document.getElementById('landing-lead-form');
  const status = document.getElementById('form-status');
  const fileInput = document.getElementById('lead-file');
  const fileError = document.getElementById('file-error');
  const formSuccess = document.getElementById('form-success');
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = new Set(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']);
  const ALLOWED_EXTENSIONS = new Set(['pdf', 'docx', 'txt']);

  // Keep the native select for FormData and no-JavaScript fallback.
  const select = document.getElementById('lead-exchange');
  const picker = document.createElement('div');
  picker.className = 'service-select';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'service-select-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  const label = document.querySelector('label[for="lead-exchange"]');
  label.id = 'exchange-label';
  trigger.setAttribute('aria-labelledby', 'exchange-label exchange-value');
  const valueLabel = document.createElement('span');
  valueLabel.id = 'exchange-value';
  trigger.append(valueLabel);
  trigger.id = 'exchange-trigger';
  label.htmlFor = trigger.id;
  const menu = document.createElement('div');
  menu.className = 'service-select-menu';
  menu.id = 'exchange-options';
  menu.role = 'listbox';
  menu.setAttribute('aria-labelledby', label.id);
  menu.hidden = true;
  trigger.setAttribute('aria-controls', menu.id);
  const options = Array.from(select.options, (option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'service-select-option';
    button.role = 'option';
    button.textContent = option.textContent;
    button.addEventListener('click', () => {
      select.value = option.value;
      syncSelect();
      closeSelect(true);
      select.dispatchEvent(new Event('input', {bubbles:true}));
    });
    menu.append(button);
    return button;
  });
  function syncSelect() {
    valueLabel.textContent = select.options[select.selectedIndex].textContent;
    options.forEach((button, index) => button.setAttribute('aria-selected', String(index === select.selectedIndex)));
  }
  function closeSelect(focus = false) {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (focus) trigger.focus();
  }
  function openSelect() {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    options[select.selectedIndex].focus();
  }
  trigger.addEventListener('click', () => menu.hidden ? openSelect() : closeSelect());
  trigger.addEventListener('keydown', (event) => {
    if (['ArrowDown','ArrowUp'].includes(event.key)) { event.preventDefault(); openSelect(); }
  });
  menu.addEventListener('keydown', (event) => {
    const index = options.indexOf(document.activeElement);
    if(event.key === 'Escape') { event.preventDefault(); closeSelect(true); }
    if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length-1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options[next].focus();
    }
  });
  document.addEventListener('click', event => { if (!picker.contains(event.target)) closeSelect(); });
  picker.addEventListener('focusout', event => { if (!picker.contains(event.relatedTarget)) closeSelect(); });
  picker.append(trigger, menu);
  select.after(picker);
  select.hidden = true;
  syncSelect();

  function track(goal) {
    if (typeof window.ym === 'function') {
      try { window.ym(109257949, 'reachGoal', goal); } catch (_) { /* analytics must not block the form */ }
    }
  }

  function getAttribution() {
    const query = new URLSearchParams(window.location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'];
    const stored = {};
    keys.forEach((key) => {
      const value = query.get(key);
      try {
        if (value) sessionStorage.setItem(`algoforge_${key}`, value.slice(0, 200));
        stored[key] = sessionStorage.getItem(`algoforge_${key}`) || '';
      } catch (_) { stored[key] = (value || '').slice(0, 200); }
    });
    return stored;
  }

  function getClientId() {
    return new Promise((resolve) => {
      if (typeof window.ym !== 'function') return resolve('');
      let finished = false;
      const done = (value) => { if (!finished) { finished = true; resolve(String(value || '').slice(0, 80)); } };
      try { window.ym(109257949, 'getClientID', done); } catch (_) { done(''); }
      window.setTimeout(() => done(''), 700);
    });
  }

  function setStatus(message, isSuccess = false) {
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle('success', isSuccess);
  }

  function activeMethod() {
    return form.querySelector('input[name="contact_method"]:checked')?.value || 'phone';
  }

  function syncMethod() {
    const method = activeMethod();
    form.querySelectorAll('[data-contact-field]').forEach((field) => { field.hidden = field.dataset.contactField !== method; });
    const phone = document.getElementById('lead-phone');
    const telegram = document.getElementById('lead-telegram');
    phone.required = method === 'phone';
    telegram.required = method === 'telegram';
  }

  function validateFile() {
    fileError.hidden = true;
    fileError.textContent = '';
    const file = fileInput.files?.[0];
    if (!file) return true;
    const extension = file.name.toLowerCase().split('.').pop();
    if (!ALLOWED_EXTENSIONS.has(extension) || (file.type && !ALLOWED_TYPES.has(file.type))) {
      fileError.textContent = 'Прикрепите PDF, DOCX или TXT.';
      fileError.hidden = false;
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      fileError.textContent = 'Файл должен быть не больше 5 МБ.';
      fileError.hidden = false;
      return false;
    }
    return true;
  }

  document.querySelectorAll('[data-track]').forEach((element) => {
    element.addEventListener('click', () => track(element.dataset.track));
  });

  document.querySelectorAll('input[name="contact_method"]').forEach((input) => input.addEventListener('change', syncMethod));
  fileInput.addEventListener('change', () => { if (validateFile() && fileInput.files?.length) track('brief_upload'); });
  syncMethod();
  getAttribution();

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.getElementById('mobile-nav');
  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.hidden = isOpen;
  });
  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  let formStarted = false;
  form.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach((field) => field.addEventListener('input', () => {
    if (!formStarted) { formStarted = true; track('form_start'); }
  }, { once: true }));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (form.dataset.sending === 'true') return;
    setStatus('');
    if (!validateFile()) return;
    if (!form.reportValidity()) return;

    const method = activeMethod();
    const contact = method === 'phone' ? document.getElementById('lead-phone').value.trim() : document.getElementById('lead-telegram').value.trim();
    if (method === 'phone' && !/^\+?[\d\s()\-]{10,20}$/.test(contact)) {
      setStatus('Проверьте номер телефона.');
      document.getElementById('lead-phone').focus();
      track('form_error');
      return;
    }
    if (method === 'telegram' && !/^@?[A-Za-z0-9_]{3,32}$/.test(contact)) {
      setStatus('Укажите Telegram в формате @username.');
      document.getElementById('lead-telegram').focus();
      track('form_error');
      return;
    }

    const submit = form.querySelector('button[type="submit"]');
    const original = submit.innerHTML;
    form.dataset.sending = 'true';
    submit.disabled = true;
    submit.innerHTML = '<span>Отправляем…</span><span aria-hidden="true">↗</span>';
    const data = new FormData(form);
    const attribution = getAttribution();
    Object.entries(attribution).forEach(([key, value]) => data.set(key, value));
    data.set('landing_url', window.location.href.split('#')[0].slice(0, 500));
    form.elements.request_id.value ||= crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    data.set('request_id', form.elements.request_id.value);
    data.set('client_id', await getClientId());

    try {
      const endpoint = ['algoforge.ru','www.algoforge.ru'].includes(location.hostname) ? 'https://algoforge-uus2.onrender.com/api/lead' : '/api/lead';
      const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      let result = {};
      try { result = await response.json(); } catch (_) { /* handled below */ }
      if (!response.ok || !result.ok || !result.lead_id || result.spam) throw new Error(result.message || 'Не удалось отправить заявку. Попробуйте ещё раз.');
      track('lead_success');
      form.hidden = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      form.dataset.sending = 'false';
      submit.disabled = false;
      submit.innerHTML = original;
      setStatus(error.message || 'Не удалось отправить заявку. Попробуйте ещё раз.');
      track('form_error');
    }
  });
})();
