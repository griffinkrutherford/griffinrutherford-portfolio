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
  
    // Consolidated "Show More" functionality for collapsible sections:
    document.querySelectorAll('.collapsible').forEach(collapsible => {
      const content = collapsible.querySelector('.collapsible-content');
      const button = collapsible.querySelector('.show-more-btn');
      if (!content || !button) return;
      
      // Convert 30em to pixels (using the root font size)
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const threshold = 20 * rootFontSize; // 30em in pixels
    
      // If the content's scrollHeight is less than or equal to 20em, hide the button.
      if (content.scrollHeight <= threshold) {
        button.style.display = 'none';
      } else {
        button.style.display = 'block';
      }
    
      button.addEventListener('click', () => {
        collapsible.classList.toggle('expanded');
        button.textContent = collapsible.classList.contains('expanded')
          ? 'Show Less ↑'
          : 'Show More ↓';
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
  

  document.addEventListener('DOMContentLoaded', function() {
    const quickLinksMenu = document.querySelector('.quick-links-menu');
    const quickLinksButton = document.querySelector('.quick-links-button');
    if (quickLinksButton && quickLinksMenu) {
      quickLinksButton.addEventListener('click', () => {
        quickLinksMenu.classList.toggle('active');
      });
    }
  });
  