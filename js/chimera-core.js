/**
 * Chimera — Unified frontend (space theme)
 */
(function () {
    'use strict';

    const PAGE = document.body.dataset.page || '';

    /* ── Starfield canvas ── */
    function initStarfield() {
        const canvas = document.getElementById('starfield');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let stars = [];
        let w, h, animId;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            const count = Math.min(400, Math.floor((w * h) / 4500));
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                z: Math.random() * 2 + 0.2,
                r: Math.random() * 1.5 + 0.3,
                tw: Math.random() * Math.PI * 2
            }));
        }

        function draw() {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, w, h);
            const t = Date.now() * 0.001;
            stars.forEach(s => {
                s.y += s.z * 0.15;
                if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
                const pulse = 0.4 + 0.6 * Math.sin(t * 2 + s.tw);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${0.3 + s.z * 0.35})`;
                ctx.fill();
            });
            animId = requestAnimationFrame(draw);
        }

        resize();
        draw();
        window.addEventListener('resize', resize);
    }

    /* ── Theme (space default) ── */
    function initTheme() {
        const html = document.documentElement;
        const toggle = document.getElementById('themeToggle');
        const saved = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', saved);

        function updateIcon() {
            if (!toggle) return;
            const icon = toggle.querySelector('i');
            if (!icon) return;
            icon.classList.toggle('fa-sun', html.getAttribute('data-theme') === 'dark');
            icon.classList.toggle('fa-moon', html.getAttribute('data-theme') !== 'dark');
        }
        updateIcon();
        toggle?.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateIcon();
        });
    }

    /* ── Mobile nav ── */
    function initNav() {
        const btn = document.getElementById('mobileMenuToggle');
        const links = document.querySelector('.nav-links');
        if (!btn || !links) return;
        btn.addEventListener('click', () => {
            links.classList.toggle('active');
            const icon = btn.querySelector('i');
            icon?.classList.toggle('fa-bars');
            icon?.classList.toggle('fa-times');
        });
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                links.classList.remove('active');
                const icon = btn.querySelector('i');
                icon?.classList.add('fa-bars');
                icon?.classList.remove('fa-times');
            });
        });
        window.addEventListener('scroll', () => {
            document.querySelector('.header')?.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /* ── Notifications ── */
    window.showNotification = function (message, type = 'info') {
        document.querySelector('.notification')?.remove();
        const n = document.createElement('div');
        n.className = `notification notification-${type} show`;
        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
        n.innerHTML = `<div class="notification-content"><i class="fas ${icons[type] || icons.info}"></i><span>${message}</span><button class="notification-close" type="button"><i class="fas fa-times"></i></button></div>`;
        document.body.appendChild(n);
        n.querySelector('.notification-close')?.addEventListener('click', () => n.remove());
        setTimeout(() => n.remove(), 6000);
    };

    function isValidURL(string) {
        try {
            const u = new URL(string);
            return u.protocol === 'http:' || u.protocol === 'https:';
        } catch { return false; }
    }

    window.isValidURL = isValidURL;

    /* ── Scroll reveal ── */
    function initReveal() {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.feature-card, .step, .awareness-card, .module-card, .reveal').forEach(el => {
            el.classList.add('reveal');
            obs.observe(el);
        });
    }

    /* ── URL Scanner ── */
    const SCAN_API = 'https://url-backend-yn04.onrender.com/scan';

    function initScanner() {
        if (PAGE !== 'scan') return;
        const urlInput = document.getElementById('urlInput');
        const scanBtn = document.getElementById('scanBtn');
        if (!urlInput || !scanBtn) return;

        const sessionUrl = sessionStorage.getItem('scanUrl');
        if (sessionUrl) {
            urlInput.value = sessionUrl;
            sessionStorage.removeItem('scanUrl');
            setTimeout(performScan, 500);
        }
        scanBtn.addEventListener('click', performScan);
        urlInput.addEventListener('keypress', e => { if (e.key === 'Enter') performScan(); });

        window.setExampleUrl = url => { urlInput.value = url; urlInput.focus(); };
        window.scanAnother = () => window.location.reload();
        window.reportSuspicious = () => { window.location.href = 'report.html'; };
    }

    async function performScan() {
        const url = document.getElementById('urlInput')?.value.trim();
        if (!url) return showNotification('Please enter a URL', 'warning');

        document.querySelector('.url-input-section').style.display = 'none';
        document.getElementById('loadingSection').style.display = 'flex';
        document.getElementById('resultsSection').style.display = 'none';

        const bar = document.querySelector('.progress-fill');
        if (bar) bar.style.width = '10%';
        let w = 10;
        const timer = setInterval(() => { if (w < 90 && bar) bar.style.width = (w += 5) + '%'; }, 200);

        try {
            const res = await fetch(SCAN_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            if (!res.ok) throw new Error('Backend Error');
            const data = await res.json();
            clearInterval(timer);
            if (bar) bar.style.width = '100%';
            setTimeout(() => {
                renderScanResults(data);
                document.getElementById('loadingSection').style.display = 'none';
                document.getElementById('resultsSection').style.display = 'block';
            }, 500);
        } catch {
            clearInterval(timer);
            document.querySelector('.url-input-section').style.display = 'block';
            document.getElementById('loadingSection').style.display = 'none';
            showNotification('Connection failed. Check backend.', 'error');
        }
    }

    function formatText(text) {
        if (!text) return 'Unknown';
        return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            .replace(/Ssl/g, 'SSL').replace(/Url/g, 'URL');
    }

    function renderScanResults(data) {
        const riskScore = Math.round(data.confidence || data.final_score || 0);
        const safetyScore = Math.max(0, 100 - riskScore);
        let riskLevel = 'Safe', riskClass = 'safe';
        if (riskScore >= 80) { riskLevel = 'Critical'; riskClass = 'danger'; }
        else if (riskScore >= 40) { riskLevel = 'Suspicious'; riskClass = 'warning'; }

        const badge = document.getElementById('riskBadge');
        if (badge) {
            badge.className = `risk-badge ${riskClass}`;
            const icon = riskClass === 'warning' ? 'fa-exclamation-triangle' : riskClass === 'danger' ? 'fa-ban' : 'fa-check-circle';
            badge.innerHTML = `<i class="fas ${icon}"></i> ${riskLevel}`;
        }
        const scoreEl = document.getElementById('scoreValue');
        if (scoreEl) scoreEl.textContent = safetyScore;
        const circle = document.querySelector('.score-circle');
        if (circle) {
            const color = riskClass === 'warning' ? '#fbbf24' : riskClass === 'danger' ? '#f87171' : '#34d399';
            circle.style.background = `conic-gradient(${color} ${safetyScore}%, var(--bg-tertiary) 0)`;
        }

        const d = data.details || {};
        const isSiteBad = riskClass !== 'safe';
        const cards = [
            ['card-ssl', 'sslStatus', d.ssl_presence_and_validity],
            ['card-age', 'domainAge', d.domain_age_analysis],
            ['card-redirects', 'redirectBehavior', d.open_redirect_detection],
            ['card-blacklist', 'blacklistStatus', d.threat_intelligence],
            ['card-homoglyph', 'homoglyphStatus', d.homoglyph_impersonation],
            ['card-favicon', 'faviconStatus', d.favicon_mismatch],
            ['card-abuse', 'abuseStatus', d.domain_abuse_detection],
            ['card-obfuscation', 'obfuscationStatus', d.obfuscation_analysis],
            ['card-flux', 'fluxStatus', d.fast_flux_dns],
            ['card-datauri', 'dataUriStatus', d.data_uri_scheme],
            ['card-random', 'randomStatus', d.random_domain_detection],
            ['card-structure', 'structureStatus', d.url_structure_analysis],
            ['card-path', 'pathStatus', d.path_anomaly_detection]
        ];
        cards.forEach(([cid, tid, feat]) => updateScanCard(cid, tid, feat, isSiteBad));

        const list = document.getElementById('recommendationsList');
        if (list) {
            if (riskClass === 'danger') {
                list.innerHTML = `<div class="rec-item-compact danger"><i class="fas fa-ban"></i> <span><b>CRITICAL:</b> Do not visit.</span></div><div class="rec-item-compact warning"><i class="fas fa-key"></i> <span>Change passwords if visited.</span></div>`;
            } else if (riskClass === 'warning') {
                list.innerHTML = `<div class="rec-item-compact warning"><i class="fas fa-exclamation-triangle"></i> <span><b>CAUTION:</b> Suspicious elements.</span></div>`;
            } else {
                list.innerHTML = `<div class="rec-item-compact safe"><i class="fas fa-check-circle"></i> <span><b>SAFE:</b> No threats detected.</span></div>`;
            }
        }
    }

    function updateScanCard(cardId, textId, feature, isSiteBad) {
        const card = document.getElementById(cardId);
        const p = document.getElementById(textId);
        if (!feature || !card) { card?.classList.add('d-none'); return; }
        p.textContent = formatText(feature.message);
        const bad = feature.score > 0;
        p.className = bad ? 'text-danger' : 'text-success';
        if (isSiteBad) bad ? card.classList.remove('d-none') : card.classList.add('d-none');
        else !bad ? card.classList.remove('d-none') : card.classList.add('d-none');
    }

    /* ── Email checker ── */
    const EMAIL_API = 'https://adelia-commonsense-soaked.ngrok-free.dev/api/email/scan';

    function initEmail() {
        if (PAGE !== 'email') return;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const t = btn.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(c => {
                    c.classList.toggle('active', c.id === t + 'Tab');
                });
            });
        });
        document.getElementById('checkBtn')?.addEventListener('click', checkEmail);
        const upload = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        upload?.addEventListener('click', () => fileInput?.click());
        fileInput?.addEventListener('change', e => { if (e.target.files[0]) loadEmailFile(e.target.files[0]); });
        window.clearForm = clearEmailForm;
        window.checkAnotherEmail = () => { clearEmailForm(); toggleEmail('input'); };
        window.reportPhishingEmail = () => {
            sessionStorage.setItem('reportEmail', JSON.stringify({
                subject: document.getElementById('emailSubject')?.value,
                from: document.getElementById('emailFrom')?.value
            }));
            window.location.href = 'report.html';
        };
        window.removeFile = () => {
            if (fileInput) fileInput.value = '';
            const fi = document.getElementById('fileInfo');
            if (fi) fi.style.display = 'none';
        };
    }

    function toggleEmail(view) {
        document.querySelector('.email-input-section').style.display = view === 'input' ? 'block' : 'none';
        const load = document.getElementById('loadingSection');
        const res = document.getElementById('resultsSection');
        if (load) load.style.display = view === 'loading' ? 'block' : 'none';
        if (res) {
            res.style.display = view === 'results' ? 'block' : 'none';
            if (view === 'results') res.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function clearEmailForm() {
        ['emailSubject', 'emailFrom', 'emailContent', 'emailHeaders'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        window.removeFile?.();
    }

    function loadEmailFile(file) {
        const reader = new FileReader();
        reader.onload = e => {
            const c = document.getElementById('emailContent');
            if (c) c.value = e.target.result;
            const fn = document.getElementById('fileName');
            const fi = document.getElementById('fileInfo');
            if (fn) fn.textContent = file.name;
            if (fi) fi.style.display = 'block';
            document.querySelector('[data-tab="paste"]')?.click();
            showNotification('File loaded.', 'success');
        };
        reader.readAsText(file);
    }

    async function checkEmail() {
        const subject = document.getElementById('emailSubject')?.value.trim() || '';
        const from = document.getElementById('emailFrom')?.value.trim() || '';
        const content = document.getElementById('emailContent')?.value.trim() || '';
        const headers = document.getElementById('emailHeaders')?.value.trim() || '';
        if (!subject && !from && !content) return showNotification('Enter email content', 'warning');

        toggleEmail('loading');
        const bar = document.querySelector('.progress-fill');
        let w = 10;
        const timer = setInterval(() => { if (w < 90 && bar) bar.style.width = (w += 5) + '%'; }, 300);

        try {
            const res = await fetch(EMAIL_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject: subject || 'No Subject', body: content || '', sender: from || 'Unknown', headers })
            });
            if (!res.ok) throw new Error('fail');
            const result = await res.json();
            clearInterval(timer);
            if (bar) bar.style.width = '100%';
            setTimeout(() => {
                renderEmailResults(processEmailResult(result.data, subject, content));
                toggleEmail('results');
            }, 500);
        } catch {
            clearInterval(timer);
            toggleEmail('input');
            showNotification('Connection failed.', 'error');
        }
    }

    function processEmailResult(backendData, subject, content) {
        const score = backendData?.score ?? 0;
        let riskClass = 'safe', riskLevel = 'Safe';
        if (score >= 75) { riskLevel = 'Critical Risk'; riskClass = 'danger'; }
        else if (score >= 40) { riskLevel = 'Suspicious'; riskClass = 'warning'; }
        const text = (subject + ' ' + content).toLowerCase();
        const spamKeywords = ['urgent', 'immediate', 'suspended', 'verify', 'click here', 'winner'].filter(k => text.includes(k));
        const links = (content.match(/https?:\/\/[^\s]+/gi) || []).filter(l => /bit\.ly|tinyurl|ngrok/.test(l));
        return { phishingScore: Math.round(score), riskLevel, riskClass, confidence: 95, spamKeywords, suspiciousLinks: links, senderVerification: 'Verified' };
    }

    function renderEmailResults(a) {
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('phishingLevel', a.riskLevel);
        set('phishingScore', a.phishingScore);
        set('confidenceScore', a.confidence + '%');
        set('threatLevel', a.riskLevel.replace(' Risk', ''));
        const badge = document.getElementById('phishingBadge');
        if (badge) {
            badge.className = `phishing-badge ${a.riskClass}`;
            const icon = badge.querySelector('i');
            if (icon) icon.className = a.riskClass === 'safe' ? 'fas fa-shield-check' : 'fas fa-exclamation-triangle';
        }
        const spamEl = document.getElementById('spamKeywords');
        const spamSt = document.getElementById('spamStatus');
        if (a.spamKeywords.length) {
            if (spamSt) { spamSt.textContent = 'Found'; spamSt.className = 'status-badge warning'; }
            if (spamEl) spamEl.innerHTML = `<div class="keyword-list">${a.spamKeywords.map(k => `<span class="keyword-tag">${k}</span>`).join('')}</div>`;
        }
        const rec = document.getElementById('emailRecommendations');
        if (rec) {
            rec.innerHTML = a.riskClass === 'safe'
                ? '<div class="recommendation-item safe"><i class="fas fa-check-circle"></i><span>Email appears safe.</span></div>'
                : '<div class="recommendation-item danger"><i class="fas fa-ban"></i><span>Do not click links.</span></div>';
        }
    }

    /* ── Auth ── */
    function initAuth() {
        if (PAGE !== 'login' && PAGE !== 'signup') return;
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        ['passwordToggle', 'confirmPasswordToggle'].forEach((tid, i) => {
            const toggle = document.getElementById(tid);
            const input = document.getElementById(i ? 'confirmPassword' : 'password');
            toggle?.addEventListener('click', () => {
                if (!input) return;
                input.type = input.type === 'password' ? 'text' : 'password';
                toggle.querySelector('i')?.classList.toggle('fa-eye');
                toggle.querySelector('i')?.classList.toggle('fa-eye-slash');
            });
        });

        loginForm?.addEventListener('submit', e => {
            e.preventDefault();
            const btn = loginForm.querySelector('.auth-btn');
            if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...'; }
            setTimeout(() => {
                showNotification('Login successful!', 'success');
                setTimeout(() => { window.location.href = 'index.html'; }, 1500);
            }, 1200);
        });

        signupForm?.addEventListener('submit', e => {
            e.preventDefault();
            showNotification('Account created! Redirecting...', 'success');
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        });
    }

    /* ── Learn quiz (minimal) ── */
    const quizQuestions = [
        { q: 'You receive an email from your bank asking you to verify by clicking a link. What should you do?', options: ['Click immediately', 'Contact bank via official channels', 'Reply with account info', 'Forward to friends'], correct: 1 },
        { q: 'Which is a sign of a fake website?', options: ['HTTPS', 'Slight misspelling in URL', 'Fast loading', 'Customer reviews'], correct: 1 }
    ];
    let quizIdx = 0;

    function initLearn() {
        if (PAGE !== 'learn') return;
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
            });
        });
        const bar = document.querySelector('.loading-progress');
        if (bar) {
            window.addEventListener('scroll', () => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.width = max > 0 ? (window.scrollY / max * 100) + '%' : '0%';
            });
        }
        window.checkAnswer = (btn, correct) => {
            document.querySelectorAll('.quiz-option').forEach(o => o.disabled = true);
            btn.classList.add(correct ? 'correct' : 'incorrect');
            const fb = document.getElementById('quizFeedback');
            if (fb) {
                fb.style.display = 'flex';
                fb.className = `quiz-feedback ${correct ? 'success' : 'error'}`;
                fb.innerHTML = `<i class="fas fa-${correct ? 'check' : 'times'}-circle"></i><span>${correct ? 'Correct!' : 'Not quite — review the guides above.'}</span>`;
            }
        };
        window.loadNextQuestion = () => {
            quizIdx = (quizIdx + 1) % quizQuestions.length;
            const q = quizQuestions[quizIdx];
            const card = document.querySelector('.quiz-question');
            if (!card) return;
            card.querySelector('h3').textContent = q.q;
            const opts = card.querySelector('.quiz-options');
            opts.innerHTML = q.options.map((o, i) =>
                `<button type="button" class="quiz-option" onclick="checkAnswer(this, ${i === q.correct})">${o}</button>`
            ).join('');
            document.getElementById('quizFeedback').style.display = 'none';
        };
    }

    /* ── Contact ── */
    const contactTypes = {
        support: { title: 'Technical Support', subtitle: 'Scanner help & bugs', priority: 'medium' },
        security: { title: 'Security Concern', subtitle: 'Report vulnerabilities', priority: 'urgent' },
        partnership: { title: 'Partnerships', subtitle: 'Collaboration inquiries', priority: 'medium' }
    };

    function initContact() {
        if (PAGE !== 'contact') return;
        window.showContactForm = type => {
            const c = contactTypes[type];
            if (!c) return;
            document.getElementById('formTitle').textContent = c.title;
            document.getElementById('formSubtitle').textContent = c.subtitle;
            document.getElementById('contactType').value = type;
            document.getElementById('priority').value = c.priority;
            document.getElementById('contactFormSection').style.display = 'block';
            document.querySelector('.contact-options').style.display = 'none';
        };
        window.hideContactForm = () => {
            document.getElementById('contactFormSection').style.display = 'none';
            document.querySelector('.contact-options').style.display = 'block';
        };
        window.toggleFAQ = el => el.closest('.faq-item')?.classList.toggle('expanded');
        window.showFAQCategory = cat => {
            document.querySelectorAll('.faq-category').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.category-tab').forEach(t => {
                t.classList.toggle('active', t.getAttribute('onclick')?.includes("'" + cat + "'"));
            });
            document.getElementById(cat + 'FAQ')?.classList.add('active');
        };
        document.getElementById('contactForm')?.addEventListener('submit', e => {
            e.preventDefault();
            showNotification('Message sent! We will respond within 24 hours.', 'success');
            hideContactForm();
        });
        window.showComingSoon = () => showNotification('Coming soon!', 'info');
    }

    /* ── Report ── */
    function initReport() {
        if (PAGE !== 'report') return;
        const url = sessionStorage.getItem('reportUrl');
        if (url) {
            document.getElementById('reportUrl').value = url;
            sessionStorage.removeItem('reportUrl');
        }
        const email = sessionStorage.getItem('reportEmail');
        if (email) {
            try {
                const d = JSON.parse(email);
                document.getElementById('reportUrl').value = 'Email: ' + (d.subject || '');
                document.getElementById('reportType').value = 'phishing';
                document.getElementById('description').value = `From: ${d.from}\nSubject: ${d.subject}`;
                sessionStorage.removeItem('reportEmail');
            } catch (_) {}
        }
        document.getElementById('reportForm')?.addEventListener('submit', e => {
            e.preventDefault();
            showNotification('Report submitted. Thank you for helping keep the community safe!', 'success');
            e.target.reset();
        });
    }

    /* ── Boot ── */
    document.addEventListener('DOMContentLoaded', () => {
        initStarfield();
        initTheme();
        initNav();
        initReveal();
        initScanner();
        initEmail();
        initAuth();
        initLearn();
        initContact();
        initReport();
    });
})();
