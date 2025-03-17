/**
 * app.js
 * Main application file that handles switching between different visualizers
 */

import { GradientDescentVisualizer } from './main.js';
import { MultivariateGradientDescentVisualizer } from './multivariate-visualizer.js';
import { ComplexGradientDescentVisualizer } from './complex-visualizer.js';

// Main application class
class App {
    constructor() {
        // Current active visualizer
        this.currentVisualizer = null;
        
        // Initialize tab switching
        this.initTabs();
        
        // Start with single variable visualizer by default
        this.switchToVisualizer('single');
    }
    
    // Initialize tab switching
    initTabs() {
        const tabs = document.querySelectorAll('.function-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Get tab type
                const tabType = tab.getAttribute('data-tab');
                
                // Switch to appropriate visualizer
                this.switchToVisualizer(tabType);
            });
        });
    }
    
    // Switch to the specified visualizer type
    switchToVisualizer(type) {
        // Clear controls container
        const controlsContainer = document.getElementById('controls');
        controlsContainer.innerHTML = '';
        
        // Destroy current visualizer if exists
        if (this.currentVisualizer) {
            // No explicit destroy method needed for now
            this.currentVisualizer = null;
        }
        
        // Create new visualizer based on type
        switch (type) {
            case 'single':
                this.currentVisualizer = new GradientDescentVisualizer('canvas');
                break;
                
            case 'multi':
                this.currentVisualizer = new MultivariateGradientDescentVisualizer('canvas');
                break;
                
            case 'complex':
                this.currentVisualizer = new ComplexGradientDescentVisualizer('canvas');
                break;
                
            default:
                console.error(`Unknown visualizer type: ${type}`);
                break;
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create app
    const app = new App();
    
    // Store in global scope for debugging
    window.app = app;
});

// Export the App class
export { App };
