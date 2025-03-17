/**
 * complex-canvas.js
 * Handles canvas visualization for complex functions using domain coloring
 */

import { Complex } from '../math/complex.js';

class ComplexCanvasManager {
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
            pointColor: options.pointColor || '#F44336',
            gradientColor: options.gradientColor || '#4CAF50',
            pathColor: options.pathColor || 'rgba(244, 67, 54, 0.5)',
            backgroundColor: options.backgroundColor || '#fff',
            showGrid: options.showGrid !== undefined ? options.showGrid : true,
            showAxes: options.showAxes !== undefined ? options.showAxes : true,
            showLabels: options.showLabels !== undefined ? options.showLabels : true,
            coloringMethod: options.coloringMethod || 'phase',
            resolution: options.resolution || 200
        };
        
        // Set initial view bounds
        this.viewBounds = {
            xMin: -2,
            xMax: 2,
            yMin: -2,
            yMax: 2
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
    
    // Convert from complex plane coordinates to canvas coordinates
    complexToCanvas(z) {
        const { xMin, xMax, yMin, yMax } = this.viewBounds;
        const { width, height } = this.canvas;
        const padding = this.options.padding;
        
        // Calculate available space
        const availableWidth = width - 2 * padding;
        const availableHeight = height - 2 * padding;
        
        // Convert coordinates
        const canvasX = padding + (z.real - xMin) / (xMax - xMin) * availableWidth;
        const canvasY = height - padding - (z.imag - yMin) / (yMax - yMin) * availableHeight;
        
        return { x: canvasX, y: canvasY };
    }
    
    // Convert from canvas coordinates to complex plane coordinates
    canvasToComplex(canvasX, canvasY) {
        const { xMin, xMax, yMin, yMax } = this.viewBounds;
        const { width, height } = this.canvas;
        const padding = this.options.padding;
        
        // Calculate available space
        const availableWidth = width - 2 * padding;
        const availableHeight = height - 2 * padding;
        
        // Convert coordinates
        const real = xMin + (canvasX - padding) / availableWidth * (xMax - xMin);
        const imag = yMin + (height - canvasY - padding) / availableHeight * (yMax - yMin);
        
        return new Complex(real, imag);
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
            const { x: x0, y: y0 } = this.complexToCanvas(new Complex(xMin, 0));
            const { x: x1, y: y1 } = this.complexToCanvas(new Complex(xMax, 0));
            
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
                ctx.fillText('Re', x1 - 5, y0 + 20);
            }
        }
        
        // Draw y-axis if it's in view
        if (xMin <= 0 && xMax >= 0) {
            const { x: x0, y: y0 } = this.complexToCanvas(new Complex(0, yMin));
            const { x: x1, y: y1 } = this.complexToCanvas(new Complex(0, yMax));
            
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
                ctx.fillText('Im', x0 - 20, y1 + 5);
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
            const { x: canvasX, y: startY } = this.complexToCanvas(new Complex(x, yMin));
            const { y: endY } = this.complexToCanvas(new Complex(x, yMax));
            
            ctx.beginPath();
            ctx.moveTo(canvasX, startY);
            ctx.lineTo(canvasX, endY);
            ctx.stroke();
            
            // Draw x-axis labels
            if (this.options.showLabels && Math.abs(x) > 0.0001) {
                const { y: labelY } = this.complexToCanvas(new Complex(0, 0));
                ctx.fillStyle = this.options.axisColor;
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(x.toFixed(1), canvasX, labelY + 20);
            }
        }
        
        // Draw horizontal grid lines
        for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
            const { x: startX, y: canvasY } = this.complexToCanvas(new Complex(xMin, y));
            const { x: endX } = this.complexToCanvas(new Complex(xMax, y));
            
            ctx.beginPath();
            ctx.moveTo(startX, canvasY);
            ctx.lineTo(endX, canvasY);
            ctx.stroke();
            
            // Draw y-axis labels
            if (this.options.showLabels && Math.abs(y) > 0.0001) {
                const { x: labelX } = this.complexToCanvas(new Complex(0, 0));
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
    
    // Draw a complex function using domain coloring
    drawComplexFunction(complexFunction, options = {}) {
        const { ctx } = this;
        const { xMin, xMax, yMin, yMax } = this.viewBounds;
        const { width, height } = this.canvas;
        const padding = this.options.padding;
        
        // Calculate available space
        const availableWidth = width - 2 * padding;
        const availableHeight = height - 2 * padding;
        
        // Create image data for domain coloring
        const resolution = options.resolution || this.options.resolution;
        const imageData = ctx.createImageData(resolution, resolution);
        
        // Fill image data with colors based on function values
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                // Calculate complex number at this pixel
                const real = xMin + (j / resolution) * (xMax - xMin);
                const imag = yMax - (i / resolution) * (yMax - yMin);
                const z = new Complex(real, imag);
                
                try {
                    // Evaluate function at z
                    const w = complexFunction.evaluate(z);
                    
                    // Get color based on function value
                    const color = this.getComplexColor(w, options.coloringMethod || this.options.coloringMethod);
                    
                    // Set pixel color
                    const pixelIndex = (i * resolution + j) * 4;
                    imageData.data[pixelIndex] = color.r;
                    imageData.data[pixelIndex + 1] = color.g;
                    imageData.data[pixelIndex + 2] = color.b;
                    imageData.data[pixelIndex + 3] = 255; // Alpha
                } catch (error) {
                    // Set transparent for errors (e.g., division by zero)
                    const pixelIndex = (i * resolution + j) * 4;
                    imageData.data[pixelIndex + 3] = 0; // Transparent
                }
            }
        }
        
        // Create temporary canvas for scaling
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = resolution;
        tempCanvas.height = resolution;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw scaled image to main canvas
        ctx.drawImage(
            tempCanvas, 
            padding, padding, 
            availableWidth, availableHeight
        );
    }
    
    // Get color for a complex number based on coloring method
    getComplexColor(z, method = 'phase') {
        switch (method) {
            case 'phase':
                // Color based on phase (argument)
                return this.getPhaseColor(z.argument());
                
            case 'modulus':
                // Color based on modulus (brightness)
                return this.getModulusColor(z.modulus());
                
            case 'combined':
                // Combine phase and modulus
                return this.getCombinedColor(z);
                
            default:
                return this.getPhaseColor(z.argument());
        }
    }
    
    // Get color based on phase angle
    getPhaseColor(angle) {
        // Normalize angle to [0, 2π)
        const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
        
        // Convert to hue (0-360)
        const hue = (normalizedAngle / (2 * Math.PI)) * 360;
        
        // Convert HSV to RGB
        return this.hsvToRgb(hue, 1, 1);
    }
    
    // Get color based on modulus
    getModulusColor(modulus) {
        // Map modulus to brightness
        const brightness = Math.min(1, 1 / (1 + modulus * 0.2));
        
        // Return grayscale color
        const value = Math.floor(brightness * 255);
        return { r: value, g: value, b: value };
    }
    
    // Get color combining phase and modulus
    getCombinedColor(z) {
        // Use phase for hue
        const hue = ((z.argument() + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI) * 360;
        
        // Use modulus for brightness
        const modulus = z.modulus();
        const value = 1 - Math.min(1, 1 / (1 + modulus * 0.2));
        const saturation = 0.8;
        
        // Convert HSV to RGB
        return this.hsvToRgb(hue, saturation, value);
    }
    
    // Convert HSV to RGB
    hsvToRgb(h, s, v) {
        let r, g, b;
        
        const i = Math.floor(h / 60) % 6;
        const f = h / 60 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        
        switch (i) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    // Draw a point
    drawPoint(z, options = {}) {
        const { ctx } = this;
        const { x: canvasX, y: canvasY } = this.complexToCanvas(z);
        
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
    
    // Draw a gradient vector
    drawGradientVector(z, gradient, options = {}) {
        const { ctx } = this;
        
        // Scale gradient for better visualization
        const scale = options.scale || 0.2;
        const scaledGradient = new Complex(
            gradient.real * scale,
            gradient.imag * scale
        );
        
        // Calculate end point
        const endZ = z.subtract(scaledGradient);
        
        // Draw line representing gradient
        this.drawArrow(
            z, endZ,
            {
                color: options.color || this.options.gradientColor,
                lineWidth: options.lineWidth || 2,
                arrowSize: options.arrowSize || 8
            }
        );
        
        // Draw gradient label if requested
        if (options.showLabel) {
            const midZ = new Complex(
                (z.real + endZ.real) / 2,
                (z.imag + endZ.imag) / 2
            );
            const { x: labelX, y: labelY } = this.complexToCanvas(midZ);
            const gradientMagnitude = gradient.modulus();
            
            ctx.save();
            ctx.fillStyle = options.labelColor || this.options.gradientColor;
            ctx.font = options.font || '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`|∇f| = ${gradientMagnitude.toFixed(2)}`, labelX, labelY - 10);
            ctx.restore();
        }
    }
    
    // Draw an arrow
    drawArrow(startZ, endZ, options = {}) {
        const { ctx } = this;
        const { x: canvasX1, y: canvasY1 } = this.complexToCanvas(startZ);
        const { x: canvasX2, y: canvasY2 } = this.complexToCanvas(endZ);
        
        ctx.save();
        ctx.strokeStyle = options.color || '#000';
        ctx.fillStyle = options.color || '#000';
        ctx.lineWidth = options.lineWidth || 1;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(canvasX1, canvasY1);
        ctx.lineTo(canvasX2, canvasY2);
        ctx.stroke();
        
        // Draw arrow head
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
        ctx.fill();
        
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
        const firstZ = options.positionAccessor 
            ? options.positionAccessor(firstPoint) 
            : firstPoint.position;
        const { x: firstX, y: firstY } = this.complexToCanvas(firstZ);
        
        ctx.moveTo(firstX, firstY);
        
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            const z = options.positionAccessor 
                ? options.positionAccessor(point) 
                : point.position;
            const { x: canvasX, y: canvasY } = this.complexToCanvas(z);
            
            ctx.lineTo(canvasX, canvasY);
        }
        
        ctx.stroke();
        
        // Draw points along the path if requested
        if (options.showPoints) {
            const pointRadius = options.pointRadius || 3;
            const pointColor = options.pointColor || this.options.pointColor;
            
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                const z = options.positionAccessor 
                    ? options.positionAccessor(point) 
                    : point.position;
                
                this.drawPoint(z, { radius: pointRadius, color: pointColor });
            }
        }
        
        ctx.restore();
    }
    
    // Render the entire scene for complex visualization
    render(scene) {
        // Clear canvas
        this.clear();
        
        // Draw complex function visualization
        if (scene.function) {
            this.drawComplexFunction(scene.function, scene.functionOptions);
        }
        
        // Draw grid and axes
        this.drawGrid();
        this.drawAxes();
        
        // Draw path if provided
        if (scene.path) {
            this.drawPath(scene.path, scene.pathOptions);
        }
        
        // Draw current point if provided
        if (scene.currentPoint) {
            this.drawPoint(
                scene.currentPoint.position,
                scene.pointOptions
            );
            
            // Draw gradient vector if provided
            if (scene.currentPoint.gradient) {
                this.drawGradientVector(
                    scene.currentPoint.position,
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
    
    // Auto-adjust view bounds based on function domain and points
    autoAdjustViewBounds(complexFunction, points = [], padding = 0.2) {
        if (!complexFunction) return;
        
        // Start with function domain
        let xMin = complexFunction.domain[0];
        let xMax = complexFunction.domain[1];
        let yMin = complexFunction.domain[2];
        let yMax = complexFunction.domain[3];
        
        // Consider points if provided
        if (points && points.length > 0) {
            for (const point of points) {
                if (point.position) {
                    xMin = Math.min(xMin, point.position.real);
                    xMax = Math.max(xMax, point.position.real);
                    yMin = Math.min(yMin, point.position.imag);
                    yMax = Math.max(yMax, point.position.imag);
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

// Export the ComplexCanvasManager class
export { ComplexCanvasManager };
