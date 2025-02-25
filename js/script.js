document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    });
  
    // Apply initial animation styles and observe elements
    const animatedElements = document.querySelectorAll('.experience-item, .ig-post, .show-more-btn');
    animatedElements.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.4s ease-out';
      observer.observe(el);
    });
  
    // Set up "Show More" functionality for each collapsible section
    document.querySelectorAll('.collapsible').forEach(collapsible => {
      // Look for the preview area and the button within this section.
      // (Ensure your HTML includes an element with class "preview" inside each collapsible.)
      const preview = collapsible.querySelector('.preview');
      const fullText = collapsible.querySelector('.full-text');
      const button = collapsible.querySelector('.show-more-btn');
  
      if (!preview || !button) return; // Skip if essential elements are missing
  
      // Determine if the preview content exceeds its max height (set in CSS)
      const previewHeight = preview.scrollHeight;
      const maxPreviewHeight = parseFloat(getComputedStyle(preview).maxHeight);
  
      if (previewHeight > maxPreviewHeight || (fullText && fullText.textContent.trim().length > 0)) {
        button.style.display = 'block';
        if (!collapsible.classList.contains('expanded')) {
          preview.classList.add('needs-gradient');
        }
      } else {
        button.style.display = 'none';
        preview.classList.remove('needs-gradient');
      }
  
      // Toggle expanded state and update button text
      button.addEventListener('click', () => {
        collapsible.classList.toggle('expanded');
        button.textContent = collapsible.classList.contains('expanded')
          ? 'Show Less ↑'
          : 'Show More ↓';
        preview.classList.toggle('needs-gradient', !collapsible.classList.contains('expanded'));
      });
    });
  
    // Scroll arrow functionality: Scroll smoothly to the content section
    const scrollArrow = document.querySelector('.scroll-arrow');
    const contentSection = document.querySelector('.content-section');
    if (scrollArrow && contentSection) {
      scrollArrow.addEventListener('click', function() {
        contentSection.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      console.error('Scroll arrow or content section not found.');
    }
  });
  