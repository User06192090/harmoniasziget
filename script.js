const body = document.body;
const page = body.dataset.page;
const navLinks = [...document.querySelectorAll('[data-nav]')];
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleLabel = document.querySelector('.theme-toggle-label');
const revealItems = [...document.querySelectorAll('.reveal')];
const THEME_STORAGE_KEY = 'harmonia-theme';

const getStoredTheme = () => {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
};

const applyTheme = (theme) => {
  body.dataset.theme = theme;
  if (themeToggleLabel) {
    themeToggleLabel.textContent = theme === 'dark' ? 'Világos mód' : 'Sötét mód';
  }
};

const setActiveNav = () => {
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.dataset.nav === page);
  });
};

const showReveals = () => {
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
};

const startFleas = () => {
  const layer = document.createElement('div');
  layer.className = 'flea-layer';
  layer.setAttribute('aria-hidden', 'true');
  body.appendChild(layer);

  const pool = Array.from({ length: 6 }, () => {
    const flea = document.createElement('img');
    flea.src = 'media/flea.png';
    flea.alt = '';
    flea.className = 'flea';
    layer.appendChild(flea);
    return flea;
  });

  const activeFleas = new Set();

  const randomBetween = (min, max) => min + Math.random() * (max - min);

  const showFlea = (flea) => {
    const margin = 24;
    const maxX = Math.max(margin, window.innerWidth - 96);
    const maxY = Math.max(margin, window.innerHeight - 96);
    const startX = randomBetween(margin, maxX);
    const startY = randomBetween(margin, maxY);
    const scale = randomBetween(0.72, 1.08);
    const rotation = randomBetween(-18, 18);

    flea.style.display = 'block';
    flea.style.left = `${startX}px`;
    flea.style.top = `${startY}px`;
    flea.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    flea.style.opacity = `${randomBetween(0.36, 0.58)}`;

    let x = startX;
    let y = startY;
    const jumps = 2 + Math.floor(Math.random() * 4);

    const step = (count = 0) => {
      const nextX = Math.min(maxX, Math.max(margin, x + randomBetween(-140, 140)));
      const nextY = Math.min(maxY, Math.max(margin, y + randomBetween(-120, 120)));
      const nextScale = randomBetween(0.72, 1.08);
      const nextRotation = randomBetween(-24, 24);

      flea.animate(
        [
          { left: `${x}px`, top: `${y}px`, transform: flea.style.transform, opacity: flea.style.opacity },
          { left: `${(x + nextX) / 2}px`, top: `${Math.max(margin, Math.min(y, nextY) - randomBetween(28, 70))}px`, transform: `scale(${nextScale + 0.08}) rotate(${nextRotation}deg)`, opacity: `${randomBetween(0.4, 0.62)}` },
          { left: `${nextX}px`, top: `${nextY}px`, transform: `scale(${nextScale}) rotate(${nextRotation}deg)`, opacity: flea.style.opacity }
        ],
        {
          duration: randomBetween(380, 620),
          easing: 'cubic-bezier(.22,.75,.3,1)'
        }
      );

      x = nextX;
      y = nextY;
      flea.style.left = `${x}px`;
      flea.style.top = `${y}px`;
      flea.style.transform = `scale(${nextScale}) rotate(${nextRotation}deg)`;

      if (count + 1 < jumps) {
        window.setTimeout(() => step(count + 1), randomBetween(180, 360));
      } else {
        window.setTimeout(() => {
          flea.style.display = 'none';
          activeFleas.delete(flea);
        }, 500);
      }
    };

    window.setTimeout(() => step(), randomBetween(120, 280));
  };

  const launchBurst = () => {
    const available = pool.filter((flea) => !activeFleas.has(flea));
    const burstCount = Math.min(available.length, 1 + Math.floor(Math.random() * 3));

    available
      .sort(() => Math.random() - 0.5)
      .slice(0, burstCount)
      .forEach((flea, index) => {
        activeFleas.add(flea);
        window.setTimeout(() => showFlea(flea), index * randomBetween(220, 520));
      });

    window.setTimeout(launchBurst, randomBetween(2200, 4800));
  };

  window.setTimeout(launchBurst, 1800);
};

applyTheme(getStoredTheme());
setActiveNav();
showReveals();
startFleas();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}
