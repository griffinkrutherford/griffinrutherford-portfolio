/**
 * complex-visualizer.js
 * Main application file for the complex gradient descent visualizer
 */

import { ComplexCanvasManager } from './ui/complex-canvas.js';
import { ComplexControlPanel } from './ui/complex-controls.js';
import { ComplexGradientDescent } from './math/complex-descent.js';
import { Complex, complexFunctions, createCustomComplexFunction } from './math/complex.js';

// Main application class for complex visualization
class ComplexGradientDescentVisualizer {
    constructor(canvasId) {
        // Initialize canvas manager
        this.canvasManager = new ComplexCanvasManager(canvasId, {
            padding: 50,
            showGrid: true,
            showAxes: true,
            showLabels: true,
            coloringMethod: 'phase'
        });
        
        // Initialize gradient descent algorithm
        this.gradientDescent = new ComplexGradientDescent({
            learningRate: 0.1,
            maxIterations: 100,
            convergenceThreshold: 0.0001
        });
        
        // Initialize control panel
        this.controlPanel = new ComplexControlPanel({
            container: document.getElementById('controls'),
            onChange: settings => this.handleSettingsChange(settings),
            onReset: () => this.handleReset(),
            onStep: () => this.handleStep(),
            onRun: () => this.handleRun(),
            onStop: () => this.handleStop(),
            onFunctionChange: key => this.handleFunctionChange(key),
            onStartingPointChange: point => this.handleStartingPointChange(point),
            onColoringMethodChange: method => this.handleColoringMethodChange(method)
        });
        
        // Set available functions
        this.controlPanel.setFunctionOptions(complexFunctions);
        
        // Current function
        this.currentFunction = null;
        
        // Starting point
        this.startingPoint = new Complex(1, 0);
        
        // Coloring method
        this.coloringMethod = 'phase';
        
        // Initialize with default function
        this.handleFunctionChange(Object.keys(complexFunctions)[0]);
    }
    
    // Handle function change
    handleFunctionChange(functionKey) {
        // Get function
        this.currentFunction = complexFunctions[functionKey];
        
        // Reset gradient descent
        this.gradientDescent.reset();
        
        // Initialize gradient descent with new function and starting point
        this.gradientDescent.initialize(this.currentFunction, this.startingPoint);
        
        // Auto-adjust view bounds
        this.canvasManager.autoAdjustViewBounds(this.currentFunction, [{ 
            position: this.startingPoint
        }]);
        
        // Render initial state
        this.render();
    }
    
    // Handle starting point change
    handleStartingPointChange(point) {
        // Update starting point
        this.startingPoint = point;
        
        // Reset gradient descent
        this.gradientDescent.reset();
        
        // Initialize gradient descent with current function and new starting point
        this.gradientDescent.initialize(this.currentFunction, this.startingPoint);
        
        // Auto-adjust view bounds
        this.canvasManager.autoAdjustViewBounds(this.currentFunction, [{ 
            position: this.startingPoint
        }]);
        
        // Render initial state
        this.render();
    }
    
    // Handle coloring method change
    handleColoringMethodChange(method) {
        // Update coloring method
        this.coloringMethod = method;
        
        // Render with new coloring method
        this.render();
    }
    
    // Handle settings change
    handleSettingsChange(settings) {
        // Update gradient descent settings
        if (settings.learningRate !== undefined) {
            this.gradientDescent.setLearningRate(settings.learningRate);
        }
        
        // Render with updated settings
        this.render();
    }
    
    // Handle reset
    handleReset() {
        // Get current settings
        const settings = this.controlPanel.getSettings();
        
        // Reset gradient descent
        this.gradientDescent.reset();
        
        // Initialize with current function and starting point
        this.gradientDescent.initialize(this.currentFunction, settings.startingPoint);
        
        // Enable controls
        this.controlPanel.enableControls();
        
        // Render initial state
        this.render();
    }
    
    // Handle step
    handleStep() {
        // Perform a single step of gradient descent
        const result = this.gradientDescent.step();
        
        // Update status display
        if (result) {
            this.controlPanel.updateStatus({
                iteration: result.iteration,
                position: result.position,
                value: result.value,
                gradient: result.gradient,
                converged: result.converged
            });
            
            // Disable controls if converged
            if (result.converged) {
                this.controlPanel.disableControls();
            }
        }
        
        // Render updated state
        this.render();
        
        // Return result for animation control
        return result && !result.converged;
    }
    
    // Handle run
    handleRun() {
        // Perform a single step and return result
        return this.handleStep();
    }
    
    // Handle stop
    handleStop() {
        // Nothing to do here, animation is stopped by the control panel
    }
    
    // Render the visualization
    render() {
        // Get current state
        const state = this.gradientDescent.getState();
        
        // Prepare scene for rendering
        const scene = {
            function: this.currentFunction,
            functionOptions: {
                coloringMethod: this.coloringMethod,
                resolution: 200
            },
            path: state.history,
            pathOptions: {
                color: 'rgba(244, 67, 54, 0.7)',
                lineWidth: 2,
                showPoints: true,
                pointRadius: 3,
                pointColor: 'rgba(244, 67, 54, 0.7)',
                positionAccessor: point => point.position
            }
        };
        
        // Add current point if available
        if (state.currentPosition !== null) {
            scene.currentPoint = {
                position: state.currentPosition,
                gradient: state.currentGradient
            };
            
            scene.pointOptions = {
                color: '#F44336',
                radius: 6,
                label: `${state.currentPosition.real.toFixed(2)} + ${state.currentPosition.imag.toFixed(2)}i`
            };
            
            scene.gradientOptions = {
                color: '#4CAF50',
                lineWidth: 2,
                scale: 0.2,
                showLabel: true
            };
        }
        
        // Render scene
        this.canvasManager.render(scene);
        
        // Update status display
        if (state.currentPosition !== null) {
            this.controlPanel.updateStatus({
                iteration: state.iteration,
                position: state.currentPosition,
                value: state.currentValue,
                gradient: state.currentGradient,
                converged: state.converged
            });
        }
    }
}

// Export the ComplexGradientDescentVisualizer class
export { ComplexGradientDescentVisualizer };
