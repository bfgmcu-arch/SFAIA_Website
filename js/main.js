document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Form Submission
    const meetingForm = document.getElementById('meeting-form');
    if (meetingForm) {
        meetingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const business = document.getElementById('business').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const toEmail = "studentsforaiaccessability@outlook.com";
            const subject = encodeURIComponent(`Meeting Request: ${business}`);
            const body = encodeURIComponent(
                `Name: ${name}\n` +
                `Business Name: ${business}\n` +
                `Email: ${email}\n\n` +
                `Message:\n${message}`
            );

            const mailtoLink = `mailto:${toEmail}?cc=${encodeURIComponent(email)}&subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
        });
    }

    // Scroll Reveal Animation via IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
