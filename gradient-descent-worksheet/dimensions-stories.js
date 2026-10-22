/* Each visual argument has a prediction, an experiment, and a reason to trust it. */
window.DimensionsStories = {
    ladder: {
        title: 'A dimension is just a new way to move',
        intro: 'Picture a bead stuck on a wire. You only need one number to say where it is. Now let it slide around on a sheet of paper: you need two numbers. Lift it off the paper and you need three. That’s really all a dimension is: one more direction you can move in while everything else stays put.',
        limit: 'Heads up: in step four, w is a brand-new direction. It isn’t some diagonal mixed from x, y, and z. Your screen is flat, so I have to squish the picture down twice, which means the drawn directions won’t always look like they meet at right angles.',
        prompt: 'Keep the old coordinates frozen. Which edges only change the newest coordinate?',
        principle: 'Count the directions first. Worry about picturing them later.',
        reasoning: [
            ['Keep the address', 'A corner of a square has an address like (1, −1). To build a cube, I give that corner two new addresses: (1, −1, −1) and (1, −1, +1). Notice the old numbers didn’t change at all. I just tacked a new one on the end.'],
            ['Copy, then connect', 'Every old corner gets a twin that differs only in the new coordinate. Drag the slider to pull the twins apart. Four square corners become eight cube corners. Eight cube corners become sixteen tesseract corners. (A tesseract is a 4D cube.)'],
            ['Let the rule do the seeing', 'Here’s the cool part: the same trick works in any dimension. Every step doubles the corners: V(n + 1) = 2V(n), so V(n) = 2ⁿ. So I know a 5D cube has 32 corners, and I never had to picture one.']
        ],
        quiz: ['A 5D cube follows the same copy-and-connect rule. How many corners does it have?', ['20', '32', '64'], 1, 'Each of the sixteen 4D corners gets one twin. Sixteen times two is thirty-two. The rule keeps working even after your imagination gives up.'],
        demos: [['Start with the copies stacked on top of each other', {dimension: 4, growth: 0}], ['Pull them apart into a tesseract', {dimension: 4, growth: 1}], ['Try the same rule in 3D', {dimension: 3, growth: 1}]]
    },
    slice: {
        title: 'Is it changing, or are you seeing a slice?',
        intro: 'Imagine you live in Flatland, a world that’s totally flat. One day a circle appears out of nowhere, grows, shrinks, and vanishes. Spooky, right? But from above, we can see what really happened: one ordinary ball passed through your flat world. The ball never changed. You only ever saw the slice of it that touched your world.',
        limit: 'The disk on the right is a map of the whole slice, drawn for us from above. It isn’t what a Flatlander would actually see with their eyes. Also, one slice alone can’t tell you the whole 3D shape.',
        prompt: 'Try the top of the ball, the middle, and a spot outside it. What changed: the whole ball, or just the slice the Flatlander can see?',
        principle: 'Freeze one coordinate, and keep only the points that still fit.',
        reasoning: [
            ['Spend a distance budget', 'Think of it like a budget. Every point inside our ball follows x² + y² + z² ≤ 1, so you have 1 unit to spend. Putting the sheet at height z = a spends a² of it. That leaves x² + y² ≤ 1 − a² for everything else.'],
            ['Read the leftover shape', 'Whatever’s left over makes a disk with radius √(1 − a²). At a = 0.6, you have 0.64 left, so the radius is 0.8. If |a| > 1, you overspent: no points fit, so there’s no slice at all.'],
            ['Don’t jump to conclusions', 'One disk could be a slice of a ball, a cylinder, or lots of other shapes. A whole series of slices tells you way more. And scanning through a solid object isn’t the same thing as watching it actually grow and shrink.']
        ],
        quiz: ['At z = 0.6, what is the disk’s radius?', ['0.4', '0.8', '1.0'], 1, 'Take the square root of what’s left in the budget: √(1 − 0.36) = √0.64 = 0.8. If you just subtracted lengths (1 − 0.6), you’d get 0.4, which is the wrong geometry.'],
        demos: [['At the top of the ball', {slice: 1}], ['Spend 0.36 of the budget', {slice: .6}], ['The biggest slice', {slice: 0}]]
    },
    shadow: {
        title: 'A shadow throws away a coordinate',
        intro: 'Hold one bead right above another. They’re at different heights, but from straight overhead their shadows land in the exact same spot. A shadow squashes a whole vertical line of points into one dot. The height is still there; the shadow just forgot it.',
        limit: 'This kind of flat shadow is called an orthographic projection: (x, y, z) → (x, y). Turning the cube changes which corners overlap, but one flat view can never bring back every depth. Remember: a slice picks some points out, while a shadow smushes points together.',
        prompt: 'Set the rotation to zero and follow a cyan corner and its pink partner. Which number in the address did the shadow erase?',
        principle: 'Different points can land in the same spot on a picture.',
        reasoning: [
            ['Find two witnesses', 'The corners (1, 1, −1) and (1, 1, +1) are two units apart. Drop the z and both become (1, 1). Same shadow, different points.'],
            ['Name the invisible direction', 'Every point (1, 1, z), for any z, casts that same shadow. Mathematicians call that family a fiber of the projection. You can slide anywhere along it and the shadow never moves.'],
            ['Don’t trust just one view', 'A second angle can show you a gap the first one hid. So if two things look like they cross or touch in a drawing, that’s not proof they touch in real space. Keep this in your back pocket for the tesseract.']
        ],
        quiz: ['Two cube corners share one shadow. Do they have to be the same corner?', ['Yes: one spot in the picture means one point', 'No: their missing depth can be different'], 1, 'Their x and y match, but their z can be different. Lots of points can share one shadow. That’s exactly what the overlapping cyan and pink corners are showing you.'],
        demos: [['Erase the depth completely', {angle: 0}], ['Reveal a hidden gap', {angle: 35}]]
    },
    tesseract: {
        title: 'Spin it in 4D without bending it',
        intro: 'Spinning something in 4D sounds wild, but it’s really an ordinary 2D spin using a weird pair of axes. Follow the white corner in the chosen axis–w plane. It goes around in a circle, just like a point spinning in the regular x–y plane. Its other two coordinates don’t move at all.',
        limit: 'The big picture is a tesseract squished down so it fits on your screen. The small circle is just a diagram of the spin, not some other room. On screen, edges can look longer, shorter, or tangled, but in 4D every edge stays exactly two units long.',
        prompt: 'Spin it 90°. The picture looks totally different. Which measurements prove the actual object never bent or stretched?',
        principle: 'What the object does and how we draw it are two different things.',
        reasoning: [
            ['Borrow a spin you already know', 'Spinning in the a–w plane uses the same formulas as any 2D rotation: a′ = a cos θ − w sin θ and w′ = a sin θ + w cos θ. Here a is whichever axis you picked. The other two coordinates stay put.'],
            ['Track what doesn’t change', 'Before and after the spin, the tracked corner has a² + w² = 2. Its squared distance using all four coordinates stays 4, so it’s always two units from the center. Every edge stays length two in 4D, too.'],
            ['Then explain the weird picture', 'We spin first, then squish the result into 3D for drawing. Perspective shrinks the first three coordinates by an amount that depends on w. Orthographic projection just deletes w. That’s why a rigid object can look stretched, overlapping, or nested on screen even though nothing like that is happening in 4D.']
        ],
        quiz: ['An edge looks longer in the picture during the spin. What can you conclude?', ['The 4D edge must have stretched', 'Only the drawing changed; check its real 4D length'], 1, 'The spin keeps every 4D distance the same. The squished drawing is what changes the lengths you see. The live edge-length check measures all four original coordinates, before any drawing happens.'],
        demos: [['Watch a quarter-turn', {angle: 90, plane: '0', projection: 'perspective', cell: 'all'}], ['Delete w with no spin', {angle: 0, plane: '0', projection: 'orthographic', cell: 'all'}], ['Bring back perspective', {angle: 28, projection: 'perspective', cell: 'all'}]]
    },
    net: {
        title: 'The outside skin has one less direction',
        intro: 'A point inside a cube needs three coordinates. But on one of its square faces, one coordinate is stuck at +1 or −1, leaving only two free. Now say that exact same sentence about a tesseract: one of four coordinates gets stuck, leaving three free. So each face of a tesseract is a whole 3D cube!',
        limit: 'A net is what you get when you cut the outside skin apart and lay it out flat, like unfolding a cardboard box. It isn’t the inside of the shape, and it isn’t a shadow. The gap slider just spreads the pieces out so you can look at them; it isn’t showing a real 4D fold.',
        prompt: 'For each coordinate you could freeze, there are two signs to freeze it at. Use that to count the cube pieces before you look at the net.',
        principle: 'Every rule you add takes away one direction. Count the choices and the signs.',
        reasoning: [
            ['Start with a cube’s six faces', 'Pick x, y, or z and freeze it at −1 or +1. Three choices times two signs gives six square faces, each with two free coordinates.'],
            ['Count without the picture', 'For a tesseract, pick x, y, z, or w and freeze it at a sign. Four choices times two signs gives eight cube pieces. The same counting tells you a 5D cube has ten 4D pieces on its outside.'],
            ['Keep inside and outside separate', 'Each cube piece of a tesseract’s outside is a solid 3D chunk, just like a cube’s square face includes the flat part inside its edges. Calling them eight “rooms” is a handy picture for the net. Stacking cubes in our 3D world still isn’t the inside of a 4D shape.']
        ],
        quiz: ['Why does a tesseract have eight cube pieces on its outside?', ['Four coordinate choices × two signs', 'It’s made by putting eight cubes inside each other'], 0, 'Freeze x, y, z, or w at either end. Each freeze leaves the other three coordinates free. The cube-inside-a-cube picture is just how the drawing looks, not how the shape is built.'],
        demos: [['A connected net', {gap: 0}], ['Spread out all eight pieces', {gap: .65}]]
    },
    hypersphere: {
        title: 'Same budget trick, one dimension up',
        intro: 'Remember the budget trick from Flatland? It works in 4D too. Freeze w, subtract w² from your budget of 1, and ask: what ordinary 3D shape fits in what’s left?',
        limit: 'The green shape is a solid 3D slice, not a wireframe of the whole 4D ball. The violet sphere shows the biggest possible slice, so you have something to compare against. And here, w is a fourth direction in space, not time.',
        prompt: 'Compare w = 0 and w = 0.6. The radius only shrinks by 20%. How much of the slice’s volume is left?',
        principle: 'Algebra lets you carry an idea into a dimension you can’t see.',
        reasoning: [
            ['Change just one symbol', 'The 4D ball follows x² + y² + z² + w² ≤ 1. Freeze w = a. What’s left is x² + y² + z² ≤ 1 − a², which is just a regular solid 3D ball.'],
            ['Reuse the old radius', 'Its radius is √(1 − a²) again. At a = 0.6, r = 0.8. Notice that I took the exact same argument from Flatland up a dimension, and I never had to picture a fourth arrow sticking out at right angles.'],
            ['Volume plays by different rules', 'Shrink a 3D ball by a factor r and its volume shrinks by r³. A radius of 0.8 means 0.8³ = 0.512, so only 51.2% of the biggest slice’s volume is left. The same change in radius hits area and volume differently.']
        ],
        quiz: ['At w = 0.6, what fraction of the biggest 3D slice’s volume is left?', ['80%', '64%', '51.2%'], 2, 'The radius is 0.8, but volume shrinks in three directions at once: 0.8 × 0.8 × 0.8 = 0.512. The 64% answer is what you’d get for a flat disk’s area.'],
        demos: [['The biggest 3D slice', {slice: 0}], ['Radius 0.8, volume 0.512', {slice: .6}], ['Just touching', {slice: 1}]]
    },
    features: {
        title: 'A recipe is a point. The error is a height.',
        intro: 'Imagine a smoothie machine with six knobs. Every recipe is one address with six numbers. Now say your map only shows sweetness and sourness. If you turn the crunch knob, the recipe changes, but your dot on the map doesn’t budge! That’s a hidden direction, not some mysterious extra dimension of the universe.',
        limit: 'These are made-up scores you can set independently, all on the same scale. Real features can depend on each other and use different units. The spider-web (radar) chart is just a way to show the six numbers, not a view of 6D space. And my error formula is a simple teaching example, not a claim about the tastiest smoothie.',
        prompt: 'Hide the crunch difference, then take a step that improves every knob by 25%. Can the total error drop while the map shows no movement?',
        principle: 'The knobs make the space. The error is just a score for each setting, not another knob.',
        reasoning: [
            ['Write the whole address', 'The reference recipe is (0, 0, 0, 0, 0, 0). The map only shows two of those numbers. The other four are still part of the recipe, even when the map ignores them.'],
            ['Find the missing distance', 'When the map shows two different features, full distance² = visible distance² + hidden distance². It’s the Pythagorean theorem with more pieces! The six colored bars show every squared piece. At (0, 0, 1, 0, 0, 0), the map distance is zero, but the full distance is one.'],
            ['Connect it to how AI learns', 'My toy error is L = ½(v₁² + ⋯ + v₆²). Moving each knob 25% toward zero gives v_next = 0.75v, so the error drops to 0.75² = 56.25% of what it was. Six knobs means a 6D space of settings. The error is one number for each setting. When we graph it, the error becomes a height, but that height is decided by the six knobs, so it’s not a seventh knob. The 3D bowl from earlier is the same idea with only two knobs.']
        ],
        quiz: ['The recipe dot on the 2D map stays still after an improvement step. Could the total error still have dropped?', ['No: a still dot means nothing changed', 'Yes: the hidden coordinates can move toward the target'], 1, 'The map leaves out four coordinates. A crunch-only step changes a hidden coordinate. That lowers the six-number error while the sweetness–sourness dot stays put. (Side note: the randomness in SGD comes from picking random rows of data. Hidden coordinates are a different idea.)'],
        demos: [['Hide a crunch-only difference', {values: [0,0,1,0,0,0], x: '0', y: '1'}], ['Show the hidden direction', {values: [0,0,1,0,0,0], x: '0', y: '2'}], ['Try all six knobs at once', {values: [.7,-.4,.8,.2,.5,-.6], x: '0', y: '1'}]]
    },
    escape: {
        title: 'A wall only works if you can’t go around it',
        intro: 'Draw a closed loop of ink on a sheet of paper. If you’re stuck on the paper, the only way out of the loop is to cross the ink. But if you’re allowed one more direction, you can lift off, float over, and land outside, without ever touching the ink.',
        limit: 'The loop is just ink on the flat sheet at z = 0. It isn’t a tall wall or a sealed box. The escape only works because the path is allowed to leave the sheet. Escaping a sealed 3D room through a fourth direction is an analogy here, not a travel plan!',
        prompt: 'Pause where the shadow crosses the ink. Now check the traveler’s actual height. Is that crossing a real collision?',
        principle: 'A barrier that blocks you in a limited space can disappear when you get more room to move.',
        reasoning: [
            ['State the rule', 'In Flatland, you have to stay at z = 0. Any unbroken path from inside a closed loop to outside it, on that sheet, has to hit the loop.'],
            ['Find the real crossing', 'While the traveler floats across, they’re at height z = 1.2. Their shadow can sit right on the ink’s x and y spot, but the ink is down at z = 0. Matching just two coordinates doesn’t mean they touched.'],
            ['Don’t stretch the analogy too far', 'If the barrier becomes a sealed 3D box, or the traveler isn’t allowed to leave the sheet, the trick stops working. An extra direction only helps if the barrier doesn’t block that direction too.']
        ],
        quiz: ['The traveler’s shadow crosses the ink. Did the traveler touch it?', ['Yes: every crossing on the map is a collision', 'No: check the third coordinate too'], 1, 'At that moment the traveler is at z = 1.2, while all the ink is at z = 0. Their shadows overlap, but the real points don’t. It’s the same lost-coordinate idea as the shadow experiment.'],
        demos: [['Start on the sheet', {progress: 0}], ['Pause above the ink', {progress: .3 + .4 * .85 / 1.8}], ['Land outside the loop', {progress: 1}]]
    }
};
