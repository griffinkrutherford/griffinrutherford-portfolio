/**
 * canvas.js
 * Handles canvas setup and rendering for visualizations
 */

class CanvasManager {
    constructor(canvasId, options = {}) {
        // Get canvas element
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id '${canvasId}' not found`);
        }
        
        // Get 2D context
        this.ctx = this.canvas.getContext('2d');
        
        // Set default options
        this.options = {
            padding: options.padding || 40,
            axisColor: options.axisColor || '#333',
            gridColor: options.gridColor || '#ddd',
            functionColor: options.functionColor || '#2196F3',
            pointColor: options.pointColor || '#F44336',
            gradientColor: options.gradientColor || '#4CAF50',
            pathColor: options.pathColor || 'rgba(244, 67, 54, 0.5)',
            backgroundColor: options.backgroundColor || '#fff',
            animationDuration: options.animationDuration || 300,
            showGrid: options.showGrid !== undefined ? options.showGrid : true,
            showAxes: options.showAxes !== undefined ? options.showAxes : true,
            showLabels: options.showLabels !== undefined ? options.showLabels : true
        };
        
        // Set initial view bounds
        this.viewBounds = {
            xMin: -5,
            xMax: 5,
            yMin: -5,
            yMax: 5
        };
        
        // Initialize
        this.init();
    }
    
    // Initialize canvas
    init() {
        // Set canvas size to match display size
        this.resize();
        
        // Add event listeners for resizing
        window.addEventListener('resize', () => this.resize());
        
        // Clear canvas with background color
        this.clear();
    }
    
    // Resize canvas to match display size
    resize() {
        // Get the display size of the canvas
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        
        // Check if the canvas is not the same size
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            // Make the canvas the same size
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
    }
    
    // Clear canvas
    clear() {
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Set view bounds
    setViewBounds(xMin, xMax, yMin, yMax) {
        this.viewBounds = { xMin, xMax, yMin, yMax };
    }
    
    // Convert from world coordinates to canvas coordinates
    worldToCanvas(x, y) {
        const { xMin, xMax, yMin, yMax } = this.viewBounds;
        const { width, height } = this.canvas;
        const padding = this.options.padding;
        
        // Calculate available space
        const availableWidth = width - 2 * padding;
        const availableHeight = height - 2 * padding;
        
        // Convert coordinates
        const canvasX = padding + (x - xMin) / (xMax - xMin) * availableWidth;
        const canvasY = height - padding - (y - yMin) / (yMax - yMin) * availableHeight;
        
        return { x: canvasX, y: canvasY };
    }
    
    // Convert from canvas coordinates to world coordinates
    canvasToWorld(canvasX, canvasY) {
        const { xMin, xMax, yMin, yMax } = this.viewBounds;
        const { width, height } = this.canvas;
        const padding = this.options.padding;
        
        // Calculate available space
        const availableWidth = width - 2 * padding;
        const availableHeight = height - 2 * padding;
        
        // Convert coordinates
        const x = xMin + (canvasX - padding) / availableWidth * (xMax - xMin);
        const y = yMin + (height - canvasY - padding) / availableHeight * (yMax - yMin);
        
        return { x, y };
    }
    
    // Draw coordinate axes
    drawAxes() {
        if (!this.options.showAxes) return;
        
        const { ctx } = this;
        const { width, height } = this.canvas;
        const { xMin, xMax, yMin, yMax } = this.viewBounds;
        
        ctx.save();
        ctx.strokeStyle = this.options.axisColor;
        ctx.lineWidth = 1;
        
        // Draw x-axis if it's in view
        if (yMin <= 0 && yMax >= 0) {
            const { x: x0, y: y0 } = this.worldToCanvas(xMin, 0);
            const { x: x1, y: y1 } = this.worldToCanvas(xMax, 0);
            
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y0);
            ctx.stroke();
            
            // Draw x-axis arrow
            ctx.beginPath();
            ctx.moveTo(x1, y0);
            ctx.lineTo(x1 - 10, y0 - 5);
            ctx.lineTo(x1 - 10, y0 + 5);
            ctx.closePath();
            ctx.fill();
            
            // Draw x-axis label
            if (this.options.showLabels) {
                ctx.fillStyle = this.options.axisColor;
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('x', x1 - 5, y0 + 20);
            }
        }
        
        // Draw y-axis if it's in view
        if (xMin <= 0 && xMax >= 0) {
            const { x: x0, y: y0 } = this.worldToCanvas(0, yMin);
            const { x: x1, y: y1 } = this.worldToCanvas(0, yMax);
            
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x0, y1);
            ctx.stroke();
            
            // Draw y-axis arrow
            ctx.beginPath();
            ctx.moveTo(x0, y1);
            ctx.lineTo(x0 - 5, y1 + 10);
            ctx.lineTo(x0 + 5, y1 + 10);
            ctx.closePath();
            ctx.fill();
            
            // Draw y-axis label
            if (this.options.showLabels) {
                ctx.fillStyle = this.options.axisColor;
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('y', x0 - 20, y1 + 5);
            }
        }
        
        ctx.restore();
    }
    
    // Draw grid
    drawGrid() {
        if (!this.options.showGrid) return;
        
        const { ctx } = this;
        const { width, height } = this.canvas;
        const { xMin, xMax, yMin, yMax } = this.viewBounds;
        
        ctx.save();
        ctx.strokeStyle = this.options.gridColor;
        ctx.lineWidth = 0.5;
        
        // Calculate grid spacing
        const xRange = xMax - xMin;
        const yRange = yMax - yMin;
        
        const xStep = this.calculateGridStep(xRange);
        const yStep = this.calculateGridStep(yRange);
        
        // Draw vertical grid lines
        for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
            const { x: canvasX, y: startY } = this.worldToCanvas(x, yMin);
            const { y: endY } = this.worldToCanvas(x, yMax);
            
            ctx.beginPath();
            ctx.moveTo(canvasX, startY);
            ctx.lineTo(canvasX, endY);
            ctx.stroke();
            
            // Draw x-axis labels
            if (this.options.showLabels && Math.abs(x) > 0.0001) {
                const { y: labelY } = this.worldToCanvas(0, 0);
                ctx.fillStyle = this.options.axisColor;
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(x.toFixed(1), canvasX, labelY + 20);
            }
        }
        
        // Draw horizontal grid lines
        for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
            const { x: startX, y: canvasY } = this.worldToCanvas(xMin, y);
            const { x: endX } = this.worldToCanvas(xMax, y);
            
            ctx.beginPath();
            ctx.moveTo(startX, canvasY);
            ctx.lineTo(endX, canvasY);
            ctx.stroke();
            
            // Draw y-axis labels
            if (this.options.showLabels && Math.abs(y) > 0.0001) {
                const { x: labelX } = this.worldToCanvas(0, 0);
                ctx.fillStyle = this.options.axisColor;
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(y.toFixed(1), labelX - 10, canvasY + 5);
            }
        }
        
        ctx.restore();
    }
    
    // Calculate appropriate grid step size
    calculateGridStep(range) {
        const targetSteps = 10; // Aim for about 10 grid lines
        const rawStep = range / targetSteps;
        
        // Round to a nice number
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const normalized = rawStep / magnitude;
        
        if (normalized < 1.5) return magnitude;
        if (normalized < 3.5) return 2 * magnitude;
        if (normalized < 7.5) return 5 * magnitude;
        return 10 * magnitude;
    }
    
    // Draw a function
    drawFunction(mathFunction, options = {}) {
        const { ctx } = this;
        const { xMin, xMax } = this.viewBounds;
        
        // Set drawing style
        ctx.save();
        ctx.strokeStyle = options.color || this.options.functionColor;
        ctx.lineWidth = options.lineWidth || 2;
        
        // Start path
        ctx.beginPath();
        
        // Calculate number of points to draw
        const numPoints = options.numPoints || Math.max(100, this.canvas.width / 2);
        const step = (xMax - xMin) / numPoints;
        
        // Draw function
        let firstPoint = true;
        for (let x = xMin; x <= xMax; x += step) {
            try {
                const y = mathFunction.evaluate(x);
                
                // Skip if y is not a finite number
                if (!isFinite(y)) continue;
                
                const { x: canvasX, y: canvasY } = this.worldToCanvas(x, y);
                
                if (firstPoint) {
                    ctx.moveTo(canvasX, canvasY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            } catch (error) {
                // Skip points where function evaluation fails
                continue;
            }
        }
        
        // Stroke path
        ctx.stroke();
        ctx.restore();
    }
    
    // Draw a point
    drawPoint(x, y, options = {}) {
        const { ctx } = this;
        const { x: canvasX, y: canvasY } = this.worldToCanvas(x, y);
        
        const radius = options.radius || 6;
        const color = options.color || this.options.pointColor;
        
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw point label if provided
        if (options.label) {
            ctx.fillStyle = options.labelColor || '#000';
            ctx.font = options.font || '12px Arial';
            ctx.textAlign = options.textAlign || 'center';
            ctx.textBaseline = options.textBaseline || 'bottom';
            ctx.fillText(options.label, canvasX, canvasY - radius - 5);
        }
        
        ctx.restore();
    }
    
    // Draw a line
    drawLine(x1, y1, x2, y2, options = {}) {
        const { ctx } = this;
        const { x: canvasX1, y: canvasY1 } = this.worldToCanvas(x1, y1);
        const { x: canvasX2, y: canvasY2 } = this.worldToCanvas(x2, y2);
        
        ctx.save();
        ctx.strokeStyle = options.color || '#000';
        ctx.lineWidth = options.lineWidth || 1;
        
        if (options.dashed) {
            ctx.setLineDash([5, 3]);
        }
        
        ctx.beginPath();
        ctx.moveTo(canvasX1, canvasY1);
        ctx.lineTo(canvasX2, canvasY2);
        ctx.stroke();
        
        // Draw arrow if requested
        if (options.arrow) {
            const angle = Math.atan2(canvasY2 - canvasY1, canvasX2 - canvasX1);
            const arrowSize = options.arrowSize || 10;
            
            ctx.beginPath();
            ctx.moveTo(canvasX2, canvasY2);
            ctx.lineTo(
                canvasX2 - arrowSize * Math.cos(angle - Math.PI / 6),
                canvasY2 - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                canvasX2 - arrowSize * Math.cos(angle + Math.PI / 6),
                canvasY2 - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = options.color || '#000';
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // Draw a path (series of points)
    drawPath(points, options = {}) {
        const { ctx } = this;
        
        if (!points || points.length < 2) return;
        
        ctx.save();
        ctx.strokeStyle = options.color || this.options.pathColor;
        ctx.lineWidth = options.lineWidth || 2;
        
        ctx.beginPath();
        
        // Draw path
        const firstPoint = points[0];
        const { x: firstX, y: firstY } = this.worldToCanvas(
            options.xAccessor ? options.xAccessor(firstPoint) : firstPoint.x,
            options.yAccessor ? options.yAccessor(firstPoint) : firstPoint.y
        );
        
        ctx.moveTo(firstX, firstY);
        
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            const { x: canvasX, y: canvasY } = this.worldToCanvas(
                options.xAccessor ? options.xAccessor(point) : point.x,
                options.yAccessor ? options.yAccessor(point) : point.y
            );
            
            ctx.lineTo(canvasX, canvasY);
        }
        
        ctx.stroke();
        
        // Draw points along the path if requested
        if (options.showPoints) {
            const pointRadius = options.pointRadius || 3;
            const pointColor = options.pointColor || this.options.pointColor;
            
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                this.drawPoint(
                    options.xAccessor ? options.xAccessor(point) : point.x,
                    options.yAccessor ? options.yAccessor(point) : point.y,
                    { radius: pointRadius, color: pointColor }
                );
            }
        }
        
        ctx.restore();
    }
    
    // Draw gradient vector
    drawGradientVector(x, y, gradient, options = {}) {
        const { ctx } = this;
        
        // Scale gradient for better visualization
        const scale = options.scale || 0.5;
        const scaledGradient = gradient * scale;
        
        // Draw line representing gradient
        this.drawLine(
            x, y,
            x - scaledGradient, y,
            {
                color: options.color || this.options.gradientColor,
                lineWidth: options.lineWidth || 2,
                arrow: true,
                arrowSize: options.arrowSize || 8
            }
        );
        
        // Draw gradient label if requested
        if (options.showLabel) {
            const { x: labelX, y: labelY } = this.worldToCanvas(x - scaledGradient / 2, y);
            
            ctx.save();
            ctx.fillStyle = options.labelColor || this.options.gradientColor;
            ctx.font = options.font || '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`∇f = ${gradient.toFixed(2)}`, labelX, labelY - 10);
            ctx.restore();
        }
    }
    
    // Render the entire scene
    render(scene) {
        // Clear canvas
        this.clear();
        
        // Draw grid and axes
        this.drawGrid();
        this.drawAxes();
        
        // Draw function if provided
        if (scene.function) {
            this.drawFunction(scene.function, scene.functionOptions);
        }
        
        // Draw path if provided
        if (scene.path) {
            this.drawPath(scene.path, scene.pathOptions);
        }
        
        // Draw current point if provided
        if (scene.currentPoint) {
            this.drawPoint(
                scene.currentPoint.x,
                scene.currentPoint.y,
                scene.pointOptions
            );
            
            // Draw gradient vector if provided
            if (scene.currentPoint.gradient !== undefined) {
                this.drawGradientVector(
                    scene.currentPoint.x,
                    scene.currentPoint.y,
                    scene.currentPoint.gradient,
                    scene.gradientOptions
                );
            }
        }
        
        // Draw additional elements if provided
        if (scene.additionalRender) {
            scene.additionalRender(this);
        }
    }
    
    // Auto-adjust view bounds based on function and points
    autoAdjustViewBounds(mathFunction, points = [], padding = 0.2) {
        if (!mathFunction) return;
        
        // Start with function domain
        let xMin = mathFunction.domain[0];
        let xMax = mathFunction.domain[1];
        
        // Initialize y bounds
        let yMin = Infinity;
        let yMax = -Infinity;
        
        // Sample function to find y bounds
        const numSamples = 100;
        const step = (xMax - xMin) / numSamples;
        
        for (let x = xMin; x <= xMax; x += step) {
            try {
                const y = mathFunction.evaluate(x);
                if (isFinite(y)) {
                    yMin = Math.min(yMin, y);
                    yMax = Math.max(yMax, y);
                }
            } catch (error) {
                // Skip points where function evaluation fails
                continue;
            }
        }
        
        // Consider points if provided
        if (points && points.length > 0) {
            for (const point of points) {
                if (point.x !== undefined) {
                    xMin = Math.min(xMin, point.x);
                    xMax = Math.max(xMax, point.x);
                }
                if (point.y !== undefined) {
                    yMin = Math.min(yMin, point.y);
                    yMax = Math.max(yMax, point.y);
                }
            }
        }
        
        // Add padding
        const xPadding = (xMax - xMin) * padding;
        const yPadding = (yMax - yMin) * padding;
        
        xMin -= xPadding;
        xMax += xPadding;
        yMin -= yPadding;
        yMax += yPadding;
        
        // Ensure minimum range
        if (xMax - xMin < 1) {
            const center = (xMax + xMin) / 2;
            xMin = center - 0.5;
            xMax = center + 0.5;
        }
        
        if (yMax - yMin < 1) {
            const center = (yMax + yMin) / 2;
            yMin = center - 0.5;
            yMax = center + 0.5;
        }
        
        // Update view bounds
        this.setViewBounds(xMin, xMax, yMin, yMax);
    }
}

// Export the CanvasManager class
export { CanvasManager };
