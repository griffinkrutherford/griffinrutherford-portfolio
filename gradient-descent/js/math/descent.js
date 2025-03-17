/**
 * descent.js
 * Implements the gradient descent algorithm for different function types
 */

// GradientDescent class for single variable functions
class GradientDescent {
    constructor(options = {}) {
        // Learning rate (alpha)
        this.learningRate = options.learningRate || 0.1;
        // Maximum number of iterations
        this.maxIterations = options.maxIterations || 100;
        // Convergence threshold
        this.convergenceThreshold = options.convergenceThreshold || 0.0001;
        // History of points visited during descent
        this.history = [];
        // Current iteration count
        this.currentIteration = 0;
        // Current position
        this.currentPosition = null;
        // Function being optimized
        this.function = null;
        // Whether the algorithm has converged
        this.hasConverged = false;
    }

    // Initialize the algorithm with a function and starting point
    initialize(mathFunction, startingPoint) {
        this.function = mathFunction;
        this.currentPosition = startingPoint;
        this.history = [{ 
            x: startingPoint, 
            y: mathFunction.evaluate(startingPoint),
            gradient: mathFunction.evaluateDerivative(startingPoint)
        }];
        this.currentIteration = 0;
        this.hasConverged = false;
        
        return this;
    }

    // Perform a single step of gradient descent
    step() {
        if (this.hasConverged || this.currentIteration >= this.maxIterations) {
            return null;
        }

        // Calculate gradient at current position
        const gradient = this.function.evaluateDerivative(this.currentPosition);
        
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
            x: newPosition, 
            y: functionValue,
            gradient: gradient
        });
        
        // Check for convergence (if gradient is close to zero)
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
    }

    // Run the algorithm until convergence or max iterations
    run() {
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
    }

    // Reset the algorithm
    reset() {
        this.history = [];
        this.currentIteration = 0;
        this.currentPosition = null;
        this.hasConverged = false;
    }

    // Get the current state
    getState() {
        return {
            currentPosition: this.currentPosition,
            currentValue: this.function ? this.function.evaluate(this.currentPosition) : null,
            currentGradient: this.function ? this.function.evaluateDerivative(this.currentPosition) : null,
            iteration: this.currentIteration,
            history: this.history,
            converged: this.hasConverged
        };
    }

    // Update learning rate
    setLearningRate(rate) {
        this.learningRate = rate;
        return this;
    }

    // Update max iterations
    setMaxIterations(iterations) {
        this.maxIterations = iterations;
        return this;
    }

    // Update convergence threshold
    setConvergenceThreshold(threshold) {
        this.convergenceThreshold = threshold;
        return this;
    }
}

// Export the GradientDescent class
export { GradientDescent };
