var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const camera = {
    x: 0,
    y: 0,
    zoom: 1,
};
const worldWidth = 3000;
const worldHeight = 2000;
const hexImages = {
    normal: new Image(),
    muddy: new Image(),
    wet: new Image(),
    hole: new Image(),
    blocked: new Image(),
    burning: new Image(),
};
hexImages.normal.src = "Images/Terrains/normal.png";
hexImages.muddy.src = "Images/Terrains/muddy.png";
hexImages.wet.src = "Images/Terrains/wet.png";
hexImages.hole.src = "Images/Terrains/hole.png";
hexImages.blocked.src = "Images/Terrains/blocked.png";
hexImages.burning.src = "Images/Terrains/burning.png";
const warriorName = "Warrior";
const warriorBaseDmg = 20;
const warriorRange = 1;
const rangeName = "Range";
const rangeBaseDmg = 15;
const rangeRange = 5;
const mageName = "Mage";
const mageBaseDmg = 5;
const mageRange = 1;
let warriorAbilityOne;
let warriorAbilityTwo;
let warriorAbilityThree;
let warriorAbilityFour;
let rangeAbilityOne;
let rangeAbilityTwo;
let rangeAbilityThree;
let rangeAbilityFour;
let mageAbilityOne;
let mageAbilityTwo;
let mageAbilityThree;
let mageAbilityFour;
warriorAbilityOne = {
    name: "Dazing Strike",
    dmg: warriorBaseDmg,
    manaCost: 2,
    coolDown: 1,
    APCost: 1,
    AOE: 0,
    description: "Strike At the head of your opponent to Daze them",
    range: warriorRange,
    targetType: "character",
    abilityFunction: (attacker, target) => {
        performAttack(attacker, target, warriorBaseDmg, dazed);
    },
    duration: 0,
};
warriorAbilityTwo = {
    name: "Blade's Edge",
    dmg: warriorBaseDmg * 1.5,
    manaCost: 2,
    APCost: 1,
    coolDown: 2,
    AOE: 0,
    description: "Strike at an opponent with one extra range. Opponents at maximum distance take 50% extra damage",
    range: warriorRange + 1,
    targetType: "character",
    abilityFunction: (attacker, target) => {
        hexDistance(attacker, target) == 2 ?
            performAttack(attacker, target, warriorAbilityTwo.dmg) :
            performAttack(attacker, target, warriorBaseDmg);
    },
    duration: 0,
};
warriorAbilityThree = {
    name: "Jump",
    dmg: 0,
    manaCost: 0,
    APCost: 1,
    coolDown: 1,
    AOE: 0,
    description: "Don't skip leg day!",
    range: 4,
    targetType: "hex",
    abilityFunction: (attacker, targetHex) => {
        if (!targetHex)
            return;
        attacker.xCor = targetHex.xCor;
        attacker.yCor = targetHex.yCor;
        attacker.x = targetHex.x;
        attacker.y = targetHex.y;
        const path = new Path2D();
        path.arc(attacker.x, attacker.y, 10, 0, 2 * Math.PI);
        attacker.path = path;
        render();
    },
    duration: 0,
};
warriorAbilityFour = {
    name: "Heavy Whirlwind",
    dmg: warriorBaseDmg * 2,
    manaCost: 4,
    APCost: 2,
    coolDown: 4,
    AOE: 1,
    description: "Swing for heavy damage all around",
    range: warriorRange,
    targetType: "none",
    abilityFunction: (attacker) => {
        const enemyTeam = (getTeamMembers(attacker, team1, team2) === team1) ? team2 : team1;
        const targets = getCharactersInRadius(attacker, 1, enemyTeam);
        targets.forEach(enemy => {
            performAttack(attacker, enemy, warriorBaseDmg * 1.5);
        });
    },
    duration: 0,
};
rangeAbilityOne = {
    name: "Snaring Shot",
    dmg: rangeBaseDmg,
    manaCost: 2,
    coolDown: 2,
    APCost: 1,
    AOE: 0,
    description: "Strike At the head of your opponent to Daze them",
    range: rangeRange,
    targetType: "character",
    abilityFunction: (attacker, target) => {
        performAttack(attacker, target, rangeBaseDmg, snared);
    },
    duration: 1,
};
rangeAbilityTwo = {
    name: "Ricochet",
    dmg: rangeBaseDmg,
    manaCost: 2,
    coolDown: 2,
    APCost: 1,
    AOE: 0,
    description: "Shoot at a target. If there are other enemies around the target, the arrow bounces towards them too.",
    range: rangeRange,
    targetType: "character",
    abilityFunction: (attacker, target) => {
        const enemyTeam = (getTeamMembers(attacker, team1, team2) === team1) ? team2 : team1;
        const inrad = getCharactersInRadius(target, 1, enemyTeam);
        inrad.forEach(enemy => {
            performAttack(attacker, enemy, rangeBaseDmg);
        });
    },
    duration: 1,
};
rangeAbilityThree = {
    name: "Quick Evasion",
    dmg: 0,
    manaCost: 2,
    coolDown: 1,
    APCost: 1,
    AOE: 0,
    description: "Strike At the head of your opponent to Daze them",
    range: 4,
    targetType: "hex",
    abilityFunction: (attacker, targetHex) => {
        if (!targetHex)
            return;
        attacker.xCor = targetHex.xCor;
        attacker.yCor = targetHex.yCor;
        attacker.x = targetHex.x;
        attacker.y = targetHex.y;
        const path = new Path2D();
        path.arc(attacker.x, attacker.y, 10, 0, 2 * Math.PI);
        attacker.path = path;
        render();
    },
    duration: 1,
};
rangeAbilityFour = {
    name: "Big Iron",
    dmg: rangeBaseDmg,
    manaCost: 2,
    coolDown: 4,
    APCost: 0,
    AOE: 0,
    description: "You have a big iron on your hip. Use it to deal extra damage. This attack costs no AP",
    range: rangeRange,
    targetType: "character",
    abilityFunction: (attacker, target) => {
        performAttack(attacker, target, rangeBaseDmg);
    },
    duration: 1,
};
mageAbilityOne = {
    name: "FireBall",
    dmg: 20,
    manaCost: 2,
    coolDown: 1,
    APCost: 0,
    AOE: 1,
    description: "You have a big iron on your hip. Use it to deal extra damage. This attack costs no AP",
    range: 6,
    targetType: "hex",
    abilityFunction: (attacker, targetHex) => {
        if (!targetHex)
            return;
        const hitChars = getCharactersInRadius(targetHex, 1, [...team1, ...team2]);
        for (const chars of hitChars) {
            performAttack(attacker, chars, 20, burning);
        }
    },
    duration: 1,
};
mageAbilityTwo = {
    name: "Teleport",
    dmg: 0,
    manaCost: 2,
    coolDown: 4,
    APCost: 1,
    AOE: 0,
    description: "You have a big iron on your hip. Use it to deal extra damage. This attack costs no AP",
    range: rangeRange,
    targetType: "character",
    abilityFunction: (attacker, target) => {
        performAttack(attacker, target, rangeBaseDmg);
    },
    duration: 1,
};
mageAbilityThree = {
    name: "Enrage / Enfeeble",
    dmg: 0,
    manaCost: 2,
    coolDown: 3,
    APCost: 1,
    AOE: 0,
    description: "If used on an ally character, add 50% damage. If used on an opponent, remove 50% damage from their turn.",
    range: rangeRange,
    targetType: "character",
    abilityFunction: (attacker, target) => {
        const attackerTeam = getTeamMembers(attacker, team1, team2);
        const targetTeam = getTeamMembers(target, team1, team2);
        if (attackerTeam === targetTeam) {
            performAttack(attacker, target, 0, Enraged);
        }
        else {
            performAttack(attacker, target, 0, Enfeebled);
        }
    },
    duration: 1,
};
mageAbilityFour = {
    name: "Arcane Catacalysm",
    dmg: 5,
    manaCost: 5,
    coolDown: 6,
    APCost: 2,
    AOE: 5,
    description: "deal 5 damage to enemies per Mana Point you have",
    range: 5,
    targetType: "none",
    abilityFunction: (attacker) => {
        const enemyTeam = (getTeamMembers(attacker, team1, team2) === team1) ? team2 : team1;
        const targets = getCharactersInRadius(attacker, 5, enemyTeam);
        targets.forEach(enemy => {
            performAttack(attacker, enemy, 25);
        });
    },
    duration: 1,
};
const Warrior = {
    name: warriorName,
    range: warriorRange,
    baseDmg: warriorBaseDmg,
    portrait: "Images/Classes/Warrior/Warrior.png",
    abilities: [warriorAbilityOne, warriorAbilityTwo, warriorAbilityThree, warriorAbilityFour],
};
const Ranger = {
    name: rangeName,
    range: rangeRange,
    baseDmg: rangeBaseDmg,
    portrait: "Images/Classes/Range/Range.png",
    abilities: [rangeAbilityOne, rangeAbilityTwo, rangeAbilityThree, rangeAbilityFour],
};
const Mager = {
    name: mageName,
    range: mageRange,
    baseDmg: mageBaseDmg,
    portrait: "Images/Classes/Mage/Mage.png",
    abilities: [mageAbilityOne, mageAbilityTwo, mageAbilityThree, mageAbilityFour],
};
const dazed = {
    name: "dazed",
    effectDescription: "Character has 30% less damage",
    effect: 0.7,
    duration: 2,
    dmg: 0,
};
const burning = {
    name: "burning",
    effectDescription: "take 5 damage every time your turn starts",
    effect: 0,
    duration: 2,
    dmg: 5,
};
const snared = {
    name: "snared",
    effectDescription: "Snare a target for its next turn",
    effect: 0,
    duration: 1,
    dmg: 0,
};
const Enraged = {
    name: "Enraged",
    effectDescription: "add 50% damage this turn.",
    effect: 0.5,
    duration: 1,
    dmg: 0,
};
const Enfeebled = {
    name: "Enfeebled",
    effectDescription: "lose 50% damage this turn.",
    effect: 0.5,
    duration: 1,
    dmg: 0,
};
const tester = {
    x: null,
    y: null,
    xCor: null,
    yCor: null,
    hp: 100,
    mana: 100,
    movementSpeed: 10,
    str: 20,
    dex: 20,
    int: 20,
    path: null,
    actionPoints: 1,
    bonusActionPoints: 1,
    class: Warrior,
    activeStatuses: [],
};
function createCharacter(overrides = {}) {
    return Object.assign({ x: null, y: null, xCor: null, yCor: null, hp: 100, mana: 100, movementSpeed: 5, str: 20, dex: 20, int: 20, path: null, actionPoints: 1, bonusActionPoints: 1, class: null, activeStatuses: [] }, overrides);
}
function updatePortraits(list) {
    const container = document.getElementById("turn-order-ui");
    container.innerHTML = "";
    list.forEach((char, i) => {
        const img = document.createElement("img");
        img.src = char.class.portrait;
        img.alt = char.class.name;
        img.style.width = "45px";
        img.style.margin = "0 5px";
        container.appendChild(img);
    });
}
let activeAbility = null;
function updateBanner(list) {
    const char = list[0];
    const char_portrait = document.getElementById("char-portrait");
    char_portrait.src = char.class.portrait;
    char_portrait.onclick = () => {
        addChatLine(`${char.class.name} has ${char.hp} hp`);
    };
    for (let i = 1; i <= 4; i++) {
        const abilityEl = document.getElementById(`ability-${i}`);
        const ability = char.class.abilities[i - 1];
        abilityEl.src = `Images/Classes/${char.class.name}/${char.class.name + i}.png`;
        abilityEl.onclick = () => {
            activeAbility = ability;
            addChatLine(`Selected ${ability.name}. Left-click to use. Right-click to cancel.`);
            render();
        };
    }
    const msIcon = document.getElementById("movement-speed-icon");
    msIcon.onclick = () => {
        addChatLine(`${char.class.name} has ${char.movementSpeed} movement speed.`);
    };
}
function addChatLine(message) {
    const chatInfo = document.getElementById("chat-info");
    if (!chatInfo)
        return;
    const line = document.createElement("div");
    line.textContent = message;
    chatInfo.appendChild(line);
    chatInfo.scrollTop = chatInfo.scrollHeight;
}
const team1 = [
    createCharacter({ xCor: 13, yCor: 1, x: hexToPixel(13, 1).x, y: hexToPixel(13, 1).y, class: Warrior }),
    createCharacter({ xCor: 14, yCor: 2, x: hexToPixel(14, 2).x, y: hexToPixel(14, 2).y, class: Mager }),
    createCharacter({ xCor: 14, yCor: 1, x: hexToPixel(14, 1).x, y: hexToPixel(14, 1).y, class: Ranger })
];
const team2 = [
    createCharacter({ xCor: 2, yCor: 9, x: hexToPixel(2, 9).x, y: hexToPixel(2, 9).y, class: Warrior }),
    createCharacter({ xCor: 1, yCor: 9, x: hexToPixel(1, 9).x, y: hexToPixel(1, 9).y, class: Mager }),
    createCharacter({ xCor: 1, yCor: 8, x: hexToPixel(1, 8).x, y: hexToPixel(1, 8).y, class: Ranger })
];
let turn_order = [...team1, ...team2].sort((a, b) => b.dex - a.dex);
let isCharacterMoving = false;
function filterTurnOrder(turn_order) {
    // console.log(turn_order);
    turn_order = turn_order.filter((Character) => Character.hp > 0);
    return turn_order;
}
function checkTurnOrder(character) {
    character.activeStatuses.includes(snared) ? character.movementSpeed = 0 : character.movementSpeed = 5;
    isCharacterMoving = false;
    const put_turn_last = turn_order.shift();
    if (put_turn_last !== undefined)
        turn_order.push(put_turn_last);
    for (const status of character.activeStatuses) {
        character.hp -= status.dmg;
        status.duration -= 1;
    }
    character.activeStatuses = character.activeStatuses.filter((status) => status.duration >= 0);
    render();
    // console.log("turn_order:", turn_order);
}
//Chatting Logic
function sendMessage() {
    const input = document.getElementById("chat-box");
    const chatInfo = document.getElementById("chat-info");
    const text = input.innerText.trim();
    if (text === "")
        return;
    const entry = document.createElement("div");
    entry.textContent = `> ${text}`;
    chatInfo.appendChild(entry);
    chatInfo.scrollTop = chatInfo.scrollHeight;
    input.innerText = "";
}
function logToChat(text) {
    const chatInfo = document.getElementById("chat-info");
    const entry = document.createElement("div");
    entry.textContent = text;
    chatInfo.appendChild(entry);
    chatInfo.scrollTop = chatInfo.scrollHeight;
}
const hexes = [];
const hexMap = new Map();
let canvas;
let ctx;
// calc hexToPixel ratio
function hexToPixel(xCor, yCor, size = 40) {
    const vertSpacing = Math.sqrt(3) * size;
    const horizSpacing = 0.75 * (2 * size);
    const x = xCor * horizSpacing + (window.innerWidth / 3.8);
    const y = yCor * vertSpacing + (xCor % 2) * (vertSpacing / 2) + 95;
    return { x, y };
}
function initCanvas() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    // canvas.width = 1200;
    // canvas.height = 700; 
}
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(camera.zoom, 0, 0, camera.zoom, -camera.x * camera.zoom, -camera.y * camera.zoom);
    ctx.fillStyle = "rgb(171 215 235)";
    ctx.fillRect(0, 0, worldWidth, worldHeight);
    updatePortraits(turn_order);
    updateBanner(turn_order);
    const current_char = turn_order[0];
    for (const hex of hexes) {
        const rangeToUse = activeAbility ? activeAbility.range : current_char.class.range;
        const inRange = hexDistance(current_char, hex) <= rangeToUse;
        const screenX = hex.x - hex.img.width / 2;
        const screenY = hex.y - hex.img.height / 2;
        ctx.drawImage(hex.img, screenX, screenY);
        if (inRange && hex.terrain != "blocked") {
            ctx.save();
            ctx.fillStyle = activeAbility
                ? "rgba(0, 255, 0, 0.3)"
                : "rgba(255, 165, 0, 0.3)";
            ctx.fill(hex.path);
            ctx.restore;
        }
    }
    for (const char of turn_order) {
        renderChar(char);
    }
    ctx.restore();
}
function renderChar(character) {
    const path = new Path2D();
    path.arc(character.x, character.y, 10, 0, 2 * Math.PI);
    if (character.class == Mager)
        ctx.fillStyle = "#0000FF";
    if (character.class == Ranger)
        ctx.fillStyle = "#00ff00";
    if (character.class == Warrior)
        ctx.fillStyle = "#FF0000";
    ctx.fill(path);
    ctx.strokeStyle = "#000000";
    ctx.stroke(path);
    character.path = path;
}
// const structureList: string[] = ["Oasis", "the wall", "muddy", "ravine"];
const structureList = ["normal"];
const reservedHexes = new Map();
let key;
function renderHex(x, y, size, terrain, xCor, yCor) {
    const key = `${xCor},${yCor}`;
    let terrainType;
    if (reservedHexes.has(key)) {
        terrainType = reservedHexes.get(key);
    }
    else if (structureList.includes(terrain)) {
        terrainType = terrain;
        switch (terrain) {
            case "Oasis":
                if (xCor % 2 === 0) {
                    reservedHexes.set(`${xCor - 1},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor - 1},${yCor + 1}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor + 1}`, "blocked");
                    reservedHexes.set(`${xCor + 1},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor - 1}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor}`, "wet");
                }
                else {
                    reservedHexes.set(`${xCor - 1},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor + 1}`, "blocked");
                    reservedHexes.set(`${xCor + 1},${yCor + 1}`, "blocked");
                    reservedHexes.set(`${xCor + 1},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor}`, "wet");
                    reservedHexes.set(`${xCor + 1},${yCor - 1}`, "blocked");
                }
                break;
            case "The Wall":
                if (xCor % 2 === 0) {
                    reservedHexes.set(`${xCor},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor + 1},${yCor + 1}`, "blocked");
                    reservedHexes.set(`${xCor + 2},${yCor + 1}`, "blocked");
                    reservedHexes.set(`${xCor + 3},${yCor + 2}`, "blocked");
                    reservedHexes.set(`${xCor + 4},${yCor + 2}`, "blocked");
                    reservedHexes.set(`${xCor + 5},${yCor + 3}`, "blocked");
                }
                else {
                    reservedHexes.set(`${xCor},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor + 1},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor + 2},${yCor + 1}`, "blocked");
                    reservedHexes.set(`${xCor + 3},${yCor + 1}`, "blocked");
                    reservedHexes.set(`${xCor + 4},${yCor + 2}`, "blocked");
                    reservedHexes.set(`${xCor + 5},${yCor + 2}`, "blocked");
                }
                break;
            case "muddy":
                if (xCor % 2 === 0) {
                    reservedHexes.set(`${xCor},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor - 1},${yCor - 1}`, "muddy");
                    reservedHexes.set(`${xCor},${yCor - 1}`, "muddy");
                    reservedHexes.set(`${xCor - 1},${yCor}`, "muddy");
                    reservedHexes.set(`${xCor - 1},${yCor + 1}`, "muddy");
                    reservedHexes.set(`${xCor},${yCor + 1}`, "muddy");
                    reservedHexes.set(`${xCor + 1},${yCor}`, "muddy");
                }
                else {
                    reservedHexes.set(`${xCor},${yCor}`, "blocked");
                    reservedHexes.set(`${xCor},${yCor - 1}`, "muddy");
                    reservedHexes.set(`${xCor + 1},${yCor - 1}`, "muddy");
                    reservedHexes.set(`${xCor - 1},${yCor}`, "muddy");
                    reservedHexes.set(`${xCor},${yCor + 1}`, "muddy");
                    reservedHexes.set(`${xCor + 1},${yCor + 1}`, "muddy");
                    reservedHexes.set(`${xCor + 1},${yCor}`, "muddy");
                }
                break;
            case "ravine":
                if (xCor % 2 === 0) {
                    reservedHexes.set(`${xCor},${yCor}`, "hole");
                    reservedHexes.set(`${xCor},${yCor + 1}`, "hole");
                    reservedHexes.set(`${xCor + 2},${yCor + 1}`, "hole");
                    reservedHexes.set(`${xCor + 3},${yCor + 2}`, "hole");
                    reservedHexes.set(`${xCor + 4},${yCor + 2}`, "hole");
                    reservedHexes.set(`${xCor + 5},${yCor + 3}`, "hole");
                }
                else {
                    reservedHexes.set(`${xCor},${yCor}`, "hole");
                    reservedHexes.set(`${xCor + 1},${yCor}`, "hole");
                    reservedHexes.set(`${xCor + 2},${yCor + 1}`, "hole");
                    reservedHexes.set(`${xCor + 3},${yCor + 1}`, "hole");
                    reservedHexes.set(`${xCor + 4},${yCor + 2}`, "hole");
                    reservedHexes.set(`${xCor + 5},${yCor + 2}`, "hole");
                }
                break;
            default:
                break;
        }
    }
    else {
        terrainType = terrain;
    }
    const hex = new Path2D();
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) {
            hex.moveTo(px, py);
        }
        else {
            hex.lineTo(px, py);
        }
    }
    hex.closePath();
    const newHex = {
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
function genHex(rows, cols, size) {
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
    if (row >= 18 && col <= 2 || col >= 18 && row <= 2)
        return "normal";
    if (row == 0 || col == 0 || col == 19 || row == 19)
        return "blocked";
    if (reservedHexes.has(key)) {
        return reservedHexes.get(key);
    }
    if (Math.floor(Math.random() * 20) + 1 == 1) {
        return structureList[Math.floor(Math.random() * structureList.length)];
    }
    else
        return "normal";
}
function getTeamMembers(character, team1, team2) {
    if (team1.includes(character)) {
        return team1;
    }
    if (team2.includes(character)) {
        return team2;
    }
    throw new Error("Please choose a valid character.");
}
//pathfinding
function getCurrentHex(character) {
    return hexMap.get(`${character.xCor},${character.yCor}`);
}
function moveChar(character) {
    if (character.movementSpeed <= 0) {
        checkTurnOrder(character);
        return;
    }
    const currentHexagon = getCurrentHex(character);
    character.movementSpeed -= currentHexagon.movementCost;
    // console.log(character.movementSpeed);
    isCharacterMoving = true;
    if (!character.currentPath || character.currentPath.length === 0) {
        isCharacterMoving = false;
        return;
    }
    const nextHex = character.currentPath.shift();
    if (!nextHex) {
        isCharacterMoving = false;
        return;
    }
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
function setPathTo(character, targetHex) {
    const startHex = hexes.find(h => h.xCor === character.xCor && h.yCor === character.yCor);
    if (!startHex)
        return;
    const path = findPath(startHex, targetHex);
    if (path.length > 0) {
        character.currentPath = path.slice(1);
        moveChar(character);
    }
}
function isOccupied(hex, characters) {
    return characters.some(c => c.xCor === hex.xCor && c.yCor === hex.yCor);
}
const filtered = hexes.filter((h) => !!h &&
    h.movementCost !== Infinity &&
    !isOccupied(h, turn_order));
//get neighbors of a hex helper
function getNeighbors(hex) {
    const even = hex.xCor % 2 === 0;
    const deltas = even
        ? [[+1, -1], [0, -1], [-1, -1], [-1, 0], [0, +1], [+1, 0]]
        : [[+1, 0], [0, -1], [-1, 0], [-1, +1], [0, +1], [+1, +1]];
    return deltas
        .map(([dx, dy]) => hexMap.get(`${hex.xCor + dx},${hex.yCor + dy}`))
        .filter((h) => !!h &&
        h.movementCost !== Infinity &&
        !isOccupied(h, [...team1, ...team2]));
}
function findPath(start, goal) {
    const openSet = [];
    const closedSet = new Set();
    function hexKey(h) {
        return `${h.xCor},${h.yCor}`;
    }
    function heuristic(a, b) {
        function toCube(x, y) {
            const xCube = x;
            const zCube = y - (x - (x & 1)) / 2;
            const yCube = -xCube - zCube;
            return [xCube, yCube, zCube];
        }
        const [ax, ay, az] = toCube(a.xCor, a.yCor);
        const [bx, by, bz] = toCube(b.xCor, b.yCor);
        return Math.max(Math.abs(ax - bx), Math.abs(ay - by), Math.abs(az - bz));
    }
    const startNode = {
        hex: start,
        g: 0,
        h: heuristic(start, goal),
        f: 0,
    };
    startNode.f = startNode.g + startNode.h;
    openSet.push(startNode);
    while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();
        if (current.hex === goal) {
            const path = [];
            let node = current;
            while (node) {
                path.unshift(node.hex);
                node = node.parent;
            }
            return path;
        }
        closedSet.add(hexKey(current.hex));
        for (const neighbor of getNeighbors(current.hex)) {
            if (closedSet.has(hexKey(neighbor)))
                continue;
            const tentativeG = current.g + neighbor.movementCost;
            const existing = openSet.find(n => n.hex === neighbor);
            if (existing) {
                if (tentativeG < existing.g) {
                    existing.g = tentativeG;
                    existing.f = tentativeG + existing.h;
                    existing.parent = current;
                }
            }
            else {
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
//this code is so messy man just start coding the actionPoints logic here
function checkActionPoints(character) {
    if (character.actionPoints <= 0 && character.bonusActionPoints <= 0) {
        checkTurnOrder(character);
        return;
    }
    return (character.actionPoints, character.bonusActionPoints);
}
function getNeighboringCharacters(hex, characters) {
    const neighbors = getNeighbors(hex);
    return characters.filter(char => neighbors.some(n => n.xCor === char.xCor && n.yCor === char.yCor));
}
// OI I WANT YOU TO ADD AN ATTACKING FUNCTION ON YOUR NEXT THING. 
// It checks if the character has enough action / bonus action to do anything,
// and the way you attack is you take the range of the weapon (e.g meele would be 1 hex away)
// and then if the character you want to attack is in that range, you can attack them.
// Create a new interface called weapon that has the following properties:
// name, range, damage
//calculate distance between hexes to see if they fit range or not
function offsetToCube(hex) {
    const x = hex.xCor;
    const z = hex.yCor - (hex.xCor - (hex.xCor & 1)) / 2;
    const y = -x - z;
    return { x, y, z };
}
function hexDistance(a, b) {
    const ac = offsetToCube(a);
    const bc = offsetToCube(b);
    return Math.max(Math.abs(ac.x - bc.x), Math.abs(ac.y - bc.y), Math.abs(ac.z - bc.z));
}
function getCharactersInRadius(center, radius, targets) {
    return targets.filter(char => {
        const dist = hexDistance(center, char);
        return dist <= radius;
    });
}
function getCharacterOnHex(hex, characters) {
    return turn_order.find(c => c.xCor === hex.xCor && c.yCor === hex.yCor);
}
function performAttack(attacker, target, damage, status) {
    attacker.activeStatuses.includes(dazed) ? target.hp -= damage * 0.7 : target.hp -= damage;
    target.activeStatuses.push(status);
    logToChat(target.hp);
}
window.onload = () => __awaiter(this, void 0, void 0, function* () {
    initCanvas();
    genHex(10, 15, 40);
    render();
    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / camera.zoom + camera.x;
        const mouseY = (e.clientY - rect.top) / camera.zoom + camera.y;
        const attacker = turn_order[0];
        for (const hex of hexes) {
            if (!ctx.isPointInPath(hex.path, mouseX, mouseY))
                continue;
            const targetCharacter = getCharacterOnHex(hex, [...team1, ...team2]);
            if (activeAbility) {
                if (activeAbility.targetType === "character") {
                    if (targetCharacter && targetCharacter !== attacker) {
                        const inRange = hexDistance(attacker, targetCharacter) <= activeAbility.range;
                        if (inRange) {
                            activeAbility.abilityFunction(attacker, targetCharacter);
                            activeAbility = null;
                        }
                        else {
                            logToChat("Target is too far away.");
                        }
                    }
                    else {
                        logToChat("You must click a valid character.");
                    }
                }
                else if (activeAbility.targetType === "hex") {
                    const inRange = hexDistance(attacker, hex) <= activeAbility.range;
                    if (inRange) {
                        activeAbility.abilityFunction(attacker, hex);
                        activeAbility = null;
                    }
                    else {
                        logToChat("Target hex is too far away.");
                    }
                }
                else if (activeAbility.targetType === "none") {
                    activeAbility.abilityFunction(attacker);
                    activeAbility = null;
                }
                return;
            }
            if (targetCharacter && targetCharacter !== attacker) {
                const inRange = hexDistance(attacker, targetCharacter) <= attacker.class.range;
                if (inRange) {
                    performAttack(attacker, targetCharacter, attacker.class.baseDmg);
                }
                else {
                    logToChat("Target is too far away.");
                }
            }
            else {
                setPathTo(attacker, hex);
            }
        }
        turn_order = filterTurnOrder(turn_order);
        render();
    });
    canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (activeAbility) {
            activeAbility = null;
            render();
            addChatLine(`Cancelled ability selection.`);
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
        }
    });
    canvas.addEventListener("mouseup", () => isDragging = false);
    canvas.addEventListener("mouseleave", () => isDragging = false);
    canvas.addEventListener("wheel", (m) => {
        m.preventDefault();
        const scaleAmount = 1.1;
        const zoomDirection = m.deltaY < 0 ? 1 : -1;
        const zoomFactor = zoomDirection > 0 ? scaleAmount : 1 / scaleAmount;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (m.clientX - rect.left) / camera.zoom + camera.x;
        const mouseY = (m.clientY - rect.top) / camera.zoom + camera.y;
        camera.zoom *= zoomFactor;
        if (camera.zoom > 5)
            camera.zoom = 5;
        if (camera.zoom < 0.5)
            camera.zoom = 0.5;
        camera.x = mouseX - (m.clientX - rect.left) / camera.zoom;
        camera.y = mouseY - (m.clientY - rect.top) / camera.zoom;
        render();
    }, { passive: false });
});
