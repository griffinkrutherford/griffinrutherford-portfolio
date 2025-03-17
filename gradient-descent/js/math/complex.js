/**
 * complex.js
 * Implements complex number operations and complex functions for the visualizer
 */

// Complex number class
class Complex {
    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
    }

    // Addition
    add(other) {
        return new Complex(
            this.real + other.real,
            this.imag + other.imag
        );
    }

    // Subtraction
    subtract(other) {
        return new Complex(
            this.real - other.real,
            this.imag - other.imag
        );
    }

    // Multiplication
    multiply(other) {
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }

    // Division
    divide(other) {
        const denominator = other.real * other.real + other.imag * other.imag;
        return new Complex(
            (this.real * other.real + this.imag * other.imag) / denominator,
            (this.imag * other.real - this.real * other.imag) / denominator
        );
    }

    // Modulus (absolute value)
    modulus() {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }

    // Argument (phase angle)
    argument() {
        return Math.atan2(this.imag, this.real);
    }

    // Complex conjugate
    conjugate() {
        return new Complex(this.real, -this.imag);
    }

    // Exponentiation
    exp() {
        const expReal = Math.exp(this.real);
        return new Complex(
            expReal * Math.cos(this.imag),
            expReal * Math.sin(this.imag)
        );
    }

    // Natural logarithm
    log() {
        return new Complex(
            Math.log(this.modulus()),
            this.argument()
        );
    }

    // Power
    pow(n) {
        if (n instanceof Complex) {
            // Complex power
            return this.log().multiply(n).exp();
        } else {
            // Real power
            const r = Math.pow(this.modulus(), n);
            const theta = this.argument() * n;
            return new Complex(
                r * Math.cos(theta),
                r * Math.sin(theta)
            );
        }
    }

    // Sine
    sin() {
        return new Complex(
            Math.sin(this.real) * Math.cosh(this.imag),
            Math.cos(this.real) * Math.sinh(this.imag)
        );
    }

    // Cosine
    cos() {
        return new Complex(
            Math.cos(this.real) * Math.cosh(this.imag),
            -Math.sin(this.real) * Math.sinh(this.imag)
        );
    }

    // String representation
    toString() {
        if (this.imag === 0) return `${this.real}`;
        if (this.real === 0) return `${this.imag}i`;
        if (this.imag < 0) return `${this.real} - ${-this.imag}i`;
        return `${this.real} + ${this.imag}i`;
    }

    // Create a complex number from polar form
    static fromPolar(r, theta) {
        return new Complex(
            r * Math.cos(theta),
            r * Math.sin(theta)
        );
    }
}

// ComplexFunction class to represent complex functions
class ComplexFunction {
    constructor(name, fn, derivative, domain = [-2, 2, -2, 2], description = "") {
        this.name = name;
        this.fn = fn;
        this.derivative = derivative;
        this.domain = domain; // [xMin, xMax, yMin, yMax]
        this.description = description;
    }

    // Evaluate the function at a complex point
    evaluate(z) {
        if (!(z instanceof Complex)) {
            z = new Complex(z.real, z.imag);
        }
        return this.fn(z);
    }

    // Evaluate the derivative at a complex point
    evaluateDerivative(z) {
        if (!(z instanceof Complex)) {
            z = new Complex(z.real, z.imag);
        }
        return this.derivative(z);
    }
}

// Collection of predefined complex functions
const complexFunctions = {
    // Identity function
    identity: new ComplexFunction(
        "Identity Function",
        z => z,
        z => new Complex(1, 0),
        [-2, 2, -2, 2],
        "f(z) = z - Simple identity function"
    ),

    // Square function
    square: new ComplexFunction(
        "Square Function",
        z => z.multiply(z),
        z => new Complex(2, 0).multiply(z),
        [-2, 2, -2, 2],
        "f(z) = z² - Square function"
    ),

    // Cube function
    cube: new ComplexFunction(
        "Cube Function",
        z => z.multiply(z).multiply(z),
        z => new Complex(3, 0).multiply(z).multiply(z),
        [-2, 2, -2, 2],
        "f(z) = z³ - Cube function"
    ),

    // Exponential function
    exponential: new ComplexFunction(
        "Exponential Function",
        z => z.exp(),
        z => z.exp(),
        [-2, 2, -2, 2],
        "f(z) = e^z - Exponential function"
    ),

    // Sine function
    sine: new ComplexFunction(
        "Sine Function",
        z => z.sin(),
        z => z.cos(),
        [-Math.PI, Math.PI, -Math.PI, Math.PI],
        "f(z) = sin(z) - Sine function"
    ),

    // Reciprocal function
    reciprocal: new ComplexFunction(
        "Reciprocal Function",
        z => new Complex(1, 0).divide(z),
        z => new Complex(-1, 0).divide(z.multiply(z)),
        [-2, 2, -2, 2],
        "f(z) = 1/z - Reciprocal function with pole at z = 0"
    ),

    // Möbius transformation
    mobius: new ComplexFunction(
        "Möbius Transformation",
        z => {
            const a = new Complex(1, 0);
            const b = new Complex(0, 1);
            const c = new Complex(-1, 0);
            const d = new Complex(0, 1);
            return a.multiply(z).add(b).divide(c.multiply(z).add(d));
        },
        z => {
            const a = new Complex(1, 0);
            const b = new Complex(0, 1);
            const c = new Complex(-1, 0);
            const d = new Complex(0, 1);
            const denominator = c.multiply(z).add(d);
            return a.multiply(d).subtract(b.multiply(c)).divide(denominator.multiply(denominator));
        },
        [-2, 2, -2, 2],
        "f(z) = (z + i)/(-z + i) - Möbius transformation"
    ),

    // Complex polynomial
    polynomial: new ComplexFunction(
        "Complex Polynomial",
        z => {
            const z2 = z.multiply(z);
            const z3 = z2.multiply(z);
            return z3.subtract(new Complex(2, 0).multiply(z));
        },
        z => {
            const z2 = z.multiply(z);
            return new Complex(3, 0).multiply(z2).subtract(new Complex(2, 0));
        },
        [-2, 2, -2, 2],
        "f(z) = z³ - 2z - Complex polynomial with interesting roots"
    )
};

// Function to create a custom complex function
function createCustomComplexFunction(fnString, derivativeString) {
    try {
        // Create function from string
        const fnCode = `
            return function(z) {
                const real = z.real;
                const imag = z.imag;
                // Helper functions
                const add = (a, b) => new Complex(a.real + b.real, a.imag + b.imag);
                const subtract = (a, b) => new Complex(a.real - b.real, a.imag - b.imag);
                const multiply = (a, b) => new Complex(a.real * b.real - a.imag * b.imag, a.real * b.imag + a.imag * b.real);
                const divide = (a, b) => {
                    const denominator = b.real * b.real + b.imag * b.imag;
                    return new Complex(
                        (a.real * b.real + a.imag * b.imag) / denominator,
                        (a.imag * b.real - a.real * b.imag) / denominator
                    );
                };
                const exp = (a) => {
                    const expReal = Math.exp(a.real);
                    return new Complex(
                        expReal * Math.cos(a.imag),
                        expReal * Math.sin(a.imag)
                    );
                };
                const sin = (a) => new Complex(
                    Math.sin(a.real) * Math.cosh(a.imag),
                    Math.cos(a.real) * Math.sinh(a.imag)
                );
                const cos = (a) => new Complex(
                    Math.cos(a.real) * Math.cosh(a.imag),
                    -Math.sin(a.real) * Math.sinh(a.imag)
                );
                
                // Function body
                ${fnString}
            }
        `;
        
        const fn = new Function('Complex', fnCode)(Complex);
        
        // Create derivative function from string if provided
        let derivative;
        if (derivativeString && derivativeString.trim() !== '') {
            const derivativeCode = `
                return function(z) {
                    const real = z.real;
                    const imag = z.imag;
                    // Helper functions
                    const add = (a, b) => new Complex(a.real + b.real, a.imag + b.imag);
                    const subtract = (a, b) => new Complex(a.real - b.real, a.imag - b.imag);
                    const multiply = (a, b) => new Complex(a.real * b.real - a.imag * b.imag, a.real * b.imag + a.imag * b.real);
                    const divide = (a, b) => {
                        const denominator = b.real * b.real + b.imag * b.imag;
                        return new Complex(
                            (a.real * b.real + a.imag * b.imag) / denominator,
                            (a.imag * b.real - a.real * b.imag) / denominator
                        );
                    };
                    const exp = (a) => {
                        const expReal = Math.exp(a.real);
                        return new Complex(
                            expReal * Math.cos(a.imag),
                            expReal * Math.sin(a.imag)
                        );
                    };
                    const sin = (a) => new Complex(
                        Math.sin(a.real) * Math.cosh(a.imag),
                        Math.cos(a.real) * Math.sinh(a.imag)
                    );
                    const cos = (a) => new Complex(
                        Math.cos(a.real) * Math.cosh(a.imag),
                        -Math.sin(a.real) * Math.sinh(a.imag)
                    );
                    
                    // Derivative body
                    ${derivativeString}
                }
            `;
            
            derivative = new Function('Complex', derivativeCode)(Complex);
        } else {
            // Use numerical differentiation if derivative not provided
            derivative = z => {
                const h = 0.0001;
                const zh = new Complex(z.real + h, z.imag);
                const fz = fn(z);
                const fzh = fn(zh);
                return fzh.subtract(fz).divide(new Complex(h, 0));
            };
        }
        
        return new ComplexFunction(
            "Custom Complex Function",
            fn,
            derivative,
            [-2, 2, -2, 2],
            `f(z) = ${fnString} - Custom user-defined complex function`
        );
    } catch (error) {
        console.error("Error creating custom complex function:", error);
        return null;
    }
}

// Export classes and functions
export { Complex, ComplexFunction, complexFunctions, createCustomComplexFunction };
