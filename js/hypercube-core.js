/* Coordinate geometry shared with the Beyond 3D lecture, rather than a canned morph. */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory(require('../gradient-descent-worksheet/dimensions-core.js'));
    else root.HypercubeGeometry = factory(root.DimensionsCore);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (core) {
    'use strict';
    const cache = new Map();
    function project(vector) {
        let point = vector.slice();
        const camera = point.length === 4 ? 5 : 10;
        while (point.length > 3) {
            const depth = point.pop();
            if (depth >= camera) throw new RangeError('Point must stay behind the projection camera.');
            point = point.map(value => value * camera / (camera - depth));
        }
        return point;
    }
    function shape(dimension, angle = 0) {
        if (!Number.isInteger(dimension) || dimension < 3 || dimension > 6) throw new RangeError('Choose 3–6 independent directions.');
        if (!Number.isFinite(angle)) throw new RangeError('The turn must be finite.');
        if (!cache.has(dimension)) cache.set(dimension, core.hypercube(dimension));
        const topology = cache.get(dimension);
        const rotated = topology.vertices.map(vertex => {
            let point = core.rotate(vertex, 0, dimension - 1, angle);
            if (dimension >= 5) point = core.rotate(point, 1, dimension - 2, .52 + angle * 2);
            if (dimension === 6) point = core.rotate(point, 2, 3, .38 + angle * 3);
            return core.rotate(point, 1, 2, .47);
        });
        return {vertices: rotated, projected: rotated.map(project), edges: topology.edges};
    }
    // Six square faces of one XYZ cell: extra coordinates remain fixed at -1.
    const cellFaces = [];
    for (let axis = 0; axis < 3; axis++) {
        const free = [0, 1, 2].filter(index => index !== axis);
        for (let side = 0; side < 2; side++) {
            const base = side << axis;
            cellFaces.push([base, base | (1 << free[0]), base | (1 << free[0]) | (1 << free[1]), base | (1 << free[1])]);
        }
    }
    return {shape, project, cellFaces};
});
