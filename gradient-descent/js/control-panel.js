/* control-panel.js - UI controls for the Gradient Descent Visualizer */

// Namespace for control panels
var GDVControls = {
    // Single variable control panel
    SingleVariable: function(containerId, options = {}) {
        // Get container element
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element with id '${containerId}' not found`);
        }
        
        // Set default options
        this.options = {
            functions: options.functions || GDVMath.singleVariable.functions,
            defaultFunction: options.defaultFunction || 'quadratic',
            defaultLearningRate: options.defaultLearningRate || 0.1,
            defaultStartingPoint: options.defaultStartingPoint || 0,
            maxIterations: options.maxIterations || 100
        };
        
        // State
        this.selectedFunction = null;
        this.learningRate = this.options.defaultLearningRate;
        this.startingPoint = this.options.defaultStartingPoint;
        this.isRunning = false;
        this.callbacks = {};
        
        // Initialize
        this.init();
        
        // Initialize control panel
        this.init = function() {
            this.render();
            this.setupEventListeners();
            
            // Set default function
            this.selectFunction(this.options.defaultFunction);
        };
        
        // Render control panel
        this.render = function() {
            // Clear container
            this.container.innerHTML = '';
            
            // Create control panel elements
            const panel = document.createElement('div');
            panel.className = 'control-panel';
            
            // Function selection
            const functionGroup = document.createElement('div');
            functionGroup.className = 'control-group';
            
            const functionLabel = document.createElement('label');
            functionLabel.textContent = 'Function:';
            functionGroup.appendChild(functionLabel);
            
            const functionSelect = document.createElement('select');
            functionSelect.id = 'function-select';
            
            // Add function options
            for (const [key, func] of Object.entries(this.options.functions)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = func.name;
                functionSelect.appendChild(option);
            }
            
            functionGroup.appendChild(functionSelect);
            panel.appendChild(functionGroup);
            
            // Function expression display
            const expressionGroup = document.createElement('div');
            expressionGroup.className = 'control-group';
            
            const expressionLabel = document.createElement('label');
            expressionLabel.textContent = 'Expression:';
            expressionGroup.appendChild(expressionLabel);
            
            const expressionDisplay = document.createElement('div');
            expressionDisplay.id = 'function-expression';
            expressionDisplay.className = 'expression-display';
            expressionGroup.appendChild(expressionDisplay);
            
            panel.appendChild(expressionGroup);
            
            // Learning rate control
            const learningRateGroup = document.createElement('div');
            learningRateGroup.className = 'control-group';
            
            const learningRateLabel = document.createElement('label');
            learningRateLabel.textContent = 'Learning Rate (α):';
            learningRateGroup.appendChild(learningRateLabel);
            
            const learningRateInput = document.createElement('input');
            learningRateInput.type = 'range';
            learningRateInput.id = 'learning-rate';
            learningRateInput.min = '0.01';
            learningRateInput.max = '1';
            learningRateInput.step = '0.01';
            learningRateInput.value = this.options.defaultLearningRate;
            learningRateGroup.appendChild(learningRateInput);
            
            const learningRateValue = document.createElement('span');
            learningRateValue.id = 'learning-rate-value';
            learningRateValue.textContent = this.options.defaultLearningRate;
            learningRateGroup.appendChild(learningRateValue);
            
            panel.appendChild(learningRateGroup);
            
            // Starting point control
            const startingPointGroup = document.createElement('div');
            startingPointGroup.className = 'control-group';
            
            const startingPointLabel = document.createElement('label');
            startingPointLabel.textContent = 'Starting Point (x₀):';
            startingPointGroup.appendChild(startingPointLabel);
            
            const startingPointInput = document.createElement('input');
            startingPointInput.type = 'number';
            startingPointInput.id = 'starting-point';
            startingPointInput.value = this.options.defaultStartingPoint;
            startingPointInput.step = '0.1';
            startingPointGroup.appendChild(startingPointInput);
            
            panel.appendChild(startingPointGroup);
            
            // Control buttons
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'control-group button-group';
            
            const resetButton = document.createElement('button');
            resetButton.id = 'reset-button';
            resetButton.textContent = 'Reset';
            resetButton.className = 'control-button';
            buttonGroup.appendChild(resetButton);
            
            const stepButton = document.createElement('button');
            stepButton.id = 'step-button';
            stepButton.textContent = 'Step';
            stepButton.className = 'control-button';
            buttonGroup.appendChild(stepButton);
            
            const runButton = document.createElement('button');
            runButton.id = 'run-button';
            runButton.textContent = 'Run';
            runButton.className = 'control-button primary-button';
            buttonGroup.appendChild(runButton);
            
            panel.appendChild(buttonGroup);
            
            // Status display
            const statusGroup = document.createElement('div');
            statusGroup.className = 'control-group';
            
            const statusLabel = document.createElement('label');
            statusLabel.textContent = 'Status:';
            statusGroup.appendChild(statusLabel);
            
            const statusDisplay = document.createElement('div');
            statusDisplay.id = 'status-display';
            statusDisplay.className = 'status-display';
            statusDisplay.textContent = 'Ready';
            statusGroup.appendChild(statusDisplay);
            
            panel.appendChild(statusGroup);
            
            // Add panel to container
            this.container.appendChild(panel);
        };
        
        // Set up event listeners
        this.setupEventListeners = function() {
            // Function selection
            const functionSelect = document.getElementById('function-select');
            functionSelect.addEventListener('change', () => {
                this.selectFunction(functionSelect.value);
            });
            
            // Learning rate
            const learningRateInput = document.getElementById('learning-rate');
            const learningRateValue = document.getElementById('learning-rate-value');
            
            learningRateInput.addEventListener('input', () => {
                this.learningRate = parseFloat(learningRateInput.value);
                learningRateValue.textContent = this.learningRate.toFixed(2);
                
                if (this.callbacks.onLearningRateChange) {
                    this.callbacks.onLearningRateChange(this.learningRate);
                }
            });
            
            // Starting point
            const startingPointInput = document.getElementById('starting-point');
            startingPointInput.addEventListener('change', () => {
                this.startingPoint = parseFloat(startingPointInput.value);
                
                if (this.callbacks.onStartingPointChange) {
                    this.callbacks.onStartingPointChange(this.startingPoint);
                }
            });
            
            // Reset button
            const resetButton = document.getElementById('reset-button');
            resetButton.addEventListener('click', () => {
                this.isRunning = false;
                
                if (this.callbacks.onReset) {
                    this.callbacks.onReset();
                }
                
                this.updateStatus('Reset');
            });
            
            // Step button
            const stepButton = document.getElementById('step-button');
            stepButton.addEventListener('click', () => {
                if (this.callbacks.onStep) {
                    this.callbacks.onStep();
                }
            });
            
            // Run button
            const runButton = document.getElementById('run-button');
            runButton.addEventListener('click', () => {
                this.isRunning = !this.isRunning;
                runButton.textContent = this.isRunning ? 'Pause' : 'Run';
                
                if (this.callbacks.onRunToggle) {
                    this.callbacks.onRunToggle(this.isRunning);
                }
                
                this.updateStatus(this.isRunning ? 'Running' : 'Paused');
            });
        };
        
        // Select a function
        this.selectFunction = function(functionKey) {
            this.selectedFunction = this.options.functions[functionKey];
            
            // Update UI
            const functionSelect = document.getElementById('function-select');
            functionSelect.value = functionKey;
            
            const expressionDisplay = document.getElementById('function-expression');
            expressionDisplay.textContent = this.selectedFunction.expression;
            
            // Call callback if registered
            if (this.callbacks.onFunctionChange) {
                this.callbacks.onFunctionChange(this.selectedFunction);
            }
        };
        
        // Update status display
        this.updateStatus = function(status, details = '') {
            const statusDisplay = document.getElementById('status-display');
            statusDisplay.textContent = status + (details ? ': ' + details : '');
        };
        
        // Register callback
        this.on = function(event, callback) {
            this.callbacks[event] = callback;
            return this;
        };
        
        // Get current settings
        this.getSettings = function() {
            return {
                function: this.selectedFunction,
                learningRate: this.learningRate,
                startingPoint: this.startingPoint,
                isRunning: this.isRunning
            };
        };
    },
    
    // Multivariate control panel
    Multivariate: function(containerId, options = {}) {
        // Get container element
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element with id '${containerId}' not found`);
        }
        
        // Set default options
        this.options = {
            functions: options.functions || GDVMath.multivariate.functions,
            defaultFunction: options.defaultFunction || 'paraboloid',
            defaultLearningRate: options.defaultLearningRate || 0.1,
            defaultStartingPoint: options.defaultStartingPoint || { x: 1, y: 1 },
            maxIterations: options.maxIterations || 100
        };
        
        // State
        this.selectedFunction = null;
        this.learningRate = this.options.defaultLearningRate;
        this.startingPoint = this.options.defaultStartingPoint;
        this.isRunning = false;
        this.callbacks = {};
        
        // Initialize
        this.init();
        
        // Initialize control panel
        this.init = function() {
            this.render();
            this.setupEventListeners();
            
            // Set default function
            this.selectFunction(this.options.defaultFunction);
        };
        
        // Render control panel
        this.render = function() {
            // Clear container
            this.container.innerHTML = '';
            
            // Create control panel elements
            const panel = document.createElement('div');
            panel.className = 'control-panel';
            
            // Function selection
            const functionGroup = document.createElement('div');
            functionGroup.className = 'control-group';
            
            const functionLabel = document.createElement('label');
            functionLabel.textContent = 'Function:';
            functionGroup.appendChild(functionLabel);
            
            const functionSelect = document.createElement('select');
            functionSelect.id = 'function-select-multi';
            
            // Add function options
            for (const [key, func] of Object.entries(this.options.functions)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = func.name;
                functionSelect.appendChild(option);
            }
            
            functionGroup.appendChild(functionSelect);
            panel.appendChild(functionGroup);
            
            // Function expression display
            const expressionGroup = document.createElement('div');
            expressionGroup.className = 'control-group';
            
            const expressionLabel = document.createElement('label');
            expressionLabel.textContent = 'Expression:';
            expressionGroup.appendChild(expressionLabel);
            
            const expressionDisplay = document.createElement('div');
            expressionDisplay.id = 'function-expression-multi';
            expressionDisplay.className = 'expression-display';
            expressionGroup.appendChild(expressionDisplay);
            
            panel.appendChild(expressionGroup);
            
            // Learning rate control
            const learningRateGroup = document.createElement('div');
            learningRateGroup.className = 'control-group';
            
            const learningRateLabel = document.createElement('label');
            learningRateLabel.textContent = 'Learning Rate (α):';
            learningRateGroup.appendChild(learningRateLabel);
            
            const learningRateInput = document.createElement('input');
            learningRateInput.type = 'range';
            learningRateInput.id = 'learning-rate-multi';
            learningRateInput.min = '0.01';
            learningRateInput.max = '1';
            learningRateInput.step = '0.01';
            learningRateInput.value = this.options.defaultLearningRate;
            learningRateGroup.appendChild(learningRateInput);
            
            const learningRateValue = document.createElement('span');
            learningRateValue.id = 'learning-rate-value-multi';
            learningRateValue.textContent = this.options.defaultLearningRate;
            learningRateGroup.appendChild(learningRateValue);
            
            panel.appendChild(learningRateGroup);
            
            // Starting point controls
            const startingPointGroup = document.createElement('div');
            startingPointGroup.className = 'control-group';
            
            const startingPointLabel = document.createElement('label');
            startingPointLabel.textContent = 'Starting Point (x₀, y₀):';
            startingPointGroup.appendChild(startingPointLabel);
            
            const startingPointXInput = document.createElement('input');
            startingPointXInput.type = 'number';
            startingPointXInput.id = 'starting-point-x';
            startingPointXInput.value = this.options.defaultStartingPoint.x;
            startingPointXInput.step = '0.1';
            startingPointXInput.placeholder = 'x';
            startingPointGroup.appendChild(startingPointXInput);
            
            const startingPointYInput = document.createElement('input');
            startingPointYInput.type = 'number';
            startingPointYInput.id = 'starting-point-y';
            startingPointYInput.value = this.options.defaultStartingPoint.y;
            startingPointYInput.step = '0.1';
            startingPointYInput.placeholder = 'y';
            startingPointGroup.appendChild(startingPointYInput);
            
            panel.appendChild(startingPointGroup);
            
            // Control buttons
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'control-group button-group';
            
            const resetButton = document.createElement('button');
            resetButton.id = 'reset-button-multi';
            resetButton.textContent = 'Reset';
            resetButton.className = 'control-button';
            buttonGroup.appendChild(resetButton);
            
            const stepButton = document.createElement('button');
            stepButton.id = 'step-button-multi';
            stepButton.textContent = 'Step';
            stepButton.className = 'control-button';
            buttonGroup.appendChild(stepButton);
            
            const runButton = document.createElement('button');
            runButton.id = 'run-button-multi';
            runButton.textContent = 'Run';
            runButton.className = 'control-button primary-button';
            buttonGroup.appendChild(runButton);
            
            panel.appendChild(buttonGroup);
            
            // Status display
            const statusGroup = document.createElement('div');
            statusGroup.className = 'control-group';
            
            const statusLabel = document.createElement('label');
            statusLabel.textContent = 'Status:';
            statusGroup.appendChild(statusLabel);
            
            const statusDisplay = document.createElement('div');
            statusDisplay.id = 'status-display-multi';
            statusDisplay.className = 'status-display';
            statusDisplay.textContent = 'Ready';
            statusGroup.appendChild(statusDisplay);
            
            panel.appendChild(statusGroup);
            
            // Add panel to container
            this.container.appendChild(panel);
        };
        
        // Set up event listeners
        this.setupEventListeners = function() {
            // Function selection
            const functionSelect = document.getElementById('function-select-multi');
            functionSelect.addEventListener('change', () => {
                this.selectFunction(functionSelect.value);
            });
            
            // Learning rate
            const learningRateInput = document.getElementById('learning-rate-multi');
            const learningRateValue = document.getElementById('learning-rate-value-multi');
            
            learningRateInput.addEventListener('input', () => {
                this.learningRate = parseFloat(learningRateInput.value);
                learningRateValue.textContent = this.learningRate.toFixed(2);
                
                if (this.callbacks.onLearningRateChange) {
                    this.callbacks.onLearningRateChange(this.learningRate);
                }
            });
            
            // Starting point
            const startingPointXInput = document.getElementById('starting-point-x');
            const startingPointYInput = document.getElementById('starting-point-y');
            
            const updateStartingPoint = () => {
                this.startingPoint = {
                    x: parseFloat(startingPointXInput.value),
                    y: parseFloat(startingPointYInput.value)
                };
                
                if (this.callbacks.onStartingPointChange) {
                    this.callbacks.onStartingPointChange(this.startingPoint);
                }
            };
            
            startingPointXInput.addEventListener('change', updateStartingPoint);
            startingPointYInput.addEventListener('change', updateStartingPoint);
            
            // Reset button
            const resetButton = document.getElementById('reset-button-multi');
            resetButton.addEventListener('click', () => {
                this.isRunning = false;
                
                if (this.callbacks.onReset) {
                    this.callbacks.onReset();
                }
                
                this.updateStatus('Reset');
            });
            
            // Step button
            const stepButton = document.getElementById('step-button-multi');
            stepButton.addEventListener('click', () => {
                if (this.callbacks.onStep) {
                    this.callbacks.onStep();
                }
            });
            
            // Run button
            const runButton = document.getElementById('run-button-multi');
            runButton.addEventListener('click', () => {
                this.isRunning = !this.isRunning;
                runButton.textContent = this.isRunning ? 'Pause' : 'Run';
                
                if (this.callbacks.onRunToggle) {
                    this.callbacks.onRunToggle(this.isRunning);
                }
                
                this.updateStatus(this.isRunning ? 'Running' : 'Paused');
            });
        };
        
        // Select a function
        this.selectFunction = function(functionKey) {
            this.selectedFunction = this.options.functions[functionKey];
            
            // Update UI
            const functionSelect = document.getElementById('function-select-multi');
            functionSelect.value = functionKey;
            
            const expressionDisplay = document.getElementById('function-expression-multi');
            expressionDisplay.textContent = this.selectedFunction.expression;
            
            // Call callback if registered
            if (this.callbacks.onFunctionChange) {
                this.callbacks.onFunctionChange(this.selectedFunction);
            }
        };
        
        // Update status display
        this.updateStatus = function(status, details = '') {
            const statusDisplay = document.getElementById('status-display-multi');
            statusDisplay.textContent = status + (details ? ': ' + details : '');
        };
        
        // Register callback
        this.on = function(event, callback) {
            this.callbacks[event] = callback;
            return this;
        };
        
        // Get current settings
        this.getSettings = function() {
            return {
                function: this.selectedFunction,
                learningRate: this.learningRate,
                startingPoint: this.startingPoint,
                isRunning: this.isRunning
            };
        };
    },
    
    // Complex control panel
    Complex: function(containerId, options = {}) {
        // Get container element
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element with id '${containerId}' not found`);
        }
        
        // Set default options
        this.options = {
            functions: options.functions || GDVMath.complex.functions,
            defaultFunction: options.defaultFunction || 'square',
            defaultLearningRate: options.defaultLearningRate || 0.1,
            defaultStartingPoint: options.defaultStartingPoint || { real: 1, imag: 1 },
            maxIterations: options.maxIterations || 100,
            coloringMethods: options.coloringMethods || ['phase', 'modulus', 'combined']
        };
        
        // State
        this.selectedFunction = null;
        this.learningRate = this.options.defaultLearningRate;
        this.startingPoint = this.options.defaultStartingPoint;
        this.coloringMethod = 'phase';
        this.isRunning = false;
        this.callbacks = {};
        
        // Initialize
        this.init();
        
        // Initialize control panel
        this.init = function() {
            this.render();
            this.setupEventListeners();
            
            // Set default function
            this.selectFunction(this.options.defaultFunction);
        };
        
        // Render control panel
        this.render = function() {
            // Clear container
            this.container.innerHTML = '';
            
            // Create control panel elements
            const panel = document.createElement('div');
            panel.className = 'control-panel';
            
            // Function selection
            const functionGroup = document.createElement('div');
            functionGroup.className = 'control-group';
            
            const functionLabel = document.createElement('label');
            functionLabel.textContent = 'Function:';
            functionGroup.appendChild(functionLabel);
            
            const functionSelect = document.createElement('select');
            functionSelect.id = 'function-select-complex';
            
            // Add function options
            for (const [key, func] of Object.entries(this.options.functions)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = func.name;
                functionSelect.appendChild(option);
            }
            
            functionGroup.appendChild(functionSelect);
            panel.appendChild(functionGroup);
            
            // Function expression display
            const expressionGroup = document.createElement('div');
            expressionGroup.className = 'control-group';
            
            const expressionLabel = document.createElement('label');
            expressionLabel.textContent = 'Expression:';
            expressionGroup.appendChild(expressionLabel);
            
            const expressionDisplay = document.createElement('div');
            expressionDisplay.id = 'function-expression-complex';
            expressionDisplay.className = 'expression-display';
            expressionGroup.appendChild(expressionDisplay);
            
            panel.appendChild(expressionGroup);
            
            // Coloring method selection
            const coloringGroup = document.createElement('div');
            coloringGroup.className = 'control-group';
            
            const coloringLabel = document.createElement('label');
            coloringLabel.textContent = 'Coloring Method:';
            coloringGroup.appendChild(coloringLabel);
            
            const coloringSelect = document.createElement('select');
            coloringSelect.id = 'coloring-method';
            
            // Add coloring method options
            for (const method of this.options.coloringMethods) {
                const option = document.createElement('option');
                option.value = method;
                option.textContent = method.charAt(0).toUpperCase() + method.slice(1);
                coloringSelect.appendChild(option);
            }
            
            coloringGroup.appendChild(coloringSelect);
            panel.appendChild(coloringGroup);
            
            // Learning rate control
            const learningRateGroup = document.createElement('div');
            learningRateGroup.className = 'control-group';
            
            const learningRateLabel = document.createElement('label');
            learningRateLabel.textContent = 'Learning Rate (α):';
            learningRateGroup.appendChild(learningRateLabel);
            
            const learningRateInput = document.createElement('input');
            learningRateInput.type = 'range';
            learningRateInput.id = 'learning-rate-complex';
            learningRateInput.min = '0.01';
            learningRateInput.max = '1';
            learningRateInput.step = '0.01';
            learningRateInput.value = this.options.defaultLearningRate;
            learningRateGroup.appendChild(learningRateInput);
            
            const learningRateValue = document.createElement('span');
            learningRateValue.id = 'learning-rate-value-complex';
            learningRateValue.textContent = this.options.defaultLearningRate;
            learningRateGroup.appendChild(learningRateValue);
            
            panel.appendChild(learningRateGroup);
            
            // Starting point controls
            const startingPointGroup = document.createElement('div');
            startingPointGroup.className = 'control-group';
            
            const startingPointLabel = document.createElement('label');
            startingPointLabel.textContent = 'Starting Point (z₀ = a + bi):';
            startingPointGroup.appendChild(startingPointLabel);
            
            const startingPointRealInput = document.createElement('input');
            startingPointRealInput.type = 'number';
            startingPointRealInput.id = 'starting-point-real';
            startingPointRealInput.value = this.options.defaultStartingPoint.real;
            startingPointRealInput.step = '0.1';
            startingPointRealInput.placeholder = 'Real';
            startingPointGroup.appendChild(startingPointRealInput);
            
            const startingPointImagInput = document.createElement('input');
            startingPointImagInput.type = 'number';
            startingPointImagInput.id = 'starting-point-imag';
            startingPointImagInput.value = this.options.defaultStartingPoint.imag;
            startingPointImagInput.step = '0.1';
            startingPointImagInput.placeholder = 'Imaginary';
            startingPointGroup.appendChild(startingPointImagInput);
            
            panel.appendChild(startingPointGroup);
            
            // Control buttons
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'control-group button-group';
            
            const resetButton = document.createElement('button');
            resetButton.id = 'reset-button-complex';
            resetButton.textContent = 'Reset';
            resetButton.className = 'control-button';
            buttonGroup.appendChild(resetButton);
            
            const stepButton = document.createElement('button');
            stepButton.id = 'step-button-complex';
            stepButton.textContent = 'Step';
            stepButton.className = 'control-button';
            buttonGroup.appendChild(stepButton);
            
            const runButton = document.createElement('button');
            runButton.id = 'run-button-complex';
            runButton.textContent = 'Run';
            runButton.className = 'control-button primary-button';
            buttonGroup.appendChild(runButton);
            
            panel.appendChild(buttonGroup);
            
            // Status display
            const statusGroup = document.createElement('div');
            statusGroup.className = 'control-group';
            
            const statusLabel = document.createElement('label');
            statusLabel.textContent = 'Status:';
            statusGroup.appendChild(statusLabel);
            
            const statusDisplay = document.createElement('div');
            statusDisplay.id = 'status-display-complex';
            statusDisplay.className = 'status-display';
            statusDisplay.textContent = 'Ready';
            statusGroup.appendChild(statusDisplay);
            
            panel.appendChild(statusGroup);
            
            // Add panel to container
            this.container.appendChild(panel);
        };
        
        // Set up event listeners
        this.setupEventListeners = function() {
            // Function selection
            const functionSelect = document.getElementById('function-select-complex');
            functionSelect.addEventListener('change', () => {
                this.selectFunction(functionSelect.value);
            });
            
            // Coloring method
            const coloringSelect = document.getElementById('coloring-method');
            coloringSelect.addEventListener('change', () => {
                this.coloringMethod = coloringSelect.value;
                
                if (this.callbacks.onColoringMethodChange) {
                    this.callbacks.onColoringMethodChange(this.coloringMethod);
                }
            });
            
            // Learning rate
            const learningRateInput = document.getElementById('learning-rate-complex');
            const learningRateValue = document.getElementById('learning-rate-value-complex');
            
            learningRateInput.addEventListener('input', () => {
                this.learningRate = parseFloat(learningRateInput.value);
                learningRateValue.textContent = this.learningRate.toFixed(2);
                
                if (this.callbacks.onLearningRateChange) {
                    this.callbacks.onLearningRateChange(this.learningRate);
                }
            });
            
            // Starting point
            const startingPointRealInput = document.getElementById('starting-point-real');
            const startingPointImagInput = document.getElementById('starting-point-imag');
            
            const updateStartingPoint = () => {
                this.startingPoint = {
                    real: parseFloat(startingPointRealInput.value),
                    imag: parseFloat(startingPointImagInput.value)
                };
                
                if (this.callbacks.onStartingPointChange) {
                    this.callbacks.onStartingPointChange(this.startingPoint);
                }
            };
            
            startingPointRealInput.addEventListener('change', updateStartingPoint);
            startingPointImagInput.addEventListener('change', updateStartingPoint);
            
            // Reset button
            const resetButton = document.getElementById('reset-button-complex');
            resetButton.addEventListener('click', () => {
                this.isRunning = false;
                
                if (this.callbacks.onReset) {
                    this.callbacks.onReset();
                }
                
                this.updateStatus('Reset');
            });
            
            // Step button
            const stepButton = document.getElementById('step-button-complex');
            stepButton.addEventListener('click', () => {
                if (this.callbacks.onStep) {
                    this.callbacks.onStep();
                }
            });
            
            // Run button
            const runButton = document.getElementById('run-button-complex');
            runButton.addEventListener('click', () => {
                this.isRunning = !this.isRunning;
                runButton.textContent = this.isRunning ? 'Pause' : 'Run';
                
                if (this.callbacks.onRunToggle) {
                    this.callbacks.onRunToggle(this.isRunning);
                }
                
                this.updateStatus(this.isRunning ? 'Running' : 'Paused');
            });
        };
        
        // Select a function
        this.selectFunction = function(functionKey) {
            this.selectedFunction = this.options.functions[functionKey];
            
            // Update UI
            const functionSelect = document.getElementById('function-select-complex');
            functionSelect.value = functionKey;
            
            const expressionDisplay = document.getElementById('function-expression-complex');
            expressionDisplay.textContent = this.selectedFunction.expression;
            
            // Call callback if registered
            if (this.callbacks.onFunctionChange) {
                this.callbacks.onFunctionChange(this.selectedFunction);
            }
        };
        
        // Update status display
        this.updateStatus = function(status, details = '') {
            const statusDisplay = document.getElementById('status-display-complex');
            statusDisplay.textContent = status + (details ? ': ' + details : '');
        };
        
        // Register callback
        this.on = function(event, callback) {
            this.callbacks[event] = callback;
            return this;
        };
        
        // Get current settings
        this.getSettings = function() {
            return {
                function: this.selectedFunction,
                learningRate: this.learningRate,
                startingPoint: this.startingPoint,
                coloringMethod: this.coloringMethod,
                isRunning: this.isRunning
            };
        };
    }
};
