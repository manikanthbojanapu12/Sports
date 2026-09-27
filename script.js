(function initSaPreloader() {
  var el = document.getElementById('sa-preloader');
  if (!el) {
    document.documentElement.classList.remove('preloader-active');
    return;
  }
  if (window.__saPreloaderStarted) return;
  window.__saPreloaderStarted = true;
  var DURATION = 1800;
  document.documentElement.classList.add('preloader-active');
  function hidePreloader() {
    document.documentElement.classList.remove('preloader-active');
    if (!el || el.classList.contains('is-done')) return;
    el.classList.add('is-done');
    window.setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 500);
  }
  window.setTimeout(hidePreloader, DURATION);
})();
document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);
    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorOutline);
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 150, fill: "forwards" });
    });
    const interactables = document.querySelectorAll('a, button, .card, .glass-card, .play-btn-wrapper');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const backToTopBtn = document.querySelector('a[href="#"]'); 
            if (backToTopBtn && backToTopBtn.style.position === 'fixed') {
                backToTopBtn.style.display = navLinks.classList.contains('active') ? 'flex' : 'none';
            }
            navLinks.classList.toggle('active');
        });
    }
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    const animatedElements = document.querySelectorAll('.reveal, .anim-fade-up, .anim-slide-left, .anim-slide-right, .anim-zoom-in');
    animatedElements.forEach(el => observer.observe(el));
    const playBtn = document.querySelector('.play-btn-wrapper');
    const videoModal = document.getElementById('videoModal');
    if(playBtn && videoModal) {
        const closeModal = videoModal.querySelector('.close-modal');
        const modalVideo = videoModal.querySelector('video');
        playBtn.addEventListener('click', () => {
            videoModal.classList.add('active');
            if(modalVideo) {
                modalVideo.play();
            }
        });
        const closeFunc = () => {
            videoModal.classList.remove('active');
            if(modalVideo) {
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
        };
        if(closeModal) closeModal.addEventListener('click', closeFunc);
        videoModal.addEventListener('click', (e) => {
            if(e.target === videoModal) closeFunc();
        });
    }
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        const videos = ['assets/hero1.mp4', 'assets/hero2.mp4', 'assets/hero3.mp4', 'assets/hero4.mp4'];
        let currentVideoIndex = 0;
        heroVideo.addEventListener('ended', () => {
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
            heroVideo.src = videos[currentVideoIndex];
            heroVideo.play().catch(e => console.log('Video play error:', e));
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === '') currentPath = 'index.html'; 
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    if (mobileCloseBtn && navLinks) {
        mobileCloseBtn.addEventListener('click', () => {
            const backToTopBtn = document.querySelector('a[href="#"]');
            if (backToTopBtn && backToTopBtn.style.position === 'fixed') {
                backToTopBtn.style.display = 'flex';
            }
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }
});
window.StacklyAuth = {
  KEY: 'stackly_user',
  getUser: function () {
    try {
      var raw = localStorage.getItem(this.KEY) || sessionStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },
  setUser: function (user) {
    localStorage.setItem(this.KEY, JSON.stringify(user));
    try { sessionStorage.setItem(this.KEY, JSON.stringify(user)); } catch (e) {}
  },
  clearUser: function () {
    localStorage.removeItem(this.KEY);
    sessionStorage.removeItem(this.KEY);
  },
  isLoggedIn: function () {
    var u = this.getUser();
    return !!(u && u.loggedIn);
  },
  requireAuth: function (role) {
    var u = this.getUser();
    if (!u || !u.loggedIn) {
      window.location.href = 'signin.html';
      return null;
    }
    if (role === 'admin' && u.role !== 'admin') {
      window.location.href = 'player-dashboard.html';
      return null;
    }
    if (role === 'player' && u.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
      return null;
    }
    return u;
  },
  dashboardFor: function (role) {
    return role === 'admin' ? 'admin-dashboard.html' : 'player-dashboard.html';
  }
};
window.KickToast = {
  ensureHost: function () {
    var host = document.getElementById('kickToastHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'kickToastHost';
      host.className = 'kick-toast-host';
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    return host;
  },
  show: function (message, type, title) {
    type = type || 'success';
    title = title || (type === 'error' ? 'Hold up' : type === 'info' ? 'Heads up' : 'Nice play');
    var icons = { success: 'fa-trophy', error: 'fa-circle-exclamation', info: 'fa-futbol' };
    var host = this.ensureHost();
    var el = document.createElement('div');
    el.className = 'kick-toast kick-toast--' + type;
    el.innerHTML =
      '<div class="kick-toast__badge"><i class="fas ' + (icons[type] || 'fa-trophy') + '"></i></div>' +
      '<div class="kick-toast__body"><div class="kick-toast__title">' + title + '</div>' +
      '<div class="kick-toast__msg">' + message + '</div></div>' +
      '<div class="kick-toast__bar"><span></span></div>';
    host.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-out');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
    }, 3200);
  }
};
window.StacklyForms = {
  isName: function (v) { return /^[a-zA-Z\s.'-]+$/.test((v || '').trim()) && (v || '').trim().length >= 2; },
  isEmail: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim()); },
  isPassword: function (v) { return (v || '').length >= 8; },
  isPhone: function (v) { return String(v || '').replace(/\D/g, '').length === 10; },
  isTextOnly: function (v) {
    var value = (v || '').trim();
    return value.length > 0 && !/\d/.test(value) && /^[A-Za-z\s.,'()&/-]+$/.test(value);
  },
  sanitizeTextOnly: function (value) {
    return String(value || '').replace(/\d/g, '').replace(/\s{2,}/g, ' ').trim();
  },
  setGroupError: function (group, on) {
    if (!group) return;
    if (on) group.classList.add('has-error');
    else group.classList.remove('has-error');
  },
  sanitizeName: function (value) {
    return String(value || '').replace(/[^a-zA-Z\s.'-]/g, '').replace(/\s{2,}/g, ' ').trim();
  },
  sanitizePhone: function (value) {
    return String(value || '').replace(/\D/g, '').slice(0, 10);
  },
  bindNameInput: function (input) {
    if (!input) return;
    input.setAttribute('pattern', "[A-Za-z\\s.'-]+");
    input.addEventListener('input', function () {
      this.value = window.StacklyForms.sanitizeName(this.value);
    });
  },
  bindPhoneInput: function (input) {
    if (!input) return;
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('pattern', '[0-9]*');
    input.addEventListener('input', function () {
      this.value = window.StacklyForms.sanitizePhone(this.value);
    });
  }
};


window.StacklySelect = {
  closeAll: function (except) {
    document.querySelectorAll('.sa-select.is-open').forEach(function (wrap) {
      if (except && wrap === except) return;
      wrap.classList.remove('is-open');
      var menu = wrap._saMenu;
      if (menu) menu.style.display = 'none';
    });
  },
  positionMenu: function (btn, menu) {
    var rect = btn.getBoundingClientRect();
    var pad = 12;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var width = Math.min(rect.width, vw - pad * 2);
    var left = Math.min(Math.max(pad, rect.left), vw - pad - width);

    menu.style.display = 'block';
    menu.style.width = width + 'px';
    menu.style.maxWidth = (vw - pad * 2) + 'px';
    menu.style.left = left + 'px';
    menu.style.right = 'auto';

    var menuH = Math.min(menu.scrollHeight, Math.min(240, vh * 0.45));
    menu.style.maxHeight = menuH + 'px';

    var spaceBelow = vh - rect.bottom - pad;
    var spaceAbove = rect.top - pad;
    if (spaceBelow < 160 && spaceAbove > spaceBelow) {
      menu.style.top = Math.max(pad, rect.top - menuH - 6) + 'px';
    } else {
      menu.style.top = Math.min(rect.bottom + 6, vh - pad - 80) + 'px';
    }
  },
  enhance: function (select) {
    if (!select || select.dataset.saSelect === '1') return;
    select.dataset.saSelect = '1';

    var wrap = document.createElement('div');
    wrap.className = 'sa-select';
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    select.classList.add('sa-select__native');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sa-select__btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="sa-select__btn-label"></span><i class="fas fa-chevron-down" aria-hidden="true"></i>';
    wrap.appendChild(btn);

    var menu = document.createElement('div');
    menu.className = 'sa-select__menu';
    menu.setAttribute('role', 'listbox');
    document.body.appendChild(menu);
    wrap._saMenu = menu;

    var labelEl = btn.querySelector('.sa-select__btn-label');

    function syncLabel() {
      var opt = select.options[select.selectedIndex];
      labelEl.textContent = opt ? opt.textContent : 'Select';
    }

    function rebuildOptions() {
      menu.innerHTML = '';
      Array.prototype.forEach.call(select.options, function (opt, idx) {
        var item = document.createElement('button');
        item.type = 'button';
        item.className = 'sa-select__option' + (opt.selected ? ' is-selected' : '');
        item.setAttribute('role', 'option');
        item.disabled = !!opt.disabled;
        item.textContent = opt.textContent;
        item.dataset.index = String(idx);
        item.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (opt.disabled) return;
          select.selectedIndex = idx;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          syncLabel();
          window.StacklySelect.closeAll();
          btn.setAttribute('aria-expanded', 'false');
        });
        menu.appendChild(item);
      });
    }

    function openMenu() {
      window.StacklySelect.closeAll(wrap);
      rebuildOptions();
      wrap.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      window.StacklySelect.positionMenu(btn, menu);
    }

    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      if (wrap.classList.contains('is-open')) {
        window.StacklySelect.closeAll();
        btn.setAttribute('aria-expanded', 'false');
      } else {
        openMenu();
      }
    }

    btn.addEventListener('click', toggleMenu);
    select.addEventListener('change', syncLabel);
    syncLabel();
  },
  init: function (root) {
    var scope = root || document;
    var selects = scope.querySelectorAll('select');
    selects.forEach(function (sel) {
      if (sel.closest('.dash-layout') || sel.classList.contains('js-sa-select')) {
        window.StacklySelect.enhance(sel);
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  var nameInputs = document.querySelectorAll('#fullName, #firstName, #lastName, #cf-name, #jf-name, input[name="fullName"], input[name="firstName"], input[name="lastName"], input[name="name"]');
  nameInputs.forEach(function (input) {
    window.StacklyForms.bindNameInput(input);
  });

  var phoneInputs = document.querySelectorAll('#phone, input[type="tel"], input[name="phone"]');
  phoneInputs.forEach(function (input) {
    window.StacklyForms.bindPhoneInput(input);
  });

  window.StacklySelect.init();
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.sa-select') && !e.target.closest('.sa-select__menu')) {
      window.StacklySelect.closeAll();
    }
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.sa-select.is-open').forEach(function (wrap) {
      var btn = wrap.querySelector('.sa-select__btn');
      var menu = wrap._saMenu;
      if (btn && menu) window.StacklySelect.positionMenu(btn, menu);
    });
  });
  window.addEventListener('scroll', function () {
    window.StacklySelect.closeAll();
  }, true);

  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var open = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(function (x) { x.classList.remove('open'); });
      if (!open) item.classList.add('open');
    });
  });
  
  document.querySelectorAll('[data-auth-nav]').forEach(function (wrap) {
    if (wrap.classList.contains('mobile-auth-wrapper')) {
      wrap.innerHTML =
        '<a href="signin.html" class="btn btn-outline">Sign In</a>' +
        '<a href="signup.html" class="btn btn-primary">Get Started</a>';
    } else {
      wrap.innerHTML =
        '<a href="signin.html" class="btn btn-outline" style="padding: 10px 25px; font-size: 1.05rem;">Sign In</a>' +
        '<a href="signup.html" class="btn btn-primary" style="padding: 10px 25px; font-size: 1.05rem;">Get Started <i class="fas fa-arrow-right"></i></a>';
    }
  });
  document.querySelectorAll('[data-logout]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = document.getElementById('logoutModal');
      if (modal) modal.classList.add('show');
      else {
        window.StacklyAuth.clearUser();
        window.KickToast.show('Signed out. See you on the pitch!', 'info', 'Session ended');
        setTimeout(function () { window.location.href = 'signin.html'; }, 900);
      }
    });
  });
  var confirmLogout = document.getElementById('confirmLogout');
  var cancelLogout = document.getElementById('cancelLogout');
  if (confirmLogout) {
    confirmLogout.addEventListener('click', function () {
      window.StacklyAuth.clearUser();
      window.location.href = 'signin.html';
    });
  }
  if (cancelLogout) {
    cancelLogout.addEventListener('click', function () {
      var modal = document.getElementById('logoutModal');
      if (modal) modal.classList.remove('show');
    });
  }
});

window.initPasswordToggles = function () {
  document.querySelectorAll('input[type="password"]').forEach(function (passInput) {
    if (passInput.dataset.hasToggle) return;
    passInput.dataset.hasToggle = 'true';
    var wrapper = document.createElement('div');
    wrapper.className = 'password-input-wrapper';
    passInput.parentNode.insertBefore(wrapper, passInput);
    wrapper.appendChild(passInput);
    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      toggleBtn.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash" style="color:var(--accent);"></i>' : '<i class="fa-solid fa-eye"></i>';
    });
    wrapper.appendChild(toggleBtn);
  });
};

window.initMobileSidebar = function () {
  var dashSidebar = document.getElementById('dashSidebar');
  var menuToggle = document.getElementById('dashMenuToggle');
  var closeBtn = document.getElementById('closeSidebarBtn');
  var dashOverlay = document.getElementById('dashOverlay');
  if (!dashSidebar || !menuToggle) return;

  var lastToggleAt = 0;
  var mq = window.matchMedia('(max-width: 900px)');
  var layoutRoot = document.querySelector('.dash-layout');
  var sidebarHome = layoutRoot || dashSidebar.parentElement;
  var overlayHome = layoutRoot || (dashOverlay && dashOverlay.parentElement);

  if (!window.__dashSidebarHomeMarker) {
    window.__dashSidebarHomeMarker = document.createComment('dash-sidebar-home');
    if (dashSidebar.parentElement) {
      dashSidebar.parentElement.insertBefore(window.__dashSidebarHomeMarker, dashSidebar);
    }
  }
  if (dashOverlay && !window.__dashOverlayHomeMarker) {
    window.__dashOverlayHomeMarker = document.createComment('dash-overlay-home');
    if (dashOverlay.parentElement) {
      dashOverlay.parentElement.insertBefore(window.__dashOverlayHomeMarker, dashOverlay);
    }
  }

  function isMobileDash() {
    return mq.matches;
  }

  function clearForcedStyles(el) {
    if (!el) return;
    [
      'left', 'top', 'right', 'bottom', 'height', 'width', 'max-width',
      'transform', 'visibility', 'opacity', 'pointer-events', 'z-index',
      'display', 'transition', 'box-shadow', 'padding-top'
    ].forEach(function (prop) {
      el.style.removeProperty(prop);
    });
  }

  function moveToBody() {
    if (dashSidebar.parentElement !== document.body) {
      document.body.appendChild(dashSidebar);
    }
    if (dashOverlay && dashOverlay.parentElement !== document.body) {
      document.body.appendChild(dashOverlay);
    }
  }

  function restoreHome() {
    var sm = window.__dashSidebarHomeMarker;
    var om = window.__dashOverlayHomeMarker;
    if (sm && sm.parentNode) {
      sm.parentNode.insertBefore(dashSidebar, sm.nextSibling);
    } else if (sidebarHome && dashSidebar.parentElement !== sidebarHome) {
      sidebarHome.insertBefore(dashSidebar, sidebarHome.firstChild);
    }
    if (dashOverlay) {
      if (om && om.parentNode) {
        om.parentNode.insertBefore(dashOverlay, om.nextSibling);
      } else if (overlayHome && dashOverlay.parentElement !== overlayHome) {
        overlayHome.appendChild(dashOverlay);
      }
    }
  }

  function resetDesktopSidebar() {
    dashSidebar.classList.remove('open');
    if (dashOverlay) dashOverlay.classList.remove('show');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('dash-sidebar-open');
    document.documentElement.classList.remove('dash-sidebar-open');
    clearForcedStyles(dashSidebar);
    clearForcedStyles(dashOverlay);
    restoreHome();
  }

  function applyMobileClosedStyles() {
    moveToBody();
    dashSidebar.classList.remove('open');
    if (dashOverlay) dashOverlay.classList.remove('show');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('dash-sidebar-open');
    document.documentElement.classList.remove('dash-sidebar-open');
    dashSidebar.style.setProperty('left', '-105%', 'important');
    dashSidebar.style.setProperty('top', '60px', 'important');
    dashSidebar.style.setProperty('height', 'calc(100dvh - 60px)', 'important');
    dashSidebar.style.setProperty('transform', 'none', 'important');
    if (dashOverlay) {
      dashOverlay.style.removeProperty('display');
      dashOverlay.style.removeProperty('top');
    }
  }

  function openSidebar() {
    if (!isMobileDash()) return;
    moveToBody();
    dashSidebar.classList.add('open');
    if (dashOverlay) dashOverlay.classList.add('show');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('dash-sidebar-open');
    document.documentElement.classList.add('dash-sidebar-open');
    dashSidebar.style.setProperty('left', '0', 'important');
    dashSidebar.style.setProperty('top', '60px', 'important');
    dashSidebar.style.setProperty('height', 'calc(100dvh - 60px)', 'important');
    dashSidebar.style.setProperty('transform', 'none', 'important');
    dashSidebar.style.setProperty('visibility', 'visible', 'important');
    dashSidebar.style.setProperty('opacity', '1', 'important');
    dashSidebar.style.setProperty('pointer-events', 'auto', 'important');
    dashSidebar.style.setProperty('z-index', '1050', 'important');
    if (dashOverlay) {
      dashOverlay.style.setProperty('display', 'block', 'important');
      dashOverlay.style.setProperty('top', '60px', 'important');
    }
  }

  function closeSidebar() {
    if (isMobileDash()) applyMobileClosedStyles();
    else resetDesktopSidebar();
  }

  function toggleSidebar(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isMobileDash()) return;
    var now = Date.now();
    if (now - lastToggleAt < 350) return;
    lastToggleAt = now;
    if (dashSidebar.classList.contains('open')) closeSidebar();
    else openSidebar();
  }

  var lastMobileMode = null;

  function syncSidebarMode(force) {
    var mobile = isMobileDash();
    if (!force && mobile === lastMobileMode) {
      if (!mobile) resetDesktopSidebar();
      return;
    }
    lastMobileMode = mobile;
    if (mobile) applyMobileClosedStyles();
    else resetDesktopSidebar();
  }

  menuToggle.onclick = toggleSidebar;
  menuToggle.type = 'button';
  if (closeBtn) {
    closeBtn.onclick = function (e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      closeSidebar();
    };
    closeBtn.type = 'button';
  }
  if (dashOverlay) {
    dashOverlay.onclick = function (e) {
      if (e) e.preventDefault();
      closeSidebar();
    };
  }
  if (dashSidebar.dataset.navCloseBound !== '1') {
    dashSidebar.dataset.navCloseBound = '1';
    dashSidebar.addEventListener('click', function (e) {
      if (e.target.closest('.dash-nav-btn[data-target]') && isMobileDash()) closeSidebar();
    });
  }

  if (!window.__dashSidebarResizeBound) {
    window.__dashSidebarResizeBound = true;
    var onModeChange = function () { syncSidebarMode(); };
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onModeChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onModeChange);
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncSidebarMode, 80);
    });
  }

  syncSidebarMode(true);

  window.openDashSidebar = openSidebar;
  window.closeDashSidebar = closeSidebar;
  window.toggleDashSidebar = toggleSidebar;
  window.resetDashSidebarDesktop = resetDesktopSidebar;
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    window.initPasswordToggles();
    window.initMobileSidebar();
  });
} else {
  window.initPasswordToggles();
  window.initMobileSidebar();
}

/* ==========================================================================
   SPORTS PERFORMANCE INTERACTIVE ENGINES
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
  // 1. Turf & Arena Schedule Filter
  const scheduleBtns = document.querySelectorAll('.schedule-filter-btn');
  const scheduleCards = document.querySelectorAll('.schedule-card');
  if (scheduleBtns.length > 0 && scheduleCards.length > 0) {
    scheduleBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        scheduleBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        scheduleCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-sport') === filter) {
            card.style.display = 'block';
            card.style.animation = 'floatSmooth 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 2. Athlete Target & Readiness Calculator
  const calcHoursInput = document.getElementById('calc-hours');
  const calcIntensityInput = document.getElementById('calc-intensity');
  const calcLevelInput = document.getElementById('calc-level');
  const calcReadinessScore = document.getElementById('calc-readiness-score');
  const calcVolumeOutput = document.getElementById('calc-volume-output');
  const calcRecoveryOutput = document.getElementById('calc-recovery-output');

  function updateAthleteReadiness() {
    if (!calcHoursInput || !calcReadinessScore) return;
    const hours = parseFloat(calcHoursInput.value) || 6;
    const intensity = parseFloat(calcIntensityInput ? calcIntensityInput.value : 7) || 7;
    const level = calcLevelInput ? calcLevelInput.value : 'varsity';

    let levelMultiplier = level === 'elite' ? 1.25 : (level === 'pro' ? 1.45 : 1.0);
    let rawScore = Math.min(99, Math.round((hours * intensity * 1.5 * levelMultiplier) % 100));
    if (rawScore < 45) rawScore = 65;

    let volumeEstimate = Math.round(hours * 380 * levelMultiplier) + " kcal / session";
    let recoveryHours = Math.round(24 + (intensity * 2.5)) + " hrs optimal rest";

    calcReadinessScore.textContent = rawScore + "/100";
    if (calcVolumeOutput) calcVolumeOutput.textContent = volumeEstimate;
    if (calcRecoveryOutput) calcRecoveryOutput.textContent = recoveryHours;
  }

  if (calcHoursInput) {
    calcHoursInput.addEventListener('input', updateAthleteReadiness);
    if (calcIntensityInput) calcIntensityInput.addEventListener('input', updateAthleteReadiness);
    if (calcLevelInput) calcLevelInput.addEventListener('change', updateAthleteReadiness);
    updateAthleteReadiness();
  }

  // 3. 360 Campus Zone Explorer
  const campusBtns = document.querySelectorAll('.campus-zone-btn');
  const campusPanels = document.querySelectorAll('.campus-zone-panel');
  if (campusBtns.length > 0 && campusPanels.length > 0) {
    campusBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        campusBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const target = this.getAttribute('data-zone');
        campusPanels.forEach(panel => {
          if (panel.id === target) {
            panel.style.display = 'grid';
          } else {
            panel.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Combine Benchmark Standards Evaluator
  const benchDash = document.getElementById('bench-dash');
  const benchJump = document.getElementById('bench-jump');
  const benchRatingOutput = document.getElementById('bench-rating-output');
  const benchTierOutput = document.getElementById('bench-tier-output');

  function updateCombineBenchmarks() {
    if (!benchDash || !benchRatingOutput) return;
    const dash = parseFloat(benchDash.value) || 4.7;
    const jump = parseFloat(benchJump ? benchJump.value : 30) || 30;

    let score = Math.max(50, Math.min(99, Math.round(100 - ((dash - 4.2) * 50) + (jump - 20) * 1.5)));
    let tier = "Regional Competitor";
    if (score >= 90) tier = "Division 1 / Pro Combine Caliber";
    else if (score >= 78) tier = "Elite Varsity Prospect";
    else if (score >= 65) tier = "Development Academy Athlete";

    benchRatingOutput.textContent = score + " PT INDEX";
    if (benchTierOutput) benchTierOutput.textContent = tier;
  }

  if (benchDash) {
    benchDash.addEventListener('input', updateCombineBenchmarks);
    if (benchJump) benchJump.addEventListener('input', updateCombineBenchmarks);
    updateCombineBenchmarks();
  }

  // 5. Enterprise & Team Package Calculator
  const teamSlider = document.getElementById('team-athletes-slider');
  const teamAthleteCount = document.getElementById('team-athletes-count');
  const teamPriceEst = document.getElementById('team-price-est');
  const teamPerksList = document.getElementById('team-perks-list');

  if (teamSlider && teamAthleteCount && teamPriceEst) {
    teamSlider.addEventListener('input', function() {
      const count = parseInt(this.value, 10);
      teamAthleteCount.textContent = count + " Athletes";
      let baseRate = 85;
      if (count >= 30) baseRate = 65;
      else if (count >= 15) baseRate = 75;
      const total = count * baseRate;
      teamPriceEst.textContent = "$" + total.toLocaleString() + " / mo";
      if (teamPerksList) {
        if (count >= 30) {
          teamPerksList.innerHTML = '<span class="sports-badge sports-badge-volt"><i class="fas fa-check"></i> Dedicated Strength Coach</span> <span class="sports-badge sports-badge-cyan"><i class="fas fa-check"></i> Biometric Video Lab Access</span> <span class="sports-badge sports-badge-volt"><i class="fas fa-check"></i> Private Turf Slots</span>';
        } else if (count >= 15) {
          teamPerksList.innerHTML = '<span class="sports-badge sports-badge-volt"><i class="fas fa-check"></i> Assistant Coach Assigned</span> <span class="sports-badge sports-badge-cyan"><i class="fas fa-check"></i> 10 Combine Video Tests</span>';
        } else {
          teamPerksList.innerHTML = '<span class="sports-badge sports-badge-volt"><i class="fas fa-check"></i> Group Court Time</span> <span class="sports-badge sports-badge-cyan"><i class="fas fa-check"></i> Standard Telemetry App</span>';
        }
      }
    });
  }

  // 6. 404 Penalty Shootout Mini-Game
  const goalButtons = document.querySelectorAll('.goal-target-btn');
  const gameScoreEl = document.getElementById('penalty-score');
  const gameStatusEl = document.getElementById('penalty-status');
  let gameScore = 0;

  if (goalButtons.length > 0 && gameScoreEl) {
    goalButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const goalieChoice = Math.floor(Math.random() * 3);
        const playerChoice = parseInt(this.getAttribute('data-target-idx') || '0', 10);
        if (goalieChoice !== playerChoice) {
          gameScore++;
          gameScoreEl.textContent = gameScore;
          if (gameStatusEl) {
            gameStatusEl.innerHTML = '<span style="color: var(--accent);"><i class="fas fa-futbol"></i> GOAL! Top bins! Great strike.</span>';
          }
          this.style.background = 'var(--accent)';
          setTimeout(() => { this.style.background = ''; }, 600);
        } else {
          if (gameStatusEl) {
            gameStatusEl.innerHTML = '<span style="color: var(--accent-crimson);"><i class="fas fa-hand-paper"></i> SAVED by the keeper! Try another corner!</span>';
          }
          this.style.background = 'var(--accent-crimson)';
          setTimeout(() => { this.style.background = ''; }, 600);
        }
      });
    });
  }

  // 7. Dynamic Telemetry Metric Counter Rollup
  const metricValues = document.querySelectorAll('.rollup-metric');
  if (metricValues.length > 0) {
    const metricObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseInt(el.getAttribute('data-target') || '100', 10);
          let currentNum = 0;
          const step = Math.ceil(targetNum / 40);
          const interval = setInterval(() => {
            currentNum += step;
            if (currentNum >= targetNum) {
              el.textContent = targetNum + (el.getAttribute('data-suffix') || '');
              clearInterval(interval);
            } else {
              el.textContent = currentNum + (el.getAttribute('data-suffix') || '');
            }
          }, 25);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });
    metricValues.forEach(el => metricObserver.observe(el));
  }
});
