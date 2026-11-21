document.addEventListener('DOMContentLoaded', () => {
    /* Mobile Navigation Drawer */
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

    /* FAQ Accordion */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const button = item.querySelector('.faq-question');
        if (!button) return;

        button.addEventListener('click', () => {
            const isOpen = item.classList.toggle('open');
            button.setAttribute('aria-expanded', String(isOpen));
        });
    });

    /* Copy Email Button */
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

    /* Contact Form (Opens pre-filled email) */
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
            const subject = `SLBS Inquiry: ${topic}${business ? ` (${business})` : ''}`;
            const bodyLines = [
                'Hi Student Led Business Solutions team,',
                '',
                `Name: ${name}`,
                business ? `Business: ${business}` : null,
                `Email: ${email}`,
                `Topic: ${topic}`,
                '',
                'Message:',
                message || 'I would like to learn more about setting up your free budgeting tool.',
            ].filter((line) => line !== null);

            const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

            formFeedback.innerHTML = `
                <strong>Your email draft is ready.</strong> We opened your email app addressed to
                <a href="mailto:${recipient}">${recipient}</a>. If it did not open automatically,
                <a href="${mailtoUrl}">click here to open the draft</a>.
            `;
            formFeedback.classList.add('visible');

            window.location.href = mailtoUrl;
        });
    }

    /* Staggered Scroll Reveal */
    const staggerContainers = document.querySelectorAll('.commitments-grid, .card-grid, .steps-preview, .timeline');
    staggerContainers.forEach((container) => {
        const items = container.querySelectorAll('.reveal');
        items.forEach((item, idx) => {
            item.style.setProperty('--reveal-delay', `${idx * 60}ms`);
        });
    });

    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0 && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const viewportH = window.innerHeight || document.documentElement.clientHeight;
        const belowFold = [];

        revealEls.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < viewportH * 0.96) {
                el.classList.add('is-visible');
            } else {
                belowFold.push(el);
            }
        });

        if (belowFold.length > 0) {
            document.documentElement.classList.add('js-reveal');
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.02 }
            );
            belowFold.forEach((el) => observer.observe(el));
        }
    }
});
