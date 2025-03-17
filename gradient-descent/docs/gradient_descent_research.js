// Research notes on Gradient Descent Algorithm

/*
Gradient Descent Algorithm - Mathematical Foundation

1. Basic Concept:
   - Gradient descent is an optimization algorithm used to minimize a function
   - It works by iteratively moving in the direction of steepest descent (negative gradient)
   - Formula: xᵢ₊₁ = xᵢ - α▽fᵢ
     where:
     * xᵢ₊₁ is the next position
     * xᵢ is the current position
     * α is the learning rate (step size)
     * ▽fᵢ is the gradient of the function at the current position

2. Gradient Calculation:
   - For single variable functions: ▽f(x) = df/dx
   - For multivariate functions: ▽f(x,y) = [∂f/∂x, ∂f/∂y]
   - For complex functions: ▽f(z) = ∂f/∂z where z = x + iy

3. Types of Gradient Descent:
   - Batch Gradient Descent: Uses entire dataset to compute gradient
   - Stochastic Gradient Descent: Uses single data point to compute gradient
   - Mini-batch Gradient Descent: Uses subset of data to compute gradient

4. Convergence Criteria:
   - Gradient magnitude becomes very small
   - Change in function value becomes very small
   - Maximum number of iterations reached

5. Challenges:
   - Learning rate selection (too small: slow convergence, too large: overshooting)
   - Local minima vs. global minima
   - Saddle points
   - Plateaus with small gradients

6. Variations:
   - Momentum: Adds fraction of previous update to current update
   - Adaptive learning rates: Adjusts learning rate during training
   - Second-order methods: Uses Hessian matrix (curvature information)
*/
