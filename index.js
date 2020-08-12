const {World, Render, Runner, Bodies, Engine, Body, Events} = Matter;

const engine = Engine.create(); // gives a world object
engine.world.gravity.y = 0;

const {world} = engine

const height = window.innerHeight;
const width = window.innerWidth;
const cellHorizontal = 10;
const cellVertical = 10;

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
World.add(world, Bodies.rectangle(width / 2, 0, width, 2, {isStatic: true}));
World.add(world, Bodies.rectangle(width / 2, height, width, 2, {isStatic: true}));
World.add(world, Bodies.rectangle(0, height / 2, 2, height, {isStatic: true}));
World.add(world, Bodies.rectangle(width, height / 2, 2, height, {isStatic: true}));

// Making the maze
const grid = Array(cellVertical).fill(null).map(() => Array(cellHorizontal).fill(false));

// Vertical
const vertical = Array(cellVertical).fill(null).map(() => Array(cellHorizontal - 1).fill(false));

// Horizontal
const horizontal = Array(cellVertical - 1).fill(null).map(() => Array(cellHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellVertical);
const startColumn = Math.floor(Math.random() * cellHorizontal);
const unitLengthX = width / cellHorizontal;
const unitLengthY = height / cellVertical;

const arrayShuffle = (arr) => {
    counter = arr.length;

    while(counter > 0) {
        const index = Math.floor(Math.random() * counter);

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

        if(nextRow < 0 || nextRow >= cellVertical || nextColumn < 0 || nextColumn >= cellHorizontal) {
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
        else if(direction === "down") {
            horizontal[row][column] = true;
        }

        recurse(nextRow, nextColumn); 
    }
}

recurse(startRow, startColumn);

horizontal.forEach((row, rowIndex) => {
    row.forEach((open, colIndex) => {
        if(open) {
            return;
        } else {
            const wall = Bodies.rectangle(
                colIndex * unitLengthX + unitLengthX / 2,
                rowIndex * unitLengthY + unitLengthY,
                unitLengthX,
                5,
                {
                    label: "wall",
                    render: {
                        fillStyle: 'red'
                    },
                    isStatic: true
                }
            );
            World.add(world, wall);
        }
    })
})

vertical.forEach((row, rowIndex) => {
    row.forEach((open, colIndex) => {
        if(open) {
            return;
        }
        else {
            const wall = Bodies.rectangle(
                colIndex * unitLengthX + unitLengthX,
                rowIndex * unitLengthY + unitLengthY / 2,
                5,
                unitLengthY,
                {
                    label: "wall",
                    render: {
                        fillStyle: 'red'
                    },
                    isStatic: true
                }
            )
            World.add(world, wall);
        }
    })
})

// Goal
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * .7, 
    unitLengthY * .7,
    {
        isStatic: true,
        render: {
            fillStyle: 'green'
        },
        label: "goal"
    }
);
World.add(world, goal)

// Ball
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    Math.min(unitLengthX, unitLengthY) / 4, {
        label: "ball",
        render: {
            fillStyle: 'blue'
        }
    }
);

World.add(world, ball);

document.addEventListener("keydown", (event) => {
    const {x, y} = ball.velocity;
    
    if(event.keyCode === 87) {
        Body.setVelocity(ball, {x, y: y - 5});
    }
    else if (event.keyCode === 65) {
        Body.setVelocity(ball, {x: x - 5, y});
    }
    else if (event.keyCode === 83) {
        Body.setVelocity(ball, {x, y: y + 5});
    }
    else if (event.keyCode === 68) {
        Body.setVelocity(ball, {x: x + 5, y});
    }
})

// Ball collided with the Goal
Events.on(engine, "collisionStart", event => {
    event.pairs.forEach((collision) => {
        const labels = ['ball', 'goal'];
        if(labels.includes(collision.bodyA.label)
         && 
         labels.includes(collision.bodyB.label)) {
            world.gravity.y = 1;
            world.bodies.forEach((shape) => {
                if (shape.label === "wall") {
                    Body.setStatic(shape, false);
                }
            })
        }
    })
})