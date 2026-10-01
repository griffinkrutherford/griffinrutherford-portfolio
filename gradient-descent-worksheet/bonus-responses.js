/* Written responses for both bonus lectures, saved separately by prompt. */
(function () {
    'use strict';

    function saveDraft(input, status, printed, key) {
        function updatePrint() {
            printed.textContent = input.value || 'Write your response here.';
        }
        try {
            const draft = localStorage.getItem(key);
            if (draft !== null) input.value = draft;
            status.textContent = input.value ? 'Draft saved in this browser.' : 'Drafts save in this browser.';
        } catch {
            status.textContent = 'Your draft stays on this page while it is open.';
        }
        updatePrint();
        input.addEventListener('input', () => {
            updatePrint();
            try {
                localStorage.setItem(key, input.value);
                status.textContent = 'Draft saved in this browser.';
            } catch {
                status.textContent = 'Your draft stays on this page while it is open.';
            }
        });
    }

    document.querySelectorAll('#dimensions-worksheet .dim-prompt, #attention-worksheet .att-prompt').forEach(prompt => {
        const section = prompt.parentElement;
        prompt.id = `${section.id}-prompt`;
        const wrapper = document.createElement('div');
        wrapper.className = 'bonus-response';
        const input = document.createElement('textarea');
        input.id = `${section.id}-response`;
        input.rows = 5;
        input.dataset.bonusResponse = '';
        input.placeholder = 'Describe what you observed and explain your reasoning…';
        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = 'Your response';
        const status = document.createElement('p');
        status.id = `${input.id}-status`;
        status.className = 'bonus-save-status';
        status.setAttribute('role', 'status');
        input.setAttribute('aria-describedby', `${prompt.id} ${status.id}`);
        const printed = document.createElement('p');
        printed.className = 'bonus-print-response';
        wrapper.append(label, input, status, printed);
        prompt.after(wrapper);
        saveDraft(input, status, printed, `bonus-response:${input.id}`);
    });

    // Keep the existing exit-ticket storage key so earlier drafts survive.
    const exit = document.getElementById('att-exit-response');
    exit.dataset.bonusResponse = '';
    const status = document.createElement('p');
    status.id = 'att-exit-response-status';
    status.className = 'bonus-save-status';
    status.setAttribute('role', 'status');
    exit.setAttribute('aria-describedby', status.id);
    const printed = document.createElement('p');
    printed.className = 'bonus-print-response';
    exit.after(status, printed);
    saveDraft(exit, status, printed, 'attention-exit-response');
})();
