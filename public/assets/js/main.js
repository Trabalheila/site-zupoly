/* ==========================================================================
   ZUPOLY PROJETOS LTDA — main.js
   Funcionalidades centrais: menu mobile, header ao rolar, scroll suave,
   botão voltar ao topo, acordeão (FAQ), contadores e lazy loading.
   ========================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHeaderScroll();
        initSmoothScroll();
        initBackToTop();
        initAccordion();
        initCounters();
        initLazyLoading();
        initContactForm();
        initFooterYear();
    });

    /* ----------------------------------------------------------------------
       Menu mobile
       ---------------------------------------------------------------------- */
    function initMobileMenu() {
        const toggle = document.getElementById('menuToggle');
        const menu = document.getElementById('mobileMenu');
        if (!toggle || !menu) return;

        const iconOpen = toggle.querySelector('.icon-open');
        const iconClose = toggle.querySelector('.icon-close');

        function setState(open) {
            menu.classList.toggle('hidden', !open);
            iconOpen?.classList.toggle('hidden', open);
            iconClose?.classList.toggle('hidden', !open);
            toggle.setAttribute('aria-expanded', String(open));
        }

        toggle.addEventListener('click', function () {
            setState(menu.classList.contains('hidden'));
        });

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', () => setState(false));
        });
    }

    /* ----------------------------------------------------------------------
       Header: fundo sólido + sombra ao rolar
       ---------------------------------------------------------------------- */
    function initHeaderScroll() {
        const header = document.getElementById('siteHeader');
        if (!header) return;

        function onScroll() {
            const scrolled = window.scrollY > 20;
            header.classList.toggle('shadow-lg', scrolled);
            header.classList.toggle('bg-slate-950/95', scrolled);
            header.classList.toggle('bg-slate-950/70', !scrolled);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ----------------------------------------------------------------------
       Scroll suave para âncoras internas
       ---------------------------------------------------------------------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                const id = link.getAttribute('href');
                if (id.length <= 1) return;
                const target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, '', id);
            });
        });
    }

    /* ----------------------------------------------------------------------
       Botão "voltar ao topo"
       ---------------------------------------------------------------------- */
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            btn.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ----------------------------------------------------------------------
       Acordeão (FAQ)
       ---------------------------------------------------------------------- */
    function initAccordion() {
        const items = document.querySelectorAll('.faq-item');
        items.forEach(function (item) {
            const trigger = item.querySelector('.faq-trigger');
            const answer = item.querySelector('.faq-answer');
            if (!trigger || !answer) return;

            trigger.addEventListener('click', function () {
                const isOpen = item.classList.contains('open');

                items.forEach(function (other) {
                    if (other !== item) {
                        other.classList.remove('open');
                        const a = other.querySelector('.faq-answer');
                        if (a) a.style.maxHeight = null;
                        other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
                    }
                });

                item.classList.toggle('open', !isOpen);
                trigger.setAttribute('aria-expanded', String(!isOpen));
                answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
            });
        });
    }

    /* ----------------------------------------------------------------------
       Contadores animados
       ---------------------------------------------------------------------- */
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        if (counters.length === 0) return;

        function animate(el) {
            const target = parseFloat(el.getAttribute('data-counter')) || 0;
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1600;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
                el.textContent = Math.floor(eased * target).toLocaleString('pt-BR') + suffix;
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target.toLocaleString('pt-BR') + suffix;
                }
            }
            requestAnimationFrame(tick);
        }

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animate);
            return;
        }

        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach((c) => observer.observe(c));
    }

    /* ----------------------------------------------------------------------
       Lazy loading de imagens (data-src -> src)
       ---------------------------------------------------------------------- */
    function initLazyLoading() {
        const images = document.querySelectorAll('img.lazy[data-src]');
        if (images.length === 0) return;

        function load(img) {
            const src = img.getAttribute('data-src');
            if (!src) return;
            img.src = src;
            img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
            img.removeAttribute('data-src');
        }

        if (!('IntersectionObserver' in window)) {
            images.forEach(load);
            return;
        }

        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    load(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '200px 0px' });

        images.forEach((img) => observer.observe(img));
    }

    /* ----------------------------------------------------------------------
       Envio do formulário de contato (FormSubmit — AJAX)
       ---------------------------------------------------------------------- */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const status = document.getElementById('formStatus');
        if (!form) return;

        const endpoint = form.getAttribute('data-endpoint');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtn = submitBtn ? submitBtn.innerHTML : '';

        function showStatus(message, ok) {
            if (!status) return;
            status.textContent = message;
            status.classList.remove('hidden');
            status.classList.toggle('text-emerald-400', ok);
            status.classList.toggle('text-red-400', !ok);
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validação nativa
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            // Honeypot preenchido => provável bot, aborta silenciosamente
            if (form.querySelector('[name="_honey"]')?.value) return;
            if (!endpoint) {
                showStatus('Configuração de envio pendente. Fale conosco pelo WhatsApp.', false);
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
            }

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(form),
                });
                if (response.ok) {
                    form.reset();
                    showStatus('Mensagem enviada com sucesso! Retornaremos em breve.', true);
                } else {
                    showStatus('Não foi possível enviar agora. Tente novamente ou use o WhatsApp.', false);
                }
            } catch (err) {
                showStatus('Erro de conexão. Verifique sua internet ou fale pelo WhatsApp.', false);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtn;
                }
            }
        });
    }

    /* ----------------------------------------------------------------------
       Ano atual no rodapé
       ---------------------------------------------------------------------- */
    function initFooterYear() {
        const el = document.getElementById('currentYear');
        if (el) el.textContent = new Date().getFullYear();
    }

})();
