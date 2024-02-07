let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["棒"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: '棒', power: 5 },
  { name: '短刀', power: 30 },
  { name: 'クローハンマー', power: 50 },
  { name: '剣', power: 100 }
];
const monsters = [
  {
    name: "スライム",
    level: 2,
    health: 15
  },
  {
    name: "牙獣",
    level: 8,
    health: 60
  },
  {
    name: "ドラゴン",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["店に行く", "洞窟に行く", "ドラゴンと戦う"],
    "button functions": [goStore, goCave, fightDragon],
    text: " あなたは町の広場にいます。という看板が見えます\"Store\"."
  },
  {
    name: "store",
    "button text": ["体力を10(10ゴールド)購入","武器(30ゴールド)を購入","町の広場に行く"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "店内に入る."
  },
  {
    name: "cave",
    "button text": ['スライムと戦う','牙獣と戦う','町の広場に行く'],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "洞窟に入ります。モンスターが何人か見えます。"
  },
  {
    name: "fight",
    "button text": ["攻撃","回避","逃げる"],
    "button functions": [attack, dodge, goTown],
    text: "あなたはモンスターと戦っています。"
  },
  {
    name: "kill monster",
    "button text": ["町の広場に行く","町の広場に行く","町の広場に行く"],
    "button functions": [goTown, goTown, easterEgg],
    text: '怪物は「アーグ!」と叫びながら死ぬ。経験値を獲得し、ゴールドを見つけます。'
  },
  {
    name: "lose",
    "button text": ["リプレイ?" ,"リプレイ? ","リプレイ?"],
    "button functions": [restart, restart, restart],
    text: "あなたは死ぬ。☠️"
  },
  { 
    name: "win", 
    "button text": ["リプレイ?" ,"リプレイ? ","リプレイ?"], 
    "button functions": [restart, restart, restart], 
    text: "ドラゴンを倒せ!あなたはゲームに勝ちます! 🎉" 
  },
  {
    name: "easter egg",
    "button text": ["2","8","町の広場に行く?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "あなたは秘密のゲームを見つけます。上の数字を選んでください。0から10までの10個の数字がランダムに選ばれます。選択した数字が乱数の1つと一致すると、あなたの勝ちです!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "体力を買うのに十分なゴールドがありません.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = " これで、 " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " インベントリには次のものがあります。 " + inventory;
    } else {
      text.innerText = "武器を買うのに十分なゴールドがありません.";
    }
  } else {
    text.innerText = "あなたはすでに最強の武器を持っています!!";
    button2.innerText = "武器を15ゴールドで売る";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "売りました" + currentWeapon + ".";
    text.innerText += 　"インベントリには、 " + inventory;
  } else {
    text.innerText = "唯一の武器を売るな!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}