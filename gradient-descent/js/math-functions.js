/* math-functions.js - Mathematical functions for the Gradient Descent Visualizer */

// Namespace for mathematical functions
var GDVMath = {
    // Single variable functions
    singleVariable: {
        // Predefined functions
        functions: {
            quadratic: {
                name: "Quadratic Function",
                expression: "f(x) = x² + 2",
                evaluate: function(x) {
                    return x * x + 2;
                },
                derivative: function(x) {
                    return 2 * x;
                },
                domain: [-10, 10]
            },
            cubic: {
                name: "Cubic Function",
                expression: "f(x) = x³ - 3x + 1",
                evaluate: function(x) {
                    return Math.pow(x, 3) - 3 * x + 1;
                },
                derivative: function(x) {
                    return 3 * Math.pow(x, 2) - 3;
                },
                domain: [-5, 5]
            },
            sine: {
                name: "Sine Function",
                expression: "f(x) = sin(x) + 0.2x",
                evaluate: function(x) {
                    return Math.sin(x) + 0.2 * x;
                },
                derivative: function(x) {
                    return Math.cos(x) + 0.2;
                },
                domain: [-10, 10]
            },
            logistic: {
                name: "Logistic Function",
                expression: "f(x) = 1 / (1 + e^(-x))",
                evaluate: function(x) {
                    return 1 / (1 + Math.exp(-x));
                },
                derivative: function(x) {
                    const sigmoid = 1 / (1 + Math.exp(-x));
                    return sigmoid * (1 - sigmoid);
                },
                domain: [-10, 10]
            },
            quartic: {
                name: "Quartic Function",
                expression: "f(x) = x⁴ - 4x² + 2",
                evaluate: function(x) {
                    return Math.pow(x, 4) - 4 * Math.pow(x, 2) + 2;
                },
                derivative: function(x) {
                    return 4 * Math.pow(x, 3) - 8 * x;
                },
                domain: [-5, 5]
            }
        }
    },
    
    // Multivariate functions
    multivariate: {
        // Predefined functions
        functions: {
            paraboloid: {
                name: "Paraboloid",
                expression: "f(x,y) = x² + y²",
                evaluate: function(x, y) {
                    return x * x + y * y;
                },
                gradient: function(x, y) {
                    return {
                        x: 2 * x,
                        y: 2 * y
                    };
                },
                domain: [-5, 5, -5, 5]
            },
            rosenbrock: {
                name: "Rosenbrock Function",
                expression: "f(x,y) = (1-x)² + 100(y-x²)²",
                evaluate: function(x, y) {
                    return Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2);
                },
                gradient: function(x, y) {
                    return {
                        x: -2 * (1 - x) - 400 * x * (y - x * x),
                        y: 200 * (y - x * x)
                    };
                },
                domain: [-2, 2, -1, 3]
            },
            himmelblau: {
                name: "Himmelblau's Function",
                expression: "f(x,y) = (x²+y-11)² + (x+y²-7)²",
                evaluate: function(x, y) {
                    return Math.pow(x * x + y - 11, 2) + Math.pow(x + y * y - 7, 2);
                },
                gradient: function(x, y) {
                    const term1 = x * x + y - 11;
                    const term2 = x + y * y - 7;
                    
                    return {
                        x: 4 * x * term1 + 2 * term2,
                        y: 2 * term1 + 4 * y * term2
                    };
                },
                domain: [-5, 5, -5, 5]
            },
            beale: {
                name: "Beale's Function",
                expression: "f(x,y) = (1.5-x+xy)² + (2.25-x+xy²)² + (2.625-x+xy³)²",
                evaluate: function(x, y) {
                    return Math.pow(1.5 - x + x * y, 2) + 
                           Math.pow(2.25 - x + x * y * y, 2) + 
                           Math.pow(2.625 - x + x * y * y * y, 2);
                },
                gradient: function(x, y) {
                    const term1 = 1.5 - x + x * y;
                    const term2 = 2.25 - x + x * y * y;
                    const term3 = 2.625 - x + x * y * y * y;
                    
                    return {
                        x: 2 * (term1 * (y - 1) + term2 * (y * y - 1) + term3 * (y * y * y - 1)),
                        y: 2 * (term1 * x + term2 * 2 * x * y + term3 * 3 * x * y * y)
                    };
                },
                domain: [-4.5, 4.5, -4.5, 4.5]
            },
            booth: {
                name: "Booth's Function",
                expression: "f(x,y) = (x+2y-7)² + (2x+y-5)²",
                evaluate: function(x, y) {
                    return Math.pow(x + 2 * y - 7, 2) + Math.pow(2 * x + y - 5, 2);
                },
                gradient: function(x, y) {
                    const term1 = x + 2 * y - 7;
                    const term2 = 2 * x + y - 5;
                    
                    return {
                        x: 2 * term1 + 4 * term2,
                        y: 4 * term1 + 2 * term2
                    };
                },
                domain: [-10, 10, -10, 10]
            }
        }
    },
    
    // Complex functions
    complex: {
        // Predefined functions
        functions: {
            identity: {
                name: "Identity Function",
                expression: "f(z) = z",
                evaluate: function(z) {
                    return z;
                },
                evaluateDerivative: function(z) {
                    return new GDVUtils.Complex(1, 0);
                },
                domain: [-2, 2, -2, 2]
            },
            square: {
                name: "Square Function",
                expression: "f(z) = z²",
                evaluate: function(z) {
                    return z.multiply(z);
                },
                evaluateDerivative: function(z) {
                    return new GDVUtils.Complex(2 * z.real, 2 * z.imag);
                },
                domain: [-2, 2, -2, 2]
            },
            reciprocal: {
                name: "Reciprocal Function",
                expression: "f(z) = 1/z",
                evaluate: function(z) {
                    return new GDVUtils.Complex(1, 0).divide(z);
                },
                evaluateDerivative: function(z) {
                    const denominator = z.multiply(z);
                    return new GDVUtils.Complex(-1, 0).divide(denominator);
                },
                domain: [-2, 2, -2, 2]
            },
            exponential: {
                name: "Exponential Function",
                expression: "f(z) = e^z",
                evaluate: function(z) {
                    const magnitude = Math.exp(z.real);
                    return new GDVUtils.Complex(
                        magnitude * Math.cos(z.imag),
                        magnitude * Math.sin(z.imag)
                    );
                },
                evaluateDerivative: function(z) {
                    // The derivative of e^z is e^z
                    return this.evaluate(z);
                },
                domain: [-2, 2, -2, 2]
            },
            sinusoidal: {
                name: "Sinusoidal Function",
                expression: "f(z) = sin(z)",
                evaluate: function(z) {
                    return new GDVUtils.Complex(
                        Math.sin(z.real) * Math.cosh(z.imag),
                        Math.cos(z.real) * Math.sinh(z.imag)
                    );
                },
                evaluateDerivative: function(z) {
                    // The derivative of sin(z) is cos(z)
                    return new GDVUtils.Complex(
                        Math.cos(z.real) * Math.cosh(z.imag),
                        -Math.sin(z.real) * Math.sinh(z.imag)
                    );
                },
                domain: [-3, 3, -3, 3]
            }
        }
    }
};
