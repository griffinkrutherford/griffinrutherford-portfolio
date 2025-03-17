/* app.js - Main application for the Gradient Descent Visualizer */

// Main application
var GDVApp = {
    // Current active visualizer
    activeVisualizer: null,
    
    // Current active tab
    activeTab: 'single',
    
    // Visualizers
    visualizers: {},
    
    // Initialize the application
    init: function() {
        // Create visualizers
        this.visualizers = {
            single: new GDVVisualizer.SingleVariable('canvas', 'controls'),
            multi: new GDVVisualizer.Multivariate('canvas', 'controls'),
            complex: new GDVVisualizer.Complex('canvas', 'controls')
        };
        
        // Set up tab switching
        this.setupTabs();
        
        // Set initial active tab
        this.switchTab('single');
        
        // Add CSS styles
        this.addStyles();
    },
    
    // Set up tab switching
    setupTabs: function() {
        const tabs = document.querySelectorAll('.function-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    },
    
    // Switch to a different tab
    switchTab: function(tabId) {
        // Update active tab
        this.activeTab = tabId;
        
        // Update tab UI
        const tabs = document.querySelectorAll('.function-tab');
        tabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Clear controls container
        const controlsContainer = document.getElementById('controls');
        controlsContainer.innerHTML = '';
        
        // Set active visualizer
        this.activeVisualizer = this.visualizers[tabId];
        
        // Re-initialize the active visualizer
        if (this.activeVisualizer) {
            // Re-initialize the visualizer
            this.activeVisualizer.init();
        }
    },
    
    // Add CSS styles
    addStyles: function() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* Control panel styles */
            .control-panel {
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 15px;
                background-color: rgba(30, 30, 30, 0.8);
                border-radius: 8px;
                color: #fff;
                font-family: Arial, sans-serif;
            }
            
            .control-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .control-group label {
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .control-group select,
            .control-group input {
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #555;
                background-color: #333;
                color: #fff;
            }
            
            .expression-display {
                padding: 8px;
                background-color: #333;
                border-radius: 4px;
                font-family: monospace;
                color: #4CAF50;
            }
            
            .status-display {
                padding: 8px;
                background-color: #333;
                border-radius: 4px;
                font-family: monospace;
            }
            
            .button-group {
                display: flex;
                flex-direction: row;
                gap: 10px;
                justify-content: space-between;
            }
            
            .control-button {
                padding: 8px 16px;
                border-radius: 4px;
                border: none;
                background-color: #555;
                color: #fff;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            .control-button:hover {
                background-color: #777;
            }
            
            .primary-button {
                background-color: var(--primary-purple, #6C1AFF);
            }
            
            .primary-button:hover {
                background-color: var(--primary-red, #FF1A6C);
            }
            
            /* Function tabs */
            .function-tabs {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }
            
            .function-tab {
                padding: 10px 20px;
                margin: 0 5px;
                background-color: #333;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .function-tab.active {
                background-color: var(--primary-purple, #6C1AFF);
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .button-group {
                    flex-direction: column;
                }
                
                .function-tabs {
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }
                
                .function-tab {
                    width: 100%;
                    max-width: 200px;
                }
            }
        `;
        
        document.head.appendChild(styleElement);
    }
};

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    GDVApp.init();
});
