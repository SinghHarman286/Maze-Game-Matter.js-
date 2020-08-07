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

const arrayShuffle = (arr) => {
    counter = arr.length;

    while(counter > 0) {
        index = Math.floor(Math.random() * counter);

        counter --;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

const recurse = (row, column) => {

    if(grid[row][column]) {
        return;
    }

    grid[row][column] = true // marked as reached

    const neighbours = arrayShuffle([
        [row - 1, column, "up"],
        [row, column + 1, "right"],
        [row + 1, column, "down"],
        [row, column - 1, "left"]
    ])

    for (let neighbour of neighbours) {
        const [nextRow, nextColumn, direction] = neighbour;

        if(nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
            continue;
        }
        if(grid[nextRow][nextColumn]) {
            continue;
        }

        if(direction === "left") {
            vertical[row][column - 1] = true;
        }
        else if(direction === "right") {
            vertical[row][column] = true;
        }
        else if(direction === "up") {
            horizontal[row - 1][column] = true;
        }
        else if(direction === "left") {
            horizontal[row][column] = true;
        }

        recurse(nextRow, nextColumn); 
    }
}

recurse(startRow, startColumn);

console.log(vertical);
console.log(horizontal);