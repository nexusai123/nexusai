(function () {
    document.documentElement.classList.add('js');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setMenuOpen(open) {
        if (!navMenu || !hamburger) return;
        navMenu.classList.toggle('active', open);
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('nav-open', open);
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            setMenuOpen(!navMenu.classList.contains('active'));
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('click', (e) => {
        if (!navMenu || !hamburger) return;
        if (!navMenu.classList.contains('active')) return;
        if (navMenu.contains(e.target) || hamburger.contains(e.target)) return;
        setMenuOpen(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) setMenuOpen(false);
    });

    function sectionIdFromHref(href) {
        if (!href || href === '#') return '';
        if (href.includes('.html')) return '';
        if (href.startsWith('#')) return href.slice(1);
        return '';
    }

    const pageSections = [...document.querySelectorAll('section[id]')];
    if (pageSections.length) {
        window.addEventListener('scroll', () => {
            let current = '';
            pageSections.forEach((section) => {
                if (window.scrollY >= section.offsetTop - 160) {
                    current = section.id;
                }
            });
            navLinks.forEach((link) => {
                const id = sectionIdFromHref(link.getAttribute('href'));
                if (!id) return;
                link.classList.toggle('active', id === current);
            });
        }, { passive: true });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                return;
            }
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            history.replaceState(null, '', href);
        });
    });

    const yearNodes = document.querySelectorAll('.year');
    const year = String(new Date().getFullYear());
    yearNodes.forEach((el) => { el.textContent = year; });

    const toast = document.getElementById('toast');
    let toastTimer;
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.hidden = false;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
            toast.hidden = true;
        }, 4000);
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const errorEl = document.getElementById('form-error');
        const successEl = document.getElementById('form-success');
        const sendBtn = document.getElementById('send-btn');
        const waBtn = document.getElementById('wa-btn');
        const FORM_ENDPOINT = 'https://formsubmit.co/ajax/info@nexusai.com';

        function setError(msg) {
            if (successEl) successEl.hidden = true;
            if (errorEl) {
                errorEl.textContent = msg;
                errorEl.hidden = !msg;
            } else if (msg) {
                showToast(msg);
            }
        }

        function readFields() {
            const data = Object.fromEntries(new FormData(contactForm));
            return {
                name: (data.name || '').trim(),
                email: (data.email || '').trim(),
                message: (data.message || '').trim(),
                company: (data.company || '').trim(),
                service: data.service || ''
            };
        }

        function waHref(fields) {
            const text = [
                'Hello NexusAI,',
                fields.name ? 'Name: ' + fields.name : '',
                fields.company ? 'Company: ' + fields.company : '',
                fields.service ? 'Need: ' + fields.service : '',
                fields.message ? fields.message : ''
            ].filter(Boolean).join('\n');
            return 'https://wa.me/918079603321?text=' + encodeURIComponent(text);
        }

        if (waBtn) {
            waBtn.addEventListener('click', (e) => {
                const fields = readFields();
                waBtn.href = waHref(fields);
            });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fields = readFields();
            setError('');

            if (!fields.name || !fields.email || !fields.message || !fields.service) {
                setError('Please fill in name, work email, what you need, and a short message.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(fields.email)) {
                setError('Please enter a valid work email.');
                return;
            }

            if (sendBtn) {
                sendBtn.disabled = true;
                sendBtn.textContent = 'Sending…';
            }

            try {
                const res = await fetch(FORM_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({
                        name: fields.name,
                        email: fields.email,
                        company: fields.company || '—',
                        service: fields.service,
                        message: fields.message,
                        _subject: 'NexusAI enquiry — ' + fields.service
                    })
                });
                const payload = await res.json().catch(() => ({}));
                if (!res.ok || payload.success === 'false' || payload.success === false) {
                    throw new Error(payload.message || 'Send failed');
                }
                contactForm.reset();
                if (successEl) successEl.hidden = false;
                showToast('Message sent.');
            } catch (err) {
                setError('Could not send from the browser. Opening WhatsApp instead.');
                window.open(waHref(fields), '_blank', 'noopener');
            } finally {
                if (sendBtn) {
                    sendBtn.disabled = false;
                    sendBtn.textContent = 'Send message';
                }
            }
        });
    }

    if (!reduceMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

        document.querySelectorAll(
            '.service-card, .benefit, .team-member, .project-card, .platform-item, .mobile-app, .home-product-card, .approach-card'
        ).forEach((el) => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

    const runBtn = document.getElementById('run-analysis');
    const quickScan = document.getElementById('quick-scan');
    const progressBar = document.querySelector('#analysis-progress > span');
    const progressWrap = document.getElementById('analysis-progress');
    const resultsPanel = document.getElementById('analysis-results');
    const resultsList = document.getElementById('results-list');
    const demoFile = document.getElementById('demo-file');
    const fileStatus = document.getElementById('file-status');
    const analysisStatus = document.getElementById('analysis-status');
    let analysisTimer;

    function simulateAnalysis(mode) {
        if (!progressBar || !progressWrap || !resultsPanel) return;
        resultsPanel.hidden = true;
        progressWrap.setAttribute('aria-hidden', 'false');
        progressBar.style.width = '0%';
        if (analysisStatus) analysisStatus.textContent = 'Preview running.';
        let progress = 0;
        const step = mode === 'quick' ? 22 : 10;
        clearInterval(analysisTimer);
        analysisTimer = setInterval(() => {
            progress = Math.min(100, progress + Math.floor(Math.random() * step) + (mode === 'quick' ? 12 : 5));
            progressBar.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(analysisTimer);
                window.setTimeout(() => showFakeResults(mode), reduceMotion ? 0 : 280);
            }
        }, reduceMotion ? 40 : (mode === 'quick' ? 180 : 320));
    }

    function showFakeResults(mode) {
        if (!resultsList || !resultsPanel) return;
        const isHeap = demoFile && demoFile.files[0] && /\.hprof$/i.test(demoFile.files[0].name);
        const dump = [
            { severity: 'Critical', title: 'Deadlock between pool-1-thread-3 and http-nio-8080', fix: 'Reduce lock scope around OrderService#reserveInventory and avoid nested synchronized on the same pair of monitors.' },
            { severity: 'High', title: 'RUNNABLE spin in worker pool', fix: 'The worker loop has no backoff. Add a wait/notify or bounded queue so idle workers park.' },
            { severity: 'Medium', title: 'Cache retaining 1.2M entries', fix: 'Set a max size and TTL on the local cache; confirm eviction in a second dump after deploy.' },
            { severity: 'Info', title: 'JDBC wait on main request thread', fix: 'Move the query off the servlet thread or raise the pool and add a timeout.' }
        ];
        const heap = [
            { severity: 'High', title: 'Retained HashMap in SessionStore', fix: 'Sessions are never removed on logout. Add explicit remove and a size cap.' },
            { severity: 'High', title: 'Byte[] buffers held by Netty', fix: 'Check for missing release() on pooled buffers in the outbound handler.' },
            { severity: 'Medium', title: 'Soft references not clearing under load', fix: 'Heap is too large for the current pause goal; review G1 region size and live-data size.' },
            { severity: 'Info', title: 'Classloader metadata growth', fix: 'Redeploys without unloading. Confirm undeploy of old webapps.' }
        ];
        const sample = isHeap ? heap : dump;
        const results = mode === 'quick' ? sample.slice(0, 2) : sample;
        resultsList.innerHTML = '';
        results.forEach((r) => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML =
                '<div class="result-severity">' + r.severity + '</div>' +
                '<div><strong>' + r.title + '</strong><div class="result-fix">' + r.fix + '</div></div>';
            resultsList.appendChild(div);
        });
        resultsPanel.hidden = false;
        progressWrap.setAttribute('aria-hidden', 'true');
        if (analysisStatus) {
            analysisStatus.textContent = 'Preview complete. ' + results.length + ' sample findings.';
        }
        resultsPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    }

    if (runBtn) runBtn.addEventListener('click', () => simulateAnalysis('full'));
    if (quickScan) quickScan.addEventListener('click', () => simulateAnalysis('quick'));

    if (demoFile) {
        demoFile.addEventListener('change', () => {
            if (demoFile.files && demoFile.files[0] && fileStatus) {
                fileStatus.textContent = 'Using filename “' + demoFile.files[0].name + '” for this preview only. The file is not uploaded.';
            }
        });
    }

    const themeToggle = document.getElementById('theme-toggle');
    function applyTheme(t) {
        document.body.classList.toggle('dark', t === 'dark');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            const dark = t === 'dark';
            if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
            themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        }
    }
    const savedTheme = localStorage.getItem('nexusai_theme');
    if (savedTheme) applyTheme(savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
    else applyTheme('light');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = document.body.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('nexusai_theme', next);
        });
    }
})();
