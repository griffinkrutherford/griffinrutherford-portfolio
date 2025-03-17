# Gradient Descent Visualizer

A web-based interactive tool that visualizes the gradient descent algorithm for single variable, multivariate, and complex functions. This educational tool helps users understand how gradient descent works by providing real-time visualization of the algorithm's iterations.

## Features

- **Single Variable Visualization**: Visualize gradient descent on 1D functions with interactive controls
- **Multivariate Visualization**: Explore gradient descent on 2D functions with contour plots
- **Complex Function Visualization**: Understand gradient descent on complex functions with domain coloring
- **Interactive Controls**: Adjust learning rate, starting points, and other parameters in real-time
- **Step-by-Step Execution**: Run the algorithm step by step or continuously
- **Multiple Predefined Functions**: Choose from a variety of predefined functions or create custom ones

## Mathematical Background

Gradient descent is an optimization algorithm that finds the minimum of a function by iteratively moving in the direction of steepest descent, as defined by the negative of the gradient. The algorithm follows the formula:

xᵢ₊₁ = xᵢ - α▽fᵢ

Where:
- xᵢ is the current position
- α is the learning rate
- ▽fᵢ is the gradient at the current position
- xᵢ₊₁ is the next position

For complex functions, the gradient is calculated using the Wirtinger derivatives, and the direction of steepest descent for |f(z)| is given by 2 * conjugate(f'(z)).

## Usage

1. Select the type of function (Single Variable, Multivariate, or Complex)
2. Choose a predefined function from the dropdown menu
3. Set the starting point for the algorithm
4. Adjust the learning rate using the slider
5. Use the "Step" button to perform a single iteration
6. Use the "Run" button to continuously run the algorithm
7. Use the "Reset" button to start over

## Implementation Details

The visualizer is implemented using vanilla JavaScript with ES6 modules and HTML5 Canvas for rendering. The code is organized into the following components:

- **Math Components**: Implement mathematical functions and gradient descent algorithms
- **UI Components**: Handle user interface elements and controls
- **Visualization Components**: Render functions and algorithm progress on canvas
- **Main Application**: Coordinates between components and manages application state

## Development

### Prerequisites

- Modern web browser with ES6 module support
- Basic understanding of calculus and optimization algorithms

### Project Structure

```
gradient_descent_visualizer/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # CSS styles
├── js/
│   ├── app.js              # Main application file
│   ├── main.js             # Single variable visualizer
│   ├── multivariate-visualizer.js  # Multivariate visualizer
│   ├── complex-visualizer.js       # Complex function visualizer
│   ├── math/
│   │   ├── functions.js            # Single variable functions
│   │   ├── descent.js              # Single variable gradient descent
│   │   ├── multivariate.js         # Multivariate functions
│   │   ├── multivariate-descent.js # Multivariate gradient descent
│   │   ├── complex.js              # Complex functions and operations
│   │   └── complex-descent.js      # Complex gradient descent
│   └── ui/
│       ├── canvas.js               # Single variable canvas manager
│       ├── controls.js             # Single variable control panel
│       ├── multivariate-canvas.js  # Multivariate canvas manager
│       ├── multivariate-controls.js # Multivariate control panel
│       ├── complex-canvas.js       # Complex canvas manager
│       └── complex-controls.js     # Complex control panel
└── docs/
    ├── website_integration.md      # Guide for website integration
    └── architecture.md             # Architecture documentation
```

## Credits

This project was created as an educational tool to help understand the gradient descent algorithm and its applications in different domains. It was inspired by coursework in Scientific Computing and Machine Learning.

## License

This project is open source and available under the MIT License.
