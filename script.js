// ==========================================
// Site config: window.SITE_CONFIG задаётся в index.html перед подключением этого файла
// ==========================================
const SITE_DEFAULTS = {
    brandName: 'AlgoForge',
    telegramUsername: 'your_username',
    email: 'your@email.com',
    githubUrl: '',
};

function getSiteConfig() {
    const raw = typeof window.SITE_CONFIG === 'object' && window.SITE_CONFIG != null ? window.SITE_CONFIG : {};
    const merged = { ...SITE_DEFAULTS };
    for (const key of Object.keys(raw)) {
        const v = raw[key];
        if (v !== undefined) merged[key] = v;
    }
    return merged;
}

function normalizeTelegramUser(raw) {
    if (raw == null || raw === '') return '';
    return String(raw).trim().replace(/^@+/, '');
}

function applySiteConfig() {
    const c = getSiteConfig();
    const tg = normalizeTelegramUser(c.telegramUsername);
    const mail = (c.email || '').trim();
    const tgUrl = tg ? 'https://t.me/' + tg : '#';

    document.title = c.brandName + ' — Алгоритмы. Боты. Софт. Сайты.';

    document.querySelectorAll('[data-site-email]').forEach((el) => { el.textContent = mail || ''; });
    document.querySelectorAll('[data-site-email-footer]').forEach((el) => { el.textContent = mail || ''; });
    document.querySelectorAll('[data-site-email-link]').forEach((el) => {
        el.href = mail ? 'mailto:' + mail : '#';
        if (!mail) el.setAttribute('aria-disabled', 'true');
    });
    document.querySelectorAll('[data-site-email-link-footer]').forEach((el) => {
        el.href = mail ? 'mailto:' + mail : '#';
    });

    document.querySelectorAll('[data-site-email-row]').forEach((el) => {
        if (!mail) {
            el.classList.add('hidden');
            el.setAttribute('aria-hidden', 'true');
        } else {
            el.classList.remove('hidden');
            el.removeAttribute('aria-hidden');
        }
    });

    const tgLabel = tg ? 'Telegram: @' + tg : 'Telegram';
    document.querySelectorAll('[data-site-telegram-label]').forEach((el) => { el.textContent = tgLabel; });
    document.querySelectorAll('[data-site-telegram-footer]').forEach((el) => { el.textContent = tg ? '@' + tg : 'Telegram'; });
    document.querySelectorAll('[data-site-telegram-link], [data-site-telegram-link-footer], [data-site-social-telegram]').forEach((el) => {
        el.href = tgUrl;
    });

    const gh = (c.githubUrl || '').trim();
    const ghLine = document.querySelector('[data-site-github-line]');
    const ghFooterA = document.querySelector('[data-site-github-link-footer]');
    const ghSocial = document.querySelector('[data-site-social-github]');
    if (ghLine && ghFooterA) {
        if (!gh) {
            ghLine.hidden = true;
            if (ghSocial) ghSocial.style.display = 'none';
        } else {
            ghLine.hidden = false;
            ghFooterA.href = gh;
            ghFooterA.textContent = gh.replace(/^https?:\/\//i, '').replace(/\/$/, '');
            if (ghSocial) {
                ghSocial.href = gh;
                ghSocial.style.display = '';
            }
        }
    }

    const y = document.querySelector('[data-site-year]');
    if (y) y.textContent = String(new Date().getFullYear());
    document.querySelectorAll('[data-site-brand-copy]').forEach((el) => { el.textContent = c.brandName; });
}

applySiteConfig();

// ==========================================
// Модальное окно (вместо alert)
// ==========================================
function showSiteModal(text) {
    const modal = document.getElementById('site-modal');
    const p = document.getElementById('site-modal-text');
    if (!modal || !p) return;
    p.textContent = text;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function hideSiteModal() {
    const modal = document.getElementById('site-modal');
    if (modal) modal.classList.remove('is-open');
    document.body.style.overflow = '';
}

(function initSiteModal() {
    const modal = document.getElementById('site-modal');
    if (!modal) return;
    const ok = document.getElementById('site-modal-ok');
    const bd = document.getElementById('site-modal-backdrop');
    if (ok) ok.addEventListener('click', hideSiteModal);
    if (bd) bd.addEventListener('click', hideSiteModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) hideSiteModal();
    });
})();

// ==========================================
// Three.js 3D Background Animation
// ==========================================
(function() {
    const canvas = document.getElementById('three-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // --- Particle System ---
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
        new THREE.Color('#00ff88'),
        new THREE.Color('#00d4ff'),
        new THREE.Color('#a855f7'),
        new THREE.Color('#ec4899'),
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Connection Lines ---
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];
    const maxDist = 12;

    function updateLines() {
        linePositions.length = 0;
        lineColors.length = 0;
        
        const pos = particleGeometry.attributes.position.array;
        const col = particleGeometry.attributes.color.array;
        
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (dist < maxDist) {
                    linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                    linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                    
                    const alpha = 1 - dist / maxDist;
                    lineColors.push(col[i * 3] * alpha, col[i * 3 + 1] * alpha, col[i * 3 + 2] * alpha);
                    lineColors.push(col[j * 3] * alpha, col[j * 3 + 1] * alpha, col[j * 3 + 2] * alpha);
                }
            }
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    }

    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Floating Geometries ---
    const torusGeo = new THREE.TorusGeometry(3, 0.08, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.15, wireframe: true });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-20, 10, -10);
    scene.add(torus);

    const icosaGeo = new THREE.IcosahedronGeometry(2.5, 0);
    const icosaMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.1, wireframe: true });
    const icosa = new THREE.Mesh(icosaGeo, icosaMat);
    icosa.position.set(20, -8, -5);
    scene.add(icosa);

    const octaGeo = new THREE.OctahedronGeometry(2, 0);
    const octaMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.12, wireframe: true });
    const octa = new THREE.Mesh(octaGeo, octaMat);
    octa.position.set(15, 15, -15);
    scene.add(octa);

    // --- Mouse tracking ---
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // --- Scroll offset ---
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
    });

    // --- Animation Loop ---
    let frameCount = 0;
    function animate() {
        requestAnimationFrame(animate);
        frameCount++;

        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Rotate particles
        particles.rotation.x = mouseY * 0.3 + frameCount * 0.0002;
        particles.rotation.y = mouseX * 0.3 + frameCount * 0.0003;

        // Move particles slightly
        const pos = particleGeometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3 + 1] += Math.sin(frameCount * 0.001 + i) * 0.005;
        }
        particleGeometry.attributes.position.needsUpdate = true;

        // Update lines periodically (performance)
        if (frameCount % 3 === 0) {
            updateLines();
            lineGeometry.attributes.position.needsUpdate = true;
            lineGeometry.attributes.color.needsUpdate = true;
        }

        lines.rotation.x = mouseY * 0.3 + frameCount * 0.0002;
        lines.rotation.y = mouseX * 0.3 + frameCount * 0.0003;

        // Floating geometries
        torus.rotation.x = frameCount * 0.003;
        torus.rotation.y = frameCount * 0.005;
        torus.position.y = 10 + Math.sin(frameCount * 0.008) * 3;

        icosa.rotation.x = frameCount * 0.004;
        icosa.rotation.z = frameCount * 0.006;
        icosa.position.y = -8 + Math.sin(frameCount * 0.006) * 2.5;

        octa.rotation.y = frameCount * 0.005;
        octa.rotation.z = frameCount * 0.003;
        octa.position.y = 15 + Math.cos(frameCount * 0.007) * 2;

        // Camera parallax
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        // Scroll-based movement
        const scrollOffset = scrollY * 0.002;
        particles.position.y = -scrollOffset * 5;
        lines.position.y = -scrollOffset * 5;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();


// ==========================================
// GSAP Scroll Animations
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Reveal animations
document.querySelectorAll('.reveal').forEach((el, i) => {
    gsap.fromTo(el, 
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            delay: i % 3 * 0.1,
        }
    );
});

// Parallax for hero
gsap.to('#hero', {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
    }
});


// ==========================================
// Navbar Scroll Effect
// ==========================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// ==========================================
// Mobile Menu Toggle
// ==========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});


// ==========================================
// Stat Counter Animation
// ==========================================
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    
    ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        onEnter: () => {
            let current = 0;
            const increment = target / 60;
            const suffix = stat.textContent.includes('%') ? '%' : '+';
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                stat.textContent = Math.floor(current) + suffix;
            }, 25);
        },
        once: true,
    });
});


// ==========================================
// Form Submission
// ==========================================
const PROJECT_TYPE_LABELS = {
    algo: 'Торговый алгоритм',
    bot: 'Торговый бот',
    api: 'API интеграция',
    desktop: 'Десктопное приложение',
    web: 'Веб-разработка',
    mobile: 'Мобильное приложение',
    other: 'Другое',
};

function resetCustomProjectTypeSelect() {
    const hidden = document.getElementById('contact-type');
    const label = document.getElementById('custom-type-label');
    const panel = document.getElementById('custom-type-panel');
    const trigger = document.getElementById('custom-type-trigger');
    if (hidden) hidden.value = '';
    if (label) {
        label.textContent = 'Тип проекта';
        label.classList.add('text-gray-400');
        label.classList.remove('text-white');
    }
    if (panel) panel.classList.add('hidden');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function initCustomProjectTypeSelect() {
    const root = document.getElementById('custom-type-root');
    const trigger = document.getElementById('custom-type-trigger');
    const panel = document.getElementById('custom-type-panel');
    const hidden = document.getElementById('contact-type');
    const label = document.getElementById('custom-type-label');
    if (!root || !trigger || !panel || !hidden || !label) return;

    function closePanel() {
        panel.classList.add('hidden');
        trigger.setAttribute('aria-expanded', 'false');
    }

    function openPanel() {
        panel.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');
    }

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel.classList.contains('hidden')) openPanel();
        else closePanel();
    });

    panel.querySelectorAll('.custom-type-opt').forEach((btn) => {
        btn.addEventListener('click', () => {
            hidden.value = btn.getAttribute('data-value') || '';
            label.textContent = btn.textContent.trim();
            label.classList.remove('text-gray-400');
            label.classList.add('text-white');
            closePanel();
        });
    });

    document.addEventListener('click', (e) => {
        if (!root.contains(e.target)) closePanel();
    });
}

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nameEl = document.getElementById('contact-name');
    const tgEl = document.getElementById('contact-telegram');
    const msgEl = document.getElementById('contact-message');
    const typeVal = document.getElementById('contact-type').value;

    if (!nameEl.checkValidity()) {
        nameEl.reportValidity();
        return;
    }
    if (!tgEl.checkValidity()) {
        tgEl.reportValidity();
        return;
    }
    if (!msgEl.checkValidity()) {
        msgEl.reportValidity();
        return;
    }
    if (!typeVal) {
        showSiteModal('Выберите тип проекта в списке.');
        return;
    }

    const clientTg = normalizeTelegramUser(tgEl.value);
    if (!clientTg || !/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(clientTg)) {
        showSiteModal('В поле Telegram укажите корректный username: латиница, 5–32 символа, как в ссылке t.me/username (можно с @ или без).');
        return;
    }

    const cfg = getSiteConfig();
    const tg = normalizeTelegramUser(cfg.telegramUsername);
    if (!tg || tg === 'your_username') {
        showSiteModal(
            'Внизу файла index.html найдите блок window.SITE_CONFIG и укажите telegramUsername — ваш логин в Telegram без символа @ (как в ссылке t.me/username).'
        );
        return;
    }

    const name = nameEl.value.trim();
    const message = msgEl.value.trim();
    const typeLabel = PROJECT_TYPE_LABELS[typeVal] || typeVal;

    const text = [
        'Заявка с сайта',
        'Имя: ' + name,
        'Telegram клиента: @' + clientTg,
        'Тип проекта: ' + typeLabel,
        '',
        message,
    ].join('\n');

    const url = 'https://t.me/' + tg + '?text=' + encodeURIComponent(text);
    if (url.length > 3500) {
        showSiteModal('Текст слишком длинный для одной ссылки Telegram. Сократите описание проекта.');
        return;
    }

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = `
        <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Открываем Telegram…
    `;
    btn.disabled = true;

    window.open(url, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
        btn.innerHTML = `
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Готово — проверьте Telegram
        `;
        btn.classList.remove('from-neon-green', 'to-accent-400');
        btn.classList.add('from-green-500', 'to-green-400');

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.classList.remove('from-green-500', 'to-green-400');
            btn.classList.add('from-neon-green', 'to-accent-400');
            this.reset();
            resetCustomProjectTypeSelect();
            lucide.createIcons();
        }, 2200);
    }, 400);
});


// ==========================================
// 3D Card Tilt Effect
// ==========================================
document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});


// ==========================================
// Initialize Lucide Icons
// ==========================================
lucide.createIcons();
initCustomProjectTypeSelect();


// ==========================================
// Smooth scroll for anchor links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});