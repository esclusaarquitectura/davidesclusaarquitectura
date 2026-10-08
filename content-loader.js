/* Carregador independent dels textos editables de Pages CMS. */
(() => {
  const cache = {};
  let currentLanguage = document.documentElement.lang === 'es' ? 'es' : 'ca';
  function render(lang) {
    const content = cache[lang];
    if (!content) return;
    document.querySelectorAll('[data-i]').forEach(element => {
      const key = element.getAttribute('data-i');
      if (!Object.prototype.hasOwnProperty.call(content, key)) return;
      if (key === 'photoPlaceholder') element.innerHTML = content[key];
      else element.textContent = content[key];
    });
  }
  async function load(lang) {
    try {
      const response = await fetch('/content/' + lang + '.json?t=' + Date.now(), {cache:'no-store'});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      cache[lang] = await response.json();
      if (currentLanguage === lang) render(lang);
    } catch (error) {
      console.warn('No s’han pogut carregar els textos de Pages CMS:', error);
    }
  }
  function switchLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    render(lang);
    load(lang);
  }
  document.getElementById('ca')?.addEventListener('click', () => switchLanguage('ca'));
  document.getElementById('es')?.addEventListener('click', () => switchLanguage('es'));
  load('ca');
  load('es');
})();