interface Hex {
    terrain: "normal"|"muddy"|"wet"|"hole"|"blocked"|"burning";
    x: number;
    y: number;
    movementCost: number;
    path: Path2D;
}
const hexes: Hex[] = [];
    
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

function draw() {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d")!;
}

function renderHex(x: number, y: number, size: number) {
    const hex = new Path2D();
    
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) {
            hex.moveTo(px, py);
        } else {
            hex.lineTo(px, py);
        }
    }

    const terrains: Hex["terrain"][] = ["normal","muddy","wet","hole","blocked","burning"];
    const genRate = [0.5, 0.1, 0.2, 0.05, 0.1, 0.05];
    const terrain = weightedRandom(terrains, genRate);

    //push this hex to the hexes list
    const newHex: Hex = {
        terrain: terrain,
        x: x,
        y: y,
        movementCost: calcMoveCost(terrain),
        path: hex,
    };

    hex.closePath();
    ctx.fillStyle = hexColor(terrain);
    ctx.fill(hex);
    ctx.strokeStyle = "#000";
    ctx.stroke(hex);

    hexes.push(newHex)
}

function calcMoveCost(terrainType) {
    switch (terrainType) {
        case "normal": return 1;
        case "muddy": return 3;
        case "wet": return 2;
        case "hole": return Infinity;
        case "blocked": return Infinity;
        case "burning": return 1;
    }
}

function hexColor(terrainType) {
        switch (terrainType) {
        case "normal": return "#FFFFF7";
        case "muddy": return "70543E";
        case "wet": return "#DEF4FC";
        case "hole": return "#000000";
        case "blocked": return "#808080";
        case "burning": return "#FF0000";
    }
}

function weightedRandom<T>(items: T[], weights: number[]): T {
    if (items.length !== weights.length) {
        throw new Error("Items and weights must be the same length");
    }

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    const normWeights = weights.map(w => w / totalWeight);

    const random = Math.random();

    let weightSum = 0;

    for (let i = 0; i < items.length ; i++) {
        weightSum += normWeights[i];
        if (random <= weightSum) {
            return items[i];
        }
    }
    return items[items.length - 1];
}

function genHex(rows: number, cols: number, size: number) {
    const vertSpacing = Math.sqrt(3) * size;
    const horizSpacing = 0.75 * (2 * size);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * horizSpacing;
            const y = row * vertSpacing + (col % 2) * (vertSpacing / 2);
            renderHex(x + 25, y + 25, size);
        }
    }
}

window.onload = () => {
    draw();
    genHex(6, 6, 20);

    canvas.addEventListener("click", (i) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = i.clientX - rect.left;
        const mouseY = i.clientY - rect.top;

        for (const hex of hexes) {
            if (ctx.isPointInPath(hex.path, mouseX, mouseY)) {
                console.log("clicked hex", hex)
                return;
            }
        }
    })
};
