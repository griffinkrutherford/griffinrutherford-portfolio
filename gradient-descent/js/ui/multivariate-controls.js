/**
 * multivariate-controls.js
 * Handles UI controls for the multivariate gradient descent visualizer
 */

class MultivariateControlPanel {
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.onChange = options.onChange || (() => {});
        this.onReset = options.onReset || (() => {});
        this.onStep = options.onStep || (() => {});
        this.onRun = options.onRun || (() => {});
        this.onStop = options.onStop || (() => {});
        this.onFunctionChange = options.onFunctionChange || (() => {});
        this.onStartingPointChange = options.onStartingPointChange || (() => {});
        
        // State
        this.isRunning = false;
        this.animationId = null;
        
        // Create UI elements
        this.createControls();
    }
    
    createControls() {
        // Create control panel container
        this.panel = document.createElement('div');
        this.panel.className = 'control-panel';
        this.container.appendChild(this.panel);
        
        // Function selection
        this.createFunctionSelector();
        
        // Starting point inputs
        this.createStartingPointInputs();
        
        // Learning rate slider
        this.createLearningRateSlider();
        
        // Buttons container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        this.panel.appendChild(buttonContainer);
        
        // Reset button
        this.resetButton = document.createElement('button');
        this.resetButton.textContent = 'Reset';
        this.resetButton.className = 'control-button reset-button';
        this.resetButton.addEventListener('click', () => this.handleReset());
        buttonContainer.appendChild(this.resetButton);
        
        // Step button
        this.stepButton = document.createElement('button');
        this.stepButton.textContent = 'Step';
        this.stepButton.className = 'control-button step-button';
        this.stepButton.addEventListener('click', () => this.handleStep());
        buttonContainer.appendChild(this.stepButton);
        
        // Run/Stop button
        this.runButton = document.createElement('button');
        this.runButton.textContent = 'Run';
        this.runButton.className = 'control-button run-button';
        this.runButton.addEventListener('click', () => this.toggleRunStop());
        buttonContainer.appendChild(this.runButton);
        
        // Status display
        this.statusDisplay = document.createElement('div');
        this.statusDisplay.className = 'status-display';
        this.panel.appendChild(this.statusDisplay);
        
        // Set initial status
        this.updateStatus({
            iteration: 0,
            position: [0, 0],
            value: 0,
            gradient: [0, 0],
            converged: false
        });
    }
    
    createFunctionSelector() {
        const functionContainer = document.createElement('div');
        functionContainer.className = 'control-group';
        this.panel.appendChild(functionContainer);
        
        const functionLabel = document.createElement('label');
        functionLabel.textContent = 'Function:';
        functionContainer.appendChild(functionLabel);
        
        this.functionSelector = document.createElement('select');
        this.functionSelector.className = 'function-selector';
        functionContainer.appendChild(this.functionSelector);
        
        // Add event listener
        this.functionSelector.addEventListener('change', () => {
            const selectedValue = this.functionSelector.value;
            this.onFunctionChange(selectedValue);
        });
    }
    
    createStartingPointInputs() {
        const startingPointContainer = document.createElement('div');
        startingPointContainer.className = 'control-group';
        this.panel.appendChild(startingPointContainer);
        
        const startingPointLabel = document.createElement('label');
        startingPointLabel.textContent = 'Starting Point:';
        startingPointContainer.appendChild(startingPointLabel);
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-group';
        startingPointContainer.appendChild(inputContainer);
        
        // X input
        const xLabel = document.createElement('span');
        xLabel.textContent = 'X:';
        xLabel.className = 'input-label';
        inputContainer.appendChild(xLabel);
        
        this.startingPointXInput = document.createElement('input');
        this.startingPointXInput.type = 'number';
        this.startingPointXInput.className = 'starting-point-input';
        this.startingPointXInput.value = '2';
        this.startingPointXInput.step = '0.1';
        inputContainer.appendChild(this.startingPointXInput);
        
        // Y input
        const yLabel = document.createElement('span');
        yLabel.textContent = 'Y:';
        yLabel.className = 'input-label';
        inputContainer.appendChild(yLabel);
        
        this.startingPointYInput = document.createElement('input');
        this.startingPointYInput.type = 'number';
        this.startingPointYInput.className = 'starting-point-input';
        this.startingPointYInput.value = '2';
        this.startingPointYInput.step = '0.1';
        inputContainer.appendChild(this.startingPointYInput);
        
        // Add event listeners
        const updateStartingPoint = () => {
            const x = parseFloat(this.startingPointXInput.value);
            const y = parseFloat(this.startingPointYInput.value);
            if (!isNaN(x) && !isNaN(y)) {
                this.onStartingPointChange([x, y]);
            }
        };
        
        this.startingPointXInput.addEventListener('change', updateStartingPoint);
        this.startingPointYInput.addEventListener('change', updateStartingPoint);
    }
    
    createLearningRateSlider() {
        const learningRateContainer = document.createElement('div');
        learningRateContainer.className = 'control-group';
        this.panel.appendChild(learningRateContainer);
        
        const learningRateLabel = document.createElement('label');
        learningRateLabel.textContent = 'Learning Rate (α):';
        learningRateContainer.appendChild(learningRateLabel);
        
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        learningRateContainer.appendChild(sliderContainer);
        
        this.learningRateSlider = document.createElement('input');
        this.learningRateSlider.type = 'range';
        this.learningRateSlider.className = 'learning-rate-slider';
        this.learningRateSlider.min = '0.01';
        this.learningRateSlider.max = '1';
        this.learningRateSlider.step = '0.01';
        this.learningRateSlider.value = '0.1';
        sliderContainer.appendChild(this.learningRateSlider);
        
        this.learningRateValue = document.createElement('span');
        this.learningRateValue.className = 'slider-value';
        this.learningRateValue.textContent = '0.1';
        sliderContainer.appendChild(this.learningRateValue);
        
        // Add event listener
        this.learningRateSlider.addEventListener('input', () => {
            const value = parseFloat(this.learningRateSlider.value);
            this.learningRateValue.textContent = value.toFixed(2);
            this.onChange({ learningRate: value });
        });
    }
    
    setFunctionOptions(functions) {
        // Clear existing options
        this.functionSelector.innerHTML = '';
        
        // Add options for each function
        for (const [key, func] of Object.entries(functions)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = func.name;
            this.functionSelector.appendChild(option);
        }
        
        // Trigger change event for initial selection
        this.onFunctionChange(this.functionSelector.value);
    }
    
    handleReset() {
        // Stop if running
        if (this.isRunning) {
            this.toggleRunStop();
        }
        
        // Call reset callback
        this.onReset();
    }
    
    handleStep() {
        // Call step callback
        this.onStep();
    }
    
    toggleRunStop() {
        if (this.isRunning) {
            // Stop animation
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            
            // Update button
            this.runButton.textContent = 'Run';
            this.runButton.classList.remove('stop-button');
            this.runButton.classList.add('run-button');
            
            // Update state
            this.isRunning = false;
            
            // Call stop callback
            this.onStop();
        } else {
            // Update button
            this.runButton.textContent = 'Stop';
            this.runButton.classList.remove('run-button');
            this.runButton.classList.add('stop-button');
            
            // Update state
            this.isRunning = true;
            
            // Start animation
            const animate = () => {
                if (!this.isRunning) return;
                
                // Call run callback
                const result = this.onRun();
                
                // Stop if converged or callback returns false
                if (result === false) {
                    this.toggleRunStop();
                    return;
                }
                
                // Continue animation
                this.animationId = requestAnimationFrame(animate);
            };
            
            animate();
        }
    }
    
    updateStatus(state) {
        if (!state) return;
        
        // Format status text
        let statusHTML = `
            <div class="status-item">
                <span class="status-label">Iteration:</span>
                <span class="status-value">${state.iteration}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Position:</span>
                <span class="status-value">(${state.position[0].toFixed(4)}, ${state.position[1].toFixed(4)})</span>
            </div>
            <div class="status-item">
                <span class="status-label">Value:</span>
                <span class="status-value">${state.value.toFixed(4)}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Gradient:</span>
                <span class="status-value">(${state.gradient[0].toFixed(4)}, ${state.gradient[1].toFixed(4)})</span>
            </div>
        `;
        
        // Add convergence status if converged
        if (state.converged) {
            statusHTML += `
                <div class="status-item converged">
                    <span class="status-label">Status:</span>
                    <span class="status-value">Converged!</span>
                </div>
            `;
        }
        
        // Update status display
        this.statusDisplay.innerHTML = statusHTML;
    }
    
    disableControls() {
        this.functionSelector.disabled = true;
        this.startingPointXInput.disabled = true;
        this.startingPointYInput.disabled = true;
        this.learningRateSlider.disabled = true;
        this.resetButton.disabled = true;
    }
    
    enableControls() {
        this.functionSelector.disabled = false;
        this.startingPointXInput.disabled = false;
        this.startingPointYInput.disabled = false;
        this.learningRateSlider.disabled = false;
        this.resetButton.disabled = false;
    }
    
    getSettings() {
        return {
            functionKey: this.functionSelector.value,
            startingPoint: [
                parseFloat(this.startingPointXInput.value),
                parseFloat(this.startingPointYInput.value)
            ],
            learningRate: parseFloat(this.learningRateSlider.value)
        };
    }
}

// Export the MultivariateControlPanel class
export { MultivariateControlPanel };
