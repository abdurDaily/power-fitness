// Power Fitness Gym — rendering, interactions & GSAP animations (content lives in data.js)
const hasGSAP = !!(window.gsap && window.ScrollTrigger && window.ScrollSmoother && window.SplitText);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const animate = hasGSAP && !reduceMotion;

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const taka = n => '৳' + n.toLocaleString('en-IN');
const todayISO = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const header = $('#navbar');
const toTop = $('#toTop');
const mobileBar = $('#mobileBar');
const mobileMenu = $('#mobileMenu');
const mobileMenuBtn = $('#mobileMenuBtn');
let smoother = null;
let period = 'monthly';

$('#year').textContent = new Date().getFullYear();
$$('.date-min').forEach(i => { i.min = todayISO(); });

// ======================================================================
// Rendering from data.js
// ======================================================================
function renderPlans() {
    $('#planGrid').innerHTML = PLANS.map(p => `
        <article class="plan-card reveal-card${p.featured ? ' featured' : ''}">
            ${p.featured ? '<span class="plan-badge">Most popular</span>' : ''}
            <h3 class="plan-name">${esc(p.name)}</h3>
            <p class="text-white/60 text-sm mt-1">${esc(p.tagline)}</p>
            <p class="plan-price"><span class="plan-amount" data-plan="${p.id}">${taka(p.price[period])}</span><small>${PERIODS[period].suffix}</small></p>
            ${period !== 'monthly' ? `<p class="text-sm text-[#4ade80] mt-2">Save ${taka(p.price.monthly * (period === 'yearly' ? 12 : 3) - p.price[period])}</p>` : '<p class="text-sm mt-2 invisible">.</p>'}
            <ul class="plan-features">${p.features.map(f => `<li><i class="fas fa-check"></i>${esc(f)}</li>`).join('')}</ul>
            <button type="button" class="btn ${p.featured ? 'btn-primary' : 'btn-outline'} w-full" data-buy="${p.id}">Buy now</button>
        </article>`).join('');
}

function renderTrainers() {
    $('#trainerGrid').innerHTML = TRAINERS.map((t, i) => `
        <article class="trainer-card reveal-card">
            <div class="trainer-photo"><img src="${esc(t.photo)}" alt="${esc(t.name)}" style="object-position:${t.photoPosition || 'center'};transform-origin:${t.photoPosition || 'center'};--zoom:${t.photoZoom || 1}" loading="lazy"></div>
            <div class="trainer-body">
                <h3>${esc(t.name)}</h3>
                <p class="trainer-role">${esc(t.role)}${t.experience ? ` · ${esc(t.experience)}` : ''}</p>
                <p>${esc(t.bio)}</p>
                <div class="tags">${t.specialties.map(s => `<span>${esc(s)}</span>`).join('')}</div>
                <button type="button" class="btn btn-outline w-full mt-5 !py-3" data-book="${i}"><i class="fa-regular fa-calendar-check"></i> Book session</button>
            </div>
        </article>`).join('');
    $('#bkTrainer').innerHTML = '<option>Any available coach</option>' + TRAINERS.map(t => `<option>${esc(t.name)} — ${esc(t.role)}</option>`).join('');
}

const DAYS = Object.keys(SCHEDULE);
function renderSchedule(activeDay) {
    $('#dayTabs').innerHTML = DAYS.map(d => `
        <button type="button" role="tab" aria-selected="${d === activeDay}" data-day="${d}"><span>${d.slice(0, 3)}</span><small>${SCHEDULE[d].length} classes</small></button>`).join('');
    const classes = SCHEDULE[activeDay];
    $('#classList').innerHTML = classes.length ? classes.map(c => `
        <div class="class-row">
            <p class="class-time">${c.time}<small>to ${c.end}</small></p>
            <div><p class="class-name">${esc(c.name)}</p><p class="class-meta"><i class="fa-regular fa-user mr-1"></i>${esc(c.coach)}</p></div>
            <span class="level">${esc(c.level)}</span>
        </div>`).join('') : '<p class="text-center text-white/60">No classes scheduled — open gym all day.</p>';
}
// Hero card: today's classes, with the next upcoming one highlighted
function renderToday() {
    const day = DAYS[(new Date().getDay() + 1) % 7];
    const now = new Date().toTimeString().slice(0, 5);
    const classes = SCHEDULE[day];
    const next = classes.find(c => c.time > now);
    $('#todayName').textContent = day;
    $('#todayList').innerHTML = classes.length ? classes.map(c => `
        <li class="today-item${c === next ? ' is-next' : ''}${c.end <= now ? ' is-past' : ''}">
            <span class="today-time">${c.time}</span>
            <span><span class="today-name block">${esc(c.name)}</span><span class="today-coach">${esc(c.coach)} · ${esc(c.level)}</span></span>
            ${c === next ? '<span class="today-badge">Next</span>' : ''}
        </li>`).join('') : '<li class="text-white/60 text-sm">No classes today — open gym.</li>';
    // Compact version for phones
    $('#nextLabel').textContent = next ? `Next class today · ${day}` : `${day}'s classes`;
    $('#nextClass').textContent = next ? `${next.time} — ${next.name}` : (classes.length ? 'All done — see the week' : 'Open gym today');
    $('#fromPrice').innerHTML = `${taka(Math.min(...PLANS.map(p => p.price.monthly)))}<span class="text-sm text-white/50 font-normal"> / month</span>`;
}

$('#dayTabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-day]');
    if (btn) renderSchedule(btn.dataset.day);
});

function renderStories() {
    $('#testimonialTrack').innerHTML = TESTIMONIALS.map((t, i) => `
        <figure class="testimonial${i === 0 ? ' is-active' : ''}" aria-hidden="${i !== 0}">
            <div class="text-accent text-sm">${'<i class="fas fa-star"></i>'.repeat(t.rating)}</div>
            <blockquote>“${esc(t.quote)}”</blockquote>
            <figcaption class="flex items-center gap-3">
                <span class="tool-icon !w-11 !h-11 !rounded-full font-display">${esc(t.name.charAt(0))}</span>
                <span><span class="block font-display uppercase tracking-wide">${esc(t.name)}</span><span class="text-white/50 text-sm">${esc(t.since)}</span></span>
            </figcaption>
        </figure>`).join('');
    $('#testimonialDots').innerHTML = TESTIMONIALS.map((_, i) => `<button type="button" class="dot${i === 0 ? ' is-active' : ''}" data-dot="${i}" aria-label="Show review ${i + 1}"></button>`).join('');

    $('#spotlight').innerHTML = MEMBER_SPOTLIGHT.map(m => `
        <figure class="spot reveal-card"><img src="${esc(m.photo)}" alt="${esc(m.caption)}" loading="lazy"><figcaption>${esc(m.caption)}</figcaption></figure>`).join('');

    if (TRANSFORMATIONS.length) {
        $('#transformations').classList.remove('hidden');
        $('#transformGrid').innerHTML = TRANSFORMATIONS.map(t => `
            <figure>
                <div class="ba">
                    <img src="${esc(t.before)}" alt="${esc(t.name)} before">
                    <img class="ba-after" src="${esc(t.after)}" alt="${esc(t.name)} after">
                    <span class="ba-label left-3">Before</span><span class="ba-label right-3">After</span>
                    <span class="ba-handle"></span>
                    <input type="range" min="0" max="100" value="50" aria-label="Compare before and after for ${esc(t.name)}">
                </div>
                <figcaption class="mt-3"><span class="font-display uppercase">${esc(t.name)}</span> <span class="text-brand">${esc(t.result)}</span></figcaption>
            </figure>`).join('');
        $$('.ba input').forEach(r => r.addEventListener('input', () => r.parentElement.style.setProperty('--pos', r.value + '%')));
    }
}

let tIndex = 0;
let tTimer = null;
function showTestimonial(i) {
    const items = $$('.testimonial');
    tIndex = (i + items.length) % items.length;
    items.forEach((el, n) => { el.classList.toggle('is-active', n === tIndex); el.setAttribute('aria-hidden', String(n !== tIndex)); });
    $$('.dot').forEach((d, n) => d.classList.toggle('is-active', n === tIndex));
}
function startTestimonials() {
    clearInterval(tTimer);
    if (!reduceMotion) tTimer = setInterval(() => showTestimonial(tIndex + 1), 6000);
}
$('#tPrev').addEventListener('click', () => { showTestimonial(tIndex - 1); startTestimonials(); });
$('#tNext').addEventListener('click', () => { showTestimonial(tIndex + 1); startTestimonials(); });
$('#testimonialDots').addEventListener('click', e => { const d = e.target.closest('[data-dot]'); if (d) { showTestimonial(+d.dataset.dot); startTestimonials(); } });
$('.testimonial-wrap').addEventListener('mouseenter', () => clearInterval(tTimer));
$('.testimonial-wrap').addEventListener('mouseleave', startTestimonials);

function renderGallery(filter = 'All') {
    const cats = ['All', ...new Set(GALLERY.map(g => g.category))];
    $('#galleryFilters').innerHTML = cats.map(c => `<button type="button" class="chip${c === filter ? ' is-active' : ''}" data-filter="${esc(c)}">${esc(c)}</button>`).join('');
    const items = GALLERY.map((g, i) => ({ ...g, i })).filter(g => filter === 'All' || g.category === filter);
    $('#galleryGrid').innerHTML = items.map(g => `
        <button type="button" class="gallery-item${g.wide && filter === 'All' ? ' wide' : ''}" data-photo="${g.i}" aria-label="Open photo: ${esc(g.alt)}">
            <img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy"><span class="g-tag">${esc(g.category)}</span>
        </button>`).join('');
    if (animate) gsap.from('#galleryGrid .gallery-item', { opacity: 0, y: 30, stagger: .05, duration: .6, ease: 'power3.out' });
}
$('#galleryFilters').addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (b) { renderGallery(b.dataset.filter); smoother && ScrollTrigger.refresh(); } });
$('#galleryGrid').addEventListener('click', e => {
    const b = e.target.closest('[data-photo]');
    if (!b) return;
    const g = GALLERY[b.dataset.photo];
    $('#mediaBody').innerHTML = `<img src="${esc(g.src.replace(/w=\d+/, 'w=1800'))}" alt="${esc(g.alt)}"><p class="text-center text-white/70 mt-3 text-sm">${esc(g.alt)}</p>`;
    openModal('mediaModal');
});

function renderVideos() {
    $('#videoGrid').innerHTML = VIDEOS.map((v, i) => `
        <button type="button" class="video-card" data-video="${i}" aria-label="Play video: ${esc(v.title)}">
            <video src="${esc(v.src)}#t=1.5" muted playsinline loop preload="metadata"></video>
            <span class="play"><i class="fas fa-play"></i></span>
            <span class="v-info"><span>${esc(v.tag)}</span><h3>${esc(v.title)}</h3></span>
        </button>`).join('');
    $$('.video-card').forEach(card => {
        const v = $('video', card);
        if (finePointer && !reduceMotion) {
            card.addEventListener('mouseenter', () => v.play().catch(() => {}));
            card.addEventListener('mouseleave', () => v.pause());
        }
        card.addEventListener('click', () => {
            const item = VIDEOS[card.dataset.video];
            $('#mediaBody').innerHTML = `<video src="${esc(item.src)}" controls autoplay playsinline></video><p class="text-center text-white/70 mt-3 text-sm">${esc(item.title)}</p>`;
            openModal('mediaModal');
        });
    });
}
$$('[data-gtab]').forEach(tab => tab.addEventListener('click', () => {
    $$('[data-gtab]').forEach(t => t.classList.toggle('is-active', t === tab));
    $('#photoPanel').classList.toggle('hidden', tab.dataset.gtab !== 'photos');
    $('#videoPanel').classList.toggle('hidden', tab.dataset.gtab !== 'videos');
    if (smoother) ScrollTrigger.refresh();
}));

function renderBlog() {
    const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    $('#blogGrid').innerHTML = POSTS.map(p => `
        <button type="button" class="blog-card reveal-card" data-post="${p.id}">
            <div class="b-img"><img src="${esc(p.image)}" alt="" loading="lazy"></div>
            <div class="b-body">
                <p class="b-meta"><span>${esc(p.category)}</span><span>${fmt(p.date)}</span><span>${esc(p.read)} read</span></p>
                <h3>${esc(p.title)}</h3>
                <p>${esc(p.excerpt)}</p>
                <span class="b-more">Read article <i class="fas fa-arrow-right"></i></span>
            </div>
        </button>`).join('');
    $('#blogGrid').addEventListener('click', e => {
        const card = e.target.closest('[data-post]');
        if (!card) return;
        const p = POSTS.find(x => x.id === card.dataset.post);
        $('#articleBody').innerHTML = `
            <img src="${esc(p.image.replace(/w=\d+/, 'w=1600'))}" alt="" class="w-full aspect-[16/7] object-cover">
            <article class="article p-7 sm:p-10">
                <p class="text-brand text-sm font-medium mb-3">${esc(p.category)} · ${fmt(p.date)} · ${esc(p.read)} read</p>
                <h2 id="articleTitle">${esc(p.title)}</h2>
                ${p.body.map(([tag, text]) => tag === 'h' ? `<h3>${esc(text)}</h3>` : `<p>${esc(text)}</p>`).join('')}
                <div class="mt-10 p-6 rounded-2xl bg-ink border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p class="font-display uppercase text-xl">Want a coach to guide you?</p>
                    <button type="button" class="btn btn-primary" data-open="trialModal">Book free trial</button>
                </div>
            </article>`;
        openModal('articleModal');
    });
}

function renderStats() {
    const counts = {
        programs: $$('.program-card').length,
        trainers: TRAINERS.length,
        classes: DAYS.reduce((n, d) => n + SCHEDULE[d].length, 0)
    };
    $$('[data-count]').forEach(el => {
        const key = el.dataset.count;
        el.dataset.target = counts[key] ?? key;
        el.textContent = el.dataset.target;
    });
}

// Program cards lead to the contact form with the program pre-selected
$$('.program-card').forEach(card => {
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', `Enquire about ${card.dataset.program}`);
    $('.program-body', card).insertAdjacentHTML('beforeend', '<span class="more">Enquire <i class="fas fa-arrow-right"></i></span>');
    const go = () => { $('#interest').value = card.dataset.program; scrollToTarget($('#contact')); setTimeout(() => $('#contactForm [name="name"]').focus({ preventScroll: true }), 1200); };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
});

renderPlans();
renderTrainers();
renderSchedule(DAYS[(new Date().getDay() + 1) % 7]); // JS week starts Sunday; ours starts Saturday
renderToday();
renderStories();
renderGallery();
renderVideos();
renderBlog();
renderStats();
startTestimonials();

// Billing period toggle
$$('[data-period]').forEach(btn => btn.addEventListener('click', () => {
    period = btn.dataset.period;
    $$('[data-period]').forEach(b => b.setAttribute('aria-selected', String(b === btn)));
    renderPlans();
}));

// ======================================================================
// Dialogs
// ======================================================================
function openModal(id) {
    const dlg = document.getElementById(id);
    $$('dialog[open]').forEach(d => { if (d !== dlg) d.close(); });
    setMenu(false);
    if (!dlg.open) dlg.showModal();
    if (smoother) smoother.paused(true);
}
$$('dialog').forEach(dlg => {
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
    dlg.addEventListener('close', () => {
        $$('video', dlg).forEach(v => v.pause());
        if (dlg.id === 'mediaModal') $('#mediaBody').innerHTML = '';
        if (smoother && !$('dialog[open]')) smoother.paused(false);
    });
});
document.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); openModal(opener.dataset.open); }
});

// Checkout
$('#coPlan').innerHTML = PLANS.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('');
$('#coPeriod').innerHTML = Object.entries(PERIODS).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');
function updateTotal() {
    const plan = PLANS.find(p => p.id === $('#coPlan').value);
    $('#coTotal').textContent = taka(plan.price[$('#coPeriod').value]);
}
$('#coPlan').addEventListener('change', updateTotal);
$('#coPeriod').addEventListener('change', updateTotal);
$('#planGrid').addEventListener('click', e => {
    const btn = e.target.closest('[data-buy]');
    if (!btn) return;
    $('#coPlan').value = btn.dataset.buy;
    $('#coPeriod').value = period;
    $('#coStart').min = todayISO();
    $('#coStart').value = todayISO();
    prefill($('#checkoutForm'));
    updateTotal();
    openModal('checkoutModal');
});

// Trainer booking
$('#trainerGrid').addEventListener('click', e => {
    const btn = e.target.closest('[data-book]');
    if (!btn) return;
    $('#bkTrainer').selectedIndex = +btn.dataset.book + 1;
    prefill($('#bookingForm'));
    openModal('bookingModal');
});

// ======================================================================
// Member area (front-end only)
// Accounts are kept in this browser so the flow can be demoed. Connect
// register/login to a real backend before launch — no password is stored here.
// ======================================================================
const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* storage unavailable */ } }
};
const currentUser = () => (store.get('pf-session') ? store.get('pf-member') : null);

function refreshAuthUI() {
    const user = currentUser();
    $$('.auth-label').forEach(l => { l.textContent = user ? user.name.split(' ')[0] : 'Login'; });
    $('#authForms').classList.toggle('hidden', !!user);
    $('#authAccount').classList.toggle('hidden', !user);
    if (user) { $('#accountName').textContent = user.name.split(' ')[0]; $('#accountEmail').textContent = user.email; }
}
function prefill(form) {
    const user = currentUser();
    if (!user) return;
    ['name', 'phone', 'email'].forEach(k => { const f = form.elements[k]; if (f && !f.value) f.value = user[k] || ''; });
}
function setAuthTab(tab) {
    $$('[data-auth-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.authTab === tab)));
    $('#loginForm').classList.toggle('hidden', tab !== 'login');
    $('#registerForm').classList.toggle('hidden', tab !== 'register');
}
$$('[data-auth-tab]').forEach(b => b.addEventListener('click', () => setAuthTab(b.dataset.authTab)));
$$('.auth-open').forEach(b => b.addEventListener('click', () => { setAuthTab(b.dataset.auth || 'login'); refreshAuthUI(); openModal('authModal'); }));

function showFormError(form, msg) {
    const box = $('.form-error', form);
    box.textContent = msg;
    box.classList.toggle('hidden', !msg);
}
$('#registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return showFormError(form, 'Please fill in every field (password: 6+ characters) and accept the rules.');
    const d = Object.fromEntries(new FormData(form));
    store.set('pf-member', { name: d.name.trim(), email: d.email.trim().toLowerCase(), phone: d.phone.trim() });
    store.set('pf-session', true);
    form.reset();
    showFormError(form, '');
    refreshAuthUI();
    sendLead('New member registration', { name: d.name, phone: d.phone, email: d.email }, { silent: true });
});
$('#loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return showFormError(form, 'Enter your email and password.');
    const member = store.get('pf-member');
    if (!member || member.email !== form.elements.email.value.trim().toLowerCase()) {
        return showFormError(form, 'No account found with that email. Please register first.');
    }
    store.set('pf-session', true);
    form.reset();
    showFormError(form, '');
    refreshAuthUI();
});
$('#logoutBtn').addEventListener('click', () => { store.del('pf-session'); refreshAuthUI(); });
refreshAuthUI();

// ======================================================================
// Forms → form endpoint (if configured) or WhatsApp
// ======================================================================
function validate(form) {
    let ok = true;
    $$('input, select, textarea', form).forEach(f => {
        const bad = !f.checkValidity();
        f.classList.toggle('is-invalid', bad && f.type !== 'checkbox');
        if (bad && ok) { f.focus(); ok = false; }
    });
    return ok;
}

const SUCCESS = {
    'Free trial request': 'Your free trial request is ready. We will call you to confirm the time.',
    'Membership purchase': 'Your order has been placed. Our team will send payment instructions and activate your membership.',
    'Personal training booking': 'Your session request has been sent. We will confirm with your coach shortly.',
    'Contact enquiry': 'Thanks for reaching out — we usually reply within a few hours.',
    'Newsletter subscription': 'You are on the list! Watch your inbox for tips and offers.'
};

async function sendLead(type, data, { silent = false } = {}) {
    const payload = { type, ...data, page: location.href, sentAt: new Date().toISOString() };
    if (SITE.formEndpoint) {
        try {
            const res = await fetch(SITE.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
            if (res.ok) return true;
        } catch { /* fall through to WhatsApp */ }
    }
    if (silent) return false;
    if (type === 'Newsletter subscription') {
        location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Newsletter subscription')}&body=${encodeURIComponent('Please add ' + data.email + ' to the Power Fitness newsletter.')}`;
        return true;
    }
    const lines = Object.entries(data).filter(([, v]) => String(v).trim()).map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`);
    const text = `*${type}* — Power Fitness Gym website\n\n${lines.join('\n')}`;
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    return true;
}

$$('.lead-form').forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate(form)) return;
    const type = form.dataset.type;
    const data = Object.fromEntries(new FormData(form));
    if (form.id === 'checkoutForm') {
        const plan = PLANS.find(p => p.id === data.plan);
        data.plan = `${plan.name} (${PERIODS[data.period].label})`;
        data.total = taka(plan.price[data.period]);
        delete data.period;
    }
    await sendLead(type, data);
    form.reset();
    $$('.is-invalid', form).forEach(f => f.classList.remove('is-invalid'));
    $('#successText').textContent = SUCCESS[type];
    openModal('successModal');
}));
$$('.field').forEach(f => f.addEventListener('input', () => f.classList.remove('is-invalid')));

// ======================================================================
// Calculators
// ======================================================================
const BMI_RANGES = [
    { max: 18.5, label: 'Underweight', color: '#60a5fa' },
    { max: 25, label: 'Healthy', color: '#4ade80' },
    { max: 30, label: 'Overweight', color: '#fbbf24' },
    { max: Infinity, label: 'Obese', color: '#f87171' }
];
function countTo(el, value, decimals = 0) {
    if (!animate) { el.textContent = value.toFixed(decimals); return; }
    const o = { v: parseFloat(el.textContent) || 0 };
    gsap.to(o, { v: value, duration: 1.2, ease: 'power3.out', onUpdate: () => { el.textContent = o.v.toFixed(decimals); } });
}
$('#bmiForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(e.currentTarget)) return;
    const h = +$('#bmiHeight').value, w = +$('#bmiWeight').value;
    const bmi = w / (h / 100) ** 2;
    const r = BMI_RANGES.find(x => bmi < x.max);
    countTo($('#bmiValue'), bmi, 1);
    Object.assign($('#bmiLabel').style, { color: r.color });
    $('#bmiLabel').textContent = r.label;
    Object.assign($('#bmiMarker').style, { left: Math.min(Math.max((bmi - 15) / 25, 0), 1) * 100 + '%', opacity: 1 });
});
$('#calForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(e.currentTarget)) return;
    const male = $('#calSex').value === 'male';
    const age = +$('#calAge').value, h = +$('#calHeight').value, w = +$('#calWeight').value;
    const bmr = 10 * w + 6.25 * h - 5 * age + (male ? 5 : -161);          // Mifflin-St Jeor
    const kcal = Math.round(bmr * +$('#calActivity').value + +$('#calGoal').value);
    const protein = Math.round(w * 1.8);
    const fat = Math.round(kcal * 0.25 / 9);
    const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
    countTo($('#calValue'), kcal);
    $('#macroP').textContent = protein + 'g';
    $('#macroC').textContent = carbs + 'g';
    $('#macroF').textContent = fat + 'g';
});

// ======================================================================
// Navigation
// ======================================================================
function scrollToTarget(target) {
    if (smoother) smoother.scrollTo(target, true, 'top 70px');
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: reduceMotion ? 'auto' : 'smooth' });
}
document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = a.getAttribute('href') === '#' ? null : $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    a.closest('dialog')?.close();
    scrollToTarget(target);
});

function setMenu(open) {
    if (open === !mobileMenu.classList.contains('hidden')) return;
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
    mobileMenuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (smoother) smoother.paused(open);
    const [l1, l2] = $$('.burger-line');
    if (open) {
        mobileMenu.classList.replace('hidden', 'flex');
        if (animate) {
            gsap.to(l1, { rotation: 45, y: 4, duration: .3 });
            gsap.to(l2, { rotation: -45, y: -4, duration: .3 });
            gsap.fromTo($$('.menu-item', mobileMenu), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: .03, duration: .5, ease: 'power3.out' });
        }
    } else {
        mobileMenu.classList.replace('flex', 'hidden');
        if (animate) gsap.to([l1, l2], { rotation: 0, y: 0, duration: .3 });
    }
}
mobileMenuBtn.addEventListener('click', () => setMenu(mobileMenu.classList.contains('hidden')));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

function updateChrome(y) {
    header.classList.toggle('bg-ink/90', y > 40);
    header.classList.toggle('backdrop-blur-md', y > 40);
    header.classList.toggle('shadow-lg', y > 40);
    const show = y > 600;
    toTop.classList.toggle('opacity-0', !show);
    toTop.classList.toggle('pointer-events-none', !show);
    mobileBar.classList.toggle('translate-y-full', y < window.innerHeight * .6);
}

// Highlight the nav link of the section in view; sections without a link clear the highlight
const navObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
        if (en.isIntersecting) $$('.nav-link').forEach(l => l.classList.toggle('is-active', l.dataset.nav === en.target.id));
    });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main > section').forEach(s => navObserver.observe(s));

// ======================================================================
// Animations
// ======================================================================
if (reduceMotion) $('.hero-video')?.pause();

if (!animate) {
    $('.preloader')?.remove();
    window.addEventListener('scroll', () => updateChrome(window.scrollY), { passive: true });
    updateChrome(window.scrollY);
} else {
    initAnimations();
}

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
    gsap.defaults({ ease: 'power3.out' });

    smoother = ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.1, smoothTouch: 0.1 });
    smoother.paused(true);
    gsap.set(['.hero-fade', header], { opacity: 0 });
    gsap.set('.hero-word', { yPercent: 110 });
    gsap.set('.hero-card', { x: 60, opacity: 0 });

    // ---------- Preloader: real progress from the page's images + fonts ----------
    const counter = { v: 0 };
    const countEl = $('.pre-count');
    const bar = $('.pre-line');
    const draw = () => { countEl.textContent = Math.round(counter.v); gsap.set(bar, { scaleX: counter.v / 100 }); };

    const intro = gsap.timeline()
        .from('.pre-logo', { scale: .3, opacity: 0, rotation: -180, duration: 1.1, ease: 'back.out(1.6)' })
        .from('.pre-word', { yPercent: 110, duration: .8 }, '-=.4')
        .from('.pre-tag', { opacity: 0, y: 10, duration: .6 }, '-=.4');
    gsap.to('.pre-glow', { scale: 1.25, opacity: .6, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    const assets = $$('img').filter(i => i.loading !== 'lazy');
    const total = assets.length + 1;                                   // +1 for web fonts
    let done = assets.filter(i => i.complete).length;
    const showProgress = () => gsap.to(counter, { v: Math.min(95, done / total * 95), duration: .6, onUpdate: draw, overwrite: true });
    const bump = () => { done++; showProgress(); };
    assets.filter(i => !i.complete).forEach(i => { i.addEventListener('load', bump, { once: true }); i.addEventListener('error', bump, { once: true }); });
    document.fonts.ready.then(bump);
    showProgress();                                                    // reflect images already cached

    const loaded = new Promise(res => (document.readyState === 'complete' ? res() : window.addEventListener('load', res, { once: true })));
    const capped = Promise.race([loaded, new Promise(res => setTimeout(res, 4000))]);   // never block longer than 4s
    const minTime = new Promise(res => setTimeout(res, 1800));

    Promise.all([capped, document.fonts.ready, minTime, intro.then()]).then(() => {
        buildScrollAnimations();
        gsap.timeline()
            .to(counter, { v: 100, duration: .5, ease: 'power1.inOut', onUpdate: draw, overwrite: true })
            .to(['.pre-logo', '.pre-word', '.pre-tag', '.pre-count'], { y: -30, opacity: 0, stagger: .05, duration: .5, ease: 'power2.in' }, '+=.15')
            .to('.preloader', { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut' }, '-=.2')
            .add(() => { $('.preloader').remove(); smoother.paused(false); })
            .add(heroIntro(), '-=.55');
    });
}

function heroIntro() {
    return gsap.timeline()
        .from('.glow', { scale: .4, opacity: 0, duration: 1.6, stagger: .2, ease: 'power2.out' })
        .to('.hero-word', { yPercent: 0, stagger: .12, duration: 1.1, ease: 'expo.out' }, 0)
        .to('.hero-fade', { opacity: 1, y: 0, stagger: .1, duration: .9 }, .5)
        .to('.hero-card', { x: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, .6)
        .from('.today-item', { x: 30, opacity: 0, stagger: .08, duration: .6 }, 1)
        .from('.hero-band', { yPercent: 100, duration: .9, ease: 'expo.out' }, .7)
        .to(header, { opacity: 1, duration: .6 }, .6);
}

function padMasks(split) {
    split.masks?.forEach(m => { m.style.paddingBottom = '.1em'; m.style.marginBottom = '-.1em'; });
}

function buildScrollAnimations() {
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => updateChrome(self.scroll()) });
    updateChrome(0);

    // Hero background: drifting glows, sliding outline text, benefit band
    gsap.to('.glow-1', { x: '8vw', y: '6vh', duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.glow-2', { x: '-6vw', y: '-8vh', duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.hero-outline', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    gsap.to('.band-track', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
    gsap.to('.hero-outline-wrap', { yPercent: -80, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-slash', { xPercent: 20, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true } });
    $$('[data-split]').forEach(el => SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: self => { padMasks(self); return gsap.from(self.lines, { yPercent: 110, stagger: .1, duration: 1, scrollTrigger: { trigger: el, start: 'top 88%' } }); }
    }));
    $$('.section-head .lead, [data-fade]').forEach(el => gsap.from(el, { y: 30, opacity: 0, duration: 1, scrollTrigger: { trigger: el, start: 'top 90%' } }));
    ScrollTrigger.batch('.reveal-card', {
        start: 'top 90%',
        onEnter: batch => gsap.fromTo(batch, { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .9, overwrite: true })
    });
    gsap.set('.reveal-card', { opacity: 0 });

    $$('.img-reveal').forEach(w => gsap.fromTo(w, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: w, start: 'top 85%' } }));
    $$('[data-parallax]').forEach(img => gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // Count-up stats
    $$('.stat-num').forEach(el => {
        const o = { v: 0 };
        gsap.to(o, { v: +el.dataset.target, duration: 1.6, ease: 'power2.out', snap: { v: 1 }, onUpdate: () => { el.textContent = o.v; }, scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    // Period toggle re-renders plans: animate the new prices
    $$('[data-period]').forEach(b => b.addEventListener('click', () => gsap.from('.plan-amount', { y: -12, opacity: 0, duration: .4, stagger: .05 })));
    $('#dayTabs').addEventListener('click', () => gsap.from('#classList .class-row', { x: -20, opacity: 0, stagger: .06, duration: .4 }));
    $$('.faq').forEach(d => d.addEventListener('toggle', () => ScrollTrigger.refresh()));

    if (finePointer) {
        $$('.magnetic').forEach(el => {
            const xTo = gsap.quickTo(el, 'x', { duration: .5 }), yTo = gsap.quickTo(el, 'y', { duration: .5 });
            el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
            el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
        });
    }
    ScrollTrigger.refresh();
}
