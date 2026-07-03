/* ==========================================================================
   ZUPOLY PROJETOS LTDA — gallery.js
   Galeria do portfólio: filtros por categoria + lightbox com zoom suave.
   Preparado para receber imagens futuras (usa data-full para a versão grande).
   ========================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initFilters();
        initLightbox();
    });

    /* ----------------------------------------------------------------------
       Filtros por categoria
       ---------------------------------------------------------------------- */
    function initFilters() {
        const buttons = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.gallery-item');
        if (buttons.length === 0 || items.length === 0) return;

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const filter = btn.getAttribute('data-filter');

                buttons.forEach((b) => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                items.forEach(function (item) {
                    const category = item.getAttribute('data-category') || '';
                    const show = filter === 'all' || category === filter;
                    item.classList.toggle('hide', !show);
                });
            });
        });
    }

    /* ----------------------------------------------------------------------
       Lightbox
       ---------------------------------------------------------------------- */
    function initLightbox() {
        const triggers = document.querySelectorAll('[data-lightbox]');
        const lightbox = document.getElementById('lightbox');
        if (!lightbox || triggers.length === 0) return;

        const imgEl = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('[data-lightbox-close]');
        let lastFocused = null;

        function open(src, alt) {
            if (!src) return; // Sem imagem ainda (placeholder) — não abre
            lastFocused = document.activeElement;
            imgEl.src = src;
            imgEl.alt = alt || 'Imagem do portfólio ZUPOLY';
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
            closeBtn?.focus();
        }

        function close() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            imgEl.removeAttribute('src');
            lastFocused?.focus();
        }

        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function () {
                open(trigger.getAttribute('data-full'), trigger.getAttribute('data-alt'));
            });
        });

        closeBtn?.addEventListener('click', close);
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
        });
    }

})();
