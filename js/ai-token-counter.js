// Live AI token counter (tools/ai-token-counter/export_tokens.py publishes the data).
// Shows the last published total and counts up at the recent average rate.
// Extrapolation stops a few hours after the last update, so a sleeping Mac
// never produces made-up numbers; if the data can't be loaded, nothing shows.
(function () {
    var DATA_URL = 'https://raw.githubusercontent.com/griffinkrutherford/griffinrutherford-portfolio/refs/heads/token-stats/token-stats.json';
    var MAX_EXTRAPOLATE_MS = 6 * 60 * 60 * 1000;
    var root = document.getElementById('ai-token-counter');
    var valueEl = document.getElementById('ai-token-counter-value');
    var srEl = document.getElementById('ai-token-counter-sr');
    if (!root || !valueEl || !window.fetch) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var format = new Intl.NumberFormat('en-US');

    function currentTotal(data) {
        var elapsed = Date.now() - Date.parse(data.asOf);
        if (!(elapsed > 0)) return data.total;
        return data.total + data.ratePerSec * Math.min(elapsed, MAX_EXTRAPOLATE_MS) / 1000;
    }

    fetch(DATA_URL, { cache: 'no-cache' })
        .then(function (response) { return response.ok ? response.json() : null; })
        .then(function (data) {
            if (!data || typeof data.total !== 'number' || typeof data.ratePerSec !== 'number' || !data.asOf) return;
            var billions = Math.floor(currentTotal(data) / 1e9);
            if (srEl) srEl.textContent = 'Over ' + billions + ' billion AI tokens spent building across Claude and ChatGPT, including cached context, and counting.';
            valueEl.textContent = format.format(Math.floor(currentTotal(data)));
            root.hidden = false;
            if (reduceMotion) return;
            var tick = function () {
                if (!document.hidden) valueEl.textContent = format.format(Math.floor(currentTotal(data)));
            };
            setInterval(tick, 100);
        })
        .catch(function () { /* leave the counter hidden */ });
})();
