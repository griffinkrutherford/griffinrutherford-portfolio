/* utils.js - Utility functions for the Gradient Descent Visualizer */

// Namespace for utility functions
var GDVUtils = {
    // Calculate appropriate grid step size
    calculateGridStep: function(range) {
        const targetSteps = 10; // Aim for about 10 grid lines
        const rawStep = range / targetSteps;
        
        // Round to a nice number
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const normalized = rawStep / magnitude;
        
        if (normalized < 1.5) return magnitude;
        if (normalized < 3.5) return 2 * magnitude;
        if (normalized < 7.5) return 5 * magnitude;
        return 10 * magnitude;
    },
    
    // HSV to RGB conversion
    hsvToRgb: function(h, s, v) {
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
    },
    
    // Complex number operations
    Complex: function(real, imag) {
        this.real = real || 0;
        this.imag = imag || 0;
        
        // Add two complex numbers
        this.add = function(other) {
            return new GDVUtils.Complex(
                this.real + other.real,
                this.imag + other.imag
            );
        };
        
        // Subtract two complex numbers
        this.subtract = function(other) {
            return new GDVUtils.Complex(
                this.real - other.real,
                this.imag - other.imag
            );
        };
        
        // Multiply two complex numbers
        this.multiply = function(other) {
            return new GDVUtils.Complex(
                this.real * other.real - this.imag * other.imag,
                this.real * other.imag + this.imag * other.real
            );
        };
        
        // Divide two complex numbers
        this.divide = function(other) {
            const denominator = other.real * other.real + other.imag * other.imag;
            return new GDVUtils.Complex(
                (this.real * other.real + this.imag * other.imag) / denominator,
                (this.imag * other.real - this.real * other.imag) / denominator
            );
        };
        
        // Complex conjugate
        this.conjugate = function() {
            return new GDVUtils.Complex(this.real, -this.imag);
        };
        
        // Modulus (magnitude) of complex number
        this.modulus = function() {
            return Math.sqrt(this.real * this.real + this.imag * this.imag);
        };
        
        // Argument (phase) of complex number
        this.argument = function() {
            return Math.atan2(this.imag, this.real);
        };
        
        // String representation
        this.toString = function() {
            if (this.imag >= 0) {
                return this.real.toFixed(4) + " + " + this.imag.toFixed(4) + "i";
            } else {
                return this.real.toFixed(4) + " - " + Math.abs(this.imag).toFixed(4) + "i";
            }
        };
    }
};
