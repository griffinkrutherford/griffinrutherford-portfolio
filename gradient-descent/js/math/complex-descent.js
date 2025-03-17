/**
 * complex-descent.js
 * Implements the gradient descent algorithm for complex functions
 */

import { Complex } from './complex.js';

// ComplexGradientDescent class
class ComplexGradientDescent {
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
        // Current position (complex number)
        this.currentPosition = null;
        // Function being optimized
        this.function = null;
        // Whether the algorithm has converged
        this.hasConverged = false;
    }

    // Initialize the algorithm with a function and starting point
    initialize(complexFunction, startingPoint) {
        this.function = complexFunction;
        this.currentPosition = startingPoint instanceof Complex 
            ? startingPoint 
            : new Complex(startingPoint.real, startingPoint.imag);
        
        const value = complexFunction.evaluate(this.currentPosition).modulus();
        const gradient = complexFunction.evaluateDerivative(this.currentPosition);
        
        this.history = [{ 
            position: this.currentPosition, 
            value: value,
            gradient: gradient
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

        // Calculate derivative at current position
        const derivative = this.function.evaluateDerivative(this.currentPosition);
        
        // For holomorphic functions, the gradient is 2 * conjugate(derivative)
        // This gives the direction of steepest descent of |f(z)|
        const gradient = derivative.conjugate().multiply(new Complex(2, 0));
        
        // Update position: z_new = z_old - learning_rate * gradient
        const step = gradient.multiply(new Complex(this.learningRate, 0));
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
    }

    // Run the algorithm until convergence or max iterations
    run() {
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
            currentValue: this.function ? this.function.evaluate(this.currentPosition).modulus() : null,
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

// Export the ComplexGradientDescent class
export { ComplexGradientDescent };
