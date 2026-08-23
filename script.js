/* ============================================================
   THE ADDRESS COMPANY — gentle interactions & lead capture
   ============================================================ */

/* ------------------------------------------------------------
   LEAD DESTINATION: Google Form "Interest Form" → linked Sheet
   The website POSTs each lead straight into this public Google Form,
   which stores responses in its connected Google Sheet.
   Field entry IDs were read from the live form's metadata.
   ------------------------------------------------------------ */
const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSeiwDBHaxy9QTyRCdfoC62inGwM2zdqhMOSyYBabRQv6Bl61A/formResponse';
const GOOGLE_FORM_FIELDS = {
    name:     'entry.2005620554',   // Name (required)
    email:    'entry.1045781291',   // Email (optional, validated by Google)
    interest: 'entry.122261008',    // What are you interested in? (dropdown)
    phone:    'entry.1166974658'    // Phone number (required)
};

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Mobile navigation ---------- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    /* ---------- Header scroll state ---------- */
    const header = document.getElementById('header');
    const onScrollHeader = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();

    /* ---------- Active nav link on scroll ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    function updateActiveLink() {
        const scrollY = window.scrollY + 140;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    /* ---------- Gentle scroll reveal (with stagger) ---------- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;

            if (el.classList.contains('reveal-group')) {
                // stagger the children softly
                Array.from(el.children).forEach((child, i) => {
                    child.style.transitionDelay = `${Math.min(i * 0.12, 0.6)}s`;
                    child.classList.add('in-view');
                });
            } else {
                el.classList.add('in-view');
            }
            revealObserver.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-group').forEach(el => revealObserver.observe(el));

    /* ---------- Animated stat counters ---------- */
    const statsEl = document.querySelector('.stats');
    let statsDone = false;

    function animateStats() {
        if (statsDone || !statsEl) return;
        const rect = statsEl.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;
        statsDone = true;

        statsEl.querySelectorAll('.stat-number').forEach(num => {
            const isDecimal = !!num.dataset.decimal;
            const target = isDecimal ? parseFloat(num.dataset.decimal) : parseInt(num.dataset.target, 10);
            const duration = 2200;
            const start = performance.now();

            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3); // gentle ease-out
                const value = target * eased;
                num.textContent = isDecimal
                    ? value.toFixed(1)
                    : Math.floor(value).toLocaleString('en-IN');
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }
    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats();

    /* ---------- Project filters ---------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                if (show) {
                    card.style.display = '';
                    card.style.animation = 'storyIn 0.7s var(--ease-gentle)';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ---------- Testimonial slider ---------- */
    const stories = document.querySelectorAll('.story-card');
    const dots = document.querySelectorAll('.dot');
    let currentStory = 0;
    let storyTimer;

    function showStory(index) {
        stories.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        stories[index].classList.add('active');
        dots[index].classList.add('active');
        currentStory = index;
    }

    function startStoryAutoplay() {
        clearInterval(storyTimer);
        storyTimer = setInterval(() => {
            showStory((currentStory + 1) % stories.length);
        }, 6000);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showStory(parseInt(dot.dataset.index, 10));
            startStoryAutoplay();
        });
    });
    startStoryAutoplay();

    /* ---------- Enquire buttons → prefill lead form ---------- */
    const contactForm = document.getElementById('contactForm');
    const messageField = document.getElementById('message');
    const nameField = document.getElementById('name');

    document.querySelectorAll('.enquire-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const project = btn.dataset.project;
            messageField.value = `Hi! I'd love to know more about ${project} — floor plans, pricing and a site visit, please.`;
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => nameField.focus({ preventScroll: true }), 900);
            showToast(`Lovely choice! Tell us a little about you and we'll share details of ${project}. 🏡`);
        });
    });

    /* ---------- Lead capture (contact form) ---------- */
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameField.value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const interest = document.getElementById('interest').value;
        const budget = document.getElementById('budgetRange').value;
        const message = messageField.value.trim();

        if (!name || !phone) {
            showToast('Please share your name and phone number so we can reach you. 💛');
            return;
        }

        if (!/^[\d\s+\-()]{10,}$/.test(phone)) {
            showToast('That phone number looks a little off — mind checking it? 📞');
            return;
        }

        // Build the lead record
        const lead = {
            name, phone, email, interest, budget, message,
            source: messageField.value.startsWith("Hi! I'd love to know more about") ? 'project-enquiry' : 'contact-form',
            capturedAt: new Date().toISOString()
        };

        // Always keep a local backup copy
        const leads = JSON.parse(localStorage.getItem('tac_leads') || '[]');
        leads.push(lead);
        localStorage.setItem('tac_leads', JSON.stringify(leads));

        // Submit to the Google Form (lands in the connected Sheet)
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        const formData = new URLSearchParams();
        formData.append(GOOGLE_FORM_FIELDS.name, name);
        formData.append(GOOGLE_FORM_FIELDS.phone, phone);
        if (email) formData.append(GOOGLE_FORM_FIELDS.email, email);
        formData.append(GOOGLE_FORM_FIELDS.interest, interest);

        // mode: 'no-cors' lets the browser POST cross-origin without a
        // preflight; Google still records the response in the sheet.
        fetch(GOOGLE_FORM_ACTION, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        })
            .then(() => {
                showToast(`Thank you, ${name.split(' ')[0]}! Your home buddy will call you within 24 hours. Put the kettle on. ☕`);
                contactForm.reset();
            })
            .catch(() => {
                showToast(`Saved your details locally, ${name.split(' ')[0]} — but the sheet didn't respond. We'll still reach out! 💛`);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
    });

    /* ---------- FAQ — one open at a time ---------- */
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('summary').addEventListener('click', () => {
            document.querySelectorAll('.faq-item[open]').forEach(other => {
                if (other !== item) other.removeAttribute('open');
            });
        });
    });

    /* ---------- Back to top ---------- */
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- Toast ---------- */
    function showToast(message) {
        const existing = document.querySelector('.notification-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('leaving');
            setTimeout(() => toast.remove(), 500);
        }, 4600);
    }
});
