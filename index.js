var hexes = [];
var canvas;
var ctx;
function draw() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
}
function renderHex(x, y, size) {
    var hex = new Path2D();
    for (var i = 0; i < 6; i++) {
        var angle = i * Math.PI / 3;
        var px = x + size * Math.cos(angle);
        var py = y + size * Math.sin(angle);
        if (i === 0) {
            hex.moveTo(px, py);
        }
        else {
            hex.lineTo(px, py);
        }
    }
    var terrains = ["normal", "muddy", "wet", "hole", "blocked", "burning"];
    var genRate = [0.5, 0.1, 0.2, 0.05, 0.1, 0.05];
    var terrain = weightedRandom(terrains, genRate);
    //push this hex to the hexes list
    var newHex = {
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
function weightedRandom(items, weights) {
    if (items.length !== weights.length) {
        throw new Error("Items and weights must be the same length");
    }
    var totalWeight = weights.reduce(function (sum, w) { return sum + w; }, 0);
    var normWeights = weights.map(function (w) { return w / totalWeight; });
    var random = Math.random();
    var weightSum = 0;
    for (var i = 0; i < items.length; i++) {
        weightSum += normWeights[i];
        if (random <= weightSum) {
            return items[i];
        }
    }
    return items[items.length - 1];
}
function genHex(rows, cols, size) {
    var vertSpacing = Math.sqrt(3) * size;
    var horizSpacing = 0.75 * (2 * size);
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var x = col * horizSpacing;
            var y = row * vertSpacing + (col % 2) * (vertSpacing / 2);
            renderHex(x + 25, y + 25, size);
        }
    }
}
window.onload = function () {
    draw();
    genHex(6, 6, 20);
    canvas.addEventListener("click", function (i) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = i.clientX - rect.left;
        var mouseY = i.clientY - rect.top;
        for (var _i = 0, hexes_1 = hexes; _i < hexes_1.length; _i++) {
            var hex = hexes_1[_i];
            if (ctx.isPointInPath(hex.path, mouseX, mouseY)) {
                console.log("clicked hex", hex);
                return;
            }
        }
    });
};
