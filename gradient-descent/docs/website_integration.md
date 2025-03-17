# Website Integration Guide

This document provides instructions for integrating the Gradient Descent Visualizer into the griffinrutherford.com website.

## Directory Structure

The Gradient Descent Visualizer should be placed in a subdirectory of the main website. Based on the existing website structure, it should be placed in:

```
/gradient-descent/
```

This matches the link in the projects section of the website that points to "gradient-descent".

## Files to Copy

Copy the following files and directories to the `/gradient-descent/` directory on the website:

1. `index.html` - The main HTML file
2. `css/` - Directory containing CSS styles
3. `js/` - Directory containing all JavaScript files
   - `app.js` - Main application file
   - `main.js` - Single variable visualizer
   - `multivariate-visualizer.js` - Multivariate visualizer
   - `complex-visualizer.js` - Complex function visualizer
   - `math/` - Directory containing math-related files
   - `ui/` - Directory containing UI-related files

## Integration Steps

1. Create the `/gradient-descent/` directory on the website if it doesn't already exist
2. Copy all files and directories listed above to the `/gradient-descent/` directory
3. Ensure the relative paths in the HTML file match the website's structure
4. Test the integration by navigating to `https://griffinrutherford.com/gradient-descent/`

## Compatibility Notes

- The visualizer uses ES6 modules, which require a modern browser
- All paths in the HTML file are relative, so they should work as long as the directory structure is maintained
- The visualizer is designed to match the styling of griffinrutherford.com
- The home button in the visualizer links back to the main website using a relative path (`..`)

## Troubleshooting

If the visualizer doesn't work after integration:

1. Check browser console for JavaScript errors
2. Verify that all files were copied correctly
3. Ensure the server supports serving JavaScript modules (Content-Type: application/javascript)
4. Check that the paths in the HTML file match the actual file locations

## Future Updates

To update the visualizer in the future:

1. Make changes to the local development version
2. Test thoroughly
3. Copy the updated files to the website, maintaining the same directory structure
