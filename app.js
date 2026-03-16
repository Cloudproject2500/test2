document.addEventListener('DOMContentLoaded', () => {
    // --- Rotating Hero Word ---
    const words = ['personal', 'work', 'student', 'creative'];
    const colors = ['#3b82f6', '#ec4899', '#22c55e', '#f97316'];
    const el = document.querySelector('.rotating-word');
    if (!el) return;

    let index = 0;
    el.style.color = colors[0];

    setInterval(() => {
        el.classList.add('slide-out');

        setTimeout(() => {
            index = (index + 1) % words.length;
            el.textContent = words[index];
            el.style.color = colors[index];
            el.classList.remove('slide-out');
            el.classList.add('slide-in');

            setTimeout(() => {
                el.classList.remove('slide-in');
            }, 400);
        }, 400);
    }, 1700);
});
