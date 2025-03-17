/* canvas-manager.js - Canvas visualization for the Gradient Descent Visualizer */

// Namespace for canvas managers
var GDVCanvas = {
    // Single variable canvas manager
    SingleVariable: function(canvasId, options = {}) {
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
            functionColor: options.functionColor || '#4285F4',
            pointColor: options.pointColor || '#F44336',
            gradientColor: options.gradientColor || '#4CAF50',
            pathColor: options.pathColor || 'rgba(244, 67, 54, 0.5)',
            backgroundColor: options.backgroundColor || '#fff',
            showGrid: options.showGrid !== undefined ? options.showGrid : true,
            showAxes: options.showAxes !== undefined ? options.showAxes : true,
            showLabels: options.showLabels !== undefined ? options.showLabels : true
        };
        
        // Set initial view bounds
        this.viewBounds = {
            xMin: -10,
            xMax: 10,
            yMin: -5,
            yMax: 15
        };
        
        // Initialize
        this.init();
        
        // Initialize canvas
        this.init = function() {
            // Set canvas size to match display size
            this.resize();
            
            // Add event listeners for resizing
            window.addEventListener('resize', () => this.resize());
            
            // Clear canvas with background color
            this.clear();
        };
        
        // Resize canvas to match display size
        this.resize = function() {
            // Get the display size of the canvas
            const displayWidth = this.canvas.clientWidth;
            const displayHeight = this.canvas.clientHeight;
            
            // Check if the canvas is not the same size
            if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
                // Make the canvas the same size
                this.canvas.width = displayWidth;
                this.canvas.height = displayHeight;
            }
        };
        
        // Clear canvas
        this.clear = function() {
            this.ctx.fillStyle = this.options.backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };
        
        // Set view bounds
        this.setViewBounds = function(xMin, xMax, yMin, yMax) {
            this.viewBounds = { xMin, xMax, yMin, yMax };
        };
        
        // Convert from function coordinates to canvas coordinates
        this.functionToCanvas = function(x, y) {
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
        };
        
        // Convert from canvas coordinates to function coordinates
        this.canvasToFunction = function(canvasX, canvasY) {
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
        };
        
        // Draw coordinate axes
        this.drawAxes = function() {
            if (!this.options.showAxes) return;
            
            const { ctx } = this;
            const { width, height } = this.canvas;
            const { xMin, xMax, yMin, yMax } = this.viewBounds;
            
            ctx.save();
            ctx.strokeStyle = this.options.axisColor;
            ctx.lineWidth = 1;
            
            // Draw x-axis if it's in view
            if (yMin <= 0 && yMax >= 0) {
                const { x: x0, y: y0 } = this.functionToCanvas(xMin, 0);
                const { x: x1, y: y1 } = this.functionToCanvas(xMax, 0);
                
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
                const { x: x0, y: y0 } = this.functionToCanvas(0, yMin);
                const { x: x1, y: y1 } = this.functionToCanvas(0, yMax);
                
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
                    ctx.fillText('f(x)', x0 - 20, y1 + 5);
                }
            }
            
            ctx.restore();
        };
        
        // Draw grid
        this.drawGrid = function() {
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
            
            const xStep = GDVUtils.calculateGridStep(xRange);
            const yStep = GDVUtils.calculateGridStep(yRange);
            
            // Draw vertical grid lines
            for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
                const { x: canvasX, y: startY } = this.functionToCanvas(x, yMin);
                const { y: endY } = this.functionToCanvas(x, yMax);
                
                ctx.beginPath();
                ctx.moveTo(canvasX, startY);
                ctx.lineTo(canvasX, endY);
                ctx.stroke();
                
                // Draw x-axis labels
                if (this.options.showLabels && Math.abs(x) > 0.0001) {
                    const { y: labelY } = this.functionToCanvas(0, 0);
                    ctx.fillStyle = this.options.axisColor;
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(x.toFixed(1), canvasX, labelY + 20);
                }
            }
            
            // Draw horizontal grid lines
            for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
                const { x: startX, y: canvasY } = this.functionToCanvas(xMin, y);
                const { x: endX } = this.functionToCanvas(xMax, y);
                
                ctx.beginPath();
                ctx.moveTo(startX, canvasY);
                ctx.lineTo(endX, canvasY);
                ctx.stroke();
                
                // Draw y-axis labels
                if (this.options.showLabels && Math.abs(y) > 0.0001) {
                    const { x: labelX } = this.functionToCanvas(0, 0);
                    ctx.fillStyle = this.options.axisColor;
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'right';
                    ctx.fillText(y.toFixed(1), labelX - 10, canvasY + 5);
                }
            }
            
            ctx.restore();
        };
        
        // Draw a function
        this.drawFunction = function(func, options = {}) {
            const { ctx } = this;
            const { xMin, xMax } = this.viewBounds;
            
            ctx.save();
            ctx.strokeStyle = options.color || this.options.functionColor;
            ctx.lineWidth = options.lineWidth || 2;
            
            // Calculate number of points to draw
            const numPoints = options.numPoints || 500;
            const step = (xMax - xMin) / numPoints;
            
            ctx.beginPath();
            
            // Draw function curve
            for (let i = 0; i <= numPoints; i++) {
                const x = xMin + i * step;
                const y = func.evaluate(x);
                
                const { x: canvasX, y: canvasY } = this.functionToCanvas(x, y);
                
                if (i === 0) {
                    ctx.moveTo(canvasX, canvasY);
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            }
            
            ctx.stroke();
            ctx.restore();
        };
        
        // Draw a point
        this.drawPoint = function(x, y, options = {}) {
            const { ctx } = this;
            const { x: canvasX, y: canvasY } = this.functionToCanvas(x, y);
            
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
        };
        
        // Draw a gradient vector
        this.drawGradientVector = function(x, y, gradient, options = {}) {
            const { ctx } = this;
            
            // Scale gradient for better visualization
            const scale = options.scale || 0.5;
            const scaledGradient = gradient * scale;
            
            // Calculate end point
            const endX = x - scaledGradient;
            const endY = y;
            
            // Draw line representing gradient
            this.drawArrow(
                x, y, endX, endY,
                {
                    color: options.color || this.options.gradientColor,
                    lineWidth: options.lineWidth || 2,
                    arrowSize: options.arrowSize || 8
                }
            );
            
            // Draw gradient label if requested
            if (options.showLabel) {
                const midX = (x + endX) / 2;
                const midY = (y + endY) / 2;
                const { x: labelX, y: labelY } = this.functionToCanvas(midX, midY);
                
                ctx.save();
                ctx.fillStyle = options.labelColor || this.options.gradientColor;
                ctx.font = options.font || '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(`∇f = ${gradient.toFixed(2)}`, labelX, labelY - 10);
                ctx.restore();
            }
        };
        
        // Draw an arrow
        this.drawArrow = function(startX, startY, endX, endY, options = {}) {
            const { ctx } = this;
            const { x: canvasX1, y: canvasY1 } = this.functionToCanvas(startX, startY);
            const { x: canvasX2, y: canvasY2 } = this.functionToCanvas(endX, endY);
            
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
        };
        
        // Draw a path (series of points)
        this.drawPath = function(points, options = {}) {
            const { ctx } = this;
            
            if (!points || points.length < 2) return;
            
            ctx.save();
            ctx.strokeStyle = options.color || this.options.pathColor;
            ctx.lineWidth = options.lineWidth || 2;
            
            ctx.beginPath();
            
            // Draw path
            const firstPoint = points[0];
            const { x: firstX, y: firstY } = this.functionToCanvas(
                options.positionAccessor ? options.positionAccessor(firstPoint) : firstPoint.position,
                options.valueAccessor ? options.valueAccessor(firstPoint) : firstPoint.value
            );
            
            ctx.moveTo(firstX, firstY);
            
            for (let i = 1; i < points.length; i++) {
                const point = points[i];
                const { x: canvasX, y: canvasY } = this.functionToCanvas(
                    options.positionAccessor ? options.positionAccessor(point) : point.position,
                    options.valueAccessor ? options.valueAccessor(point) : point.value
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
                        options.positionAccessor ? options.positionAccessor(point) : point.position,
                        options.valueAccessor ? options.valueAccessor(point) : point.value,
                        { radius: pointRadius, color: pointColor }
                    );
                }
            }
            
            ctx.restore();
        };
        
        // Render the entire scene
        this.render = function(scene) {
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
                    scene.currentPoint.position,
                    scene.currentPoint.value,
                    scene.pointOptions
                );
                
                // Draw gradient vector if provided
                if (scene.currentPoint.gradient !== undefined) {
                    this.drawGradientVector(
                        scene.currentPoint.position,
                        scene.currentPoint.value,
                        scene.currentPoint.gradient,
                        scene.gradientOptions
                    );
                }
            }
            
            // Draw additional elements if provided
            if (scene.additionalRender) {
                scene.additionalRender(this);
            }
        };
        
        // Auto-adjust view bounds based on function domain and points
        this.autoAdjustViewBounds = function(func, points = [], padding = 0.2) {
            if (!func) return;
            
            // Start with function domain
            let xMin = func.domain[0];
            let xMax = func.domain[1];
            
            // Calculate y range
            const numSamples = 100;
            const step = (xMax - xMin) / numSamples;
            
            let yMin = Infinity;
            let yMax = -Infinity;
            
            for (let i = 0; i <= numSamples; i++) {
                const x = xMin + i * step;
                const y = func.evaluate(x);
                
                yMin = Math.min(yMin, y);
                yMax = Math.max(yMax, y);
            }
            
            // Consider points if provided
            if (points && points.length > 0) {
                for (const point of points) {
                    if (point.position !== undefined && point.value !== undefined) {
                        xMin = Math.min(xMin, point.position);
                        xMax = Math.max(xMax, point.position);
                        yMin = Math.min(yMin, point.value);
                        yMax = Math.max(yMax, point.value);
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
        };
    },
    
    // Multivariate canvas manager
    Multivariate: function(canvasId, options = {}) {
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
            contourLevels: options.contourLevels || 20,
            contourColors: options.contourColors || ['#0000FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000']
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
        
        // Initialize canvas
        this.init = function() {
            // Set canvas size to match display size
            this.resize();
            
            // Add event listeners for resizing
            window.addEventListener('resize', () => this.resize());
            
            // Clear canvas with background color
            this.clear();
        };
        
        // Resize canvas to match display size
        this.resize = function() {
            // Get the display size of the canvas
            const displayWidth = this.canvas.clientWidth;
            const displayHeight = this.canvas.clientHeight;
            
            // Check if the canvas is not the same size
            if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
                // Make the canvas the same size
                this.canvas.width = displayWidth;
                this.canvas.height = displayHeight;
            }
        };
        
        // Clear canvas
        this.clear = function() {
            this.ctx.fillStyle = this.options.backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };
        
        // Set view bounds
        this.setViewBounds = function(xMin, xMax, yMin, yMax) {
            this.viewBounds = { xMin, xMax, yMin, yMax };
        };
        
        // Convert from function coordinates to canvas coordinates
        this.functionToCanvas = function(x, y) {
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
        };
        
        // Convert from canvas coordinates to function coordinates
        this.canvasToFunction = function(canvasX, canvasY) {
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
        };
        
        // Draw coordinate axes
        this.drawAxes = function() {
            if (!this.options.showAxes) return;
            
            const { ctx } = this;
            const { width, height } = this.canvas;
            const { xMin, xMax, yMin, yMax } = this.viewBounds;
            
            ctx.save();
            ctx.strokeStyle = this.options.axisColor;
            ctx.lineWidth = 1;
            
            // Draw x-axis if it's in view
            if (yMin <= 0 && yMax >= 0) {
                const { x: x0, y: y0 } = this.functionToCanvas(xMin, 0);
                const { x: x1, y: y1 } = this.functionToCanvas(xMax, 0);
                
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
                const { x: x0, y: y0 } = this.functionToCanvas(0, yMin);
                const { x: x1, y: y1 } = this.functionToCanvas(0, yMax);
                
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
        };
        
        // Draw grid
        this.drawGrid = function() {
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
            
            const xStep = GDVUtils.calculateGridStep(xRange);
            const yStep = GDVUtils.calculateGridStep(yRange);
            
            // Draw vertical grid lines
            for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
                const { x: canvasX, y: startY } = this.functionToCanvas(x, yMin);
                const { y: endY } = this.functionToCanvas(x, yMax);
                
                ctx.beginPath();
                ctx.moveTo(canvasX, startY);
                ctx.lineTo(canvasX, endY);
                ctx.stroke();
                
                // Draw x-axis labels
                if (this.options.showLabels && Math.abs(x) > 0.0001) {
                    const { y: labelY } = this.functionToCanvas(0, 0);
                    ctx.fillStyle = this.options.axisColor;
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(x.toFixed(1), canvasX, labelY + 20);
                }
            }
            
            // Draw horizontal grid lines
            for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
                const { x: startX, y: canvasY } = this.functionToCanvas(yMin, y);
                const { x: endX } = this.functionToCanvas(yMax, y);
                
                ctx.beginPath();
                ctx.moveTo(startX, canvasY);
                ctx.lineTo(endX, canvasY);
                ctx.stroke();
                
                // Draw y-axis labels
                if (this.options.showLabels && Math.abs(y) > 0.0001) {
                    const { x: labelX } = this.functionToCanvas(0, 0);
                    ctx.fillStyle = this.options.axisColor;
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'right';
                    ctx.fillText(y.toFixed(1), labelX - 10, canvasY + 5);
                }
            }
            
            ctx.restore();
        };
        
        // Draw a contour plot of a multivariate function
        this.drawContourPlot = function(func, options = {}) {
            const { ctx } = this;
            const { xMin, xMax, yMin, yMax } = this.viewBounds;
            const { width, height } = this.canvas;
            const padding = this.options.padding;
            
            // Calculate available space
            const availableWidth = width - 2 * padding;
            const availableHeight = height - 2 * padding;
            
            // Calculate resolution
            const resolution = options.resolution || 200;
            const xStep = (xMax - xMin) / resolution;
            const yStep = (yMax - yMin) / resolution;
            
            // Create image data for contour plot
            const imageData = ctx.createImageData(resolution, resolution);
            
            // Calculate function values
            const values = [];
            let minValue = Infinity;
            let maxValue = -Infinity;
            
            for (let i = 0; i < resolution; i++) {
                values[i] = [];
                for (let j = 0; j < resolution; j++) {
                    const x = xMin + j * xStep;
                    const y = yMax - i * yStep;
                    
                    const value = func.evaluate(x, y);
                    values[i][j] = value;
                    
                    minValue = Math.min(minValue, value);
                    maxValue = Math.max(maxValue, value);
                }
            }
            
            // Calculate contour levels
            const levels = options.levels || this.options.contourLevels;
            const levelStep = (maxValue - minValue) / levels;
            
            // Get contour colors
            const colors = options.colors || this.options.contourColors;
            
            // Fill image data with colors based on function values
            for (let i = 0; i < resolution; i++) {
                for (let j = 0; j < resolution; j++) {
                    const value = values[i][j];
                    
                    // Normalize value to [0, 1]
                    const normalizedValue = (value - minValue) / (maxValue - minValue);
                    
                    // Get color based on normalized value
                    const color = this.getContourColor(normalizedValue, colors);
                    
                    // Set pixel color
                    const pixelIndex = (i * resolution + j) * 4;
                    imageData.data[pixelIndex] = color.r;
                    imageData.data[pixelIndex + 1] = color.g;
                    imageData.data[pixelIndex + 2] = color.b;
                    imageData.data[pixelIndex + 3] = 255; // Alpha
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
        };
        
        // Get color for contour plot based on normalized value
        this.getContourColor = function(normalizedValue, colors) {
            if (normalizedValue <= 0) return this.hexToRgb(colors[0]);
            if (normalizedValue >= 1) return this.hexToRgb(colors[colors.length - 1]);
            
            const segment = 1 / (colors.length - 1);
            const index = Math.min(Math.floor(normalizedValue / segment), colors.length - 2);
            const t = (normalizedValue - index * segment) / segment;
            
            const color1 = this.hexToRgb(colors[index]);
            const color2 = this.hexToRgb(colors[index + 1]);
            
            return {
                r: Math.round(color1.r * (1 - t) + color2.r * t),
                g: Math.round(color1.g * (1 - t) + color2.g * t),
                b: Math.round(color1.b * (1 - t) + color2.b * t)
            };
        };
        
        // Convert hex color to RGB
        this.hexToRgb = function(hex) {
            // Remove # if present
            hex = hex.replace(/^#/, '');
            
            // Parse hex
            const bigint = parseInt(hex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            
            return { r, g, b };
        };
        
        // Draw a point
        this.drawPoint = function(x, y, options = {}) {
            const { ctx } = this;
            const { x: canvasX, y: canvasY } = this.functionToCanvas(x, y);
            
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
        };
        
        // Draw a gradient vector
        this.drawGradientVector = function(x, y, gradient, options = {}) {
            const { ctx } = this;
            
            // Scale gradient for better visualization
            const scale = options.scale || 0.2;
            const scaledGradientX = gradient.x * scale;
            const scaledGradientY = gradient.y * scale;
            
            // Calculate end point
            const endX = x - scaledGradientX;
            const endY = y - scaledGradientY;
            
            // Draw line representing gradient
            this.drawArrow(
                x, y, endX, endY,
                {
                    color: options.color || this.options.gradientColor,
                    lineWidth: options.lineWidth || 2,
                    arrowSize: options.arrowSize || 8
                }
            );
            
            // Draw gradient label if requested
            if (options.showLabel) {
                const midX = (x + endX) / 2;
                const midY = (y + endY) / 2;
                const { x: labelX, y: labelY } = this.functionToCanvas(midX, midY);
                const gradientMagnitude = Math.sqrt(gradient.x * gradient.x + gradient.y * gradient.y);
                
                ctx.save();
                ctx.fillStyle = options.labelColor || this.options.gradientColor;
                ctx.font = options.font || '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(`|∇f| = ${gradientMagnitude.toFixed(2)}`, labelX, labelY - 10);
                ctx.restore();
            }
        };
        
        // Draw an arrow
        this.drawArrow = function(startX, startY, endX, endY, options = {}) {
            const { ctx } = this;
            const { x: canvasX1, y: canvasY1 } = this.functionToCanvas(startX, startY);
            const { x: canvasX2, y: canvasY2 } = this.functionToCanvas(endX, endY);
            
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
        };
        
        // Draw a path (series of points)
        this.drawPath = function(points, options = {}) {
            const { ctx } = this;
            
            if (!points || points.length < 2) return;
            
            ctx.save();
            ctx.strokeStyle = options.color || this.options.pathColor;
            ctx.lineWidth = options.lineWidth || 2;
            
            ctx.beginPath();
            
            // Draw path
            const firstPoint = points[0];
            const firstX = options.positionXAccessor ? options.positionXAccessor(firstPoint) : firstPoint.position.x;
            const firstY = options.positionYAccessor ? options.positionYAccessor(firstPoint) : firstPoint.position.y;
            const { x: firstCanvasX, y: firstCanvasY } = this.functionToCanvas(firstX, firstY);
            
            ctx.moveTo(firstCanvasX, firstCanvasY);
            
            for (let i = 1; i < points.length; i++) {
                const point = points[i];
                const x = options.positionXAccessor ? options.positionXAccessor(point) : point.position.x;
                const y = options.positionYAccessor ? options.positionYAccessor(point) : point.position.y;
                const { x: canvasX, y: canvasY } = this.functionToCanvas(x, y);
                
                ctx.lineTo(canvasX, canvasY);
            }
            
            ctx.stroke();
            
            // Draw points along the path if requested
            if (options.showPoints) {
                const pointRadius = options.pointRadius || 3;
                const pointColor = options.pointColor || this.options.pointColor;
                
                for (let i = 0; i < points.length; i++) {
                    const point = points[i];
                    const x = options.positionXAccessor ? options.positionXAccessor(point) : point.position.x;
                    const y = options.positionYAccessor ? options.positionYAccessor(point) : point.position.y;
                    
                    this.drawPoint(x, y, { radius: pointRadius, color: pointColor });
                }
            }
            
            ctx.restore();
        };
        
        // Render the entire scene
        this.render = function(scene) {
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
                    scene.currentPoint.position.x,
                    scene.currentPoint.position.y,
                    scene.pointOptions
                );
                
                // Draw gradient vector if provided
                if (scene.currentPoint.gradient) {
                    this.drawGradientVector(
                        scene.currentPoint.position.x,
                        scene.currentPoint.position.y,
                        scene.currentPoint.gradient,
                        scene.gradientOptions
                    );
                }
            }
            
            // Draw additional elements if provided
            if (scene.additionalRender) {
                scene.additionalRender(this);
            }
        };
        
        // Auto-adjust view bounds based on function domain and points
        this.autoAdjustViewBounds = function(func, points = [], padding = 0.2) {
            if (!func) return;
            
            // Start with function domain
            let xMin = func.domain[0];
            let xMax = func.domain[1];
            let yMin = func.domain[2];
            let yMax = func.domain[3];
            
            // Consider points if provided
            if (points && points.length > 0) {
                for (const point of points) {
                    if (point.position) {
                        xMin = Math.min(xMin, point.position.x);
                        xMax = Math.max(xMax, point.position.x);
                        yMin = Math.min(yMin, point.position.y);
                        yMax = Math.max(yMax, point.position.y);
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
        };
    },
    
    // Complex canvas manager
    Complex: function(canvasId, options = {}) {
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
        
        // Initialize canvas
        this.init = function() {
            // Set canvas size to match display size
            this.resize();
            
            // Add event listeners for resizing
            window.addEventListener('resize', () => this.resize());
            
            // Clear canvas with background color
            this.clear();
        };
        
        // Resize canvas to match display size
        this.resize = function() {
            // Get the display size of the canvas
            const displayWidth = this.canvas.clientWidth;
            const displayHeight = this.canvas.clientHeight;
            
            // Check if the canvas is not the same size
            if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
                // Make the canvas the same size
                this.canvas.width = displayWidth;
                this.canvas.height = displayHeight;
            }
        };
        
        // Clear canvas
        this.clear = function() {
            this.ctx.fillStyle = this.options.backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };
        
        // Set view bounds
        this.setViewBounds = function(xMin, xMax, yMin, yMax) {
            this.viewBounds = { xMin, xMax, yMin, yMax };
        };
        
        // Convert from complex plane coordinates to canvas coordinates
        this.complexToCanvas = function(z) {
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
        };
        
        // Convert from canvas coordinates to complex plane coordinates
        this.canvasToComplex = function(canvasX, canvasY) {
            const { xMin, xMax, yMin, yMax } = this.viewBounds;
            const { width, height } = this.canvas;
            const padding = this.options.padding;
            
            // Calculate available space
            const availableWidth = width - 2 * padding;
            const availableHeight = height - 2 * padding;
            
            // Convert coordinates
            const real = xMin + (canvasX - padding) / availableWidth * (xMax - xMin);
            const imag = yMin + (height - canvasY - padding) / availableHeight * (yMax - yMin);
            
            return new GDVUtils.Complex(real, imag);
        };
        
        // Draw coordinate axes
        this.drawAxes = function() {
            if (!this.options.showAxes) return;
            
            const { ctx } = this;
            const { width, height } = this.canvas;
            const { xMin, xMax, yMin, yMax } = this.viewBounds;
            
            ctx.save();
            ctx.strokeStyle = this.options.axisColor;
            ctx.lineWidth = 1;
            
            // Draw x-axis if it's in view
            if (yMin <= 0 && yMax >= 0) {
                const { x: x0, y: y0 } = this.complexToCanvas(new GDVUtils.Complex(xMin, 0));
                const { x: x1, y: y1 } = this.complexToCanvas(new GDVUtils.Complex(xMax, 0));
                
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
                const { x: x0, y: y0 } = this.complexToCanvas(new GDVUtils.Complex(0, yMin));
                const { x: x1, y: y1 } = this.complexToCanvas(new GDVUtils.Complex(0, yMax));
                
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
        };
        
        // Draw grid
        this.drawGrid = function() {
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
            
            const xStep = GDVUtils.calculateGridStep(xRange);
            const yStep = GDVUtils.calculateGridStep(yRange);
            
            // Draw vertical grid lines
            for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
                const { x: canvasX, y: startY } = this.complexToCanvas(new GDVUtils.Complex(x, yMin));
                const { y: endY } = this.complexToCanvas(new GDVUtils.Complex(x, yMax));
                
                ctx.beginPath();
                ctx.moveTo(canvasX, startY);
                ctx.lineTo(canvasX, endY);
                ctx.stroke();
                
                // Draw x-axis labels
                if (this.options.showLabels && Math.abs(x) > 0.0001) {
                    const { y: labelY } = this.complexToCanvas(new GDVUtils.Complex(0, 0));
                    ctx.fillStyle = this.options.axisColor;
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(x.toFixed(1), canvasX, labelY + 20);
                }
            }
            
            // Draw horizontal grid lines
            for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
                const { x: startX, y: canvasY } = this.complexToCanvas(new GDVUtils.Complex(xMin, y));
                const { x: endX } = this.complexToCanvas(new GDVUtils.Complex(xMax, y));
                
                ctx.beginPath();
                ctx.moveTo(startX, canvasY);
                ctx.lineTo(endX, canvasY);
                ctx.stroke();
                
                // Draw y-axis labels
                if (this.options.showLabels && Math.abs(y) > 0.0001) {
                    const { x: labelX } = this.complexToCanvas(new GDVUtils.Complex(0, 0));
                    ctx.fillStyle = this.options.axisColor;
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'right';
                    ctx.fillText(y.toFixed(1), labelX - 10, canvasY + 5);
                }
            }
            
            ctx.restore();
        };
        
        // Draw a complex function using domain coloring
        this.drawComplexFunction = function(complexFunction, options = {}) {
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
                    const z = new GDVUtils.Complex(real, imag);
                    
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
        };
        
        // Get color for a complex number based on coloring method
        this.getComplexColor = function(z, method = 'phase') {
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
        };
        
        // Get color based on phase angle
        this.getPhaseColor = function(angle) {
            // Normalize angle to [0, 2π)
            const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
            
            // Convert to hue (0-360)
            const hue = (normalizedAngle / (2 * Math.PI)) * 360;
            
            // Convert HSV to RGB
            return GDVUtils.hsvToRgb(hue, 1, 1);
        };
        
        // Get color based on modulus
        this.getModulusColor = function(modulus) {
            // Map modulus to brightness
            const brightness = Math.min(1, 1 / (1 + modulus * 0.2));
            
            // Return grayscale color
            const value = Math.floor(brightness * 255);
            return { r: value, g: value, b: value };
        };
        
        // Get color combining phase and modulus
        this.getCombinedColor = function(z) {
            // Use phase for hue
            const hue = ((z.argument() + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI) * 360;
            
            // Use modulus for brightness
            const modulus = z.modulus();
            const value = 1 - Math.min(1, 1 / (1 + modulus * 0.2));
            const saturation = 0.8;
            
            // Convert HSV to RGB
            return GDVUtils.hsvToRgb(hue, saturation, value);
        };
        
        // Draw a point
        this.drawPoint = function(z, options = {}) {
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
        };
        
        // Draw a gradient vector
        this.drawGradientVector = function(z, gradient, options = {}) {
            const { ctx } = this;
            
            // Scale gradient for better visualization
            const scale = options.scale || 0.2;
            const scaledGradient = new GDVUtils.Complex(
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
                const midZ = new GDVUtils.Complex(
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
        };
        
        // Draw an arrow
        this.drawArrow = function(startZ, endZ, options = {}) {
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
        };
        
        // Draw a path (series of points)
        this.drawPath = function(points, options = {}) {
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
        };
        
        // Render the entire scene for complex visualization
        this.render = function(scene) {
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
        };
        
        // Auto-adjust view bounds based on function domain and points
        this.autoAdjustViewBounds = function(complexFunction, points = [], padding = 0.2) {
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
        };
    }
};
