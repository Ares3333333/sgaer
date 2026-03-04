document.addEventListener("DOMContentLoaded", function() {

    // КУРСОР ДЛЯ ПК
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

    // БУРГЕР МЕНЮ
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

    // КНОПКА "РАЗВЕРНУТЬ ПОРТФОЛИО"
    const showMoreBtn = document.getElementById('show-more-btn');
    if(showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            document.querySelectorAll('.hidden-case').forEach(el => {
                el.style.display = 'block';
                setTimeout(() => el.classList.add('is-visible'), 50);
            });
            this.style.display = 'none';
        });
    }

    // АНИМАЦИЯ ПРИ СКРОЛЛЕ
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in-section, .stagger-item').forEach(el => observer.observe(el));

    // СЧЕТЧИКИ
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

    // УМНЫЕ МОДАЛКИ (ВИДЕО ПОДГРУЖАЕТСЯ ТОЛЬКО ПО КЛИКУ!)
    window.openCase = function(id) {
        const modal = document.getElementById('case-' + id);
        if(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Убираем скролл страницы
            
            // Находим iframe и вставляем ссылку из data-src
            const iframe = modal.querySelector('iframe');
            if (iframe && iframe.getAttribute('data-src')) {
                iframe.src = iframe.getAttribute('data-src');
            }
        }
    }

    window.closeCase = function(id) {
        const modal = document.getElementById('case-' + id);
        if(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Возвращаем скролл
            
            // Убиваем видео, чтобы очистить память
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                iframe.src = '';
            }
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

    // ПЛАВНЫЙ СКРОЛЛ К ЯКОРЯМ (ЗАКРЫВАЯ МОДАЛКУ ЕСЛИ ОНА ОТКРЫТА)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                
                // Закрываем все модалки перед скроллом
                document.querySelectorAll('.modal.active').forEach(modal => {
                    const id = modal.id.split('-')[1];
                    if(id) window.closeCase(id);
                });

                const target = document.querySelector(href);
                if (target) {
                    // Небольшая задержка, чтобы модалка успела закрыться
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        });
    });
});
