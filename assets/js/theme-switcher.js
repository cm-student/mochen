// assets/js/theme-switcher.js

(function() {
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  };

  const STORAGE_KEY = 'theme-preference';

  // SVGs for icons
  const ICONS = {
    [THEMES.LIGHT]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    [THEMES.DARK]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    [THEMES.SYSTEM]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
  };

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) || THEMES.SYSTEM;
  }

  function setStoredTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
  }

  function updateTheme(theme) {
    const root = document.documentElement;
    const effectiveTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;
    
    if (effectiveTheme === THEMES.DARK) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    
    // Update active state in UI
    const wrapper = document.getElementById('theme-switcher-wrapper');
    if (wrapper) {
      // Remove previous active classes
      wrapper.classList.remove('active-light', 'active-dark', 'active-system');
      wrapper.classList.add(`active-${theme}`); // e.g., active-light

      // Update button active states
      const btns = wrapper.querySelectorAll('.theme-btn');
      btns.forEach(btn => {
        if (btn.dataset.theme === theme) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        }
      });
    }
  }

  function createSwitcher() {
    // Remove old button if exists
    const oldBtn = document.getElementById('theme-switcher-btn');
    if (oldBtn) oldBtn.remove();

    const wrapper = document.createElement('div');
    wrapper.id = 'theme-switcher-wrapper';
    
    // Background indicator
    const indicator = document.createElement('div');
    indicator.id = 'theme-indicator';
    wrapper.appendChild(indicator);

    // Buttons
    [THEMES.LIGHT, THEMES.DARK, THEMES.SYSTEM].forEach(theme => {
      const btn = document.createElement('button');
      btn.className = 'theme-btn';
      btn.dataset.theme = theme;
      btn.innerHTML = ICONS[theme]; // Add text label if needed? Icons are probably enough.
      btn.title = `Switch to ${theme} theme`;
      btn.setAttribute('aria-label', `Switch to ${theme} theme`);
      
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent bubbling if needed
        setStoredTheme(theme);
        updateTheme(theme);
      });

      wrapper.appendChild(btn);
    });

    document.body.appendChild(wrapper);

    // Initial theme apply
    updateTheme(getStoredTheme());

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (getStoredTheme() === THEMES.SYSTEM) {
        updateTheme(THEMES.SYSTEM);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSwitcher);
  } else {
    createSwitcher();
  }
})();
