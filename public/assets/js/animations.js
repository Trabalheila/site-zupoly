/* ==========================================================================
   ZUPOLY PROJETOS LTDA — animations.js
   Scroll reveal via IntersectionObserver (animações de entrada) e parallax
   leve do hero. Mantido separado para modularidade.
   ========================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initScrollReveal();
        initHeroParallax();
    });

    /* ----------------------------------------------------------------------
       Scroll Reveal
       ---------------------------------------------------------------------- */
    function initScrollReveal() {
        const els = document.querySelectorAll('[data-reveal]');
        if (els.length === 0) return;

        if (!('IntersectionObserver' in window)) {
            els.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        els.forEach((el) => observer.observe(el));
    }

    /* ----------------------------------------------------------------------
       Parallax leve do conteúdo do hero (desktop apenas)
       O background já usa background-attachment: fixed (CSS); aqui aplicamos
       um deslocamento sutil ao conteúdo para dar profundidade.
       ---------------------------------------------------------------------- */
    function initHeroParallax() {
        const layer = document.querySelector('[data-parallax]');
        if (!layer) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
        if (reduce || !isDesktop) return;

        let ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                const offset = Math.min(window.scrollY * 0.15, 120);
                layer.style.transform = 'translateY(' + offset + 'px)';
                ticking = false;
            });
        }, { passive: true });
    }

})();
