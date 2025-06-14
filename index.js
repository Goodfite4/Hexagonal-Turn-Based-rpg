// interface Animal {
//   name: string;
//   hp: number;
//   dmg: number;
//   passive: string;
//   gold: number;
// }
var hexMap = [];
var hexDirections = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
function genHex(q, r) {
    var terrains = ["normal", "muddy", "wet", "hole", "blocked", "burning"];
    var genRate = [0.5, 0.1, 0.2, 0.05, 0.1, 0.05];
    var terrain = weightedRandom(terrains, genRate);
    return {
        terrain: terrain,
        q: q,
        r: r,
        movementCost: terrain === "muddy" ? 2 : 1,
        element: null,
    };
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
function genMap(radius) {
    for (var q = -radius; q <= radius; q++) {
        for (var r = -radius; r <= radius; r++) {
            if (Math.abs(q + r) <= radius) {
                hexMap.push(genHex(q, r));
            }
        }
    }
}
function renderHex(hex) {
    var _a;
    var hexElement = document.createElement("div");
    hexElement.className = "hex ".concat(hex.terrain);
    var terrainIcons = {
        burning: "Fire",
        muddy: "Mud",
        hole: "Hole",
        wet: "Water"
    };
    hexElement.innerHTML = terrainIcons[hex.terrain] || "";
    hexElement.style.setProperty("--q", hex.q.toString());
    hexElement.style.setProperty("--r", hex.r.toString());
    hexElement.dataset.coords = "".concat(hex.q, ", ").concat(hex.r);
    (_a = document.getElementById("hex-grid")) === null || _a === void 0 ? void 0 : _a.appendChild(hexElement);
    hex.element = hexElement;
}
function init() {
    genMap(1);
    hexMap.forEach(function (hex) { return renderHex(hex); });
}
document.addEventListener('DOMContentLoaded', init);
// const aniSubmit1 = document.getElementById('AnimalSubmit1') as HTMLInputElement;
// const aniBox1 = document.getElementById('AnimalBox1') as HTMLInputElement;
// const aniSubmit2 = document.getElementById('AnimalSubmit2') as HTMLInputElement;
// const aniBox2 = document.getElementById('AnimalBox2') as HTMLInputElement;
// let currentTurn: number = 0;
// let battleLog: string[] = [];
// function beginBattle() {
//     const battleField = document.getElementById("battleField")!;
//     battleField.innerHTML = ""; 
//     team1.forEach(animal => animal.hp = getBaseHp(animal.name));
//     team2.forEach(animal => animal.hp = getBaseHp(animal.name));
//     while (team1.some(a => a.hp > 0) && team2.some(a => a.hp > 0)) {
//         currentTurn++;
//         logBattleMessage("--- Turn ${currentTurn} ---");
//         processTeamTurn(team1, team2, "Team 1");
//         if (!team2.some(a => a.hp > 0)) break; 
//         processTeamTurn(team2, team1, "Team 2");
//     }
//     const winner = team1.some(a => a.hp > 0) ? "Team 1" : "Team 2";
//     logBattleMessage(`BATTLE OVER! ${winner} wins!`);
// }
// function getBaseHp(animalName: string): number {
//     switch (animalName.toLowerCase()) {
//         case "cat": return 3;
//         case "dog": return 7;
//         case "rat": return 1;
//         default: return 0;
//     }
// }
// function processTeamTurn(attackingTeam: Animal[], defendingTeam: Animal[], teamName: string) {
//     const aliveAttackers = attackingTeam.filter(a => a.hp > 0);
//     const aliveDefenders = defendingTeam.filter(a => a.hp > 0);
//     if (aliveAttackers.length === 0) return;
//     for (const attacker of aliveAttackers) {
//         if (aliveDefenders.length === 0) break;
//         const defender = selectDefender(attacker, aliveDefenders);
//         attack(attacker, defender, teamName);
//         if (defender.hp <= 0) {
//             const index = aliveDefenders.indexOf(defender);
//             aliveDefenders.splice(index, 1);
//             logBattleMessage(`${defender.name} has been defeated!`);
//         }
//     }
// }
// function selectDefender(attacker: Animal, defenders: Animal[]): Animal {
//     if (attacker.name === "dog") {
//         const catDefender = defenders.find(d => d.name === "cat");
//         if (catDefender) return catDefender;
//     }
//     if (attacker.name === "rat") {
//         return defenders.reduce((lowest, current) => 
//             current.hp < lowest.hp ? current : lowest);
//     }
//     return defenders[Math.floor(Math.random() * defenders.length)];
// }
// function attack(attacker: Animal, defender: Animal, teamName: string) {
//     let damage = attacker.dmg;
//     if (defender.name === "cat" && attacker.name === "dog") {
//         damage = Math.floor(damage / 2);
//     }
//     defender.hp -= damage;
//     logBattleMessage(
//         `${teamName}'s ${attacker.name} attacks ${defender.name} for ${damage} damage! ` +
//         `(${defender.hp > 0 ? defender.hp + ' HP remaining' : 'DEFEATED'})`
//     );
// }
// function logBattleMessage(message: string) {
//     battleLog.push(message);
//     const battleField = document.getElementById("battleField")!;
//     const messageElement = document.createElement('div');
//     messageElement.textContent = message;
//     battleField.appendChild(messageElement);
// }
// function addMob(xTeam:Array<Animal>, animalName, teamAnimalList:string) {
//     const xTeamMems = document.getElementById(teamAnimalList)
//     if (xTeam.length < 3 && pushMob(animalName, xTeam)) {
//         const newXTeamMember = document.createElement('div');
//         const mob = xTeam[xTeam.length - 1]
//         newXTeamMember.textContent = mob.name + " | " + mob.hp + "hp | " + mob.dmg + "dmg | " + mob.passive; 
//         xTeamMems.appendChild(newXTeamMember); 
//     }
// }
// let team1: Array<Animal> = [];
// let team2: Array<Animal> = [];
// function pushMob(mob:string, xTeam:Array<Animal>) {
//     mob = mob.toLowerCase()
//     if (mob == "dog") {
//         xTeam.push(dog);
//         return true;
//     } else if (mob == "cat") {
//         xTeam.push(cat);
//         return true;
//     } else if (mob == "rat") {
//         xTeam.push(rat);
//         return true;
//     } else return false; }
// aniSubmit1.addEventListener('click', function (event) {
//     // Prevent form submission if this is inside a form
//     event.preventDefault();
//     var animalName = aniBox1.value;
//     addMob(team1, animalName, "Team1AnimalList");
// });
// aniSubmit2.addEventListener('click', function (event) {
//     // Prevent form submission if this is inside a form
//     event.preventDefault();
//     var animalName = aniBox2.value;
//     addMob(team2, animalName, "Team2AnimalList");
// });
// const startBattle = document.getElementById("Begin")
// startBattle.addEventListener('click', function(event){
//     event.preventDefault();
//     if (team1.length == 3 && team2.length == 3){
//         beginBattle();
//     }
//     else {
//         console.log("Theres Something Wrong")
//     }
// })
