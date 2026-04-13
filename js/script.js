document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    });
  
    // Apply initial animation styles and observe elements
    const animatedElements = document.querySelectorAll('.experience-item, .ig-post, .show-more-btn');
    animatedElements.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.4s ease-out';
      observer.observe(el);
    });
  
    // Consolidated "Show More" functionality for collapsible sections:
    document.querySelectorAll('.collapsible').forEach(collapsible => {
      const content = collapsible.querySelector('.collapsible-content');
      const button = collapsible.querySelector('.show-more-btn');
      if (!content || !button) return;
      
      // Convert 30em to pixels (using the root font size)
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const threshold = 20 * rootFontSize; // 30em in pixels
    
      // If the content's scrollHeight is less than or equal to 20em, hide the button.
      if (content.scrollHeight <= threshold) {
        button.style.display = 'none';
      } else {
        button.style.display = 'block';
      }
    
      button.addEventListener('click', () => {
        collapsible.classList.toggle('expanded');
        button.textContent = collapsible.classList.contains('expanded')
          ? 'Show Less ↑'
          : 'Show More ↓';
      });
    });
    
  
    // Scroll arrow functionality: Scroll smoothly to the content section
    const scrollArrow = document.querySelector('.scroll-arrow');
    const contentSection = document.querySelector('.content-section');
    if (scrollArrow && contentSection) {
      scrollArrow.addEventListener('click', function() {
        contentSection.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      console.error('Scroll arrow or content section not found.');
    }
  });
  
  // 90s Mode Toggle Functionality
  document.addEventListener('DOMContentLoaded', function() {
    const ninetiesToggle = document.getElementById('nineties-toggle');
    
    if (ninetiesToggle) {
      ninetiesToggle.addEventListener('click', function() {
        // Redirect to 90s page
        window.location.href = '90s.html';
      });
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const quickLinksMenu = document.querySelector('.quick-links-menu');
    const quickLinksButton = document.querySelector('.quick-links-button');
    const quickLinksNav = document.querySelector('.quick-links-nav');
    
    if (quickLinksButton && quickLinksMenu && quickLinksNav) {
      quickLinksButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = quickLinksMenu.classList.toggle('active');
        if (isOpen) {
          schedulePortfolioLiquidGlassRefresh(50);
        }
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!quickLinksMenu.contains(e.target)) {
          quickLinksMenu.classList.remove('active');
        }
      });
      
      // Close menu when clicking on a link
      const navLinks = quickLinksNav.querySelectorAll('a[href^="#"]');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          quickLinksMenu.classList.remove('active');
        });
      });

      // Handle submenu toggle on mobile
      const submenuParent = quickLinksNav.querySelector('.has-submenu');
      if (submenuParent) {
        const parentLink = submenuParent.querySelector('> a');
        parentLink.addEventListener('click', (e) => {
          // Only prevent default and toggle on mobile/tablet
          if (window.innerWidth <= 768) {
            e.preventDefault();
            submenuParent.classList.toggle('active');
            schedulePortfolioLiquidGlassRefresh(50);
          }
        });
      }
    }

  });

  const PORTFOLIO_LIQUID_GLASS_SELECTORS = [
    '.theme-picker-button',
    '.theme-picker-panel',
    '.quick-links-button',
    '.quick-links-nav',
    '.scroll-arrow',
    '.experience-item',
    '.education-item',
    '.skills-section',
    '.social-links a',
    '.linkedin-section .ig-post',
    '.pacman-button-wrapper',
  ];

  const LIQUID_GLASS_SURFACE_FNS = {
    convex_squircle: (x) => Math.pow(1 - Math.pow(1 - x, 4), 0.25),
  };

  let portfolioLiquidGlassInitialized = false;
  let portfolioLiquidGlassTimer = null;

  function calculateLiquidGlassRefractionProfile(glassThickness, bezelWidth, heightFn, ior, samples = 128) {
    const eta = 1 / ior;

    function refract(nx, ny) {
      const dot = ny;
      const k = 1 - eta * eta * (1 - dot * dot);

      if (k < 0) {
        return null;
      }

      const sq = Math.sqrt(k);
      return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
    }

    const profile = new Float64Array(samples);

    for (let i = 0; i < samples; i++) {
      const x = i / samples;
      const y = heightFn(x);
      const dx = x < 1 ? 0.0001 : -0.0001;
      const y2 = heightFn(x + dx);
      const deriv = (y2 - y) / dx;
      const mag = Math.sqrt(deriv * deriv + 1);
      const ref = refract(-deriv / mag, -1 / mag);

      if (!ref) {
        profile[i] = 0;
        continue;
      }

      profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1]);
    }

    return profile;
  }

  function generateLiquidGlassDisplacementMap(width, height, radius, bezelWidth, profile, maxDisplacement) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 128;
      data[i + 1] = 128;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    const radiusSquared = radius * radius;
    const outerRadiusSquared = (radius + 1) ** 2;
    const innerRadiusSquared = Math.max(radius - bezelWidth, 0) ** 2;
    const bodyWidth = width - radius * 2;
    const bodyHeight = height - radius * 2;
    const sampleCount = profile.length;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x < radius ? x - radius : x >= width - radius ? x - radius - bodyWidth : 0;
        const dy = y < radius ? y - radius : y >= height - radius ? y - radius - bodyHeight : 0;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared > outerRadiusSquared || distanceSquared < innerRadiusSquared) {
          continue;
        }

        const distance = Math.sqrt(distanceSquared);
        const fromSide = radius - distance;
        const opacity = distanceSquared < radiusSquared
          ? 1
          : 1 - (distance - Math.sqrt(radiusSquared)) / (Math.sqrt(outerRadiusSquared) - Math.sqrt(radiusSquared));

        if (opacity <= 0 || distance === 0) {
          continue;
        }

        const cos = dx / distance;
        const sin = dy / distance;
        const profileIndex = Math.min(((fromSide / bezelWidth) * sampleCount) | 0, sampleCount - 1);
        const displacement = profile[profileIndex] || 0;
        const displacementX = (-cos * displacement) / maxDisplacement;
        const displacementY = (-sin * displacement) / maxDisplacement;
        const index = (y * width + x) * 4;

        data[index] = (128 + displacementX * 127 * opacity + 0.5) | 0;
        data[index + 1] = (128 + displacementY * 127 * opacity + 0.5) | 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }

  function generateLiquidGlassSpecularMap(width, height, radius, bezelWidth, angle = Math.PI / 3) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    data.fill(0);

    const radiusSquared = radius * radius;
    const outerRadiusSquared = (radius + 1) ** 2;
    const innerRadiusSquared = Math.max(radius - bezelWidth, 0) ** 2;
    const bodyWidth = width - radius * 2;
    const bodyHeight = height - radius * 2;
    const lightVector = [Math.cos(angle), Math.sin(angle)];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x < radius ? x - radius : x >= width - radius ? x - radius - bodyWidth : 0;
        const dy = y < radius ? y - radius : y >= height - radius ? y - radius - bodyHeight : 0;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared > outerRadiusSquared || distanceSquared < innerRadiusSquared) {
          continue;
        }

        const distance = Math.sqrt(distanceSquared);
        const fromSide = radius - distance;
        const opacity = distanceSquared < radiusSquared
          ? 1
          : 1 - (distance - Math.sqrt(radiusSquared)) / (Math.sqrt(outerRadiusSquared) - Math.sqrt(radiusSquared));

        if (opacity <= 0 || distance === 0) {
          continue;
        }

        const cos = dx / distance;
        const sin = -dy / distance;
        const dot = Math.abs(cos * lightVector[0] + sin * lightVector[1]);
        const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
        const coefficient = dot * edge;
        const color = (255 * coefficient) | 0;
        const alpha = (color * coefficient * opacity) | 0;
        const index = (y * width + x) * 4;

        data[index] = color;
        data[index + 1] = color;
        data[index + 2] = color;
        data[index + 3] = alpha;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }

  function getLiquidGlassBorderRadius(element) {
    const computedStyle = window.getComputedStyle(element);
    const radius = parseFloat(computedStyle.borderTopLeftRadius) || parseFloat(computedStyle.borderRadius) || 12;
    return Math.max(8, radius);
  }

  function getPortfolioLiquidGlassTargets() {
    const seen = new Set();
    const elements = [];

    PORTFOLIO_LIQUID_GLASS_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (seen.has(element)) {
          return;
        }

        seen.add(element);
        elements.push(element);
      });
    });

    return elements;
  }

  function refreshPortfolioLiquidGlass() {
    const defs = document.getElementById('portfolio-liquid-glass-defs');

    if (!defs || !document.body) {
      return;
    }

    const targets = getPortfolioLiquidGlassTargets();

    if (!document.body.classList.contains('liquid-glass-mode')) {
      defs.innerHTML = '';
      targets.forEach((element) => {
        element.classList.remove('liquid-glass-surface');
        element.style.removeProperty('--liquid-glass-filter-url');
      });
      return;
    }

    const filterMarkup = [];

    targets.forEach((element, index) => {
      element.classList.add('liquid-glass-surface');

      const rect = element.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      if (width < 24 || height < 24) {
        element.style.removeProperty('--liquid-glass-filter-url');
        return;
      }

      const radius = Math.min(getLiquidGlassBorderRadius(element), width / 2 - 1, height / 2 - 1);
      const bezelWidth = Math.max(6, Math.min(radius * 0.55, 24));
      const glassThickness = Math.max(28, Math.min(Math.min(width, height) * 0.42, 72));
      const heightFn = LIQUID_GLASS_SURFACE_FNS.convex_squircle;
      const profile = calculateLiquidGlassRefractionProfile(glassThickness, bezelWidth, heightFn, 2.2, 96);
      const maxDisplacement = Math.max(...Array.from(profile).map(Math.abs)) || 1;
      const displacementMapUrl = generateLiquidGlassDisplacementMap(width, height, radius, bezelWidth, profile, maxDisplacement);
      const specularMapUrl = generateLiquidGlassSpecularMap(width, height, radius, bezelWidth * 2.25);
      const filterId = `portfolio-liquid-glass-${index}`;

      filterMarkup.push(`
        <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.32" result="blurred_source" />
          <feImage href="${displacementMapUrl}" x="0" y="0" width="${width}" height="${height}" result="disp_map" />
          <feDisplacementMap in="blurred_source" in2="disp_map"
            scale="${(maxDisplacement * 0.95).toFixed(3)}" xChannelSelector="R" yChannelSelector="G"
            result="displaced" />
          <feColorMatrix in="displaced" type="saturate" values="3.2" result="displaced_sat" />
          <feImage href="${specularMapUrl}" x="0" y="0" width="${width}" height="${height}" result="spec_layer" />
          <feComposite in="displaced_sat" in2="spec_layer" operator="in" result="spec_masked" />
          <feComponentTransfer in="spec_layer" result="spec_faded">
            <feFuncA type="linear" slope="0.42" />
          </feComponentTransfer>
          <feBlend in="spec_masked" in2="displaced" mode="normal" result="with_sat" />
          <feBlend in="spec_faded" in2="with_sat" mode="normal" />
        </filter>
      `);

      element.style.setProperty('--liquid-glass-filter-url', `url(#${filterId})`);
    });

    defs.innerHTML = filterMarkup.join('');
  }

  function schedulePortfolioLiquidGlassRefresh(delay = 60) {
    clearTimeout(portfolioLiquidGlassTimer);
    portfolioLiquidGlassTimer = setTimeout(refreshPortfolioLiquidGlass, delay);
  }

  function applyLiquidGlassMode(enabled) {
    if (!document.body) {
      return;
    }

    document.body.classList.toggle('liquid-glass-mode', enabled);
    localStorage.setItem('liquidGlassMode', String(enabled));
    schedulePortfolioLiquidGlassRefresh(enabled ? 30 : 0);
  }

  function initPortfolioLiquidGlass() {
    if (portfolioLiquidGlassInitialized) {
      return;
    }

    portfolioLiquidGlassInitialized = true;
    window.addEventListener('resize', () => {
      schedulePortfolioLiquidGlassRefresh(150);
    });
    schedulePortfolioLiquidGlassRefresh(30);
  }

  function initThemePicker() {
    const themePickerMenu = document.querySelector('.theme-picker-menu');
    const themePickerButton = document.querySelector('.theme-picker-button');
    const primaryColorInput = document.getElementById('primary-color');
    const secondaryColorInput = document.getElementById('secondary-color');
    const liquidGlassToggle = document.getElementById('liquid-glass-toggle');
    const resetThemeBtn = document.querySelector('.reset-theme-btn');
    const randomThemeBtn = document.querySelector('.random-theme-btn');
    const rainbowThemeBtn = document.querySelector('.rainbow-theme-btn');

    if (!themePickerButton || !themePickerMenu || !primaryColorInput || !secondaryColorInput || !resetThemeBtn || !randomThemeBtn || !rainbowThemeBtn) {
      return;
    }

    if (themePickerMenu.dataset.themePickerInit === 'true') {
      return;
    }
    themePickerMenu.dataset.themePickerInit = 'true';

    let rainbowInterval = null;
    let rainbowHue = 0;

    const setExpanded = (isOpen) => {
      themePickerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    // Toggle theme picker panel
    themePickerButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = themePickerMenu.classList.toggle('active');
      setExpanded(isOpen);
      if (isOpen) {
        schedulePortfolioLiquidGlassRefresh(50);
      }
    });

    // Close theme picker when clicking outside
    document.addEventListener('click', (e) => {
      if (!themePickerMenu.contains(e.target)) {
        themePickerMenu.classList.remove('active');
        setExpanded(false);
      }
    });

    // Load saved colors from localStorage
    const savedPrimaryColor = localStorage.getItem('primaryColor') || '#6C1AFF';
    const savedSecondaryColor = localStorage.getItem('secondaryColor') || '#FF1A4D';
    const savedLiquidGlassMode = localStorage.getItem('liquidGlassMode');
    const liquidGlassEnabled = savedLiquidGlassMode === null ? true : savedLiquidGlassMode === 'true';

    primaryColorInput.value = savedPrimaryColor;
    secondaryColorInput.value = savedSecondaryColor;

    // Apply saved colors
    applyThemeColors(savedPrimaryColor, savedSecondaryColor);
    applyLiquidGlassMode(liquidGlassEnabled);

    if (liquidGlassToggle) {
      liquidGlassToggle.checked = liquidGlassEnabled;
      liquidGlassToggle.addEventListener('input', (e) => {
        applyLiquidGlassMode(e.target.checked);
      });
    }

    // Primary color change handler
    primaryColorInput.addEventListener('input', (e) => {
      stopRainbowMode();
      const primaryColor = e.target.value;
      const secondaryColor = secondaryColorInput.value;
      applyThemeColors(primaryColor, secondaryColor);
      localStorage.setItem('primaryColor', primaryColor);
    });

    // Secondary color change handler
    secondaryColorInput.addEventListener('input', (e) => {
      stopRainbowMode();
      const primaryColor = primaryColorInput.value;
      const secondaryColor = e.target.value;
      applyThemeColors(primaryColor, secondaryColor);
      localStorage.setItem('secondaryColor', secondaryColor);
    });

    // Reset to default colors
    resetThemeBtn.addEventListener('click', () => {
      stopRainbowMode();
      const defaultPrimary = '#6C1AFF';
      const defaultSecondary = '#FF1A4D';
      primaryColorInput.value = defaultPrimary;
      secondaryColorInput.value = defaultSecondary;
      applyThemeColors(defaultPrimary, defaultSecondary);
      localStorage.setItem('primaryColor', defaultPrimary);
      localStorage.setItem('secondaryColor', defaultSecondary);
    });

    // Random colors
    randomThemeBtn.addEventListener('click', () => {
      stopRainbowMode();
      const randomPrimary = generateRandomColor();
      const randomSecondary = generateRandomColor();
      primaryColorInput.value = randomPrimary;
      secondaryColorInput.value = randomSecondary;
      applyThemeColors(randomPrimary, randomSecondary);
      localStorage.setItem('primaryColor', randomPrimary);
      localStorage.setItem('secondaryColor', randomSecondary);
    });

    // Rainbow mode
    rainbowThemeBtn.addEventListener('click', () => {
      if (rainbowInterval) {
        stopRainbowMode();
      } else {
        startRainbowMode();
      }
    });

    // Start rainbow mode
    function startRainbowMode() {
      rainbowThemeBtn.classList.add('active');
      rainbowHue = 0;
      rainbowInterval = setInterval(() => {
        rainbowHue = (rainbowHue + 1) % 360;
        const primaryColor = hslToHex(rainbowHue, 70, 55);
        const secondaryColor = hslToHex((rainbowHue + 180) % 360, 80, 55);
        primaryColorInput.value = primaryColor;
        secondaryColorInput.value = secondaryColor;
        applyThemeColors(primaryColor, secondaryColor);
      }, 50); // Update every 50ms for smooth animation
    }

    // Stop rainbow mode
    function stopRainbowMode() {
      if (rainbowInterval) {
        clearInterval(rainbowInterval);
        rainbowInterval = null;
        rainbowThemeBtn.classList.remove('active');
      }
    }

    // Function to apply theme colors
    function applyThemeColors(primaryColor, secondaryColor) {
      const root = document.documentElement;

      // Set primary color (purple) and variations
      root.style.setProperty('--primary-purple', primaryColor);
      root.style.setProperty('--accent-purple', adjustColorBrightness(primaryColor, 40));

      // Set backgrounds as darker versions of primary color
      root.style.setProperty('--dark-bg', darkenColor(primaryColor, 0.85));
      root.style.setProperty('--content-bg', darkenColor(primaryColor, 0.75));

      // Set secondary color (red) and variations
      root.style.setProperty('--primary-red', secondaryColor);
      root.style.setProperty('--accent-red', adjustColorBrightness(secondaryColor, 40));

      // Set rgba versions for effects (shadows, backgrounds)
      const primaryRgb = hexToRgb(primaryColor);
      const secondaryRgb = hexToRgb(secondaryColor);

      root.style.setProperty('--primary-red-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
      root.style.setProperty('--primary-purple-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
      root.style.setProperty('--liquid-glass-tint-color', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
      root.style.setProperty('--liquid-glass-shadow', `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.18)`);

      if (document.body.classList.contains('liquid-glass-mode')) {
        schedulePortfolioLiquidGlassRefresh(30);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPortfolioLiquidGlass();
      initThemePicker();
    });
  } else {
    initPortfolioLiquidGlass();
    initThemePicker();
  }

    // Helper function to adjust color brightness
    function adjustColorBrightness(hex, amount) {
      // Remove # if present
      hex = hex.replace('#', '');

      // Convert to RGB
      let r = parseInt(hex.substr(0, 2), 16);
      let g = parseInt(hex.substr(2, 2), 16);
      let b = parseInt(hex.substr(4, 2), 16);

      // Adjust brightness
      r = Math.min(255, Math.max(0, r + amount));
      g = Math.min(255, Math.max(0, g + amount));
      b = Math.min(255, Math.max(0, b + amount));

      // Convert back to hex
      const newHex = '#' +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0');

      return newHex;
    }

    // Helper function to darken a color by a percentage
    function darkenColor(hex, percentage) {
      // Remove # if present
      hex = hex.replace('#', '');

      // Convert to RGB
      let r = parseInt(hex.substr(0, 2), 16);
      let g = parseInt(hex.substr(2, 2), 16);
      let b = parseInt(hex.substr(4, 2), 16);

      // Darken by reducing RGB values
      r = Math.round(r * (1 - percentage));
      g = Math.round(g * (1 - percentage));
      b = Math.round(b * (1 - percentage));

      // Convert back to hex
      const newHex = '#' +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0');

      return newHex;
    }

    // Generate a random color
    function generateRandomColor() {
      const hue = Math.floor(Math.random() * 360);
      const saturation = 60 + Math.floor(Math.random() * 30); // 60-90%
      const lightness = 45 + Math.floor(Math.random() * 20); // 45-65%
      return hslToHex(hue, saturation, lightness);
    }

    // Convert HSL to Hex
    function hslToHex(h, s, l) {
      s /= 100;
      l /= 100;

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      let r = 0, g = 0, b = 0;

      if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
      } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
      } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
      } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
      } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
      } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return '#' +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0');
    }

    // Convert hex to RGB object
    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return { r, g, b };
    }
  
  // Konami Code Easter Egg
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiProgress = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiProgress]) {
      konamiProgress++;
      if (konamiProgress === konamiCode.length) {
        activateRainbowMode();
        konamiProgress = 0;
      }
    } else {
      konamiProgress = 0;
    }
  });
  
  function activateRainbowMode() {
    // Add rainbow hue animation to all elements
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbowHue {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
      
      .rainbow-active * {
        animation: rainbowHue 5s linear infinite !important;
      }
    `;
    document.head.appendChild(style);
    
    // Apply rainbow effect to body
    document.body.classList.add('rainbow-active');
    
    // Show secret message
    const message = document.createElement('div');
    message.textContent = 'Easter Egg Found!';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3em;
      font-weight: bold;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      z-index: 10000;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.7);
      padding: 20px 40px;
      border-radius: 10px;
    `;
    
    document.body.appendChild(message);
    
    // Remove effects after 5 seconds
    setTimeout(() => {
      document.body.classList.remove('rainbow-active');
      message.remove();
      style.remove();
    }, 5000);
  }
  
  // Pac-Man Maze Game
  const canvas = document.getElementById('pacman-maze');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Function to resize canvas responsively
    function resizeCanvas() {
      const container = canvas.parentElement;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Set canvas size to match container
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      
      // Calculate cell size based on canvas dimensions
      // Maintain the 25x15 grid ratio
      const targetCols = 25;
      const targetRows = 15;
      const cellSizeX = canvas.width / targetCols;
      const cellSizeY = canvas.height / targetRows;
      
      // Use the smaller cell size to maintain aspect ratio
      window.pacmanCellSize = Math.min(cellSizeX, cellSizeY);
      
      // Center the game if there's extra space
      window.pacmanOffsetX = (canvas.width - (targetCols * window.pacmanCellSize)) / 2;
      window.pacmanOffsetY = (canvas.height - (targetRows * window.pacmanCellSize)) / 2;
    }
    
    function getCellSize() {
      return window.pacmanCellSize;
    }
    
    function syncEntityPixelsToGrid(entity) {
      const size = getCellSize();
      entity.pixelX = entity.x * size;
      entity.pixelY = entity.y * size;
    }
    
    function snapEntityToGrid(entity, snapThreshold = 0.05) {
      const size = getCellSize();
      const gridX = Math.round(entity.x);
      const gridY = Math.round(entity.y);
      if (Math.abs(entity.x - gridX) < snapThreshold) {
        entity.x = gridX;
        entity.pixelX = gridX * size;
      }
      if (Math.abs(entity.y - gridY) < snapThreshold) {
        entity.y = gridY;
        entity.pixelY = gridY * size;
      }
    }
    
    // Initial resize
    resizeCanvas();
    
    function handlePacmanResize() {
      resizeCanvas();
      if (pacman) {
        syncEntityPixelsToGrid(pacman);
      }
      if (ghosts && Array.isArray(ghosts)) {
        ghosts.forEach(syncEntityPixelsToGrid);
      }
    }
    const cols = 25; // Fixed grid size
    const rows = 15;
    
    // Game state
    let gameActive = true;
    let respawnTimer = 0;
    let pelletsRemaining = 0;
    let levelComplete = false;
    
    // Frame rate independent timing
    let lastFrameTime = 0;
    let deltaTime = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS; // 16.67ms for 60fps
    
    // Classic Pac-Man maze layout (25x15 for 500x300 canvas)
    // 1 = wall, 0 = empty path, 2 = pellet, 3 = power pellet
    const mazeTemplate = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,3,2,2,2,2,2,2,2,2,1,0,1,2,2,2,2,2,2,2,2,3,1,0],
      [0,1,2,1,1,2,1,1,1,1,2,1,0,1,2,1,1,1,1,2,1,1,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,1,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,1,2,1,0],
      [0,1,2,2,2,2,1,2,2,2,2,1,0,1,2,2,2,2,1,2,2,2,2,1,0],
      [0,1,1,1,1,2,1,1,1,1,0,1,0,1,0,1,1,1,1,2,1,1,1,1,0],
      [0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0],
      [0,1,1,1,1,2,1,0,1,1,0,0,0,0,0,1,1,0,1,2,1,1,1,1,0],
      [0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0],
      [0,1,2,1,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,1,2,1,0],
      [0,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    
    // Create a working copy of the maze
    let maze = mazeTemplate.map(row => [...row]);
    
    function resetMaze() {
      // Reset maze to original state
      maze = mazeTemplate.map(row => [...row]);
      
      // Count pellets
      pelletsRemaining = 0;
      for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 25; x++) {
          if (maze[y][x] === 2 || maze[y][x] === 3) {
            pelletsRemaining++;
          }
        }
      }
      
      // Reset entities to spawn positions
      pacman.x = pacmanSpawn.x;
      pacman.y = pacmanSpawn.y;
      pacman.pixelX = pacmanSpawn.x * getCellSize();
      pacman.pixelY = pacmanSpawn.y * getCellSize();
      pacman.direction = 'left';
      pacman.targetPath = [];
      
      ghosts.forEach((ghost) => {
        ghost.x = ghost.spawn.x;
        ghost.y = ghost.spawn.y;
        ghost.pixelX = ghost.spawn.x * getCellSize();
        ghost.pixelY = ghost.spawn.y * getCellSize();
        ghost.targetPath = [];
        ghost.mode = 'scatter';
      });
      
      // Reset game state (in milliseconds)
      startDelay = 2000; // 2 seconds
      modeTimer = 3000; // 3 seconds
      chaseMode = false;
      levelComplete = false;
    }
    
    // Game entities with spawn positions and smooth movement
    const pacmanSpawn = { x: 12, y: 10 };
    let pacman = {
      x: pacmanSpawn.x,
      y: pacmanSpawn.y,
      pixelX: pacmanSpawn.x * getCellSize(),
      pixelY: pacmanSpawn.y * getCellSize(),
      direction: 'left',
      nextDirection: 'left',
      mouthOpen: true,
      animationCounter: 0,
      speed: 0.08,  // Slower, frame-rate independent movement
      targetPath: [],
      lastPositions: []
    };
    
    // Spread ghost spawns across the maze to avoid early collision
    const ghostSpawns = [
      { x: 12, y: 7 },   // Blinky - center ghost house
      { x: 2, y: 2 },    // Pinky - top left corner
      { x: 22, y: 2 },   // Inky - top right corner  
      { x: 12, y: 4 }    // Clyde - upper middle
    ];
    
    const ghosts = [
      { x: ghostSpawns[0].x, y: ghostSpawns[0].y, 
        pixelX: ghostSpawns[0].x * getCellSize(), pixelY: ghostSpawns[0].y * getCellSize(), 
        color: '#FF0000', direction: 'up', name: 'Blinky', 
        mode: 'scatter', speed: 0.06, targetPath: [], scatter: {x: 22, y: 2},
        spawn: ghostSpawns[0] },
      { x: ghostSpawns[1].x, y: ghostSpawns[1].y, 
        pixelX: ghostSpawns[1].x * getCellSize(), pixelY: ghostSpawns[1].y * getCellSize(),
        color: '#FFB8FF', direction: 'right', name: 'Pinky', 
        mode: 'scatter', speed: 0.055, targetPath: [], scatter: {x: 2, y: 2},
        spawn: ghostSpawns[1] },
      { x: ghostSpawns[2].x, y: ghostSpawns[2].y, 
        pixelX: ghostSpawns[2].x * getCellSize(), pixelY: ghostSpawns[2].y * getCellSize(),
        color: '#00FFFF', direction: 'left', name: 'Inky', 
        mode: 'scatter', speed: 0.05, targetPath: [], scatter: {x: 22, y: 12},
        spawn: ghostSpawns[2] },
      { x: ghostSpawns[3].x, y: ghostSpawns[3].y, 
        pixelX: ghostSpawns[3].x * getCellSize(), pixelY: ghostSpawns[3].y * getCellSize(),
        color: '#FFB852', direction: 'down', name: 'Clyde', 
        mode: 'scatter', speed: 0.045, targetPath: [], scatter: {x: 2, y: 12},
        spawn: ghostSpawns[3] }
    ];

    // Resize on window resize (after entities exist)
    window.addEventListener('resize', handlePacmanResize);
    
    let modeTimer = 200; // Start with scatter mode
    let chaseMode = false;
    let startDelay = 120; // Give player 2 seconds to start
    
    // Movement patterns for ghosts
    const directions = ['up', 'down', 'left', 'right'];
    
    // A* Pathfinding Algorithm with improved robustness
    function findPath(startX, startY, targetX, targetY, maxLength = 20) {
      // Validate inputs
      if (!isFinite(startX) || !isFinite(startY) || !isFinite(targetX) || !isFinite(targetY)) {
        return [];
      }
      
      // Round coordinates to grid positions
      const startGridX = Math.round(startX);
      const startGridY = Math.round(startY);
      const targetGridX = Math.round(targetX);
      const targetGridY = Math.round(targetY);
      
      // Ensure target is within bounds
      if (targetGridX < 0 || targetGridX >= 25 || targetGridY < 0 || targetGridY >= 15) {
        return [];
      }
      
      // If already at target, return empty path
      if (startGridX === targetGridX && startGridY === targetGridY) {
        return [];
      }
      
      const openSet = [];
      const closedSet = new Set();
      
      // Node class for pathfinding
      class Node {
        constructor(x, y, g, h, parent) {
          this.x = x;
          this.y = y;
          this.g = g; // Distance from start
          this.h = h; // Heuristic distance to target
          this.f = g + h; // Total cost
          this.parent = parent;
          this.key = `${x},${y}`; // Unique key for fast lookup
        }
      }
      
      // Heuristic function (Manhattan distance)
      function heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
      }
      
      // Check if position is valid for pathfinding
      function isValidPos(x, y) {
        if (y < 0 || y >= 15) return false;
        if (x < 0 || x >= 25) return false;
        return maze[y] && maze[y][x] !== 1;
      }
      
      const startNode = new Node(startGridX, startGridY, 0, 
                                  heuristic(startGridX, startGridY, targetGridX, targetGridY), null);
      openSet.push(startNode);
      
      let iterations = 0;
      const maxIterations = 200; // Increased iterations for complex paths
      
      while (openSet.length > 0 && iterations < maxIterations) {
        iterations++;
        
        // Find node with lowest f cost
        let currentIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
          if (openSet[i].f < openSet[currentIndex].f || 
              (openSet[i].f === openSet[currentIndex].f && openSet[i].h < openSet[currentIndex].h)) {
            currentIndex = i;
          }
        }
        
        const current = openSet.splice(currentIndex, 1)[0];
        closedSet.add(current.key);
        
        // Check if we reached the target
        if (current.x === targetGridX && current.y === targetGridY) {
          const path = [];
          let temp = current;
          while (temp) {
            path.push({x: temp.x, y: temp.y});
            temp = temp.parent;
          }
          return path.reverse();
        }
        
        // Check neighbors
        const neighbors = [
          {x: current.x, y: current.y - 1}, // up
          {x: current.x, y: current.y + 1}, // down
          {x: current.x - 1, y: current.y}, // left
          {x: current.x + 1, y: current.y}  // right
        ];
        
        for (let neighbor of neighbors) {
          if (!isValidPos(neighbor.x, neighbor.y)) continue;
          
          const neighborKey = `${neighbor.x},${neighbor.y}`;
          if (closedSet.has(neighborKey)) continue;
          
          const g = current.g + 1;
          const h = heuristic(neighbor.x, neighbor.y, targetGridX, targetGridY);
          
          // Check if already in open set
          const existingNodeIndex = openSet.findIndex(n => n.key === neighborKey);
          if (existingNodeIndex !== -1) {
            if (g < openSet[existingNodeIndex].g) {
              openSet[existingNodeIndex].g = g;
              openSet[existingNodeIndex].f = g + h;
              openSet[existingNodeIndex].parent = current;
            }
          } else {
            openSet.push(new Node(neighbor.x, neighbor.y, g, h, current));
          }
        }
      }
      
      return []; // Return empty if no path found
    }
    
    function drawMaze() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
          const cell = maze[row][col];
          const x = col * window.pacmanCellSize + window.pacmanOffsetX;
          const y = row * window.pacmanCellSize + window.pacmanOffsetY;
          
          if (cell === 1) {
            // Draw wall with better graphics
            ctx.fillStyle = '#1919A6';
            ctx.fillRect(x + 1, y + 1, window.pacmanCellSize - 2, window.pacmanCellSize - 2);
            
            // Add highlights
            ctx.strokeStyle = '#2929FF';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y + 1, window.pacmanCellSize - 2, window.pacmanCellSize - 2);
          } else if (cell === 2) {
            // Draw pellet (scale with cell size)
            ctx.fillStyle = '#FFB897';
            ctx.beginPath();
            const pelletSize = Math.max(2, window.pacmanCellSize * 0.15);
            ctx.arc(x + window.pacmanCellSize/2, y + window.pacmanCellSize/2, pelletSize, 0, Math.PI * 2);
            ctx.fill();
          } else if (cell === 3) {
            // Draw power pellet (larger, scale with cell size)
            ctx.fillStyle = '#FFB897';
            ctx.beginPath();
            const powerPelletSize = Math.max(4, window.pacmanCellSize * 0.3);
            ctx.arc(x + window.pacmanCellSize/2, y + window.pacmanCellSize/2, powerPelletSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    function drawPacman() {
      // Convert grid position to screen coordinates and center in cell
      const gridX = pacman.x * window.pacmanCellSize + window.pacmanOffsetX + window.pacmanCellSize/2;
      const gridY = pacman.y * window.pacmanCellSize + window.pacmanOffsetY + window.pacmanCellSize/2;
      const radius = Math.max(4, window.pacmanCellSize/2 - 3);
      
      ctx.save();
      ctx.translate(gridX, gridY);
      
      // Draw Pac-Man body
      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      
      // Animate mouth with smoother animation
      let mouthAngle = pacman.mouthOpen ? 0.25 : 0.05;
      let startAngle, endAngle;
      
      switch(pacman.direction) {
        case 'right':
          ctx.rotate(0);
          break;
        case 'left':
          ctx.rotate(Math.PI);
          break;
        case 'up':
          ctx.rotate(-Math.PI/2);
          break;
        case 'down':
          ctx.rotate(Math.PI/2);
          break;
      }
      
      startAngle = mouthAngle * Math.PI;
      endAngle = (2 - mouthAngle) * Math.PI;
      
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      
      // Add a subtle gradient for depth
      const gradient = ctx.createRadialGradient(-radius/3, -radius/3, 0, 0, 0, radius);
      gradient.addColorStop(0, '#FFFF66');
      gradient.addColorStop(1, '#FFCC00');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    }
    
    function drawGhosts() {
      ghosts.forEach(ghost => {
        // Convert grid position to screen coordinates and center in cell
        const gridX = ghost.x * window.pacmanCellSize + window.pacmanOffsetX + window.pacmanCellSize/2;
        const gridY = ghost.y * window.pacmanCellSize + window.pacmanOffsetY + window.pacmanCellSize/2;
        const radius = Math.max(4, window.pacmanCellSize/2 - 3);
        
        ctx.save();
        
        // Ghost body
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(gridX, gridY - radius/3, radius, Math.PI, 0, false);
        ctx.lineTo(gridX + radius, gridY + radius/2);
        
        // Wavy bottom with more waves
        const waveCount = 4;
        const waveWidth = (radius * 2) / waveCount;
        for (let i = 0; i < waveCount; i++) {
          const waveX = gridX + radius - (i * waveWidth);
          const waveY = gridY + radius/2 + (i % 2 ? Math.max(1, radius/8) : 0);
          ctx.lineTo(waveX - waveWidth/2, waveY);
        }
        ctx.lineTo(gridX - radius, gridY + radius/2);
        ctx.closePath();
        ctx.fill();
        
        // Eyes (scale with cell size)
        const eyeRadius = Math.max(2, radius/4);
        const eyeY = gridY - radius/3;
        
        // White of eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(gridX - radius/3, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(gridX + radius/3, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils that look in direction of movement
        ctx.fillStyle = '#000066';
        let pupilOffsetX = 0, pupilOffsetY = 0;
        const pupilOffset = Math.max(1, radius/8);
        switch(ghost.direction) {
          case 'left': pupilOffsetX = -pupilOffset; break;
          case 'right': pupilOffsetX = pupilOffset; break;
          case 'up': pupilOffsetY = -pupilOffset; break;
          case 'down': pupilOffsetY = pupilOffset; break;
        }
        
        const pupilRadius = Math.max(1, radius/6);
        ctx.beginPath();
        ctx.arc(gridX - radius/3 + pupilOffsetX, eyeY + pupilOffsetY, pupilRadius, 0, Math.PI * 2);
        ctx.arc(gridX + radius/3 + pupilOffsetX, eyeY + pupilOffsetY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    }
    
    function canMove(x, y, isGhost = false) {
      // Handle horizontal tunnels
      if (x < 0 || x >= 25) {
        if (y === 8) return !isGhost; // Pac-Man can use tunnel, ghosts can't
        return false;
      }
      
      if (y < 0 || y >= 15) return false;
      
      return maze[y] && maze[y][x] !== 1;
    }
    
    function smoothMove(entity) {
      const isGhost = entity.hasOwnProperty('color');
      const speed = entity.speed * (deltaTime / frameTime);
      
      // Current grid position
      const gx = Math.round(entity.x);
      const gy = Math.round(entity.y);
      
      // Check if we are at an intersection (center of a tile)
      const atIntersection = Math.abs(entity.x - gx) < 0.1 && Math.abs(entity.y - gy) < 0.1;
      
      if (atIntersection) {
        // Can we turn to our next desired direction?
        if (entity.nextDirection && entity.nextDirection !== entity.direction) {
          let tx = gx, ty = gy;
          if (entity.nextDirection === 'up') ty--;
          else if (entity.nextDirection === 'down') ty++;
          else if (entity.nextDirection === 'left') tx--;
          else if (entity.nextDirection === 'right') tx++;
          
          if (canMove(tx, ty, isGhost)) {
            entity.direction = entity.nextDirection;
            entity.x = gx; // Snap to center before turning
            entity.y = gy;
          }
        }
        
        // Can we continue in current direction?
        let nx = gx, ny = gy;
        if (entity.direction === 'up') ny--;
        else if (entity.direction === 'down') ny++;
        else if (entity.direction === 'left') nx--;
        else if (entity.direction === 'right') nx++;
        
        if (!canMove(nx, ny, isGhost)) {
          entity.x = gx; // Snap to center and stop
          entity.y = gy;
          return false;
        }
      }
      
      // Perform movement
      if (entity.direction === 'up') entity.y -= speed;
      else if (entity.direction === 'down') entity.y += speed;
      else if (entity.direction === 'left') entity.x -= speed;
      else if (entity.direction === 'right') entity.x += speed;
      
      // Handle tunnel wrapping
      if (!isGhost) {
        if (entity.x < -0.5) entity.x = 24.5;
        if (entity.x > 24.5) entity.x = -0.5;
      }
      
      // Update pixel coordinates for drawing
      const size = getCellSize();
      entity.pixelX = entity.x * size;
      entity.pixelY = entity.y * size;
      
      return true;
    }
    
    function checkCollision() {
      if (respawnTimer > 0 || levelComplete) return;

      const collisionRadius = 0.6; // Slightly smaller than a full tile
      for (let ghost of ghosts) {
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < collisionRadius * collisionRadius) {
          handleCollision();
          break;
        }
      }
    }
    
    function handleCollision() {
      respawnTimer = 2000;
      
      // Reset Pac-Man
      pacman.x = pacmanSpawn.x;
      pacman.y = pacmanSpawn.y;
      pacman.direction = 'left';
      pacman.nextDirection = 'left';
      pacman.targetPath = [];
      
      // Scatter ghosts
      chaseMode = false;
      modeTimer = 5000;
      ghosts.forEach(ghost => {
        ghost.targetPath = [];
        // Optional: snap ghosts to corners immediately to avoid spawn killing
        ghost.x = ghost.scatter.x;
        ghost.y = ghost.scatter.y;
      });
    }
    
    function isPositionSafe(x, y, dangerRadius = 3) {
      for (let ghost of ghosts) {
        const dist = Math.abs(x - ghost.x) + Math.abs(y - ghost.y);
        if (dist < dangerRadius) return false;
      }
      return true;
    }
    
    function findBestPellet() {
      let bestPellet = null;
      let maxScore = -Infinity;
      
      for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 25; x++) {
          if (maze[y] && (maze[y][x] === 2 || maze[y][x] === 3)) {
            const dist = Math.abs(pacman.x - x) + Math.abs(pacman.y - y);
            let score = 1000 - dist;
            if (maze[y][x] === 3) score += 500;
            if (isPositionSafe(x, y)) score += 200;
            
            if (score > maxScore) {
              maxScore = score;
              bestPellet = {x, y};
            }
          }
        }
      }
      return bestPellet;
    }
    
    function findEscapeDirection() {
      const gx = Math.round(pacman.x);
      const gy = Math.round(pacman.y);
      let bestDir = pacman.direction;
      let maxDist = -Infinity;
      
      for (let dir of directions) {
        let tx = gx, ty = gy;
        if (dir === 'up') ty--;
        else if (dir === 'down') ty++;
        else if (dir === 'left') tx--;
        else if (dir === 'right') tx++;
        
        if (canMove(tx, ty)) {
          let minDistToGhost = Infinity;
          for (let ghost of ghosts) {
            const d = Math.abs(tx - ghost.x) + Math.abs(ty - ghost.y);
            if (d < minDistToGhost) minDistToGhost = d;
          }
          
          if (minDistToGhost > maxDist) {
            maxDist = minDistToGhost;
            bestDir = dir;
          }
        }
      }
      return bestDir;
    }
    
    function updatePacman() {
      if (!gameActive || respawnTimer > 0) {
        if (respawnTimer > 0) {
          respawnTimer -= deltaTime;
          if (respawnTimer < 0) respawnTimer = 0;
        }
        return;
      }
      
      const gx = Math.round(pacman.x);
      const gy = Math.round(pacman.y);
      
      // Periodically update targeting
      if (!pacman.targetPath || pacman.targetPath.length === 0 || frameCounter % 30 === 0) {
        // Danger detection
        let closestGhostDist = Infinity;
        for (let ghost of ghosts) {
          const d = Math.abs(pacman.x - ghost.x) + Math.abs(pacman.y - ghost.y);
          if (d < closestGhostDist) closestGhostDist = d;
        }
        
        if (closestGhostDist < 3) {
          pacman.nextDirection = findEscapeDirection();
          pacman.targetPath = [];
        } else {
          const pellet = findBestPellet();
          if (pellet) {
            const path = findPath(gx, gy, pellet.x, pellet.y, 20);
            if (path && path.length > 1) {
              pacman.targetPath = path;
            } else {
              // Simple direct movement
              if (Math.abs(pellet.x - gx) > Math.abs(pellet.y - gy)) {
                pacman.nextDirection = pellet.x > gx ? 'right' : 'left';
              } else {
                pacman.nextDirection = pellet.y > gy ? 'down' : 'up';
              }
            }
          }
        }
      }
      
      // If following a path, set nextDirection
      if (pacman.targetPath && pacman.targetPath.length > 0) {
        const next = pacman.targetPath[0];
        if (Math.abs(pacman.x - next.x) < 0.1 && Math.abs(pacman.y - next.y) < 0.1) {
          pacman.targetPath.shift();
        }
        if (pacman.targetPath.length > 0) {
          const target = pacman.targetPath[0];
          if (target.x > gx) pacman.nextDirection = 'right';
          else if (target.x < gx) pacman.nextDirection = 'left';
          else if (target.y > gy) pacman.nextDirection = 'down';
          else if (target.y < gy) pacman.nextDirection = 'up';
        }
      }
      
      // Move Pac-Man
      if (!smoothMove(pacman)) {
        // If stopped, force a new direction to avoid getting stuck
        const valid = directions.filter(d => {
          let tx = gx, ty = gy;
          if (d === 'up') ty--; else if (d === 'down') ty++; else if (d === 'left') tx--; else if (d === 'right') tx++;
          return canMove(tx, ty);
        });
        if (valid.length > 0) {
          pacman.nextDirection = valid[Math.floor(Math.random() * valid.length)];
        }
      }
      
      // Eating logic
      if (maze[gy] && (maze[gy][gx] === 2 || maze[gy][gx] === 3)) {
        if (maze[gy][gx] === 3) {
          chaseMode = false;
          modeTimer = 5000;
        }
        maze[gy][gx] = 0;
        pelletsRemaining--;
      }
      
      if (pelletsRemaining <= 0 && !levelComplete) {
        levelComplete = true;
        setTimeout(resetMaze, 2000);
      }
      
      // Animate mouth
      pacman.animationCounter += deltaTime;
      if (pacman.animationCounter >= 150) {
        pacman.mouthOpen = !pacman.mouthOpen;
        pacman.animationCounter = 0;
      }
      
      checkCollision();
    }
    
    function updateGhosts() {
      if (startDelay > 0) {
        startDelay -= deltaTime;
        return;
      }
      
      if (modeTimer > 0) modeTimer -= deltaTime;
      else {
        chaseMode = !chaseMode;
        modeTimer = chaseMode ? 7000 : 3000;
        ghosts.forEach(g => g.targetPath = []);
      }
      
      ghosts.forEach((ghost, index) => {
        const gx = Math.round(ghost.x);
        const gy = Math.round(ghost.y);
        
        if (!ghost.targetPath || ghost.targetPath.length === 0 || frameCounter % 60 === 0) {
          let tx, ty;
          if (chaseMode) {
            tx = Math.round(pacman.x);
            ty = Math.round(pacman.y);
            // Add some variation per ghost
            if (index === 1) { // Pinky ambushes
              if (pacman.direction === 'left') tx -= 4;
              else if (pacman.direction === 'right') tx += 4;
              else if (pacman.direction === 'up') ty -= 4;
              else if (pacman.direction === 'down') ty += 4;
            }
          } else {
            tx = ghost.scatter.x;
            ty = ghost.scatter.y;
          }
          
          tx = Math.max(0, Math.min(24, tx));
          ty = Math.max(0, Math.min(14, ty));
          
          const path = findPath(gx, gy, tx, ty, 15);
          if (path && path.length > 1) ghost.targetPath = path;
        }
        
        if (ghost.targetPath && ghost.targetPath.length > 0) {
          const next = ghost.targetPath[0];
          if (Math.abs(ghost.x - next.x) < 0.1 && Math.abs(ghost.y - next.y) < 0.1) {
            ghost.targetPath.shift();
          }
          if (ghost.targetPath.length > 0) {
            const target = ghost.targetPath[0];
            if (target.x > gx) ghost.nextDirection = 'right';
            else if (target.x < gx) ghost.nextDirection = 'left';
            else if (target.y > gy) ghost.nextDirection = 'down';
            else if (target.y < gy) ghost.nextDirection = 'up';
          }
        }
        
        if (!smoothMove(ghost)) {
          const valid = directions.filter(d => {
            let tx = gx, ty = gy;
            if (d === 'up') ty--; else if (d === 'down') ty++; else if (d === 'left') tx--; else if (d === 'right') tx++;
            return canMove(tx, ty, true);
          });
          if (valid.length > 0) {
            ghost.nextDirection = valid[Math.floor(Math.random() * valid.length)];
          }
        }
      });
    }
    
    let frameCounter = 0;
    
    function gameLoop(currentTime) {
      // Calculate delta time for frame-rate independence
      if (!Number.isFinite(currentTime)) {
        currentTime = performance.now();
      }
      if (!Number.isFinite(lastFrameTime) || lastFrameTime === 0) {
        lastFrameTime = currentTime;
      }
      deltaTime = currentTime - lastFrameTime;
      if (!Number.isFinite(deltaTime) || deltaTime <= 0) {
        deltaTime = frameTime;
      }
      lastFrameTime = currentTime;
      
      // Cap delta time to prevent large jumps (if tab was inactive)
      deltaTime = Math.min(deltaTime, frameTime * 3);
      
      // Clear and draw
      drawMaze();
      drawGhosts();
      
      // Flash effect when respawning (frame-rate independent)
      const flashSpeed = 200; // ms per flash
      if (respawnTimer <= 0 || Math.floor(currentTime / flashSpeed) % 2 === 0) {
        drawPacman();
      }
      
      // Update game logic
      updatePacman();
      updateGhosts();
      
      frameCounter++;
      
      requestAnimationFrame(gameLoop);
    }
    
    // Handle Pac-Man click for secret page
    // Remove pointer-events: none from CSS so clicks work
    canvas.style.pointerEvents = 'auto';
    
    // Get the parent link element
    const parentLink = canvas.closest('.pacman-button-wrapper');
    
    // Override the parent link's default behavior
    if (parentLink) {
      parentLink.addEventListener('click', (e) => {
        // Prevent default navigation
        e.preventDefault();
        
        // Get click coordinates relative to canvas
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Get Pac-Man's position on canvas
        const pacmanX = pacman.x * window.pacmanCellSize + window.pacmanOffsetX;
        const pacmanY = pacman.y * window.pacmanCellSize + window.pacmanOffsetY;
        
        // Check if click is on Pac-Man (with some padding for easier clicking)
        const clickRadius = window.pacmanCellSize;
        const distanceFromPacman = Math.sqrt(
          Math.pow(x - (pacmanX + clickRadius/2), 2) + 
          Math.pow(y - (pacmanY + clickRadius/2), 2)
        );
        
        if (distanceFromPacman <= clickRadius * 0.75) {
          // Clicked on Pac-Man - go to secret page
          window.location.href = 'secret.html';
        } else {
          // Clicked elsewhere - go to 90s page
          window.location.href = '90s.html';
        }
      });
    }
    
    // Initialize the game
    resetMaze();
    
    // Start the game
    requestAnimationFrame(gameLoop);
  }
  
