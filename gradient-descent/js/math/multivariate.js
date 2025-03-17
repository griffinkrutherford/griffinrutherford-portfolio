/**
 * multivariate.js
 * Implements multivariate functions and gradient calculations for the visualizer
 */

// MultivariateFunction class to represent 2D → 1D functions
class MultivariateFunction {
    constructor(name, fn, gradientFn, domain = [[-5, 5], [-5, 5]], description = "") {
        this.name = name;
        this.fn = fn;
        this.gradientFn = gradientFn;
        this.domain = domain; // [[xMin, xMax], [yMin, yMax]]
        this.description = description;
    }

    // Evaluate the function at a point
    evaluate(point) {
        return this.fn(point[0], point[1]);
    }

    // Evaluate the gradient at a point
    evaluateGradient(point) {
        return this.gradientFn(point[0], point[1]);
    }
}

// Collection of predefined multivariate functions
const multivariateFunctions = {
    // Simple quadratic bowl
    quadraticBowl: new MultivariateFunction(
        "Quadratic Bowl",
        (x, y) => x * x + y * y,
        (x, y) => [2 * x, 2 * y],
        [[-5, 5], [-5, 5]],
        "f(x,y) = x² + y² - Simple quadratic function with minimum at (0,0)"
    ),

    // Rosenbrock function (banana function)
    rosenbrock: new MultivariateFunction(
        "Rosenbrock Function",
        (x, y) => 100 * Math.pow(y - x * x, 2) + Math.pow(1 - x, 2),
        (x, y) => [
            -400 * x * (y - x * x) - 2 * (1 - x),
            200 * (y - x * x)
        ],
        [[-2, 2], [-1, 3]],
        "f(x,y) = 100(y-x²)² + (1-x)² - Rosenbrock function with minimum at (1,1)"
    ),

    // Himmelblau's function
    himmelblau: new MultivariateFunction(
        "Himmelblau's Function",
        (x, y) => Math.pow(x * x + y - 11, 2) + Math.pow(x + y * y - 7, 2),
        (x, y) => [
            4 * x * (x * x + y - 11) + 2 * (x + y * y - 7),
            2 * (x * x + y - 11) + 4 * y * (x + y * y - 7)
        ],
        [[-5, 5], [-5, 5]],
        "f(x,y) = (x²+y-11)² + (x+y²-7)² - Himmelblau's function with four local minima"
    ),

    // Beale's function
    beale: new MultivariateFunction(
        "Beale's Function",
        (x, y) => Math.pow(1.5 - x + x * y, 2) + 
                  Math.pow(2.25 - x + x * y * y, 2) + 
                  Math.pow(2.625 - x + x * y * y * y, 2),
        (x, y) => [
            2 * (1.5 - x + x * y) * (y - 1) + 
            2 * (2.25 - x + x * y * y) * (y * y - 1) + 
            2 * (2.625 - x + x * y * y * y) * (y * y * y - 1),
            2 * (1.5 - x + x * y) * x + 
            4 * (2.25 - x + x * y * y) * x * y + 
            6 * (2.625 - x + x * y * y * y) * x * y * y
        ],
        [[-4.5, 4.5], [-4.5, 4.5]],
        "f(x,y) = (1.5-x+xy)² + (2.25-x+xy²)² + (2.625-x+xy³)² - Beale's function with minimum at (3,0.5)"
    ),

    // Booth's function
    booth: new MultivariateFunction(
        "Booth's Function",
        (x, y) => Math.pow(x + 2 * y - 7, 2) + Math.pow(2 * x + y - 5, 2),
        (x, y) => [
            2 * (x + 2 * y - 7) + 4 * (2 * x + y - 5),
            4 * (x + 2 * y - 7) + 2 * (2 * x + y - 5)
        ],
        [[-10, 10], [-10, 10]],
        "f(x,y) = (x+2y-7)² + (2x+y-5)² - Booth's function with minimum at (1,3)"
    ),

    // Three-hump camel function
    threeHumpCamel: new MultivariateFunction(
        "Three-Hump Camel Function",
        (x, y) => 2 * x * x - 1.05 * Math.pow(x, 4) + Math.pow(x, 6) / 6 + x * y + y * y,
        (x, y) => [
            4 * x - 4.2 * Math.pow(x, 3) + Math.pow(x, 5) + y,
            x + 2 * y
        ],
        [[-5, 5], [-5, 5]],
        "f(x,y) = 2x² - 1.05x⁴ + x⁶/6 + xy + y² - Three-hump camel function with minimum at (0,0)"
    ),

    // Saddle function
    saddle: new MultivariateFunction(
        "Saddle Function",
        (x, y) => x * x - y * y,
        (x, y) => [2 * x, -2 * y],
        [[-3, 3], [-3, 3]],
        "f(x,y) = x² - y² - Saddle function with saddle point at (0,0)"
    )
};

// Function to create a custom multivariate function
function createCustomMultivariateFunction(fnString, gradientXString, gradientYString) {
    try {
        // Create function from string
        const fn = new Function('x', 'y', `return ${fnString};`);
        
        // Create gradient function from strings if provided
        let gradientFn;
        if (gradientXString && gradientYString && 
            gradientXString.trim() !== '' && gradientYString.trim() !== '') {
            const gradX = new Function('x', 'y', `return ${gradientXString};`);
            const gradY = new Function('x', 'y', `return ${gradientYString};`);
            gradientFn = (x, y) => [gradX(x, y), gradY(x, y)];
        } else {
            // Use numerical differentiation if derivatives not provided
            gradientFn = (x, y) => {
                const h = 0.0001;
                const dfdx = (fn(x + h, y) - fn(x, y)) / h;
                const dfdy = (fn(x, y + h) - fn(x, y)) / h;
                return [dfdx, dfdy];
            };
        }
        
        return new MultivariateFunction(
            "Custom Function",
            fn,
            gradientFn,
            [[-10, 10], [-10, 10]],
            `f(x,y) = ${fnString} - Custom user-defined function`
        );
    } catch (error) {
        console.error("Error creating custom multivariate function:", error);
        return null;
    }
}

// Export functions
export { MultivariateFunction, multivariateFunctions, createCustomMultivariateFunction };
