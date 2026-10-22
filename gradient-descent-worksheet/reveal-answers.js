/* Adds a "Reveal answer" button beside every Check button. It opens the question's existing explanation. */
(function () {
    'use strict';
    const checks = document.querySelectorAll('#original-worksheet .submit-answer, [data-stats-check], [data-model-check], [data-model-writing]');
    const buttonsFor = new Map();
    let count = 0;

    function sync(explanation) {
        for (const reveal of buttonsFor.get(explanation)) {
            reveal.textContent = explanation.open ? 'Hide answer' : 'Reveal answer';
            reveal.setAttribute('aria-expanded', String(explanation.open));
        }
    }

    for (const check of checks) {
        const question = check.closest('.question');
        const explanation = question?.querySelector('details.practice-explanation, details.stats-explanation');
        if (!explanation) continue;
        if (!buttonsFor.has(explanation)) {
            if (!explanation.id) explanation.id = `revealed-answer-${++count}`;
            buttonsFor.set(explanation, []);
            explanation.addEventListener('toggle', () => sync(explanation));
        }
        const reveal = document.createElement('button');
        reveal.type = 'button';
        reveal.className = 'reset reveal-answer';
        reveal.setAttribute('aria-controls', explanation.id);
        reveal.addEventListener('click', () => {
            explanation.open = !explanation.open;
            sync(explanation);
            if (explanation.open) explanation.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
        buttonsFor.get(explanation).push(reveal);
        check.after(reveal);
        sync(explanation);
    }
})();
