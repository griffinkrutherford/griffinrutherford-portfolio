/**
 * complex-controls.js
 * Handles UI controls for the complex gradient descent visualizer
 */

import { Complex } from '../math/complex.js';

class ComplexControlPanel {
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.onChange = options.onChange || (() => {});
        this.onReset = options.onReset || (() => {});
        this.onStep = options.onStep || (() => {});
        this.onRun = options.onRun || (() => {});
        this.onStop = options.onStop || (() => {});
        this.onFunctionChange = options.onFunctionChange || (() => {});
        this.onStartingPointChange = options.onStartingPointChange || (() => {});
        this.onColoringMethodChange = options.onColoringMethodChange || (() => {});
        
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
        
        // Coloring method selection
        this.createColoringMethodSelector();
        
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
            position: new Complex(0, 0),
            value: 0,
            gradient: new Complex(0, 0),
            converged: false
        });
    }
    
    createFunctionSelector() {
        const functionContainer = document.createElement('div');
        functionContainer.className = 'control-group';
        this.panel.appendChild(functionContainer);
        
        const functionLabel = document.createElement('label');
        functionLabel.textContent = 'Complex Function:';
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
        
        // Real part input
        const realLabel = document.createElement('span');
        realLabel.textContent = 'Re:';
        realLabel.className = 'input-label';
        inputContainer.appendChild(realLabel);
        
        this.startingPointRealInput = document.createElement('input');
        this.startingPointRealInput.type = 'number';
        this.startingPointRealInput.className = 'starting-point-input';
        this.startingPointRealInput.value = '1';
        this.startingPointRealInput.step = '0.1';
        inputContainer.appendChild(this.startingPointRealInput);
        
        // Imaginary part input
        const imagLabel = document.createElement('span');
        imagLabel.textContent = 'Im:';
        imagLabel.className = 'input-label';
        inputContainer.appendChild(imagLabel);
        
        this.startingPointImagInput = document.createElement('input');
        this.startingPointImagInput.type = 'number';
        this.startingPointImagInput.className = 'starting-point-input';
        this.startingPointImagInput.value = '0';
        this.startingPointImagInput.step = '0.1';
        inputContainer.appendChild(this.startingPointImagInput);
        
        // Add event listeners
        const updateStartingPoint = () => {
            const real = parseFloat(this.startingPointRealInput.value);
            const imag = parseFloat(this.startingPointImagInput.value);
            if (!isNaN(real) && !isNaN(imag)) {
                this.onStartingPointChange(new Complex(real, imag));
            }
        };
        
        this.startingPointRealInput.addEventListener('change', updateStartingPoint);
        this.startingPointImagInput.addEventListener('change', updateStartingPoint);
    }
    
    createColoringMethodSelector() {
        const coloringContainer = document.createElement('div');
        coloringContainer.className = 'control-group';
        this.panel.appendChild(coloringContainer);
        
        const coloringLabel = document.createElement('label');
        coloringLabel.textContent = 'Coloring Method:';
        coloringContainer.appendChild(coloringLabel);
        
        this.coloringMethodSelector = document.createElement('select');
        this.coloringMethodSelector.className = 'function-selector';
        coloringContainer.appendChild(this.coloringMethodSelector);
        
        // Add options
        const coloringMethods = [
            { value: 'phase', label: 'Phase (Argument)' },
            { value: 'modulus', label: 'Modulus (Magnitude)' },
            { value: 'combined', label: 'Combined (Phase + Modulus)' }
        ];
        
        coloringMethods.forEach(method => {
            const option = document.createElement('option');
            option.value = method.value;
            option.textContent = method.label;
            this.coloringMethodSelector.appendChild(option);
        });
        
        // Add event listener
        this.coloringMethodSelector.addEventListener('change', () => {
            const selectedValue = this.coloringMethodSelector.value;
            this.onColoringMethodChange(selectedValue);
        });
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
        this.learningRateSlider.max = '0.5';
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
                <span class="status-value">${state.position.real.toFixed(4)} + ${state.position.imag.toFixed(4)}i</span>
            </div>
            <div class="status-item">
                <span class="status-label">Value:</span>
                <span class="status-value">${state.value.toFixed(4)}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Gradient:</span>
                <span class="status-value">${state.gradient.real.toFixed(4)} + ${state.gradient.imag.toFixed(4)}i</span>
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
        this.startingPointRealInput.disabled = true;
        this.startingPointImagInput.disabled = true;
        this.coloringMethodSelector.disabled = true;
        this.learningRateSlider.disabled = true;
        this.resetButton.disabled = true;
    }
    
    enableControls() {
        this.functionSelector.disabled = false;
        this.startingPointRealInput.disabled = false;
        this.startingPointImagInput.disabled = false;
        this.coloringMethodSelector.disabled = false;
        this.learningRateSlider.disabled = false;
        this.resetButton.disabled = false;
    }
    
    getSettings() {
        return {
            functionKey: this.functionSelector.value,
            startingPoint: new Complex(
                parseFloat(this.startingPointRealInput.value),
                parseFloat(this.startingPointImagInput.value)
            ),
            learningRate: parseFloat(this.learningRateSlider.value),
            coloringMethod: this.coloringMethodSelector.value
        };
    }
}

// Export the ComplexControlPanel class
export { ComplexControlPanel };
