/* ================================================
   ATRIK SAMANTA — PORTFOLIO JS
   Premium Interactive Cursor, Particles & Resume
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // Advanced AI Cyber-Cursor System
    // ===========================
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const cursorCanvas = document.getElementById('cursorCanvas');
    const ctx = cursorCanvas.getContext('2d');

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;
    let dotX = mouseX, dotY = mouseY;
    let isHovering = false;

    // Trail particles & shockwaves
    const trailParticles = [];
    const shockwaves = [];
    const MAX_TRAIL = 45;

    function resizeCursorCanvas() {
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
    }
    resizeCursorCanvas();
    window.addEventListener('resize', resizeCursorCanvas);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Add Gold Diamond Stardust particle
        trailParticles.push({
            x: mouseX + (Math.random() - 0.5) * 8,
            y: mouseY + (Math.random() - 0.5) * 8,
            alpha: 0.85,
            size: isHovering ? Math.random() * 5 + 3 : Math.random() * 3.5 + 2,
            hue: Math.random() > 0.3 ? 43 : 48, // royal gold (#D4AF37) or champagne gold (#F5E6AB)
            lightness: Math.random() * 25 + 65,
            life: 1,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            angle: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.15
        });

        if (trailParticles.length > MAX_TRAIL) {
            trailParticles.shift();
        }
    });

    // Hover detection with magnetic snap / targeting feel
    const hoverElements = document.querySelectorAll('a, button, .glass-card, .skill-tag, .interest-tag, .project-card, input, textarea, .nav-link, .contact-method');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            cursorDot.classList.add('hovering');
            cursorRing.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            cursorDot.classList.remove('hovering');
            cursorRing.classList.remove('hovering');
        });
    });

    // Click effect (Shockwave & Gold Starburst Burst)
    document.addEventListener('mousedown', () => {
        cursorRing.classList.add('clicking');
        
        // Spawn canvas shockwave ring
        shockwaves.push({
            x: mouseX,
            y: mouseY,
            radius: 4,
            maxRadius: 55,
            alpha: 0.8,
            color: '212, 175, 55' // Royal Gold
        });

        // Burst diamond stardust sparks
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 * i) / 16 + (Math.random() * 0.2);
            const speed = Math.random() * 4.5 + 2.5;
            trailParticles.push({
                x: mouseX,
                y: mouseY,
                alpha: 0.95,
                size: Math.random() * 4.5 + 2.5,
                hue: i % 2 === 0 ? 43 : 48,
                lightness: 82,
                life: 1,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                angle: angle,
                rotSpeed: (Math.random() - 0.5) * 0.25
            });
        }
    });

    document.addEventListener('mouseup', () => {
        cursorRing.classList.remove('clicking');
    });

    // Cursor precision animation loop
    function animateCursor() {
        // Ultra-fast smooth follow for dot (near instant precision)
        dotX += (mouseX - dotX) * 0.65;
        dotY += (mouseY - dotY) * 0.65;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        // Smooth spring tracking for reticle ring
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';

        // Render Canvas Effects (Plasma Trail & Shockwaves)
        ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

        // Draw and animate shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            sw.radius += (sw.maxRadius - sw.radius) * 0.12 + 1;
            sw.alpha -= 0.035;

            if (sw.alpha <= 0) {
                shockwaves.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${sw.color}, ${sw.alpha})`;
            ctx.lineWidth = 1.8;
            ctx.stroke();
        }

        // Draw Gold Diamond Stardust trail
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            const p = trailParticles[i];
            p.life -= 0.028;
            p.alpha = p.life * 0.8;
            p.size *= 0.96;
            p.angle += p.rotSpeed;

            if (p.vx) {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.93;
                p.vy *= 0.93;
            }

            if (p.life <= 0 || p.size < 0.3) {
                trailParticles.splice(i, 1);
                continue;
            }

            // Draw rotating sparkling gold diamond / star
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);

            // Outer diamond star glow
            ctx.shadowColor = `hsl(${p.hue}, 85%, 65%)`;
            ctx.shadowBlur = p.size * 3;

            // Draw diamond (kite shape)
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.6);
            ctx.lineTo(p.size * 0.8, 0);
            ctx.lineTo(0, p.size * 1.6);
            ctx.lineTo(-p.size * 0.8, 0);
            ctx.closePath();
            ctx.fillStyle = `hsla(${p.hue}, 90%, ${p.lightness}%, ${p.alpha})`;
            ctx.fill();

            ctx.restore();
        }

        // Connect nearby diamond stardust particles with royal golden constellation lines
        for (let i = 0; i < trailParticles.length; i++) {
            for (let j = i + 1; j < trailParticles.length; j++) {
                const dx = trailParticles[i].x - trailParticles[j].x;
                const dy = trailParticles[i].y - trailParticles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 46) {
                    ctx.beginPath();
                    ctx.moveTo(trailParticles[i].x, trailParticles[i].y);
                    ctx.lineTo(trailParticles[j].x, trailParticles[j].y);
                    const alpha = (1 - dist / 46) * 0.22 * trailParticles[i].life;
                    ctx.strokeStyle = `hsla(43, 85%, 70%, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ===========================
    // CSE / AI Neural Network & Synaptic Data Stream
    // ===========================
    const particleCanvas = document.getElementById('particleCanvas');
    const pCtx = particleCanvas.getContext('2d');

    function resizeParticleCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);

    const bgParticles = [];
    const PARTICLE_COUNT = 75;

    // Color palette — Black & Gold Royal AI (#D4AF37, #F5E6AB, #E5C158, #996515)
    const particleColors = [
        'hsla(43, 85%, 65%, ', // #D4AF37 Royal gold
        'hsla(48, 95%, 85%, ', // #F5E6AB Champagne gold
        'hsla(45, 90%, 75%, ', // #E5C158 Bright gold
        'hsla(38, 80%, 45%, ', // Deep bronze gold
        'hsla(48, 100%, 95%, ',// Bright platinum gold
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        bgParticles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            size: Math.random() * 2.8 + 0.8,
            speedX: (Math.random() - 0.5) * 0.35,
            speedY: (Math.random() - 0.5) * 0.35,
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            alpha: Math.random() * 0.4 + 0.1,
            pulseSpeed: Math.random() * 0.015 + 0.005,
            pulseOffset: Math.random() * Math.PI * 2,
            isCoreNode: Math.random() > 0.75
        });
    }

    // Synaptic Data Packets traveling between nodes
    const dataPackets = [];

    function spawnPacket(fromNode, toNode) {
        dataPackets.push({
            from: fromNode,
            to: toNode,
            progress: 0,
            speed: 0.015 + Math.random() * 0.02,
            color: 'hsla(48, 95%, 88%, '
        });
    }

    // Binary / Matrix Rain data stream
    const binaryStreams = [];
    for (let i = 0; i < 25; i++) {
        binaryStreams.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            speed: 0.5 + Math.random() * 1.2,
            chars: '01'.split(''),
            charIndex: 0,
            alpha: 0.04 + Math.random() * 0.06
        });
    }

    function animateParticles() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        const time = performance.now() * 0.001;

        // Draw Binary Data Streams
        pCtx.font = '12px JetBrains Mono, monospace';
        binaryStreams.forEach(b => {
            b.y += b.speed;
            if (b.y > particleCanvas.height + 20) b.y = -20;
            if (Math.random() < 0.05) b.charIndex = (b.charIndex + 1) % 2;
            pCtx.fillStyle = `hsla(43, 60%, 55%, ${b.alpha})`;
            pCtx.fillText(b.chars[b.charIndex], b.x, b.y);
            pCtx.fillText(b.chars[(b.charIndex + 1) % 2], b.x, b.y - 14);
        });

        // Move and draw nodes
        bgParticles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < -10) p.x = particleCanvas.width + 10;
            if (p.x > particleCanvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = particleCanvas.height + 10;
            if (p.y > particleCanvas.height + 10) p.y = -10;

            const pulse = Math.sin(time * p.pulseSpeed * 10 + p.pulseOffset) * 0.5 + 0.5;
            const alpha = p.alpha * (0.6 + pulse * 0.4);

            // Node glow
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.isCoreNode ? p.size * 4 : p.size * 2.5, 0, Math.PI * 2);
            pCtx.fillStyle = p.color + (alpha * 0.25) + ')';
            pCtx.fill();

            // Core
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            pCtx.fillStyle = p.color + alpha + ')';
            pCtx.fill();
        });

        // Draw connections and spawn synaptic packets
        for (let i = 0; i < bgParticles.length; i++) {
            for (let j = i + 1; j < bgParticles.length; j++) {
                const dx = bgParticles[i].x - bgParticles[j].x;
                const dy = bgParticles[i].y - bgParticles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 160) {
                    pCtx.beginPath();
                    pCtx.moveTo(bgParticles[i].x, bgParticles[i].y);
                    pCtx.lineTo(bgParticles[j].x, bgParticles[j].y);
                    const lineAlpha = (1 - dist / 160) * 0.14;
                    pCtx.strokeStyle = `hsla(43, 75%, 65%, ${lineAlpha})`;
                    pCtx.lineWidth = bgParticles[i].isCoreNode && bgParticles[j].isCoreNode ? 1 : 0.6;
                    pCtx.stroke();

                    // Occasionally spawn a packet along this synapse
                    if (Math.random() < 0.0008 && dataPackets.length < 20) {
                        spawnPacket(bgParticles[i], bgParticles[j]);
                    }
                }
            }
        }

        // Animate Synaptic Data Packets
        for (let i = dataPackets.length - 1; i >= 0; i--) {
            const pk = dataPackets[i];
            pk.progress += pk.speed;

            if (pk.progress >= 1) {
                dataPackets.splice(i, 1);
                continue;
            }

            const curX = pk.from.x + (pk.to.x - pk.from.x) * pk.progress;
            const curY = pk.from.y + (pk.to.y - pk.from.y) * pk.progress;

            pCtx.beginPath();
            pCtx.arc(curX, curY, 2, 0, Math.PI * 2);
            pCtx.fillStyle = pk.color + '0.95)';
            pCtx.shadowColor = '#F5E6AB';
            pCtx.shadowBlur = 8;
            pCtx.fill();
            pCtx.shadowBlur = 0;
        }

        // Interactive — particles respond to mouse (simulate AI attention focus)
        bgParticles.forEach(p => {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 220) {
                const force = (220 - dist) / 220;
                p.x -= (dx / dist) * force * 1.0;
                p.y -= (dy / dist) * force * 1.0;

                // Draw attention ray to cursor if very close
                if (dist < 120 && p.isCoreNode) {
                    pCtx.beginPath();
                    pCtx.moveTo(p.x, p.y);
                    pCtx.lineTo(mouseX, mouseY);
                    pCtx.strokeStyle = `hsla(43, 90%, 80%, ${(1 - dist / 120) * 0.3})`;
                    pCtx.lineWidth = 0.8;
                    pCtx.stroke();
                }
            }
        });

        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===========================
    // Floating Shapes — CSS-driven but with JS parallax
    // ===========================
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, i) => {
        const driftX = (Math.random() - 0.5) * 200;
        const driftY = (Math.random() - 0.5) * 200;
        shape.style.setProperty('--drift-x', driftX + 'px');
        shape.style.setProperty('--drift-y', driftY + 'px');
        shape.style.setProperty('--shape-opacity', (0.15 + Math.random() * 0.2).toString());
    });

    // ===========================
    // Resume Modal
    // ===========================
    const resumeModal = document.getElementById('resumeModal');
    const resumeOverlay = document.getElementById('resumeOverlay');
    const resumeClose = document.getElementById('resumeClose');
    const navResumeBtn = document.getElementById('navResumeBtn');
    const heroResumeBtn = document.getElementById('heroResumeBtn');

    function openResume() {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeResume() {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    navResumeBtn.addEventListener('click', openResume);
    heroResumeBtn.addEventListener('click', openResume);
    resumeClose.addEventListener('click', closeResume);
    resumeOverlay.addEventListener('click', closeResume);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
            closeResume();
        }
    });

    // ===========================
    // Typing Animation
    // ===========================
    const typedTextEl = document.getElementById('typedText');
    const phrases = [
        'AI-powered solutions',
        'Computer Vision systems',
        'NLP applications',
        'Deep Learning models',
        'intelligent software'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 35;
        } else {
            typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 75;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2200;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();

    // ===========================
    // Navbar Scroll & Active Link
    // ===========================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===========================
    // Mobile Navigation
    // ===========================
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===========================
    // Smooth Scroll
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================
    // Counter Animation
    // ===========================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.dataset.count);
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                stat.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = isDecimal ? target.toFixed(1) : target;
                    if (!isDecimal) stat.textContent += '+';
                }
            }
            requestAnimationFrame(updateCounter);
        });
        countersAnimated = true;
    }

    // ===========================
    // Intersection Observer
    // ===========================
    const fadeElements = document.querySelectorAll(
        '.glass-card, .about-text, .about-card, .timeline-item, .achievement-item, .contact-method, .contact-form, .info-item'
    );
    fadeElements.forEach(el => el.classList.add('fade-in'));

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 60);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // Counter observer
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(statsSection);
    }

    // ===========================
    // Project Cards 3D Tilt
    // ===========================
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 18;
            const rotateY = (rect.width / 2 - x) / 18;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===========================
    // Contact Form
    // ===========================
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('.btn-primary');
        const original = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent! ✨</span>';
        btn.style.background = 'linear-gradient(135deg, #697565, #ecdfcc)';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            e.target.reset();
        }, 3000);
    });

    // ===========================
    // Hero Name Gradient Animation
    // ===========================
    const heroName = document.getElementById('heroName');
    let hue = 35;

    function animateHeroGradient() {
        hue = 35 + Math.sin(performance.now() * 0.0005) * 45;
        const c1 = `hsl(${hue}, 43%, 80%)`;
        const c2 = `hsl(${(hue + 40) % 360}, 15%, 65%)`;
        const c3 = `hsl(${(hue + 70) % 360}, 10%, 55%)`;
        heroName.style.backgroundImage = `linear-gradient(135deg, ${c1}, ${c2}, ${c3})`;
        requestAnimationFrame(animateHeroGradient);
    }
    animateHeroGradient();

    // ===========================
    // Parallax Scroll for AI Glyphs
    // ===========================
    const glyphs = document.querySelectorAll('.ai-glyph');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        glyphs.forEach((glyph, i) => {
            const speed = (i + 1) * 0.025;
            const translateY = scrollY * speed;
            const translateX = Math.sin(scrollY * 0.002 + i) * 10;
            glyph.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });
    }, { passive: true });

});
