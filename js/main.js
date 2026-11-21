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

    /* Direct Notification Forms (No email client needed) */
    const attachNotificationForm = ({ formId, feedbackId, submitBtnId, buildPayload, successHtml }) => {
        const form = document.getElementById(formId);
        const feedback = document.getElementById(feedbackId);
        const submitBtn = document.getElementById(submitBtnId);

        if (!form || !feedback) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const originalBtnText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            feedback.classList.remove('visible', 'error');

            try {
                const response = await fetch('https://formsubmit.co/ajax/studentsforaiaccessability@outlook.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(buildPayload()),
                });

                if (!response.ok) {
                    throw new Error('Submission failed');
                }

                form.reset();
                feedback.innerHTML = successHtml;
                feedback.classList.add('visible');
            } catch {
                feedback.innerHTML = 'We could not send your request right now. Please try again in a moment, or reach us directly at <a href="mailto:studentsforaiaccessability@outlook.com">studentsforaiaccessability@outlook.com</a>.';
                feedback.classList.add('visible', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    };

    attachNotificationForm({
        formId: 'contact-request-form',
        feedbackId: 'form-feedback',
        submitBtnId: 'contact-submit-btn',
        buildPayload: () => {
            const name = document.getElementById('contact-name')?.value.trim() || '';
            const business = document.getElementById('contact-business')?.value.trim() || '';
            const contactInfo = document.getElementById('contact-email')?.value.trim() || '';
            const service = document.getElementById('contact-topic')?.value || 'AI Budgeting Tool (Full Setup)';
            const message = document.getElementById('contact-message')?.value.trim() || '';
            return {
                _subject: `Setup Request: ${service}${business ? ` (${business})` : ''}`,
                _template: 'table',
                _captcha: 'false',
                Name: name,
                Business: business || 'Not specified',
                'Contact Info': contactInfo,
                'Requested Service': service,
                Note: message || 'Interested in scheduling a free setup.',
            };
        },
        successHtml: '<strong>Setup request received!</strong> Our team has been notified and will reach out soon to schedule your visit.',
    });

    attachNotificationForm({
        formId: 'volunteer-request-form',
        feedbackId: 'volunteer-feedback',
        submitBtnId: 'volunteer-submit-btn',
        buildPayload: () => {
            const name = document.getElementById('volunteer-name')?.value.trim() || '';
            const background = document.getElementById('volunteer-background')?.value.trim() || '';
            const contactInfo = document.getElementById('volunteer-contact')?.value.trim() || '';
            const role = document.getElementById('volunteer-role')?.value || 'General Volunteering';
            const message = document.getElementById('volunteer-message')?.value.trim() || '';
            return {
                _subject: `Volunteer Interest: ${role} (${name || 'New Volunteer'})`,
                _template: 'table',
                _captcha: 'false',
                Name: name,
                'School / Background': background || 'Not specified',
                'Contact Info': contactInfo,
                'Area of Interest': role,
                Note: message || 'Interested in volunteering.',
            };
        },
        successHtml: '<strong>Thanks for offering to help!</strong> Our team has been notified and will follow up with you soon.',
    });

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
