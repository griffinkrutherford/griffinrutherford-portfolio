/**
 * multivariate-canvas.js
 * Handles canvas visualization for multivariate functions
 */

class MultivariateCanvasManager {
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
            contourColors: options.contourColors || [
                '#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#2196f3', 
                '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd'
            ],
            showGrid: options.showGrid !== undefined ? options.showGrid : true,
            showAxes: options.showAxes !== undefined ? options.showAxes : true,
            showLabels: options.showLabels !== undefined ? options.showLabels : true,
            showContours: options.showContours !== undefined ? options.showContours : true,
            contourLevels: options.contourLevels || 20
        };
        
        // Set initial view bounds
        this.viewBounds = {
            xMin: -5,
            xMax: 5,
            yMin: -5,
            yMax: 5,
            zMin: 0,
            zMax: 50
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
    setViewBounds(xMin, xMax, yMin, yMax, zMin, zMax) {
        this.viewBounds = { xMin, xMax, yMin, yMax, zMin, zMax };
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
    
    // Draw contour plot of a multivariate function
    drawContourPlot(multivariateFunction, options = {}) {
        if (!this.options.showContours) return;
        
        const { ctx } = this;
        const { xMin, xMax, yMin, yMax, zMin, zMax } = this.viewBounds;
        
        // Calculate grid size for contour plot
        const gridSize = options.gridSize || 100;
        const xStep = (xMax - xMin) / gridSize;
        const yStep = (yMax - yMin) / gridSize;
        
        // Create grid of function values
        const values = [];
        let minValue = Infinity;
        let maxValue = -Infinity;
        
        for (let i = 0; i <= gridSize; i++) {
            values[i] = [];
            const y = yMax - i * yStep;
            
            for (let j = 0; j <= gridSize; j++) {
                const x = xMin + j * xStep;
                
                try {
                    const value = multivariateFunction.evaluate([x, y]);
                    values[i][j] = value;
                    
                    // Update min/max values
                    if (isFinite(value)) {
                        minValue = Math.min(minValue, value);
                        maxValue = Math.max(maxValue, value);
                    }
                } catch (error) {
                    values[i][j] = NaN;
                }
            }
        }
        
        // Use provided zMin/zMax or calculate from data
        const effectiveZMin = options.zMin !== undefined ? options.zMin : (zMin !== undefined ? zMin : minValue);
        const effectiveZMax = options.zMax !== undefined ? options.zMax : (zMax !== undefined ? zMax : maxValue);
        
        // Create image data for contour plot
        const imageData = ctx.createImageData(gridSize + 1, gridSize + 1);
        
        // Fill image data with colors based on function values
        for (let i = 0; i <= gridSize; i++) {
            for (let j = 0; j <= gridSize; j++) {
                const value = values[i][j];
                
                if (!isNaN(value) && isFinite(value)) {
                    // Normalize value to [0, 1]
                    const normalizedValue = Math.max(0, Math.min(1, 
                        (value - effectiveZMin) / (effectiveZMax - effectiveZMin)
                    ));
                    
                    // Get color from gradient
                    const color = this.getContourColor(normalizedValue);
                    
                    // Set pixel color
                    const pixelIndex = (i * (gridSize + 1) + j) * 4;
                    imageData.data[pixelIndex] = color.r;
                    imageData.data[pixelIndex + 1] = color.g;
                    imageData.data[pixelIndex + 2] = color.b;
                    imageData.data[pixelIndex + 3] = 255; // Alpha
                } else {
                    // Set transparent for NaN or infinite values
                    const pixelIndex = (i * (gridSize + 1) + j) * 4;
                    imageData.data[pixelIndex + 3] = 0; // Transparent
                }
            }
        }
        
        // Create temporary canvas for scaling
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = gridSize + 1;
        tempCanvas.height = gridSize + 1;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw scaled image to main canvas
        const { x: canvasXMin, y: canvasYMax } = this.worldToCanvas(xMin, yMin);
        const { x: canvasXMax, y: canvasYMin } = this.worldToCanvas(xMax, yMax);
        const canvasWidth = canvasXMax - canvasXMin;
        const canvasHeight = canvasYMax - canvasYMin;
        
        ctx.drawImage(tempCanvas, canvasXMin, canvasYMin, canvasWidth, canvasHeight);
        
        // Draw contour lines if requested
        if (options.showContourLines) {
            this.drawContourLines(values, effectiveZMin, effectiveZMax, options);
        }
    }
    
    // Get color for contour plot based on normalized value [0, 1]
    getContourColor(normalizedValue) {
        const colors = this.options.contourColors;
        const index = Math.min(colors.length - 1, Math.floor(normalizedValue * colors.length));
        
        // Convert hex color to RGB
        const hex = colors[index].replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }
    
    // Draw contour lines
    drawContourLines(values, zMin, zMax, options = {}) {
        const { ctx } = this;
        const { xMin, xMax, yMin, yMax } = this.viewBounds;
        
        // Number of contour levels
        const levels = options.levels || this.options.contourLevels;
        
        // Calculate contour levels
        const contourLevels = [];
        for (let i = 0; i < levels; i++) {
            contourLevels.push(zMin + (zMax - zMin) * i / (levels - 1));
        }
        
        // Grid dimensions
        const gridSize = values.length - 1;
        const xStep = (xMax - xMin) / gridSize;
        const yStep = (yMax - yMin) / gridSize;
        
        // Draw contour lines
        ctx.save();
        ctx.strokeStyle = options.contourLineColor || 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = options.contourLineWidth || 0.5;
        
        for (const level of contourLevels) {
            // Marching squares algorithm to find contour lines
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const x = xMin + j * xStep;
                    const y = yMax - i * yStep;
                    
                    const v00 = values[i][j];
                    const v01 = values[i][j + 1];
                    const v10 = values[i + 1][j];
                    const v11 = values[i + 1][j + 1];
                    
                    // Skip if any value is NaN or infinite
                    if (!isFinite(v00) || !isFinite(v01) || !isFinite(v10) || !isFinite(v11)) {
                        continue;
                    }
                    
                    // Calculate case index for marching squares
                    let caseIndex = 0;
                    if (v00 > level) caseIndex |= 1;
                    if (v01 > level) caseIndex |= 2;
                    if (v11 > level) caseIndex |= 4;
                    if (v10 > level) caseIndex |= 8;
                    
                    // Skip if all corners are above or below the level
                    if (caseIndex === 0 || caseIndex === 15) continue;
                    
                    // Calculate intersection points
                    const points = [];
                    
                    // Bottom edge
                    if ((caseIndex & 1) !== (caseIndex & 2)) {
                        const t = (level - v00) / (v01 - v00);
                        points.push({ x: x + t * xStep, y });
                    }
                    
                    // Right edge
                    if ((caseIndex & 2) !== (caseIndex & 4)) {
                        const t = (level - v01) / (v11 - v01);
                        points.push({ x: x + xStep, y: y - t * yStep });
                    }
                    
                    // Top edge
                    if ((caseIndex & 4) !== (caseIndex & 8)) {
                        const t = (level - v11) / (v10 - v11);
                        points.push({ x: x + (1 - t) * xStep, y: y - yStep });
                    }
                    
                    // Left edge
                    if ((caseIndex & 8) !== (caseIndex & 1)) {
                        const t = (level - v10) / (v00 - v10);
                        points.push({ x, y: y - (1 - t) * yStep });
                    }
                    
                    // Draw line segments
                    if (points.length >= 2) {
                        ctx.beginPath();
                        const { x: x0, y: y0 } = this.worldToCanvas(points[0].x, points[0].y);
                        ctx.moveTo(x0, y0);
                        
                        for (let k = 1; k < points.length; k++) {
                            const { x: xk, y: yk } = this.worldToCanvas(points[k].x, points[k].y);
                            ctx.lineTo(xk, yk);
                        }
                        
                        ctx.stroke();
                    }
                }
            }
        }
        
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
    
    // Draw a gradient vector
    drawGradientVector(x, y, gradient, options = {}) {
        const { ctx } = this;
        
        // Scale gradient for better visualization
        const scale = options.scale || 0.5;
        const scaledGradient = [gradient[0] * scale, gradient[1] * scale];
        
        // Calculate end point
        const endX = x - scaledGradient[0];
        const endY = y - scaledGradient[1];
        
        // Draw line representing gradient
        this.drawArrow(
            x, y,
            endX, endY,
            {
                color: options.color || this.options.gradientColor,
                lineWidth: options.lineWidth || 2,
                arrowSize: options.arrowSize || 8
            }
        );
        
        // Draw gradient label if requested
        if (options.showLabel) {
            const { x: labelX, y: labelY } = this.worldToCanvas((x + endX) / 2, (y + endY) / 2);
            const gradientMagnitude = Math.sqrt(gradient[0] * gradient[0] + gradient[1] * gradient[1]);
            
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
    drawArrow(x1, y1, x2, y2, options = {}) {
        const { ctx } = this;
        const { x: canvasX1, y: canvasY1 } = this.worldToCanvas(x1, y1);
        const { x: canvasX2, y: canvasY2 } = this.worldToCanvas(x2, y2);
        
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
        const { x: firstX, y: firstY } = this.worldToCanvas(
            options.positionAccessor ? options.positionAccessor(firstPoint)[0] : firstPoint.position[0],
            options.positionAccessor ? options.positionAccessor(firstPoint)[1] : firstPoint.position[1]
        );
        
        ctx.moveTo(firstX, firstY);
        
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            const position = options.positionAccessor ? options.positionAccessor(point) : point.position;
            const { x: canvasX, y: canvasY } = this.worldToCanvas(position[0], position[1]);
            
            ctx.lineTo(canvasX, canvasY);
        }
        
        ctx.stroke();
        
        // Draw points along the path if requested
        if (options.showPoints) {
            const pointRadius = options.pointRadius || 3;
            const pointColor = options.pointColor || this.options.pointColor;
            
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                const position = options.positionAccessor ? options.positionAccessor(point) : point.position;
                
                this.drawPoint(
                    position[0],
                    position[1],
                    { radius: pointRadius, color: pointColor }
                );
            }
        }
        
        ctx.restore();
    }
    
    // Render the entire scene for multivariate visualization
    render(scene) {
        // Clear canvas
        this.clear();
        
        // Draw contour plot if function provided
        if (scene.function) {
            this.drawContourPlot(scene.function, scene.contourOptions);
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
                scene.currentPoint.position[0],
                scene.currentPoint.position[1],
                scene.pointOptions
            );
            
            // Draw gradient vector if provided
            if (scene.currentPoint.gradient) {
                this.drawGradientVector(
                    scene.currentPoint.position[0],
                    scene.currentPoint.position[1],
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
    autoAdjustViewBounds(multivariateFunction, points = [], padding = 0.2) {
        if (!multivariateFunction) return;
        
        // Start with function domain
        let xMin = multivariateFunction.domain[0][0];
        let xMax = multivariateFunction.domain[0][1];
        let yMin = multivariateFunction.domain[1][0];
        let yMax = multivariateFunction.domain[1][1];
        
        // Initialize z bounds
        let zMin = Infinity;
        let zMax = -Infinity;
        
        // Sample function to find z bounds
        const numSamples = 20;
        const xStep = (xMax - xMin) / numSamples;
        const yStep = (yMax - yMin) / numSamples;
        
        for (let x = xMin; x <= xMax; x += xStep) {
            for (let y = yMin; y <= yMax; y += yStep) {
                try {
                    const z = multivariateFunction.evaluate([x, y]);
                    if (isFinite(z)) {
                        zMin = Math.min(zMin, z);
                        zMax = Math.max(zMax, z);
                    }
                } catch (error) {
                    // Skip points where function evaluation fails
                    continue;
                }
            }
        }
        
        // Consider points if provided
        if (points && points.length > 0) {
            for (const point of points) {
                if (point.position) {
                    xMin = Math.min(xMin, point.position[0]);
                    xMax = Math.max(xMax, point.position[0]);
                    yMin = Math.min(yMin, point.position[1]);
                    yMax = Math.max(yMax, point.position[1]);
                }
                if (point.value !== undefined) {
                    zMin = Math.min(zMin, point.value);
                    zMax = Math.max(zMax, point.value);
                }
            }
        }
        
        // Add padding
        const xPadding = (xMax - xMin) * padding;
        const yPadding = (yMax - yMin) * padding;
        const zPadding = (zMax - zMin) * padding;
        
        xMin -= xPadding;
        xMax += xPadding;
        yMin -= yPadding;
        yMax += yPadding;
        zMin -= zPadding;
        zMax += zPadding;
        
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
        
        if (zMax - zMin < 1) {
            const center = (zMax + zMin) / 2;
            zMin = center - 0.5;
            zMax = center + 0.5;
        }
        
        // Update view bounds
        this.setViewBounds(xMin, xMax, yMin, yMax, zMin, zMax);
    }
}

// Export the MultivariateCanvasManager class
export { MultivariateCanvasManager };
