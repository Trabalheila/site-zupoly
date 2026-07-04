/* ==========================================================================
   ZUPOLY PROJETOS LTDA — whatsapp.js
   Centraliza o número e a mensagem padrão do WhatsApp. Monta os links
   automaticamente em todos os elementos com [data-whatsapp].
   >>> AJUSTE O NÚMERO E A MENSAGEM ABAIXO. <<<
   ========================================================================== */

(function () {
    'use strict';

    // Número no formato internacional, apenas dígitos (55 = Brasil, DDD, número).
    // ALTERAÇÃO: número real da ZUPOLY — (71) 99923-1020.
    const WHATSAPP_NUMBER = '5571999231020';

    // Mensagem inicial pré-preenchida.
    const DEFAULT_MESSAGE = 'Olá! Gostaria de solicitar um orçamento para um projeto de tubulação industrial.';

    function buildLink(customMessage) {
        const text = encodeURIComponent(customMessage || DEFAULT_MESSAGE);
        return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;
    }

    document.addEventListener('DOMContentLoaded', function () {
        const link = buildLink();
        document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
            // Permite mensagem personalizada por elemento via data-wa-message.
            const custom = el.getAttribute('data-wa-message');
            el.setAttribute('href', custom ? buildLink(custom) : link);
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener');
        });
    });

})();
