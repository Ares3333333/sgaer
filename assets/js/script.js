document.addEventListener("DOMContentLoaded", function() {

    // 1. КУРСОР ТОЛЬКО ДЛЯ ПК
    const cursor = document.querySelector('.custom-cursor');
    if (window.innerWidth > 900 && cursor) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            if(!cursor.classList.contains('active')) cursor.classList.add('active');
        });
        
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        document.querySelectorAll('a, button, .case, .journal-card, .price-card, .member, input, textarea, .close-case').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // 2. БУРГЕР МЕНЮ ДЛЯ МОБИЛКИ
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const closers = document.querySelectorAll('.nav-closer');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        closers.forEach(closer => {
            closer.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // 3. ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in-section, .stagger-item').forEach(el => observer.observe(el));

    // 4. СЧЕТЧИКИ ЦИФР
    function animateCounter(el, target) {
        let start = 0; const inc = target / 30; 
        const timer = setInterval(() => {
            start += inc;
            if (start >= target) { start = target; clearInterval(timer); }
            if (el.parentElement.classList.contains('stat-item')) el.textContent = Math.floor(start) + (target === 99 ? '%' : '+');
        }, 30);
    }
    const countObs = new IntersectionObserver((entries) => { 
        entries.forEach(e => { if(e.isIntersecting) { animateCounter(e.target, parseInt(e.target.dataset.count)); countObs.unobserve(e.target); } }); 
    });
    document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

    // 5. УМНЫЕ МОДАЛКИ (БЕРЕГУТ ПРОЦЕССОР)
    window.openCase = function(id) {
        const modal = document.getElementById('case-' + id);
        if(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Видео грузится ТОЛЬКО сейчас
            const iframe = modal.querySelector('iframe');
            if (iframe && !iframe.src) iframe.src = iframe.getAttribute('data-src');
        }
    }

    window.closeCase = function(id) {
        const modal = document.getElementById('case-' + id);
        if(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Видео удаляется из памяти ТОЛЬКО сейчас
            const iframe = modal.querySelector('iframe');
            if (iframe) iframe.src = '';
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                const id = modal.id.split('-')[1];
                if(id) window.closeCase(id);
            });
        }
    });

    // 6. ОТПРАВКА ФОРМЫ (ИМИТАЦИЯ)
    const form = document.getElementById('contactForm');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit');
            btn.textContent = 'ОТПРАВКА...';
            setTimeout(() => {
                const toast = document.getElementById('toast');
                toast.textContent = 'Заявка успешно отправлена!';
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
                form.reset();
                btn.textContent = 'ОТПРАВИТЬ ЗАЯВКУ';
            }, 1000);
        });
    }

    // 7. ПЛАВНЫЙ СКРОЛЛ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
