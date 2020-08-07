const {World, Render, Runner, Bodies, Engine} = Matter;

const engine = Engine.create(); // gives a world object

const {world} = engine

const height = 600;
const width = 600;
const cells = 3;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height
    },
});

Render.run(render);
Runner.run(Runner.create(), engine)


// Borders
World.add(world, Bodies.rectangle(width / 2, 0, width, 40, {isStatic: true}));
World.add(world, Bodies.rectangle(width / 2, height, width, 40, {isStatic: true}));
World.add(world, Bodies.rectangle(0, height / 2, 40, height, {isStatic: true}));
World.add(world, Bodies.rectangle(width, height / 2, 40, height, {isStatic: true}));

// Making the maze
const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));

// Vertical
const vertical = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));

// Horizontal
const horizontal = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

console.log(startRow, startColumn)