var canvas_personnage = document.querySelector("#canvas_personnage");
var ctx_personnage = canvas_personnage.getContext("2d");
var canvas_notes = document.querySelector("#canvas_notes");
var ctx_notes = canvas_notes.getContext("2d");
var canvas_obstacles = document.querySelector("#canvas_obstacles");
var ctx_obstacles = canvas_obstacles.getContext("2d");
var vX = 0;
var vY = 0;
var xNotes = 0;
var xObstacles = 0;
let position_note = 0;
let position_obstacle = 0;

var gravite = 0.01;

canvas_personnage.height = window.innerHeight;
canvas_personnage.width = window.innerWidth;
canvas_notes.height = window.innerHeight;
canvas_notes.width = window.innerWidth;
canvas_obstacles.height = window.innerHeight;
canvas_obstacles.width = window.innerWidth;
let W = window.innerWidth;
let H = window.innerHeight;

var yNotes = -50;
var yObstacles = -50;
var xBille = W / 2;

function afficher() {
    ctx_personnage.fillStyle = "pink";
    ctx_personnage.fillRect(0, 0, W, H);

    ctx_personnage.fillStyle = "purple";
    ctx_personnage.fillRect((W * 0.25) - 20, 0, 20, H)
    ctx_personnage.fillRect((W * 0.5) - 10, 0, 20, H)
    ctx_personnage.fillRect(W * 0.75, 0, 20, H)

    ctx_obstacles.clearRect(0, 0, W, H)
    ctx_obstacles.fillStyle = "yellow";
    ctx_obstacles.fillRect(xObstacles, yObstacles, 20, 20)

    ctx_personnage.fillStyle = "black";
    ctx_personnage.fillRect(xBille, H - 50, 20, 20)

    ctx_notes.clearRect(0, 0, W, H)
    ctx_notes.fillStyle = "blue";
    ctx_notes.fillRect(xNotes, yNotes, 20, 20)
}

function calcul() {
    accelerationY = gravite;
    vY += accelerationY;
    yNotes += vY;
    yObstacles += vY;

    if (yNotes >= H + 50) {
        vY = 0
        yNotes = 0 - 50
    }
    if (yObstacles >= H + 50) {
        vY = 0
        yObstacles = 0 - 50
    }



    if (yNotes >= H - 60 && yNotes <= H - 40 && xBille == xNotes) {
        document.querySelector(".ecran_rouge").classList.add("vert");
    }
    if (yNotes <= H - 60 || yNotes >= H - 40 || xBille != xNotes) {
        document.querySelector(".ecran_rouge").classList.remove("vert");
    }

    if (yObstacles >= H - 60 && yObstacles <= H - 40 && xBille == xObstacles) {
        document.querySelector(".ecran_rouge").classList.add("rouge");
    }

    if (yObstacles <= H - 60 || yObstacles >= H - 40 || xBille != xObstacles) {
        document.querySelector(".ecran_rouge").classList.remove("rouge");
    }



    if (yNotes <= 0 || yNotes >= H) {
        position_note = Math.floor(Math.random() * 3);
    }
    if (yObstacles <= 0 || yObstacles >= H) {
        position_obstacle = Math.floor(Math.random() * 3);
    }


    if (position_note == 0) {
        xNotes = (W * 0.25) - 20;
    }
    if (position_note == 1) {
        xNotes = (W * 0.5) - 10;
    }
    if (position_note == 2) {
        xNotes = W * 0.75;
    }

    if (position_obstacle == 0) {
        xObstacles = (W * 0.25) - 20;
    }
    if (position_obstacle == 1) {
        xObstacles = (W * 0.5) - 10;
    }
    if (position_obstacle == 2) {
        xObstacles = W * 0.75;
    }
}

function boucle() {
    calcul();
    afficher();
    window.requestAnimationFrame(boucle);
}

window.addEventListener("deviceorientation", Inclinaison_Du_Telephone, true);

function Inclinaison_Du_Telephone(event) {
    const gamma = event.gamma;
    if (gamma >= 25) {
        xBille = W * 0.75;
    }
    if (gamma <= -25) {
        xBille = (W * 0.25) - 20;
    }
    if (gamma <= 25 && gamma >= -25) {
        xBille = (W * 0.5) - 10;
    }
}

boucle();