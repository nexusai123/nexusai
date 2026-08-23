// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Form Submission Handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Success message
        alert('Thank you for your message! Our team will get back to you soon.');
        contactForm.reset();
    });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.service-card, .benefit, .team-member, .project-card, .platform-item, .mobile-app').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Get current year for copyright
const yearElement = document.querySelector('.footer-bottom p');
if (yearElement) {
    const year = new Date().getFullYear();
    yearElement.textContent = `© ${year} NexusAI. All rights reserved. | Trusted by 50+ Fortune 500 Companies`;
}

// Add event listeners for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderTop = '4px solid var(--secondary-color)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.borderTop = 'none';
    });
});

// Log success message
console.log('NexusAI Website Loaded Successfully!');

// -- AI Demo Simulation --
const runBtn = document.getElementById('run-analysis');
const quickScan = document.getElementById('quick-scan');
const progressBar = document.querySelector('#analysis-progress > span');
const progressWrap = document.getElementById('analysis-progress');
const resultsPanel = document.getElementById('analysis-results');
const resultsList = document.getElementById('results-list');
const demoFile = document.getElementById('demo-file');

function simulateAnalysis(mode = 'full') {
    if (!progressBar || !progressWrap) return;
    resultsPanel.style.display = 'none';
    progressWrap.setAttribute('aria-hidden', 'false');
    progressBar.style.width = '0%';
    let progress = 0;
    const step = mode === 'quick' ? 20 : 8;
    const interval = setInterval(() => {
        progress = Math.min(100, progress + Math.floor(Math.random() * step) + (mode === 'quick' ? 10 : 4));
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showFakeResults(mode);
            }, 400);
        }
    }, mode === 'quick' ? 250 : 400);
}

function showFakeResults(mode) {
    if (!resultsList || !resultsPanel) return;
    const sample = [
        { severity: 'Critical', title: 'Deadlock between Thread-A & Thread-B', fix: 'Inspect synchronized blocks and reduce lock scope' },
        { severity: 'High', title: 'High CPU loop in worker pool', fix: 'Add rate-limiting and review loop conditions' },
        { severity: 'Medium', title: 'Large retained set in cache', fix: 'Add eviction policy and limit cache size' },
        { severity: 'Info', title: 'Blocking I/O on main thread', fix: 'Move I/O to dedicated thread pool' }
    ];

    // tailor sample for memory snapshots
    if (demoFile && demoFile.files && demoFile.files[0] && demoFile.files[0].name.endsWith('.hprof')) {
        sample.splice(0, 2, { severity: 'High', title: 'Native memory leak detected', fix: 'Check JNI allocations and release handles' });
    }

    // If quick mode, show only top 2
    const results = mode === 'quick' ? sample.slice(0, 2) : sample;
    resultsList.innerHTML = '';
    results.forEach(r => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<div class="result-severity">${r.severity}</div><div><strong>${r.title}</strong><div style="color:#666;margin-top:6px;">${r.fix}</div></div>`;
        resultsList.appendChild(div);
    });

    resultsPanel.style.display = 'block';
    progressWrap.setAttribute('aria-hidden', 'true');
}

if (runBtn) runBtn.addEventListener('click', () => simulateAnalysis('full'));
if (quickScan) quickScan.addEventListener('click', () => simulateAnalysis('quick'));

// Hook the custom file label to trigger file selection
const uploadLabel = document.querySelector('.upload-btn[for="demo-file"]');
if (uploadLabel && demoFile) {
    uploadLabel.addEventListener('click', () => demoFile.click());
    demoFile.addEventListener('change', () => {
        if (demoFile.files && demoFile.files[0]) {
            uploadLabel.textContent = demoFile.files[0].name;
        }
    });
}

// -- Theme toggle handling --
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(t) {
    if (t === 'dark') document.body.classList.add('dark'); else document.body.classList.remove('dark');
}
// load saved preference
const savedTheme = localStorage.getItem('nexusai_theme');
if (savedTheme) applyTheme(savedTheme);
// default to system preference if not set
else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('nexusai_theme', isDark ? 'dark' : 'light');
        // update icon
        const icon = themeToggle.querySelector('i');
        if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
    // set initial icon
    const iconInit = themeToggle.querySelector('i');
    if (iconInit) iconInit.className = document.body.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
}

// -- Contact Modal behavior (opens modal and hides navbar while open) --
const contactLinks = document.querySelectorAll('a[href="#contact"]');
const navbar = document.querySelector('.navbar');

function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    // show embedded modal
    modal.style.display = 'flex';
    // small timeout to allow CSS transition
    setTimeout(() => modal.classList.add('show'), 10);
    if (navbar) navbar.style.display = 'none';
    // wire close handlers (idempotent)
    const closeBtn = modal.querySelector('.contact-modal-close');
    const backdrop = modal.querySelector('.contact-modal-backdrop');
    if (closeBtn && !closeBtn._bound) { closeBtn.addEventListener('click', closeContactModal); closeBtn._bound = true; }
    if (backdrop && !backdrop._bound) { backdrop.addEventListener('click', closeContactModal); backdrop._bound = true; }

    // handle ESC
    if (!modal._escHandler) {
        modal._escHandler = (e) => { if (e.key === 'Escape') closeContactModal(); };
        document.addEventListener('keydown', modal._escHandler);
    }

    // ensure modal form submits as expected
    const modalForm = modal.querySelector('.contact-form');
    if (modalForm && !modalForm._bound) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! Our team will get back to you soon.');
            modalForm.reset();
            closeContactModal();
        });
        modalForm._bound = true;
    }
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 220);
    if (navbar) navbar.style.display = '';
    if (modal._escHandler) { document.removeEventListener('keydown', modal._escHandler); modal._escHandler = null; }
}

// Intercept same-page contact links to open modal
contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        openContactModal();
    });
});

// If page loads with #contact in hash, open modal
if (window.location.hash === '#contact') {
    setTimeout(() => openContactModal(), 150);
}
