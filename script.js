(() => {
  const body = document.body;
  const conceptButtons = [...document.querySelectorAll('[data-concept]')];
  const concepts = ['one', 'two', 'three'];
  const main = document.querySelector('#main');
  const pageSections = Object.fromEntries(['top', 'casa', 'sabores', 'eventos', 'visite'].map((id) => [id, document.getElementById(id)]));
  const flavorSection = pageSections.sabores;
  const flavorHeading = flavorSection.querySelector('.section-heading');
  const catalogToolbar = flavorSection.querySelector('.catalog-toolbar');
  const menuCatalog = flavorSection.querySelector('.menu-catalog');
  const catalogDisclaimer = flavorSection.querySelector('.catalog-disclaimer');
  const menuNote = flavorSection.querySelector('.menu-note');

  // The control changes the page's reading sequence and content composition as well as its styling.
  const pageCompositions = {
    one: ['top', 'casa', 'sabores', 'eventos', 'visite'],
    two: ['top', 'eventos', 'sabores', 'casa', 'visite'],
    three: ['top', 'sabores', 'casa', 'eventos', 'visite'],
  };

  function setConcept(next) {
    if (!concepts.includes(next)) return;
    body.classList.remove(...concepts.map((name) => `concept-${name}`));
    body.classList.add(`concept-${next}`);
    pageCompositions[next].forEach((id) => main.append(pageSections[id]));
    flavorSection.append(flavorHeading, catalogToolbar, menuCatalog, catalogDisclaimer, menuNote);
    conceptButtons.forEach((button) => {
      const selected = button.dataset.concept === next;
      button.setAttribute('aria-pressed', String(selected));
    });
    try { history.replaceState(null, '', `#${next}`); } catch (_) { /* local file preview */ }
    window.dispatchEvent(new Event('resize'));
  }

  conceptButtons.forEach((button) => {
    button.addEventListener('click', () => setConcept(button.dataset.concept));
  });
  const initial = location.hash.slice(1);
  if (concepts.includes(initial)) setConcept(initial);

  const revealTargets = document.querySelectorAll('.intro-grid, .section-heading, .catalog-card, .menu-note, .gather-copy, .visit-details');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach((target) => {
      target.classList.add('reveal');
      revealObserver.observe(target);
    });
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  const mobileCta = document.querySelector('.mobile-cta');
  const syncCta = () => mobileCta?.classList.toggle('is-visible', window.scrollY > 360);
  window.addEventListener('scroll', syncCta, { passive: true });
  syncCta();

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const catalogCards = [...document.querySelectorAll('.catalog-card[data-category]')];
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filterButtons.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    catalogCards.forEach((card) => {
      const visible = category === 'all' || card.dataset.category === category;
      card.hidden = !visible;
      if (visible) card.animate?.([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.2,.75,.25,1)' });
    });
  }));

  const imageDialog = document.querySelector('.image-dialog');
  const dialogImage = imageDialog?.querySelector('img');
  document.querySelectorAll('[data-image]').forEach((button) => button.addEventListener('click', () => {
    if (!imageDialog || !dialogImage) return;
    dialogImage.src = button.dataset.image;
    dialogImage.alt = button.querySelector('img')?.alt || 'Imagem ampliada do catálogo da Bodega do Alê';
    imageDialog.showModal();
  }));
  imageDialog?.querySelector('.dialog-close')?.addEventListener('click', () => imageDialog.close());
  imageDialog?.addEventListener('click', (event) => { if (event.target === imageDialog) imageDialog.close(); });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      target.focus?.({ preventScroll: true });
    });
  });
})();
