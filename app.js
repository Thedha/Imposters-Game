let players = [];
let secretWord = "";
let imposterIndex = -1;
let currentTurn = 0;
let clues = [];
let votes = [];

const words = ["apple", "car", "dog", "pizza", "mountain"]; // sample word list

function addPlayer() {
  const name = document.getElementById("playerName").value.trim();
  if (name) {
    players.push({ name, role: "player" });
    document.getElementById("playersList").innerHTML += `<li>${name}</li>`;
    document.getElementById("playerName").value = "";
  }
}

function startGame() {
  if (players.length < 3) {
    alert("At least 3 players required.");
    return;
  }

  // choose secret word
  secretWord = words[Math.floor(Math.random() * words.length)];

  // assign imposter
  imposterIndex = Math.floor(Math.random() * players.length);
  players.forEach((p, i) => p.role = i === imposterIndex ? "imposter" : "player");

  // setup UI
  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";
  nextTurn();
}

function nextTurn() {
  if (currentTurn >= players.length) {
    startVoting();
    return;
  }

  const player = players[currentTurn];
  document.getElementById("turnInfo").innerText = `${player.name}'s turn.`;
  document.getElementById("clueInput").value = "";
}

function submitClue() {
  const clue = document.getElementById("clueInput").value.trim();
  if (!clue) return;

  clues.push({ player: players[currentTurn].name, clue });
  document.getElementById("cluesDisplay").innerHTML = clues.map(c => `<p><strong>${c.player}:</strong> ${c.clue}</p>`).join("");

  currentTurn++;
  nextTurn();
}

function startVoting() {
  document.getElementById("clueInput").style.display = "none";
  document.getElementById("voting").style.display = "block";

  const voteButtonsDiv = document.getElementById("voteButtons");
  voteButtonsDiv.innerHTML = players.map((p, i) => `<button onclick="vote(${i})">${p.name}</button>`).join(" ");
}

function vote(index) {
  votes.push(index);
  alert(`Vote cast for ${players[index].name}`);
}

function tallyVotes() {
  const counts = {};
  votes.forEach(v => counts[v] = (counts[v] || 0) + 1);
  const maxVotes = Math.max(...Object.values(counts));
  const votedPlayer = Object.keys(counts).find(k => counts[k] === maxVotes);

  const resultDiv = document.getElementById("result");
  if (parseInt(votedPlayer) == imposterIndex) {
    resultDiv.innerHTML = `Correct! The Imposter was ${players[imposterIndex].name}.`;
  } else {
    resultDiv.innerHTML = `Wrong! The Imposter was ${players[imposterIndex].name}. They win.`;
  }

  document.getElementById("voting").style.display = "none";
}
