// Basic JavaScript for the Malestrum podcast website
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .footer-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // CTA button functionality
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Scroll to podcast section when CTA button is clicked
            const podcastSection = document.querySelector('#podcast');
            window.scrollTo({
                top: podcastSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value) {
                // Show success message
                alert('Thank you for subscribing to the Malestrum newsletter!');
                emailInput.value = '';
            }
        });
    }
    
    // Mobile navigation toggle (to be implemented when needed)
    // const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    // const navLinks = document.querySelector('.nav-links');
    // if (mobileNavToggle) {
    //     mobileNavToggle.addEventListener('click', function() {
    //         navLinks.classList.toggle('active');
    //     });
    // }
});
