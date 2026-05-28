document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  /* ==========================================================================
     THEME TOGGLE
     ========================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve existing theme or match user OS preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Animate rotation briefly
    themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 300);

    showToast(`Switched to ${newTheme} mode`, 'success');
    return newTheme;
  }

  themeToggle.addEventListener('click', () => {
    toggleTheme();
  });



  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu on link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* ==========================================================================
     SCROLL INDICATORS & INTERSECTION OBSERVER FOR ACTIVE NAV
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  
  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
  
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Reveal only once
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(element => revealObserver.observe(element));

  /* ==========================================================================
     SKILLS PROGRESS BAR INTERSECTION OBSERVER
     ========================================================================== */
  const skillCardsForAnim = document.querySelectorAll('.skill-card');
  
  const skillObserverOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target.querySelector('.progress-bar');
        if (progressBar) {
          progressBar.classList.add('animated');
        }
        skillObserver.unobserve(entry.target);
      }
    });
  }, skillObserverOptions);

  skillCardsForAnim.forEach(card => skillObserver.observe(card));

  /* ==========================================================================
     3D TILT EFFECT ON CARDS
     ========================================================================== */
  const tiltCards = document.querySelectorAll('.hover-3d');

  if (window.innerWidth > 768) {
    tiltCards.forEach(card => {
      // Disable CSS transitions during active mouse tracking to prevent stutter/lag conflicts
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // Mouse position X relative to card
        const y = e.clientY - rect.top;  // Mouse position Y relative to card
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Max tilt angle is 10 degrees
        const rotateX = ((centerY - y) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = ''; // Restore default CSS transition so it snaps back smoothly
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     PROJECTS FILTERING SYSTEM
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button style
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const categories = category.split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     SKILLS FILTERING / TABS
     ========================================================================== */
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-tab');

      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        
        if (category === 'all' || cardCat === category) {
          card.style.display = '';
          // Trigger progress bar recalculation
          const progressBar = card.querySelector('.progress-bar');
          if (progressBar) {
            progressBar.classList.add('animated');
            progressBar.style.animation = 'none';
            progressBar.offsetHeight; // Trigger reflow
            progressBar.style.animation = null;
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     MODALS DIALOG SYSTEM (PROJECT DETAILS)
     ========================================================================== */
  const openModalButtons = document.querySelectorAll('.open-modal');
  const closeModalButtons = document.querySelectorAll('.modal-close');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      }
    });
  });

  const closeModal = (modal) => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Enable background scrolling
  };

  closeModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-overlay');
      closeModal(parentModal);
    });
  });

  // Close modal when clicking outside content
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal);
      }
      const adminPanel = document.getElementById('adminPanel');
      if (adminPanel.classList.contains('active')) {
        adminPanel.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  /* ==========================================================================
     RESUME DUAL CV TAB SWITCHER
     ========================================================================== */
  const resumeTabs = document.querySelectorAll('.resume-tab');
  const resumeIframe = document.getElementById('resumeIframe');

  const cvFiles = {
    sde: 'SDE_CV_PSreeSaiPavan.pdf',
    core: 'Core_CV_PSreeSaiPavan.pdf'
  };

  resumeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      resumeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cvType = tab.getAttribute('data-cv');
      if (resumeIframe && cvFiles[cvType]) {
        resumeIframe.src = cvFiles[cvType];
      }
    });
  });

  /* ==========================================================================
     CONTACT FORM HANDLER (EXPRESS INTEGRATION)
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Reset input borders
    [nameInput, emailInput, messageInput].forEach(inp => {
      inp.style.borderBottomColor = '';
    });

    // Client-side Validation
    let hasError = false;
    if (!name) {
      nameInput.style.borderBottomColor = 'red';
      hasError = true;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.style.borderBottomColor = 'red';
      hasError = true;
    }
    if (!message) {
      messageInput.style.borderBottomColor = 'red';
      hasError = true;
    }

    if (hasError) {
      showToast('Please correct validation errors', 'error');
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> Sending...`;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('Message sent! I\'ll respond shortly.', 'success');
        contactForm.reset();
        
        // Trigger inputs blur to reset floating label classes
        [nameInput, emailInput, messageInput].forEach(inp => {
          inp.dispatchEvent(new Event('blur'));
        });
      } else {
        showToast(result.error || 'Server error occurred.', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('Network error. Is the server running?', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Send Message <i data-lucide="send" class="btn-icon"></i>`;
      lucide.createIcons(); // Refresh Lucide icons inside submit button
    }
  });

  /* ==========================================================================
     ADMIN DASHBOARD PANEL (DB INTEGRATION)
     ========================================================================== */
  const adminBtn = document.getElementById('adminBtn');
  const adminPanel = document.getElementById('adminPanel');
  const adminCloseBtn = document.getElementById('adminCloseBtn');
  const refreshAdminBtn = document.getElementById('refreshAdminBtn');
  const adminTableBody = document.getElementById('adminTableBody');

  adminBtn.addEventListener('click', () => {
    adminPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
    fetchAdminMessages();
  });

  adminCloseBtn.addEventListener('click', () => {
    adminPanel.classList.remove('active');
    document.body.style.overflow = '';
  });

  refreshAdminBtn.addEventListener('click', fetchAdminMessages);

  // Close admin when clicking on overlay background
  adminPanel.addEventListener('click', (e) => {
    if (e.target === adminPanel) {
      adminPanel.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  async function fetchAdminMessages() {
    adminTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="loading-td">
          <span class="spinner"></span> Loading messages from Express...
        </td>
      </tr>
    `;

    try {
      const response = await fetch('/api/messages');
      const result = await response.json();

      if (response.ok && result.success) {
        const messages = result.data;
        
        if (messages.length === 0) {
          adminTableBody.innerHTML = `
            <tr>
              <td colspan="5" style="text-align: center; padding: 2rem;">No messages in database.</td>
            </tr>
          `;
          return;
        }

        adminTableBody.innerHTML = '';
        messages.forEach(msg => {
          const formattedDate = new Date(msg.timestamp).toLocaleString();
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${formattedDate}</strong></td>
            <td>${escapeHTML(msg.name)}</td>
            <td><a href="mailto:${msg.email}" style="color: var(--accent-primary); text-decoration: underline;">${escapeHTML(msg.email)}</a></td>
            <td style="max-width: 300px; overflow-wrap: break-word;">${escapeHTML(msg.message)}</td>
            <td>
              <button class="btn-danger-sm delete-msg-btn" data-id="${msg.id}">Delete</button>
            </td>
          `;
          adminTableBody.appendChild(tr);
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll('.delete-msg-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const msgId = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this message?')) {
              await deleteAdminMessage(msgId, btn.closest('tr'));
            }
          });
        });
      } else {
        adminTableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 2rem; color: #ef4444;">Failed to load: ${result.error}</td>
          </tr>
        `;
      }
    } catch (error) {
      console.error('Error fetching admin messages:', error);
      adminTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2rem; color: #ef4444;">Network error connecting to backend server.</td>
        </tr>
      `;
    }
  }

  async function deleteAdminMessage(id, rowElement) {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (response.ok && result.success) {
        showToast('Message deleted', 'success');
        rowElement.style.opacity = '0';
        setTimeout(() => {
          rowElement.remove();
          // If table is empty now, show empty message
          if (adminTableBody.querySelectorAll('tr').length === 0) {
            adminTableBody.innerHTML = `
              <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">No messages in database.</td>
              </tr>
            `;
          }
        }, 300);
      } else {
        showToast(result.error || 'Failed to delete message.', 'error');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      showToast('Network error deleting message.', 'error');
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  /* ==========================================================================
     TOAST ALERTS SYSTEM
     ========================================================================== */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    
    toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    // Re-render Lucide inside the toast
    lucide.createIcons();

    // Auto-remove toast after 4s
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 4000);
  }

  /* ==========================================================================
     SCROLL TO TOP BUTTON & HEADER SCROLL
     ========================================================================== */
  const scrollToTopBtn = document.getElementById('scrollToTop');
  const glassHeader = document.querySelector('.glass-header');

  window.addEventListener('scroll', () => {
    // Header scrolled class
    if (window.scrollY > 20) {
      glassHeader.classList.add('scrolled');
    } else {
      glassHeader.classList.remove('scrolled');
    }

    // Scroll to top button visibility
    if (scrollToTopBtn) {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     DEVELOPER ARCHETYPE INTERACTIVE RADAR CHART
     ========================================================================== */
  const archetypes = [
    { name: 'Systems & Compilers', value: 95 },
    { name: 'DSA & Optimization', value: 90 },
    { name: 'AI Arch & Memory', value: 85 },
    { name: 'Full-Stack Dev', value: 80 },
    { name: 'Competitive Prog', value: 88 }
  ];

  const radarChart = document.getElementById('radarChart');
  const radarAxes = document.getElementById('radarAxes');
  const radarPoints = document.getElementById('radarPoints');
  const radarLabels = document.getElementById('radarLabels');
  const radarPolygon = document.getElementById('radarPolygon');
  const radarTooltip = document.getElementById('radarTooltip');
  const legendItems = document.querySelectorAll('.legend-item');
  const aboutDashboard = document.getElementById('aboutDashboard');

  const centerX = 200;
  const centerY = 200;
  const maxRadius = 100;
  const labelRadius = 145;
  const numAxes = archetypes.length;

  function initRadarChart() {
    if (!radarAxes || !radarPoints || !radarLabels) return;
    
    radarAxes.innerHTML = '';
    radarPoints.innerHTML = '';
    radarLabels.innerHTML = '';

    archetypes.forEach((arch, i) => {
      const angle = -Math.PI / 2 + i * (2 * Math.PI) / numAxes;
      
      // Calculate axis outer coordinate
      const xOuter = centerX + maxRadius * Math.cos(angle);
      const yOuter = centerY + maxRadius * Math.sin(angle);

      // Create axis line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centerX);
      line.setAttribute('y1', centerY);
      line.setAttribute('x2', xOuter);
      line.setAttribute('y2', yOuter);
      line.setAttribute('class', 'radar-axis');
      line.setAttribute('data-index', i);
      radarAxes.appendChild(line);

      // Create label position — push labels further out to avoid overlap
      const xLabel = centerX + labelRadius * Math.cos(angle);
      const yLabel = centerY + labelRadius * Math.sin(angle);

      // Create label element
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', xLabel);
      text.setAttribute('y', yLabel);
      text.setAttribute('class', 'radar-label');
      text.setAttribute('data-index', i);
      
      // Text anchor and vertical alignment
      let anchor = 'middle';
      if (Math.cos(angle) > 0.15) {
        anchor = 'start';
      } else if (Math.cos(angle) < -0.15) {
        anchor = 'end';
      }
      text.setAttribute('text-anchor', anchor);
      
      // Per-axis dy offsets to prevent collisions
      let dy = '0';
      if (i === 0) dy = '-10';        // Systems & Compilers (top center) — push up more
      else if (i === 1) dy = '-2';     // DSA & Optimization (top-right) — pull up to clear polygon
      else if (i === 2) dy = '16';     // AI Arch (bottom-right) — push down
      else if (i === 3) dy = '16';     // Full-Stack (bottom-left) — push down
      else if (i === 4) dy = '-2';     // Competitive Prog (top-left) — pull up
      text.setAttribute('dy', dy);
      text.textContent = arch.name;
      radarLabels.appendChild(text);
    });
  }

  function getCoordinates(index, valuePercent) {
    const angle = -Math.PI / 2 + index * (2 * Math.PI) / numAxes;
    const r = maxRadius * (valuePercent / 100);
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  }

  let animationFrameId = null;
  let chartAnimated = false;

  function animateRadarChart() {
    if (chartAnimated || !radarPolygon) return;
    chartAnimated = true;

    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3);

      const pointsArr = [];
      if (radarPoints) radarPoints.innerHTML = '';

      archetypes.forEach((arch, i) => {
        const currentVal = arch.value * ease;
        const coords = getCoordinates(i, currentVal);
        pointsArr.push(`${coords.x},${coords.y}`);

        if (radarPoints) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', coords.x);
          circle.setAttribute('cy', coords.y);
          circle.setAttribute('r', 5 * ease);
          circle.setAttribute('class', 'radar-point');
          circle.setAttribute('data-index', i);
          radarPoints.appendChild(circle);
        }
      });

      radarPolygon.setAttribute('points', pointsArr.join(' '));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        bindInteractions();
      }
    }

    animationFrameId = requestAnimationFrame(step);
  }

  let activeHighlightIndex = null;
  let archetypeLoopInterval = null;

  function highlightAxis(index) {
    activeHighlightIndex = index;
    const arch = archetypes[index];
    const coords = getCoordinates(index, arch.value);

    if (radarAxes) {
      const axisLines = radarAxes.querySelectorAll('.radar-axis');
      axisLines.forEach((line, idx) => {
        if (idx === index) line.classList.add('highlighted');
        else line.classList.remove('highlighted');
      });
    }

    if (radarPoints) {
      const points = radarPoints.querySelectorAll('.radar-point');
      points.forEach((pt, idx) => {
        if (idx === index) pt.classList.add('active');
        else pt.classList.remove('active');
      });
    }

    if (radarLabels) {
      const labels = radarLabels.querySelectorAll('.radar-label');
      labels.forEach((lbl, idx) => {
        if (idx === index) lbl.classList.add('active');
        else lbl.classList.remove('active');
      });
    }

    legendItems.forEach((item, idx) => {
      if (idx === index) item.classList.add('active');
      else item.classList.remove('active');
    });

    if (radarTooltip) {
      radarTooltip.innerHTML = `<strong>${arch.name}</strong><br>${arch.value}%`;
      radarTooltip.style.left = `${(coords.x / 400) * 100}%`;
      radarTooltip.style.top = `${(coords.y / 400) * 100}%`;
      radarTooltip.classList.add('visible');
    }
  }

  function clearHighlight() {
    activeHighlightIndex = null;
    
    if (radarAxes) {
      radarAxes.querySelectorAll('.radar-axis').forEach(l => l.classList.remove('highlighted'));
    }
    if (radarPoints) {
      radarPoints.querySelectorAll('.radar-point').forEach(p => p.classList.remove('active'));
    }
    if (radarLabels) {
      radarLabels.querySelectorAll('.radar-label').forEach(l => l.classList.remove('active'));
    }
    legendItems.forEach(item => item.classList.remove('active'));

    if (radarTooltip) {
      radarTooltip.classList.remove('visible');
    }
  }

  function bindInteractions() {
    if (radarPoints) {
      const points = radarPoints.querySelectorAll('.radar-point');
      points.forEach(pt => {
        pt.addEventListener('mouseenter', () => {
          if (archetypeLoopInterval) {
            clearInterval(archetypeLoopInterval);
            archetypeLoopInterval = null;
          }
          const index = parseInt(pt.getAttribute('data-index'));
          highlightAxis(index);
        });
        pt.addEventListener('mouseleave', clearHighlight);
      });
    }

    if (radarLabels) {
      const labels = radarLabels.querySelectorAll('.radar-label');
      labels.forEach(lbl => {
        lbl.addEventListener('mouseenter', () => {
          if (archetypeLoopInterval) {
            clearInterval(archetypeLoopInterval);
            archetypeLoopInterval = null;
          }
          const index = parseInt(lbl.getAttribute('data-index'));
          highlightAxis(index);
        });
        lbl.addEventListener('mouseleave', clearHighlight);
      });
    }
  }

  legendItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (archetypeLoopInterval) {
        clearInterval(archetypeLoopInterval);
        archetypeLoopInterval = null;
      }
      const index = parseInt(item.getAttribute('data-index'));
      highlightAxis(index);
    });
    item.addEventListener('mouseleave', clearHighlight);
  });

  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initRadarChart();
        animateRadarChart();
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  if (aboutDashboard) {
    chartObserver.observe(aboutDashboard);
  }

  /* ==========================================================================
     INTERACTIVE DEVELOPER TERMINAL (ssp_09)
     ========================================================================== */
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalResetBtn = document.getElementById('terminalResetBtn');
  const terminalScreen = document.getElementById('terminalScreen');
  const terminalMatrixCanvas = document.getElementById('terminalMatrixCanvas');

  let commandHistory = [];
  let historyIndex = -1;
  let isCvmRunning = false;
  let matrixInterval = null;
  let isMatrixActive = false;
  let contactFormState = null;
  let contactData = { name: '', email: '', message: '' };

  const DEFAULT_PLACEHOLDER = 'Try typing "help", "about", "archetype", or "projects"...';
  if (terminalInput) {
    terminalInput.placeholder = DEFAULT_PLACEHOLDER;
  }

  // Terminal commands definition
  const COMMANDS = {
    help: 'List all available console commands.',
    about: 'Prints brief background information about Sree Sai Pavan.',
    skills: 'Renders an interactive ASCII bar chart of technical skills.',
    archetype: 'Prints the developer archetype data and triggers the animated radar chart.',
    theme: 'Toggles the website theme between light and dark mode.',
    projects: 'Lists featured projects. Use "projects open <id>" to view details.',
    cvm: 'Simulates compiling and running a program on the CVM++ stack-based VM.',
    matrix: 'Toggles the glowing digital code rain background effect.',
    contact: 'Initiates a CLI-driven interactive message submission.',
    clear: 'Clears the console screen.'
  };

  // Welcome message
  function printWelcomeMessage() {
    terminalOutput.innerHTML = '';
    printLine('ssp_09 OS [Version 1.0.2]', 'system-out');
    printLine('(c) 2026 Pittala Sree Sai Pavan. IIT Guwahati. All rights reserved.', 'system-out');
    printLine('Type "help" to list available commands.', 'info-out');
    printLine('');
  }

  function printLine(text, className = 'system-out') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = text;
    terminalOutput.appendChild(line);
    scrollToBottom();
  }

  function scrollToBottom() {
    const body = terminalOutput.closest('.terminal-body');
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  // Handle CLI inputs
  function handleCommand(rawInput) {
    const input = rawInput.trim();
    
    // If in contact flow, process empty entries or normal text
    if (contactFormState) {
      // Echo input before processing
      printLine(`<span class="prompt">&gt;</span> <span class="text" style="color: var(--text-primary)">${escapeHTML(input || ' ')}</span>`, 'command-echo');
      handleContactFlow(input);
      return;
    }

    if (!input) return;

    // Log in history
    commandHistory.push(input);
    historyIndex = commandHistory.length;

    // Echo command
    printLine(`<span class="prompt"><span class="term-user">ssp_09</span><span class="term-host">@iitg-ece</span>:~$</span> <span class="text">${escapeHTML(input)}</span>`, 'command-echo');

    const args = input.split(/\s+/);
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        printLine('Available commands:', 'info-out');
        Object.keys(COMMANDS).forEach(key => {
          const paddedKey = key.padEnd(12, ' ');
          printLine(`  <strong style="color: var(--accent-primary)">${paddedKey}</strong> - ${COMMANDS[key]}`);
        });
        break;

      case 'about':
        printLine('Pittala Sree Sai Pavan', 'info-out');
        printLine('Electronics & Communication Engineering undergraduate at IIT Guwahati. CGPA: 7.13');
        printLine('Specializes in Systems Programming, analog/digital circuit design, low-level optimization in C++, and Web Architecture.');
        printLine('Notable Projects: CVM++ (Stack Virtual Machine), Miller-Compensated OTA, FPGA Traffic Controller, Parker (AI Agent with 4-Layer Memory), MWIS Solver (Branch-and-Bound C++ graph solver).');
        break;

      case 'skills':
        printLine('Skill Matrix Profile:', 'info-out');
        printLine('Languages:', 'info-out');
        printSkillBar('C/C++', 95);
        printSkillBar('Python', 88);
        printLine('Web Stack:', 'info-out');
        printSkillBar('HTML/CSS/JS', 90);
        printSkillBar('React', 82);
        printSkillBar('Node/Express', 80);
        printLine('Tools & AI:', 'info-out');
        printSkillBar('Git/GitHub', 90);
        printSkillBar('NumPy/Pandas', 85);
        printSkillBar('SymPy', 80);
        printLine('Hardware & EDA:', 'info-out');
        printSkillBar('Verilog HDL', 78);
        printSkillBar('LTspice/MATLAB', 75);
        break;

      case 'archetype':
        printLine('Developer Archetype Analysis:', 'info-out');
        printLine('=============================');
        printLine('Systems & Compilers  : <strong style="color: var(--accent-primary)">95%</strong>');
        printLine('DSA & Optimization   : <strong style="color: var(--accent-secondary)">90%</strong>');
        printLine('AI Arch & Memory     : <strong style="color: #8b5cf6">85%</strong>');
        printLine('Full-Stack Dev       : <strong style="color: #10b981">80%</strong>');
        printLine('Competitive Prog     : <strong style="color: #f59e0b">88%</strong>');
        printLine('=============================');
        printLine('Triggering SVG Radar Chart highlight scan...', 'success-out');

        // Scroll to About section if not in viewport
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Trigger loop highlight
        if (archetypeLoopInterval) {
          clearInterval(archetypeLoopInterval);
        }
        
        let loopIdx = 0;
        highlightAxis(loopIdx);
        loopIdx++;
        
        archetypeLoopInterval = setInterval(() => {
          if (loopIdx < archetypes.length) {
            highlightAxis(loopIdx);
            loopIdx++;
          } else {
            clearInterval(archetypeLoopInterval);
            archetypeLoopInterval = null;
            clearHighlight();
          }
        }, 800);
        break;

      case 'theme':
        const currentNewTheme = toggleTheme();
        printLine(`System theme toggled to <strong style="color: var(--accent-primary)">${currentNewTheme}</strong> mode.`, 'success-out');
          case 'projects':
        if (args.length > 1 && args[1].toLowerCase() === 'open') {
          if (args.length < 3) {
            printLine('Error: Please specify the project ID. Usage: projects open &lt;id&gt;', 'error-out');
            printLine('Example: projects open parker', 'system-out');
            break;
          }
          
          const projectId = args.slice(2).join(' ').toLowerCase().trim();
          let modalId = '';
          let projectName = '';
          
          if (projectId === 'parker') {
            modalId = 'modal-parker';
            projectName = 'P.A.R.K.E.R — Autonomous AI Agent';
          } else if (projectId === 'mac16' || projectId === 'mac-16') {
            modalId = 'modal-mac16';
            projectName = 'MAC-16 — Custom AI RISC Processor';
          } else if (projectId === 'cvm' || projectId === 'cvm++') {
            modalId = 'modal-cvm';
            projectName = 'CVM++ — Stack-Based VM &amp; Compiler';
          } else if (projectId === 'gitlite' || projectId === 'git') {
            modalId = 'modal-gitlite';
            projectName = 'GitLite — Git-Inspired VCS';
          } else if (projectId === 'mwis' || projectId === 'solver') {
            modalId = 'modal-mwis';
            projectName = 'MWIS Solver — Graph Solver';
          } else if (projectId === 'circuit' || projectId === 'analyser') {
            modalId = 'modal-circuit';
            projectName = 'Automated Circuit Analyser';
          } else if (projectId === 'ota' || projectId === 'amplifier') {
            modalId = 'modal-ota';
            projectName = 'Two-Stage Miller-Compensated OTA';
          } else if (projectId === 'fpga' || projectId === 'traffic') {
            modalId = 'modal-fpga';
            projectName = 'Traffic Signal Controller — FPGA';
          } else if (projectId === 'hackathon' || projectId === 'squad') {
            modalId = 'modal-hackathonsquad';
            projectName = 'Hackathon Squad Dashboard';
          } else if (projectId === 'habit' || projectId === 'habitflow') {
            modalId = 'modal-habit';
            projectName = 'HabitFlow — Habit Tracker';
          } else if (projectId === 'resume') {
            modalId = 'modal-resume';
            projectName = 'My Resumes (Dual CV Viewer)';
          }
          
          if (modalId) {
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
              // Close any active modal first to avoid stacked issues
              document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
              
              targetModal.classList.add('active');
              document.body.style.overflow = 'hidden';
              printLine(`Launching glassmorphic popup viewer for <strong style="color: var(--accent-primary)">${projectName}</strong>...`, 'success-out');
            } else {
              printLine(`Error: Modal element with ID "${modalId}" not found in document.`, 'error-out');
            }
          } else {
            printLine(`Error: Project ID "${escapeHTML(projectId)}" not recognized.`, 'error-out');
            printLine('Type "projects" to view a list of valid IDs.', 'system-out');
          }
        } else {
          printLine('Featured Projects Showcase:', 'info-out');
          printLine('Use <strong style="color: var(--accent-secondary)">projects open &lt;id&gt;</strong> to open details.', 'system-out');
          printLine('');
          printLine('  <strong style="color: var(--accent-primary)">parker</strong>     - P.A.R.K.E.R Autonomous AI Agent Engine');
          printLine('  <strong style="color: var(--accent-primary)">mac16</strong>      - MAC-16 AI-Accelerated 16-Bit RISC CPU');
          printLine('  <strong style="color: var(--accent-primary)">cvm</strong>        - CVM++ Stack-Based VM &amp; Compiler');
          printLine('  <strong style="color: var(--accent-primary)">gitlite</strong>    - GitLite Git-Inspired VCS (C++17)');
          printLine('  <strong style="color: var(--accent-primary)">mwis</strong>       - MWIS Solver Graph Independent Set Solver');
          printLine('  <strong style="color: var(--accent-primary)">circuit</strong>    - Automated Circuit Analyser (Python)');
          printLine('  <strong style="color: var(--accent-primary)">ota</strong>        - Miller-Compensated OTA (Analog IC)');
          printLine('  <strong style="color: var(--accent-primary)">fpga</strong>       - Traffic Signal Controller on FPGA');
          printLine('  <strong style="color: var(--accent-primary)">hackathon</strong>  - Hackathon Squad Team Portal');
          printLine('  <strong style="color: var(--accent-primary)">habit</strong>      - HabitFlow React Streak Tracker');
          printLine('  <strong style="color: var(--accent-primary)">resume</strong>     - Interactive Dual CV Viewer');
        }
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        break;

      case 'matrix':
        toggleMatrixRain();
        break;

      case 'cvm':
        if (args[1] === 'run') {
          runCvmSimulation();
        } else {
          printLine('Usage: cvm run', 'error-out');
          printLine('Simulates the compilation and fetch-decode-execute loop of CVM++ VM.', 'system-out');
        }
        break;

      case 'contact':
        startContactFlow();
        break;

      default:
        printLine(`Command not found: "${escapeHTML(cmd)}". Type "help" for a list of command codes.`, 'error-out');
    }
  }

  function printSkillBar(name, percentage) {
    const barWidth = 20;
    const filledCount = Math.round((percentage / 100) * barWidth);
    const emptyCount = barWidth - filledCount;
    const filled = '█'.repeat(filledCount);
    const empty = '░'.repeat(emptyCount);
    const paddedName = name.padEnd(14, ' ');
    printLine(`${paddedName} [${filled}${empty}] ${percentage}%`);
  }

  /* Matrix falling rain */
  function toggleMatrixRain() {
    if (isMatrixActive) {
      clearInterval(matrixInterval);
      terminalMatrixCanvas.style.opacity = '0';
      isMatrixActive = false;
      printLine('Matrix code background deactivated.', 'system-out');
    } else {
      terminalMatrixCanvas.style.opacity = '0.12';
      isMatrixActive = true;
      initMatrixRain();
      printLine('Matrix digital rain background initialized. System matrix running.', 'success-out');
    }
  }

  function initMatrixRain() {
    const canvas = terminalMatrixCanvas;
    const ctx = canvas.getContext('2d');

    // Resize canvas
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = terminalScreen.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ$@#%+&=?*';
    const charArr = chars.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    if (matrixInterval) clearInterval(matrixInterval);
    
    matrixInterval = setInterval(() => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      
      // Clear with slight alpha to create trail
      ctx.fillStyle = isDark ? 'rgba(3, 7, 18, 0.08)' : 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isDark ? '#10b981' : '#4f46e5'; // green in dark, indigo in light
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);
  }

  /* Interactive contact flow */
  function startContactFlow() {
    contactFormState = 'name';
    contactData = { name: '', email: '', message: '' };
    printLine('Entering CLI Contact Form. Type "cancel" at any time to abort.', 'info-out');
    printLine('Please enter your <strong>Name</strong>:', 'prompt-out');
    terminalInput.placeholder = 'e.g. John Doe';
  }

  function handleContactFlow(input) {
    if (input.toLowerCase() === 'cancel') {
      contactFormState = null;
      terminalInput.placeholder = DEFAULT_PLACEHOLDER;
      printLine('Contact form aborted.', 'error-out');
      return;
    }

    if (contactFormState === 'name') {
      if (!input.trim()) {
        printLine('Name cannot be empty. Please enter your name:', 'error-out');
        return;
      }
      contactData.name = input.trim();
      contactFormState = 'email';
      printLine('Please enter your <strong>Email</strong>:', 'prompt-out');
      terminalInput.placeholder = 'e.g. john@example.com';
    } else if (contactFormState === 'email') {
      if (!input.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim())) {
        printLine('Invalid email syntax. Please try again or type "cancel":', 'error-out');
        return;
      }
      contactData.email = input.trim();
      contactFormState = 'message';
      printLine('Please enter your <strong>Message</strong>:', 'prompt-out');
      terminalInput.placeholder = 'e.g. Let\'s work together!';
    } else if (contactFormState === 'message') {
      if (!input.trim()) {
        printLine('Message cannot be empty. Please enter your message:', 'error-out');
        return;
      }
      contactData.message = input.trim();
      submitContactCli();
    }
  }

  async function submitContactCli() {
    contactFormState = null;
    terminalInput.placeholder = DEFAULT_PLACEHOLDER;
    terminalInput.disabled = true;
    printLine('Initiating background Express API POST connection...', 'info-out');
    printLine('Sending JSON payload to "/api/contact"...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        printLine('API Server Response: 200 OK.', 'success-out');
        printLine('Database successfully updated inside messages.json!', 'success-out');
        printLine('Thank you! I will review your submission and reply shortly.', 'success-out');
        showToast('Message sent! I\'ll respond shortly.', 'success');
      } else {
        printLine(`Server Error: ${result.error || 'Unknown error occurred'}`, 'error-out');
      }
    } catch (e) {
      console.error(e);
      printLine('Network Error: Connection failed. Is the API server offline?', 'error-out');
      showToast('Network error submitting contact request.', 'error');
    } finally {
      terminalInput.disabled = false;
      terminalInput.focus();
    }
  }

  /* CVM++ VM simulator */
  async function runCvmSimulation() {
    if (isCvmRunning) return;
    isCvmRunning = true;
    terminalInput.disabled = true;

    printLine('Loading CVM++ compiler runtime...', 'info-out');
    await delay(600);
    printLine('Reading source file: sum_1_to_5.cvm');
    await delay(300);
    
    printLine(`----------------------------------------
x = 0;
i = 1;
while (i <= 5) {
    x = x + i;
    i = i + 1;
}
print(x);
----------------------------------------`, 'info-out');
    await delay(800);
    
    printLine('Compiling AST structures & resolving symbols...');
    await delay(500);
    printLine('Opcodes registered: 23 opcodes loaded.');
    printLine('Pass 1: AST parsed successfully. Nodes generated = 24.');
    printLine('Pass 2: Performing two-pass jump offset patching...');
    await delay(600);
    printLine('Bytecode generation complete. Total binary footprint: 35 bytes.', 'success-out');
    await delay(400);

    printLine('Annotated bytecode disassembly:', 'info-out');
    const instructions = [
      '0x0000: LOAD_CONST   0 (0)      ; Push x initial value',
      '0x0002: STORE_FAST   0 (x)      ; Pop and save in local[0]',
      '0x0004: LOAD_CONST   1 (1)      ; Push i initial value',
      '0x0006: STORE_FAST   1 (i)      ; Pop and save in local[1]',
      '0x0008: LOAD_FAST    1 (i)      ; Loop condition check: push i',
      '0x000A: LOAD_CONST   2 (5)      ; Push loop bound constant 5',
      '0x000C: LE                      ; Compare: i <= 5',
      '0x000D: JMP_FALSE    27         ; If false, jump to print at 0x001B',
      '0x000F: LOAD_FAST    0 (x)      ; Push x',
      '0x0011: LOAD_FAST    1 (i)      ; Push i',
      '0x0013: ADD                     ; Compute x + i',
      '0x0014: STORE_FAST   0 (x)      ; Save in local[0]',
      '0x0016: LOAD_FAST    1 (i)      ; Push i',
      '0x0018: LOAD_CONST   3 (1)      ; Push step 1',
      '0x001A: ADD                     ; Compute i + 1',
      '0x001B: STORE_FAST   1 (i)      ; Save in local[1]',
      '0x001D: JMP          8          ; Jump back to loop start check',
      '0x001F: LOAD_FAST    0 (x)      ; Push final x result',
      '0x0021: PRINT_INT               ; Output top value on stack',
      '0x0022: HALT                    ; Halt VM execution pipeline'
    ];
    for (const inst of instructions) {
      printLine(inst);
      await delay(40);
    }
    await delay(800);

    printLine('Spinning up stack-based VM virtual CPU registers...', 'info-out');
    await delay(500);

    // Create execution table header
    const headerLine = document.createElement('div');
    headerLine.className = 'cvm-exec-grid header';
    headerLine.innerHTML = `
      <div>PC</div>
      <div>Instruction</div>
      <div>Eval Stack</div>
      <div>Local Variables</div>
    `;
    terminalOutput.appendChild(headerLine);

    const cvmSteps = [
      { pc: '0x0000', inst: 'LOAD_CONST 0', stack: '[0]', locals: 'x: u/d, i: u/d' },
      { pc: '0x0002', inst: 'STORE_FAST x', stack: '[ ]', locals: 'x: 0, i: u/d' },
      { pc: '0x0004', inst: 'LOAD_CONST 1', stack: '[1]', locals: 'x: 0, i: u/d' },
      { pc: '0x0006', inst: 'STORE_FAST i', stack: '[ ]', locals: 'x: 0, i: 1' },
      
      // Loop 1
      { pc: '0x0008', inst: 'LOAD_FAST i', stack: '[1]', locals: 'x: 0, i: 1' },
      { pc: '0x000A', inst: 'LOAD_CONST 5', stack: '[1, 5]', locals: 'x: 0, i: 1' },
      { pc: '0x000C', inst: 'LE (<=)', stack: '[true]', locals: 'x: 0, i: 1' },
      { pc: '0x000D', inst: 'JMP_FALSE 27', stack: '[ ]', locals: 'x: 0, i: 1' },
      { pc: '0x000F', inst: 'LOAD_FAST x', stack: '[0]', locals: 'x: 0, i: 1' },
      { pc: '0x0011', inst: 'LOAD_FAST i', stack: '[0, 1]', locals: 'x: 0, i: 1' },
      { pc: '0x0013', inst: 'ADD', stack: '[1]', locals: 'x: 0, i: 1' },
      { pc: '0x0014', inst: 'STORE_FAST x', stack: '[ ]', locals: 'x: 1, i: 1' },
      { pc: '0x0016', inst: 'LOAD_FAST i', stack: '[1]', locals: 'x: 1, i: 1' },
      { pc: '0x0018', inst: 'LOAD_CONST 1', stack: '[1, 1]', locals: 'x: 1, i: 1' },
      { pc: '0x001A', inst: 'ADD', stack: '[2]', locals: 'x: 1, i: 1' },
      { pc: '0x001B', inst: 'STORE_FAST i', stack: '[ ]', locals: 'x: 1, i: 2' },
      { pc: '0x001D', inst: 'JMP 8', stack: '[ ]', locals: 'x: 1, i: 2' },
      
      // Loop 2 summary
      { pc: '0x0008', inst: 'LOAD_FAST i', stack: '[2]', locals: 'x: 1, i: 2' },
      { pc: '0x000C', inst: 'LE (<=)', stack: '[true]', locals: 'x: 1, i: 2' },
      { pc: '0x0013', inst: 'ADD (1+2)', stack: '[3]', locals: 'x: 1, i: 2' },
      { pc: '0x001B', inst: 'STORE_FAST i', stack: '[ ]', locals: 'x: 3, i: 3' },
      
      // Loop 3 summary
      { pc: '0x0008', inst: 'LOAD_FAST i', stack: '[3]', locals: 'x: 3, i: 3' },
      { pc: '0x000C', inst: 'LE (<=)', stack: '[true]', locals: 'x: 3, i: 3' },
      { pc: '0x0013', inst: 'ADD (3+3)', stack: '[6]', locals: 'x: 3, i: 3' },
      { pc: '0x001B', inst: 'STORE_FAST i', stack: '[ ]', locals: 'x: 6, i: 4' },

      // Loop 4 summary
      { pc: '0x0008', inst: 'LOAD_FAST i', stack: '[4]', locals: 'x: 6, i: 4' },
      { pc: '0x000C', inst: 'LE (<=)', stack: '[true]', locals: 'x: 6, i: 4' },
      { pc: '0x0013', inst: 'ADD (6+4)', stack: '[10]', locals: 'x: 6, i: 4' },
      { pc: '0x001B', inst: 'STORE_FAST i', stack: '[ ]', locals: 'x: 10, i: 5' },

      // Loop 5 summary
      { pc: '0x0008', inst: 'LOAD_FAST i', stack: '[5]', locals: 'x: 10, i: 5' },
      { pc: '0x000C', inst: 'LE (<=)', stack: '[true]', locals: 'x: 10, i: 5' },
      { pc: '0x0013', inst: 'ADD (10+5)', stack: '[15]', locals: 'x: 10, i: 5' },
      { pc: '0x001B', inst: 'STORE_FAST i', stack: '[ ]', locals: 'x: 15, i: 6' },

      // End check
      { pc: '0x0008', inst: 'LOAD_FAST i', stack: '[6]', locals: 'x: 15, i: 6' },
      { pc: '0x000A', inst: 'LOAD_CONST 5', stack: '[6, 5]', locals: 'x: 15, i: 6' },
      { pc: '0x000C', inst: 'LE (<=)', stack: '[false]', locals: 'x: 15, i: 6' },
      { pc: '0x000D', inst: 'JMP_FALSE 27', stack: '[ ]', locals: 'x: 15, i: 6' },
      { pc: '0x001F', inst: 'LOAD_FAST x', stack: '[15]', locals: 'x: 15, i: 6' },
      { pc: '0x0021', inst: 'PRINT_INT', stack: '[ ]', locals: 'x: 15, i: 6' }
    ];

    for (const step of cvmSteps) {
      const stepRow = document.createElement('div');
      stepRow.className = 'cvm-exec-grid';
      stepRow.innerHTML = `
        <div style="color: var(--text-tertiary)">${step.pc}</div>
        <div style="font-weight: 500">${step.inst}</div>
        <div style="color: var(--accent-secondary)">${step.stack}</div>
        <div style="color: var(--text-secondary)">{${step.locals}}</div>
      `;
      terminalOutput.appendChild(stepRow);
      scrollToBottom();
      await delay(120);
    }

    await delay(300);
    printLine('');
    printLine('----------------------------------------', 'success-out');
    printLine('CVM++ Execution Output: 15', 'success-out');
    printLine('----------------------------------------', 'success-out');
    printLine('Execution halted. Status code: 0.', 'success-out');

    isCvmRunning = false;
    terminalInput.disabled = false;
    terminalInput.focus();
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Bind key listeners for console typing
  terminalInput.addEventListener('keydown', (e) => {
    if (isCvmRunning) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      handleCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  // Keep focus in terminal input when clicking terminal screen
  terminalScreen.addEventListener('click', () => {
    // Only focus if they didn't select text
    if (window.getSelection().toString() === '') {
      terminalInput.focus();
    }
  });

  // Reset console button
  terminalResetBtn.addEventListener('click', () => {
    printWelcomeMessage();
    if (isMatrixActive) {
      toggleMatrixRain(); // toggle off
    }
  });

  // Initialize welcome message
  printWelcomeMessage();

  // Scroll Reveal hook to start Matrix code rain immediately if matrix command was toggled, 
  // or trigger resize checking
  const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && isMatrixActive) {
        initMatrixRain();
      }
    });
  }, { threshold: 0.1 });

  const terminalSectionElement = document.getElementById('terminal');
  if (terminalSectionElement) {
    terminalObserver.observe(terminalSectionElement);
  }
});
