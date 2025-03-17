/**
 * functions.js
 * Contains predefined functions and utilities for function evaluation
 */

// Function class to represent mathematical functions
class MathFunction {
    constructor(name, fn, derivative, domain = [-10, 10], description = "") {
        this.name = name;
        this.fn = fn;
        this.derivative = derivative;
        this.domain = domain;
        this.description = description;
    }

    // Evaluate the function at a point
    evaluate(x) {
        return this.fn(x);
    }

    // Evaluate the derivative at a point
    evaluateDerivative(x) {
        return this.derivative(x);
    }
}

// Collection of predefined single variable functions
const singleVariableFunctions = {
    // Quadratic function (parabola)
    quadratic: new MathFunction(
        "Quadratic Function",
        x => x * x,
        x => 2 * x,
        [-5, 5],
        "f(x) = x² - Simple quadratic function with minimum at x = 0"
    ),

    // Cubic function
    cubic: new MathFunction(
        "Cubic Function",
        x => x * x * x - 3 * x,
        x => 3 * x * x - 3,
        [-2, 2],
        "f(x) = x³ - 3x - Cubic function with local maximum and minimum"
    ),

    // Sine function
    sine: new MathFunction(
        "Sine Function",
        x => Math.sin(x),
        x => Math.cos(x),
        [-Math.PI * 2, Math.PI * 2],
        "f(x) = sin(x) - Trigonometric function with multiple local minima and maxima"
    ),

    // Exponential function
    exponential: new MathFunction(
        "Exponential Function",
        x => Math.exp(x) - 5,
        x => Math.exp(x),
        [-5, 3],
        "f(x) = e^x - 5 - Exponential function with minimum at x = ln(5)"
    ),

    // Logarithmic function
    logarithmic: new MathFunction(
        "Logarithmic Function",
        x => -Math.log(x) + 3 * x,
        x => -1 / x + 3,
        [0.1, 5],
        "f(x) = -ln(x) + 3x - Function with minimum at x = 1/3"
    ),

    // Function with multiple local minima
    multipleMinima: new MathFunction(
        "Multiple Minima Function",
        x => Math.sin(5 * x) * Math.exp(-0.2 * x * x) + 0.1 * x * x,
        x => 5 * Math.cos(5 * x) * Math.exp(-0.2 * x * x) - 
             0.4 * x * Math.sin(5 * x) * Math.exp(-0.2 * x * x) + 
             0.2 * x,
        [-3, 3],
        "f(x) = sin(5x) * e^(-0.2x²) + 0.1x² - Function with multiple local minima"
    ),

    // Challenging function for gradient descent
    challenging: new MathFunction(
        "Challenging Function",
        x => 0.1 * x * x * x * x - 0.5 * x * x + 0.2 * x + 2,
        x => 0.4 * x * x * x - x + 0.2,
        [-3, 3],
        "f(x) = 0.1x⁴ - 0.5x² + 0.2x + 2 - Function with challenging gradient landscape"
    )
};

// Function to parse a custom function string and create a MathFunction object
function createCustomFunction(fnString, derivativeString) {
    try {
        // Create function from string
        const fn = new Function('x', `return ${fnString};`);
        
        // Create derivative function from string if provided
        let derivative;
        if (derivativeString && derivativeString.trim() !== '') {
            derivative = new Function('x', `return ${derivativeString};`);
        } else {
            // Use numerical differentiation if derivative not provided
            derivative = x => {
                const h = 0.0001;
                return (fn(x + h) - fn(x)) / h;
            };
        }
        
        return new MathFunction(
            "Custom Function",
            fn,
            derivative,
            [-10, 10],
            `f(x) = ${fnString} - Custom user-defined function`
        );
    } catch (error) {
        console.error("Error creating custom function:", error);
        return null;
    }
}

// Export functions
export { MathFunction, singleVariableFunctions, createCustomFunction };
