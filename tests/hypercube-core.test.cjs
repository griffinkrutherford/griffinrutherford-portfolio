const test=require('node:test');
const assert=require('node:assert/strict');
const geometry=require('../js/hypercube-core.js');
const core=require('../gradient-descent-worksheet/dimensions-core.js');
const close=(a,b)=>assert(Math.abs(a-b)<1e-10,`${a} ≈ ${b}`);
test('3–6D cubes have the correct graph and edges of length two through every turn',()=>{
    for(let d=3;d<=6;d++)for(let degrees=0;degrees<=360;degrees+=5){
        const shape=geometry.shape(d,degrees*Math.PI/180);
        assert.equal(shape.vertices.length,2**d);assert.equal(shape.edges.length,d*2**(d-1));
        const degreesAtVertex=Array(2**d).fill(0);
        for(const [a,b,axis] of shape.edges){assert.equal(a^b,1<<axis);degreesAtVertex[a]++;degreesAtVertex[b]++;close(core.distance(shape.vertices[a],shape.vertices[b]),2);}
        assert(degreesAtVertex.every(n=>n===d));
        shape.vertices.forEach(p=>close(Math.hypot(...p),Math.sqrt(d)));
        shape.projected.forEach(p=>{assert.equal(p.length,3);assert(p.every(Number.isFinite));});
    }
});
test('4D projection agrees with the lecture perspective equation and never changes the input',()=>{
    const vector=[1,-1,.5,1],copy=vector.slice();
    geometry.project(vector).forEach((v,i)=>close(v,core.project4(vector,5)[i]));assert.deepEqual(vector,copy);
    assert.deepEqual(geometry.project([1,2,3]),[1,2,3]);
    assert.throws(()=>geometry.project([1,1,1,5]),RangeError);
});
test('full turns loop continuously and square faces preserve cube topology',()=>{
    for(let d=3;d<=6;d++){
        const before=geometry.shape(d,0),after=geometry.shape(d,Math.PI*2);
        before.vertices.forEach((v,i)=>v.forEach((n,j)=>close(n,after.vertices[i][j])));
        for(const face of geometry.cellFaces){assert.equal(new Set(face).size,4);assert(face.every(i=>i<8));for(let i=0;i<4;i++)close(core.distance(before.vertices[face[i]],before.vertices[face[(i+1)%4]]),2);}
    }
    assert.equal(geometry.cellFaces.length,6);
});
test('invalid dimensions and turns are rejected; repeat calls reproduce their coordinates',()=>{
    for(const d of [2,7,3.5,NaN])assert.throws(()=>geometry.shape(d),RangeError);
    assert.throws(()=>geometry.shape(4,Infinity),RangeError);
    assert.deepEqual(geometry.shape(6,1),geometry.shape(6,1));
});
