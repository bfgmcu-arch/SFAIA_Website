document.addEventListener('DOMContentLoaded', () => {
    /* 1. Top Reading Progress Bar */
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.prepend(progressBar);

    const updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
        progressBar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    /* 2. Mobile Navigation Drawer */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        const closeMenu = () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    /* 3. Simple Mascot Interaction (Hop, Wave & Friendly Tips) */
    const mascotTips = [
        'Hi! I\'m Ollie, our student mascot. Every tool we install is 100% free for local businesses.',
        'Your financial records stay right on your own computer—never uploaded to external servers.',
        'No tech experience needed! Our New Hyde Park student team comes to your shop to set it up.',
        'Curious how it works? Reach out anytime for a free, no-pressure walkthrough.'
    ];

    document.querySelectorAll('.mascot-button').forEach((button) => {
        let tipIndex = 0;
        const speechEl = button.closest('.mascot-row')?.querySelector('.mascot-speech-text');

        button.addEventListener('click', () => {
            button.classList.remove('is-hopping');
            void button.offsetWidth; // restart animation
            button.classList.add('is-hopping');

            if (speechEl) {
                tipIndex = (tipIndex + 1) % mascotTips.length;
                speechEl.style.opacity = '0';
                setTimeout(() => {
                    speechEl.textContent = mascotTips[tipIndex];
                    speechEl.style.opacity = '1';
                }, 160);
            }
        });
    });

    /* 4. FAQ Accordion */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const button = item.querySelector('.faq-question');
        if (!button) return;

        button.addEventListener('click', () => {
            const isOpen = item.classList.toggle('open');
            button.setAttribute('aria-expanded', String(isOpen));
        });
    });

    /* 5. Copy Email Button */
    const copyButtons = document.querySelectorAll('[data-copy-email]');
    copyButtons.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const email = btn.getAttribute('data-copy-email');
            if (!email) return;

            try {
                await navigator.clipboard.writeText(email);
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2200);
            } catch {
                window.location.href = `mailto:${email}`;
            }
        });
    });

    /* 6. Contact Inquiry Form (Static Mailto Composer) */
    const contactForm = document.getElementById('contact-request-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('contact-name')?.value.trim() || '';
            const business = document.getElementById('contact-business')?.value.trim() || '';
            const email = document.getElementById('contact-email')?.value.trim() || '';
            const topic = document.getElementById('contact-topic')?.value || 'Free AI Budgeting Setup';
            const message = document.getElementById('contact-message')?.value.trim() || '';

            const recipient = 'studentsforaiaccessability@outlook.com';
            const subject = `[SLBS Inquiry] ${topic}${business ? ` - ${business}` : ''}`;
            const bodyLines = [
                'Hello Student Led Business Solutions team,',
                '',
                `Name: ${name}`,
                business ? `Business / Organization: ${business}` : null,
                `Reply Email: ${email}`,
                `Inquiry Type: ${topic}`,
                '',
                'Message:',
                message || 'I would like to learn more about your free local business solutions.',
            ].filter((line) => line !== null);

            const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

            formFeedback.innerHTML = `
                <strong>Your message draft is ready.</strong> We opened your email client addressed to
                <a href="mailto:${recipient}">${recipient}</a>. If it did not open automatically,
                <a href="${mailtoUrl}">click here to open the pre-filled email</a>.
            `;
            formFeedback.classList.add('visible');

            window.location.href = mailtoUrl;
        });
    }

    /* 7. Staggered Scroll Reveal */
    const staggerContainers = document.querySelectorAll('.commitments-grid, .card-grid, .steps-preview, .timeline');
    staggerContainers.forEach((container) => {
        const items = container.querySelectorAll('.reveal');
        items.forEach((item, idx) => {
            item.style.setProperty('--reveal-delay', `${idx * 85}ms`);
        });
    });

    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0) {
        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            revealEls.forEach((el) => observer.observe(el));
        } else {
            revealEls.forEach((el) => el.classList.add('is-visible'));
        }
    }
});
