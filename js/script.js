// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.experience-item, .ig-post').forEach((el) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.4s ease-out';
        observer.observe(el);
    });

    // Show More functionality for sections
    document.querySelectorAll('.collapsible').forEach(collapsible => {
        const preview = collapsible.querySelector('.preview');
        const fullText = collapsible.querySelector('.full-text');
        const button = collapsible.querySelector('.show-more-btn');

        // Calculate heights
        const previewHeight = preview.scrollHeight; // Total height of preview content in pixels
        const maxPreviewHeight = parseFloat(getComputedStyle(preview).maxHeight); // 30em in pixels

        // Show button and gradient if content exceeds preview height or full-text exists
        if (previewHeight > maxPreviewHeight || (fullText && fullText.textContent.trim().length > 0)) {
            button.style.display = 'block';
            if (!collapsible.classList.contains('expanded')) {
                preview.classList.add('needs-gradient'); // Add gradient when collapsed
            }
        } else {
            button.style.display = 'none';
            preview.classList.remove('needs-gradient'); // No gradient for short content
        }

        button.addEventListener('click', () => {
            collapsible.classList.toggle('expanded');
            button.textContent = collapsible.classList.contains('expanded') ? 'Show Less' : 'Show More';
            preview.classList.toggle('needs-gradient', !collapsible.classList.contains('expanded'));
        });
    });
});

    document.querySelectorAll('.show-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.classList.toggle('expanded');
            this.textContent = parent.classList.contains('expanded') 
                ? 'Show Less ↑' 
                : 'Show More ↓';
        });
    });

    // Update existing Intersection Observer to include buttons
    document.querySelectorAll('.experience-item, .ig-post, .show-more-btn').forEach((el) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.4s ease-out';
        observer.observe(el);
    });