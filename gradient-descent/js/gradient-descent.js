/* gradient-descent.js - Gradient descent algorithms for the visualizer */

// Namespace for gradient descent algorithms
var GDVGradientDescent = {
    // Single variable gradient descent
    SingleVariable: function(options) {
        // Default options
        this.learningRate = options?.learningRate || 0.1;
        this.maxIterations = options?.maxIterations || 100;
        this.convergenceThreshold = options?.convergenceThreshold || 0.0001;
        
        // State variables
        this.history = [];
        this.currentIteration = 0;
        this.currentPosition = null;
        this.function = null;
        this.hasConverged = false;
        
        // Initialize with function and starting point
        this.initialize = function(func, startingPoint) {
            this.function = func;
            this.currentPosition = startingPoint;
            
            const value = func.evaluate(startingPoint);
            const gradient = func.derivative(startingPoint);
            
            this.history = [{ 
                position: startingPoint, 
                value: value,
                gradient: gradient
            }];
            
            this.currentIteration = 0;
            this.hasConverged = false;
            
            return this;
        };
        
        // Perform a single step of gradient descent
        this.step = function() {
            if (this.hasConverged || this.currentIteration >= this.maxIterations) {
                return null;
            }
            
            // Calculate gradient at current position
            const gradient = this.function.derivative(this.currentPosition);
            
            // Update position: x_new = x_old - learning_rate * gradient
            const newPosition = this.currentPosition - this.learningRate * gradient;
            
            // Evaluate function at new position
            const functionValue = this.function.evaluate(newPosition);
            
            // Update current position
            this.currentPosition = newPosition;
            
            // Increment iteration counter
            this.currentIteration++;
            
            // Add to history
            this.history.push({ 
                position: newPosition, 
                value: functionValue,
                gradient: gradient
            });
            
            // Check for convergence (if gradient magnitude is close to zero)
            if (Math.abs(gradient) < this.convergenceThreshold) {
                this.hasConverged = true;
            }
            
            return {
                position: newPosition,
                value: functionValue,
                gradient: gradient,
                iteration: this.currentIteration,
                converged: this.hasConverged
            };
        };
        
        // Run the algorithm until convergence or max iterations
        this.run = function() {
            while (!this.hasConverged && this.currentIteration < this.maxIterations) {
                this.step();
            }
            
            return {
                finalPosition: this.currentPosition,
                finalValue: this.function.evaluate(this.currentPosition),
                iterations: this.currentIteration,
                history: this.history,
                converged: this.hasConverged
            };
        };
        
        // Reset the algorithm
        this.reset = function() {
            this.history = [];
            this.currentIteration = 0;
            this.currentPosition = null;
            this.hasConverged = false;
        };
        
        // Get the current state
        this.getState = function() {
            return {
                currentPosition: this.currentPosition,
                currentValue: this.function ? this.function.evaluate(this.currentPosition) : null,
                currentGradient: this.function ? this.function.derivative(this.currentPosition) : null,
                iteration: this.currentIteration,
                history: this.history,
                converged: this.hasConverged
            };
        };
        
        // Update learning rate
        this.setLearningRate = function(rate) {
            this.learningRate = rate;
            return this;
        };
    },
    
    // Multivariate gradient descent
    Multivariate: function(options) {
        // Default options
        this.learningRate = options?.learningRate || 0.1;
        this.maxIterations = options?.maxIterations || 100;
        this.convergenceThreshold = options?.convergenceThreshold || 0.0001;
        
        // State variables
        this.history = [];
        this.currentIteration = 0;
        this.currentPosition = null;
        this.function = null;
        this.hasConverged = false;
        
        // Initialize with function and starting point
        this.initialize = function(func, startingPoint) {
            this.function = func;
            this.currentPosition = { x: startingPoint.x, y: startingPoint.y };
            
            const value = func.evaluate(startingPoint.x, startingPoint.y);
            const gradient = func.gradient(startingPoint.x, startingPoint.y);
            
            this.history = [{ 
                position: { x: startingPoint.x, y: startingPoint.y }, 
                value: value,
                gradient: gradient
            }];
            
            this.currentIteration = 0;
            this.hasConverged = false;
            
            return this;
        };
        
        // Perform a single step of gradient descent
        this.step = function() {
            if (this.hasConverged || this.currentIteration >= this.maxIterations) {
                return null;
            }
            
            // Calculate gradient at current position
            const gradient = this.function.gradient(this.currentPosition.x, this.currentPosition.y);
            
            // Update position: x_new = x_old - learning_rate * gradient
            const newPosition = {
                x: this.currentPosition.x - this.learningRate * gradient.x,
                y: this.currentPosition.y - this.learningRate * gradient.y
            };
            
            // Evaluate function at new position
            const functionValue = this.function.evaluate(newPosition.x, newPosition.y);
            
            // Update current position
            this.currentPosition = newPosition;
            
            // Increment iteration counter
            this.currentIteration++;
            
            // Add to history
            this.history.push({ 
                position: { x: newPosition.x, y: newPosition.y }, 
                value: functionValue,
                gradient: gradient
            });
            
            // Check for convergence (if gradient magnitude is close to zero)
            const gradientMagnitude = Math.sqrt(gradient.x * gradient.x + gradient.y * gradient.y);
            if (gradientMagnitude < this.convergenceThreshold) {
                this.hasConverged = true;
            }
            
            return {
                position: newPosition,
                value: functionValue,
                gradient: gradient,
                iteration: this.currentIteration,
                converged: this.hasConverged
            };
        };
        
        // Run the algorithm until convergence or max iterations
        this.run = function() {
            while (!this.hasConverged && this.currentIteration < this.maxIterations) {
                this.step();
            }
            
            return {
                finalPosition: this.currentPosition,
                finalValue: this.function.evaluate(this.currentPosition.x, this.currentPosition.y),
                iterations: this.currentIteration,
                history: this.history,
                converged: this.hasConverged
            };
        };
        
        // Reset the algorithm
        this.reset = function() {
            this.history = [];
            this.currentIteration = 0;
            this.currentPosition = null;
            this.hasConverged = false;
        };
        
        // Get the current state
        this.getState = function() {
            return {
                currentPosition: this.currentPosition,
                currentValue: this.function ? this.function.evaluate(this.currentPosition.x, this.currentPosition.y) : null,
                currentGradient: this.function ? this.function.gradient(this.currentPosition.x, this.currentPosition.y) : null,
                iteration: this.currentIteration,
                history: this.history,
                converged: this.hasConverged
            };
        };
        
        // Update learning rate
        this.setLearningRate = function(rate) {
            this.learningRate = rate;
            return this;
        };
    },
    
    // Complex gradient descent
    Complex: function(options) {
        // Default options
        this.learningRate = options?.learningRate || 0.1;
        this.maxIterations = options?.maxIterations || 100;
        this.convergenceThreshold = options?.convergenceThreshold || 0.0001;
        
        // State variables
        this.history = [];
        this.currentIteration = 0;
        this.currentPosition = null;
        this.function = null;
        this.hasConverged = false;
        
        // Initialize with function and starting point
        this.initialize = function(func, startingPoint) {
            this.function = func;
            this.currentPosition = new GDVUtils.Complex(startingPoint.real, startingPoint.imag);
            
            const value = func.evaluate(this.currentPosition).modulus();
            const gradient = func.evaluateDerivative(this.currentPosition);
            
            this.history = [{ 
                position: this.currentPosition, 
                value: value,
                gradient: gradient
            }];
            
            this.currentIteration = 0;
            this.hasConverged = false;
            
            return this;
        };
        
        // Perform a single step of gradient descent
        this.step = function() {
            if (this.hasConverged || this.currentIteration >= this.maxIterations) {
                return null;
            }
            
            // Calculate derivative at current position
            const derivative = this.function.evaluateDerivative(this.currentPosition);
            
            // For holomorphic functions, the gradient is 2 * conjugate(derivative)
            // This gives the direction of steepest descent of |f(z)|
            const gradient = derivative.conjugate().multiply(new GDVUtils.Complex(2, 0));
            
            // Update position: z_new = z_old - learning_rate * gradient
            const step = gradient.multiply(new GDVUtils.Complex(this.learningRate, 0));
            const newPosition = this.currentPosition.subtract(step);
            
            // Evaluate function at new position
            const functionValue = this.function.evaluate(newPosition).modulus();
            
            // Update current position
            this.currentPosition = newPosition;
            
            // Increment iteration counter
            this.currentIteration++;
            
            // Add to history
            this.history.push({ 
                position: this.currentPosition, 
                value: functionValue,
                gradient: gradient
            });
            
            // Check for convergence (if gradient magnitude is close to zero)
            const gradientMagnitude = gradient.modulus();
            if (gradientMagnitude < this.convergenceThreshold) {
                this.hasConverged = true;
            }
            
            return {
                position: newPosition,
                value: functionValue,
                gradient: gradient,
                iteration: this.currentIteration,
                converged: this.hasConverged
            };
        };
        
        // Run the algorithm until convergence or max iterations
        this.run = function() {
            while (!this.hasConverged && this.currentIteration < this.maxIterations) {
                this.step();
            }
            
            return {
                finalPosition: this.currentPosition,
                finalValue: this.function.evaluate(this.currentPosition).modulus(),
                iterations: this.currentIteration,
                history: this.history,
                converged: this.hasConverged
            };
        };
        
        // Reset the algorithm
        this.reset = function() {
            this.history = [];
            this.currentIteration = 0;
            this.currentPosition = null;
            this.hasConverged = false;
        };
        
        // Get the current state
        this.getState = function() {
            return {
                currentPosition: this.currentPosition,
                currentValue: this.function ? this.function.evaluate(this.currentPosition).modulus() : null,
                currentGradient: this.function ? this.function.evaluateDerivative(this.currentPosition) : null,
                iteration: this.currentIteration,
                history: this.history,
                converged: this.hasConverged
            };
        };
        
        // Update learning rate
        this.setLearningRate = function(rate) {
            this.learningRate = rate;
            return this;
        };
    }
};
