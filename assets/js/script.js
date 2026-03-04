document.addEventListener("DOMContentLoaded", function() {

    // Гамбургер меню
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

    // Появление при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-section, .stagger-item').forEach(el => observer.observe(el));

    // Умные модалки (Видео загружается при клике)
    window.openCase = function(id) {
        const modal = document.getElementById('case-' + id);
        if(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
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
            document.body.style.overflow = 'auto';
            const iframe = modal.querySelector('iframe');
            if (iframe) iframe.src = ''; // Убиваем видео при закрытии
        }
    }

    // Плавный скролл к якорям
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
