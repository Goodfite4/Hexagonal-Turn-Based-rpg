//tsc --project ./tsconfig.json to run the code

const camera = {
    x: 0,
    y: 0,
    zoom: 1,
}

const hexImages: Record<Hex["terrain"], HTMLImageElement> = {
    normal: new Image(),
    muddy: new Image(),
    wet: new Image(),
    hole: new Image(),
    blocked: new Image(),
    burning: new Image(),
};

hexImages.normal.src = "Images/Terrains/normal.png"
hexImages.muddy.src = "Images/Terrains/muddy.png"
hexImages.wet.src = "Images/Terrains/wet.png"
hexImages.hole.src = "Images/Terrains/hole.png"
hexImages.blocked.src = "Images/Terrains/blocked.png"
hexImages.burning.src = "Images/Terrains/burning.png"

interface Character {
    x: number;
    y: number;
    xCor: number;
    yCor: number;
    hp: number;
    mana: number;
    movementSpeed: number;
    str: number;
    dex: number;
    int: number;
    path: Path2D;
    currentPath?: Hex[];
}

const tester: Character = {
    x: 125,
    y: 232.84,
    xCor:2,
    yCor:3,
    hp: 100,
    mana: 100,
    movementSpeed: 10,
    str: 20,
    dex: 20,
    int: 20,
    path: null,
};

interface Hex {
    terrain: "normal"|"muddy"|"wet"|"hole"|"blocked"|"burning";
    x: number;
    y: number;
    movementCost: number;
    path: Path2D;
    xCor: number;
    yCor: number;
    img: HTMLImageElement;
}



const hexes: Hex[] = [];
const hexMap = new Map<string, Hex>();

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

// calc hexToPixel ratio
function hexToPixel(xCor: number, yCor: number, size = 40): { x: number, y: number } {
    const vertSpacing = Math.sqrt(3) * size;
    const horizSpacing = 0.75 * (2 * size);
    const x = xCor * horizSpacing + 25;
    const y = yCor * vertSpacing + (xCor % 2) * (vertSpacing / 2) + 25;
    return { x, y };
}


function initCanvas() {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d")!;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; }

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(camera.zoom, 0, 0, camera.zoom, -camera.x, -camera.y);

    for (const hex of hexes) {
        ctx.drawImage(hex.img, hex.x - hex.img.width / 2, hex.y - hex.img.height / 2);
    }

    renderChar(tester); 

    ctx.restore();

}

function renderChar(character:Character) {
    const path = new Path2D();
    path.arc(character.x, character.y, 10, 0, 2* Math.PI)
    ctx.fillStyle = "#ff0";
    ctx.fill(path);
    ctx.strokeStyle= "#000";
    ctx.stroke(path);
    character.path = path;
}

const structureList: string[] = ["Oasis", "the wall", "muddy", "ravine"];

const reservedHexes = new Map<string, Hex["terrain"]>();

let key:string;

function renderHex(x: number, y: number, size: number, terrain: string, xCor: number, yCor: number) {
    const key = `${xCor},${yCor}`;
    let terrainType: Hex["terrain"];

    if (reservedHexes.has(key)) {
        terrainType = reservedHexes.get(key)!;

    } else if (structureList.includes(terrain)) {
        terrainType = terrain as Hex["terrain"];
        
        switch (terrain) {
            case "Oasis":
                if (xCor % 2 === 0) {
                    reservedHexes.set(`${xCor-1},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor-1},${yCor+1}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor+1}`, "blocked");
                    reservedHexes.set(`${xCor+1},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor-1}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor}`, "wet");   
                } else {
                    reservedHexes.set(`${xCor-1},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor+1}`, "blocked");
                    reservedHexes.set(`${xCor+1},${yCor+1}`, "blocked");
                    reservedHexes.set(`${xCor+1},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor}`, "wet");
                    reservedHexes.set(`${xCor+1},${yCor-1}`, "blocked"); 
                }
                break;

            case "The Wall":
                if (xCor % 2 === 0) {
                    reservedHexes.set(`${xCor},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor+1},${yCor+1}`, "blocked");
                    reservedHexes.set(`${xCor+2},${yCor+1}`, "blocked");
                    reservedHexes.set(`${xCor+3},${yCor+2}`, "blocked");
                    reservedHexes.set(`${xCor+4},${yCor+2}`, "blocked");
                    reservedHexes.set(`${xCor+5},${yCor+3}`, "blocked"); 
                } else {
                    reservedHexes.set(`${xCor},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor+1},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor+2},${yCor+1}`, "blocked");
                    reservedHexes.set(`${xCor+3},${yCor+1}`, "blocked");
                    reservedHexes.set(`${xCor+4},${yCor +2}`, "blocked");
                    reservedHexes.set(`${xCor+5},${yCor +2}`, "blocked"); 
                }
                break;

            case "muddy":
                if (xCor % 2 === 0) {
                    reservedHexes.set(`${xCor},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor-1},${yCor-1}`, "muddy");
                    reservedHexes.set(`${xCor},${yCor-1}`, "muddy");
                    reservedHexes.set(`${xCor-1},${yCor}`, "muddy");
                    reservedHexes.set(`${xCor-1},${yCor+1}`, "muddy");
                    reservedHexes.set(`${xCor},${yCor+1}`, "muddy"); 
                    reservedHexes.set(`${xCor+1},${yCor}`, "muddy"); 
                } else {
                    reservedHexes.set(`${xCor},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor-1}`, "muddy");
                    reservedHexes.set(`${xCor+1},${yCor-1}`, "muddy");
                    reservedHexes.set(`${xCor-1},${yCor}`, "muddy");
                    reservedHexes.set(`${xCor},${yCor+1}`, "muddy");
                    reservedHexes.set(`${xCor+1},${yCor+1}`, "muddy"); 
                    reservedHexes.set(`${xCor+1},${yCor}`, "muddy"); 
                }
                break;

            case "ravine":
                if (xCor % 2 === 0) {
                    reservedHexes.set(`${xCor},${yCor}`, "hole");
                    reservedHexes.set(`${xCor},${yCor+1}`, "hole");
                    reservedHexes.set(`${xCor+2},${yCor+1}`, "hole");
                    reservedHexes.set(`${xCor+3},${yCor+2}`, "hole");
                    reservedHexes.set(`${xCor+4},${yCor+2}`, "hole");
                    reservedHexes.set(`${xCor+5},${yCor+3}`, "hole"); 
                } else {
                    reservedHexes.set(`${xCor},${yCor}`, "hole");
                    reservedHexes.set(`${xCor+1},${yCor}`, "hole");
                    reservedHexes.set(`${xCor+2},${yCor+1}`, "hole");
                    reservedHexes.set(`${xCor+3},${yCor+1}`, "hole");
                    reservedHexes.set(`${xCor+4},${yCor +2}`, "hole");
                    reservedHexes.set(`${xCor+5},${yCor +2}`, "hole"); 
                }
                break;
                
            default:
                break;
        }
        
    } else {
        terrainType = terrain as Hex["terrain"];
    }

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

    hex.closePath();

    const newHex: Hex = {
        terrain: terrainType,
        x: x,
        y: y,
        movementCost: calcMoveCost(terrainType),
        path: hex,
        xCor: xCor,
        yCor: yCor,
        img: hexType(terrainType),
    };
    hexMap.set(`${xCor},${yCor}`, newHex);
    hexes.push(newHex);
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

function hexType(terrainType) {
    if (!(terrainType in hexImages)) {
        console.warn(`Unknown terrainType "${terrainType}", defaulting to normal.`);
        return hexImages["normal"];
    }
    switch (terrainType) {
        case "normal": return hexImages.normal;
        case "muddy": return hexImages.muddy;
        case "wet": return hexImages.wet;
        case "hole": return hexImages.hole;
        case "blocked": return hexImages.blocked;
        case "burning": return hexImages.burning;
    }
}

// function weightedRandom<T>(items: T[], weights: number[]): T {

//     const totalWeight = weights.reduce((sum, w) => sum + w, 0);

//     const normWeights = weights.map(w => w / totalWeight);

//     const random = Math.random();

//     let weightSum = 0;

//     for (let i = 0; i < items.length ; i++) {
//         weightSum += normWeights[i];
//         if (random <= weightSum) {
//             return items[i];
//         }
//     }
//     return items[items.length - 1];
// }

function genHex(rows: number, cols: number, size: number) {
    const vertSpacing = Math.sqrt(3) * size;
    const horizSpacing = 0.75 * (2 * size);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const xCor = col;
            const yCor = row;
            const { x, y } = hexToPixel(col, row, size);

            renderHex(x, y, size, makeTerrain(row, col), col, row);
        }
    }
}

function makeTerrain(row, col) {
    if (row >= 18 && col <= 2 || col >= 18 && row <= 2) return "normal";
    if (row == 0 || col == 0 || col == 19 || row == 19) return "blocked";
    if (reservedHexes.has(key)) {
        return reservedHexes.get(key);
    }
    if (Math.floor(Math.random() * 20) + 1 == 1){
         return structureList[Math.floor(Math.random() * structureList.length)];
    } else return "normal";   
} 

//pathfinding
function moveChar(character: Character) {
    if (!character.currentPath || character.currentPath.length === 0) return;

    const nextHex = character.currentPath.shift();
    if (!nextHex) return;

    character.xCor = nextHex.xCor;
    character.yCor = nextHex.yCor;
    character.x = nextHex.x;
    character.y = nextHex.y;

    const path = new Path2D();
    path.arc(character.x, character.y, 10, 0, 2 * Math.PI);
    character.path = path;

    render();

    if (character.currentPath.length > 0) {
        setTimeout(() => moveChar(character), 150);
    }
}

function setPathTo(character: Character, targetHex: Hex) {
    const startHex = hexes.find(h => h.xCor === character.xCor && h.yCor === character.yCor);
    if (!startHex) return;

    const path = findPath(startHex, targetHex);
    if (path.length > 0) {
        character.currentPath = path.slice(1);
        moveChar(character);
    }
}

function findPath(start: Hex, goal: Hex): Hex[] {
    interface Node {
        hex: Hex;
        g: number; 
        h: number;
        f: number;
        parent?: Node;
    }

    const openSet: Node[] = [];
    const closedSet = new Set<string>();

    function hexKey(h: Hex): string {
        return `${h.xCor},${h.yCor}`;
    }

    function heuristic(a: Hex, b: Hex): number {
        
        function toCube(x: number, y: number): [number, number, number] {
            const xCube = x;
            const zCube = y - (x - (x & 1)) / 2;
            const yCube = -xCube - zCube;
        return [xCube, yCube, zCube];
    }

    const [ax, ay, az] = toCube(a.xCor, a.yCor);
    const [bx, by, bz] = toCube(b.xCor, b.yCor);
    return Math.max(Math.abs(ax - bx), Math.abs(ay - by), Math.abs(az - bz));
}

    function getNeighbors(hex: Hex): Hex[] {
        const even = hex.xCor % 2 === 0;
        const deltas = even
            ? [[+1,  0], [0, -1], [-1, -1], [-1, 0], [-1, +1], [0, +1]]
            : [[+1,  0], [0, -1], [-1, 0], [-1, +1], [0, +1], [+1, +1]];

        return deltas
            .map(([dx, dy]) =>
                hexMap.get(`${hex.xCor + dx},${hex.yCor + dy}`)
            )
            .filter((h): h is Hex => !!h && h.movementCost !== Infinity);
    }

    const startNode: Node = {
        hex: start,
        g: 0,
        h: heuristic(start, goal),
        f: 0,
    };
    startNode.f = startNode.g + startNode.h;

    openSet.push(startNode);

    while (openSet.length > 0) {
        // Get node with lowest f
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift()!;

        if (current.hex === goal) {
            // Reconstruct path
            const path: Hex[] = [];
            let node: Node | undefined = current;
            while (node) {
                path.unshift(node.hex);
                node = node.parent;
            }
            return path;
        }

        closedSet.add(hexKey(current.hex));

        for (const neighbor of getNeighbors(current.hex)) {
            if (closedSet.has(hexKey(neighbor))) continue;

            const tentativeG = current.g + neighbor.movementCost;

            const existing = openSet.find(n => n.hex === neighbor);
            if (existing) {
                if (tentativeG < existing.g) {
                    existing.g = tentativeG;
                    existing.f = tentativeG + existing.h;
                    existing.parent = current;
                }
            } else {
                const h = heuristic(neighbor, goal);
                openSet.push({
                    hex: neighbor,
                    g: tentativeG,
                    h: h,
                    f: tentativeG + h,
                    parent: current,
                });
            }
        }
    }

    // No path found
    return [];
}

window.onload = async () => {
    initCanvas();

    genHex(10, 15, 40);

    render();
    
    canvas.addEventListener("click", (i) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (i.clientX - rect.left) / camera.zoom + camera.x;
        const mouseY = (i.clientY - rect.top) / camera.zoom + camera.y;

        for (const hex of hexes) {
            if (ctx.isPointInPath(hex.path, mouseX, mouseY)) {
                setPathTo(tester, hex);
                console.log("clicked hex", hex.xCor, hex.yCor, hex, hex);
                return;
            }
        }
    });
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    canvas.addEventListener("mousedown", (m) => {
        isDragging = true;
        lastMouseX = m.clientX;
        lastMouseY = m.clientY;
    });

    canvas.addEventListener("mousemove", (m) => {
        if (isDragging) {
            const dx = (m.clientX - lastMouseX);
            const dy = (m.clientY - lastMouseY);
            camera.x -= dx;
            camera.y -= dy;
            lastMouseX = m.clientX;
            lastMouseY = m.clientY;
            // if (camera.x < -200) camera.x = -200;
            // if (camera.x > 500) camera.x = 500;
            // if (camera.y < -200) camera.y = -200;
            // if (camera.y > 500) camera.y = 500;
            render();
        }});
    canvas.addEventListener("mouseup", () => isDragging = false);
    canvas.addEventListener("mouseleave", () => isDragging = false);

    canvas.addEventListener("wheel", (m) => {
        m.preventDefault();
        const scaleAmount = 1.1;
        const zoomDirection = m.deltaY < 0 ? 1: -1;
        const zoomFactor = zoomDirection > 0 ? scaleAmount : 1 / scaleAmount;

        const rect = canvas.getBoundingClientRect();
        const mouseX = (m.clientX - rect.left) / camera.zoom + camera.x;
        const mouseY = (m.clientY - rect.top) / camera.zoom + camera.y;

        camera.zoom *= zoomFactor;

        // if (camera.zoom > 5) camera.zoom = 5;
        // if (camera.zoom < 0.8) camera.zoom = 1;

        camera.x = mouseX - (m.clientX - rect.left) / camera.zoom;
        camera.y = mouseY - (m.clientY - rect.top) / camera.zoom;

        render();
    }, {passive: false});
};


