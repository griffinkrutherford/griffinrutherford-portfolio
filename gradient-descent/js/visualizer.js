/* visualizer.js - Visualizer classes for the Gradient Descent Visualizer */

// Namespace for visualizers
var GDVVisualizer = {
    // Single variable visualizer
    SingleVariable: function(canvasId, controlsId, options = {}) {
        // Canvas and controls
        this.canvas = new GDVCanvas.SingleVariable(canvasId);
        this.controls = new GDVControls.SingleVariable(controlsId);
        
        // Gradient descent algorithm
        this.gradientDescent = new GDVGradientDescent.SingleVariable({
            learningRate: options.learningRate || 0.1,
            maxIterations: options.maxIterations || 100,
            convergenceThreshold: options.convergenceThreshold || 0.0001
        });
        
        // Animation properties
        this.animationFrameId = null;
        this.animationDelay = options.animationDelay || 100;
        this.lastStepTime = 0;
        
        // Initialize
        this.init();
        
        // Initialize visualizer
        this.init = function() {
            // Set up control event handlers
            this.setupEventHandlers();
            
            // Initial render
            this.render();
        };
        
        // Set up event handlers for controls
        this.setupEventHandlers = function() {
            // Function change
            this.controls.on('onFunctionChange', (func) => {
                // Reset gradient descent
                this.reset();
                
                // Auto-adjust view bounds based on function domain
                this.canvas.autoAdjustViewBounds(func);
                
                // Render scene
                this.render();
            });
            
            // Learning rate change
            this.controls.on('onLearningRateChange', (rate) => {
                this.gradientDescent.setLearningRate(rate);
            });
            
            // Starting point change
            this.controls.on('onStartingPointChange', (point) => {
                this.reset();
                this.render();
            });
            
            // Reset button
            this.controls.on('onReset', () => {
                this.reset();
                this.render();
            });
            
            // Step button
            this.controls.on('onStep', () => {
                this.step();
            });
            
            // Run/pause button
            this.controls.on('onRunToggle', (isRunning) => {
                if (isRunning) {
                    this.startAnimation();
                } else {
                    this.stopAnimation();
                }
            });
        };
        
        // Reset the visualization
        this.reset = function() {
            // Stop any running animation
            this.stopAnimation();
            
            // Reset gradient descent
            this.gradientDescent.reset();
            
            // Update controls
            this.controls.updateStatus('Ready');
        };
        
        // Perform a single step of gradient descent
        this.step = function() {
            const settings = this.controls.getSettings();
            
            // Initialize gradient descent if needed
            if (this.gradientDescent.currentPosition === null) {
                this.gradientDescent.initialize(
                    settings.function,
                    settings.startingPoint
                );
                
                // Render initial state
                this.render();
                return;
            }
            
            // Perform a step
            const result = this.gradientDescent.step();
            
            // If no result, we've reached the end
            if (!result) {
                this.stopAnimation();
                this.controls.updateStatus('Finished', 'Reached maximum iterations or converged');
                return;
            }
            
            // Update status
            if (result.converged) {
                this.stopAnimation();
                this.controls.updateStatus('Converged', `at x = ${result.position.toFixed(4)}, f(x) = ${result.value.toFixed(4)}`);
            } else {
                this.controls.updateStatus('Step', `${result.iteration}: x = ${result.position.toFixed(4)}, f(x) = ${result.value.toFixed(4)}`);
            }
            
            // Render updated state
            this.render();
            
            return result;
        };
        
        // Start animation
        this.startAnimation = function() {
            if (this.animationFrameId !== null) return;
            
            this.lastStepTime = performance.now();
            this.animate();
        };
        
        // Stop animation
        this.stopAnimation = function() {
            if (this.animationFrameId === null) return;
            
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        };
        
        // Animation loop
        this.animate = function() {
            this.animationFrameId = requestAnimationFrame(() => {
                const currentTime = performance.now();
                const elapsed = currentTime - this.lastStepTime;
                
                // If enough time has passed, perform a step
                if (elapsed >= this.animationDelay) {
                    this.lastStepTime = currentTime;
                    const result = this.step();
                    
                    // If step returned null or converged, stop animation
                    if (!result || result.converged) {
                        this.stopAnimation();
                        return;
                    }
                }
                
                // Continue animation if still running
                if (this.controls.getSettings().isRunning) {
                    this.animate();
                }
            });
        };
        
        // Render the visualization
        this.render = function() {
            const settings = this.controls.getSettings();
            const state = this.gradientDescent.getState();
            
            // Create scene object
            const scene = {
                function: settings.function,
                path: state.history,
                currentPoint: state.currentPosition !== null ? {
                    position: state.currentPosition,
                    value: state.currentValue,
                    gradient: state.currentGradient
                } : null,
                functionOptions: {
                    color: '#4285F4',
                    lineWidth: 2
                },
                pathOptions: {
                    color: 'rgba(244, 67, 54, 0.5)',
                    lineWidth: 2,
                    showPoints: true,
                    pointRadius: 3,
                    positionAccessor: (point) => point.position,
                    valueAccessor: (point) => point.value
                },
                pointOptions: {
                    radius: 6,
                    color: '#F44336',
                    label: state.currentPosition !== null ? `x = ${state.currentPosition.toFixed(2)}` : ''
                },
                gradientOptions: {
                    scale: 0.5,
                    color: '#4CAF50',
                    showLabel: true
                }
            };
            
            // Render scene
            this.canvas.render(scene);
        };
    },
    
    // Multivariate visualizer
    Multivariate: function(canvasId, controlsId, options = {}) {
        // Canvas and controls
        this.canvas = new GDVCanvas.Multivariate(canvasId);
        this.controls = new GDVControls.Multivariate(controlsId);
        
        // Gradient descent algorithm
        this.gradientDescent = new GDVGradientDescent.Multivariate({
            learningRate: options.learningRate || 0.1,
            maxIterations: options.maxIterations || 100,
            convergenceThreshold: options.convergenceThreshold || 0.0001
        });
        
        // Animation properties
        this.animationFrameId = null;
        this.animationDelay = options.animationDelay || 100;
        this.lastStepTime = 0;
        
        // Initialize
        this.init();
        
        // Initialize visualizer
        this.init = function() {
            // Set up control event handlers
            this.setupEventHandlers();
            
            // Initial render
            this.render();
        };
        
        // Set up event handlers for controls
        this.setupEventHandlers = function() {
            // Function change
            this.controls.on('onFunctionChange', (func) => {
                // Reset gradient descent
                this.reset();
                
                // Auto-adjust view bounds based on function domain
                this.canvas.autoAdjustViewBounds(func);
                
                // Render scene
                this.render();
            });
            
            // Learning rate change
            this.controls.on('onLearningRateChange', (rate) => {
                this.gradientDescent.setLearningRate(rate);
            });
            
            // Starting point change
            this.controls.on('onStartingPointChange', (point) => {
                this.reset();
                this.render();
            });
            
            // Reset button
            this.controls.on('onReset', () => {
                this.reset();
                this.render();
            });
            
            // Step button
            this.controls.on('onStep', () => {
                this.step();
            });
            
            // Run/pause button
            this.controls.on('onRunToggle', (isRunning) => {
                if (isRunning) {
                    this.startAnimation();
                } else {
                    this.stopAnimation();
                }
            });
        };
        
        // Reset the visualization
        this.reset = function() {
            // Stop any running animation
            this.stopAnimation();
            
            // Reset gradient descent
            this.gradientDescent.reset();
            
            // Update controls
            this.controls.updateStatus('Ready');
        };
        
        // Perform a single step of gradient descent
        this.step = function() {
            const settings = this.controls.getSettings();
            
            // Initialize gradient descent if needed
            if (this.gradientDescent.currentPosition === null) {
                this.gradientDescent.initialize(
                    settings.function,
                    settings.startingPoint
                );
                
                // Render initial state
                this.render();
                return;
            }
            
            // Perform a step
            const result = this.gradientDescent.step();
            
            // If no result, we've reached the end
            if (!result) {
                this.stopAnimation();
                this.controls.updateStatus('Finished', 'Reached maximum iterations or converged');
                return;
            }
            
            // Update status
            if (result.converged) {
                this.stopAnimation();
                this.controls.updateStatus('Converged', `at (${result.position.x.toFixed(4)}, ${result.position.y.toFixed(4)}), f(x,y) = ${result.value.toFixed(4)}`);
            } else {
                this.controls.updateStatus('Step', `${result.iteration}: (${result.position.x.toFixed(4)}, ${result.position.y.toFixed(4)}), f(x,y) = ${result.value.toFixed(4)}`);
            }
            
            // Render updated state
            this.render();
            
            return result;
        };
        
        // Start animation
        this.startAnimation = function() {
            if (this.animationFrameId !== null) return;
            
            this.lastStepTime = performance.now();
            this.animate();
        };
        
        // Stop animation
        this.stopAnimation = function() {
            if (this.animationFrameId === null) return;
            
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        };
        
        // Animation loop
        this.animate = function() {
            this.animationFrameId = requestAnimationFrame(() => {
                const currentTime = performance.now();
                const elapsed = currentTime - this.lastStepTime;
                
                // If enough time has passed, perform a step
                if (elapsed >= this.animationDelay) {
                    this.lastStepTime = currentTime;
                    const result = this.step();
                    
                    // If step returned null or converged, stop animation
                    if (!result || result.converged) {
                        this.stopAnimation();
                        return;
                    }
                }
                
                // Continue animation if still running
                if (this.controls.getSettings().isRunning) {
                    this.animate();
                }
            });
        };
        
        // Render the visualization
        this.render = function() {
            const settings = this.controls.getSettings();
            const state = this.gradientDescent.getState();
            
            // Create scene object
            const scene = {
                function: settings.function,
                path: state.history,
                currentPoint: state.currentPosition !== null ? {
                    position: state.currentPosition,
                    value: state.currentValue,
                    gradient: state.currentGradient
                } : null,
                contourOptions: {
                    levels: 20,
                    colors: ['#0000FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000']
                },
                pathOptions: {
                    color: 'rgba(244, 67, 54, 0.8)',
                    lineWidth: 2,
                    showPoints: true,
                    pointRadius: 3,
                    positionXAccessor: (point) => point.position.x,
                    positionYAccessor: (point) => point.position.y
                },
                pointOptions: {
                    radius: 6,
                    color: '#F44336',
                    label: state.currentPosition !== null ? `(${state.currentPosition.x.toFixed(2)}, ${state.currentPosition.y.toFixed(2)})` : ''
                },
                gradientOptions: {
                    scale: 0.2,
                    color: '#4CAF50',
                    showLabel: true
                }
            };
            
            // Render scene
            this.canvas.render(scene);
        };
    },
    
    // Complex visualizer
    Complex: function(canvasId, controlsId, options = {}) {
        // Canvas and controls
        this.canvas = new GDVCanvas.Complex(canvasId);
        this.controls = new GDVControls.Complex(controlsId);
        
        // Gradient descent algorithm
        this.gradientDescent = new GDVGradientDescent.Complex({
            learningRate: options.learningRate || 0.1,
            maxIterations: options.maxIterations || 100,
            convergenceThreshold: options.convergenceThreshold || 0.0001
        });
        
        // Animation properties
        this.animationFrameId = null;
        this.animationDelay = options.animationDelay || 100;
        this.lastStepTime = 0;
        
        // Initialize
        this.init();
        
        // Initialize visualizer
        this.init = function() {
            // Set up control event handlers
            this.setupEventHandlers();
            
            // Initial render
            this.render();
        };
        
        // Set up event handlers for controls
        this.setupEventHandlers = function() {
            // Function change
            this.controls.on('onFunctionChange', (func) => {
                // Reset gradient descent
                this.reset();
                
                // Auto-adjust view bounds based on function domain
                this.canvas.autoAdjustViewBounds(func);
                
                // Render scene
                this.render();
            });
            
            // Coloring method change
            this.controls.on('onColoringMethodChange', (method) => {
                this.render();
            });
            
            // Learning rate change
            this.controls.on('onLearningRateChange', (rate) => {
                this.gradientDescent.setLearningRate(rate);
            });
            
            // Starting point change
            this.controls.on('onStartingPointChange', (point) => {
                this.reset();
                this.render();
            });
            
            // Reset button
            this.controls.on('onReset', () => {
                this.reset();
                this.render();
            });
            
            // Step button
            this.controls.on('onStep', () => {
                this.step();
            });
            
            // Run/pause button
            this.controls.on('onRunToggle', (isRunning) => {
                if (isRunning) {
                    this.startAnimation();
                } else {
                    this.stopAnimation();
                }
            });
        };
        
        // Reset the visualization
        this.reset = function() {
            // Stop any running animation
            this.stopAnimation();
            
            // Reset gradient descent
            this.gradientDescent.reset();
            
            // Update controls
            this.controls.updateStatus('Ready');
        };
        
        // Perform a single step of gradient descent
        this.step = function() {
            const settings = this.controls.getSettings();
            
            // Initialize gradient descent if needed
            if (this.gradientDescent.currentPosition === null) {
                this.gradientDescent.initialize(
                    settings.function,
                    new GDVUtils.Complex(settings.startingPoint.real, settings.startingPoint.imag)
                );
                
                // Render initial state
                this.render();
                return;
            }
            
            // Perform a step
            const result = this.gradientDescent.step();
            
            // If no result, we've reached the end
            if (!result) {
                this.stopAnimation();
                this.controls.updateStatus('Finished', 'Reached maximum iterations or converged');
                return;
            }
            
            // Update status
            if (result.converged) {
                this.stopAnimation();
                this.controls.updateStatus('Converged', `at ${result.position.toString()}, |f(z)| = ${result.value.toFixed(4)}`);
            } else {
                this.controls.updateStatus('Step', `${result.iteration}: ${result.position.toString()}, |f(z)| = ${result.value.toFixed(4)}`);
            }
            
            // Render updated state
            this.render();
            
            return result;
        };
        
        // Start animation
        this.startAnimation = function() {
            if (this.animationFrameId !== null) return;
            
            this.lastStepTime = performance.now();
            this.animate();
        };
        
        // Stop animation
        this.stopAnimation = function() {
            if (this.animationFrameId === null) return;
            
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        };
        
        // Animation loop
        this.animate = function() {
            this.animationFrameId = requestAnimationFrame(() => {
                const currentTime = performance.now();
                const elapsed = currentTime - this.lastStepTime;
                
                // If enough time has passed, perform a step
                if (elapsed >= this.animationDelay) {
                    this.lastStepTime = currentTime;
                    const result = this.step();
                    
                    // If step returned null or converged, stop animation
                    if (!result || result.converged) {
                        this.stopAnimation();
                        return;
                    }
                }
                
                // Continue animation if still running
                if (this.controls.getSettings().isRunning) {
                    this.animate();
                }
            });
        };
        
        // Render the visualization
        this.render = function() {
            const settings = this.controls.getSettings();
            const state = this.gradientDescent.getState();
            
            // Create scene object
            const scene = {
                function: settings.function,
                path: state.history,
                currentPoint: state.currentPosition !== null ? {
                    position: state.currentPosition,
                    value: state.currentValue,
                    gradient: state.currentGradient
                } : null,
                functionOptions: {
                    coloringMethod: settings.coloringMethod,
                    resolution: 300
                },
                pathOptions: {
                    color: 'rgba(244, 67, 54, 0.8)',
                    lineWidth: 2,
                    showPoints: true,
                    pointRadius: 3,
                    positionAccessor: (point) => point.position
                },
                pointOptions: {
                    radius: 6,
                    color: '#F44336',
                    label: state.currentPosition !== null ? state.currentPosition.toString() : ''
                },
                gradientOptions: {
                    scale: 0.2,
                    color: '#4CAF50',
                    showLabel: true
                }
            };
            
            // Render scene
            this.canvas.render(scene);
        };
    }
};
