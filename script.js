/* PAGE NAVIGATION */

const buttons = document.querySelectorAll(".btn");

buttons.forEach(button => {

button.addEventListener("click", () => {

const nextId = button.getAttribute("data-next");
if(!nextId) return;

const current = button.closest(".page");
const next = document.getElementById(nextId);

current.classList.remove("active");

setTimeout(()=>{
next.classList.add("active");
},300);

});

});



/* START MUSIC */

const music = document.getElementById("bgMusic");
const startBtn = document.getElementById("startBtn");

if(startBtn){
startBtn.addEventListener("click",()=>{
music.play().catch(()=>{});
});
}



/* MINI GAME : FALLING HEARTS */

const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");

let score = 0;

function spawnHeart(){

if(!gameArea) return;

const heart = document.createElement("div");
heart.classList.add("falling-heart");
heart.innerHTML = "💗";

heart.style.left = Math.random()*90 + "%";
heart.style.animationDuration = (Math.random()*2+3)+"s";

gameArea.appendChild(heart);

heart.addEventListener("click",()=>{

score++;
scoreText.textContent = score;

heart.remove();

});

setTimeout(()=>{
heart.remove();
},5000);

}

setInterval(spawnHeart,900);



/* GIFT BOX */

const gift = document.getElementById("giftBox");
const giftMessage = document.getElementById("giftMessage");

if(gift){

gift.addEventListener("click",()=>{

gift.style.transform="scale(1.2) rotate(15deg)";

giftMessage.classList.remove("hidden");

});

}



/* CONFETTI */

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pieces = [];

for(let i=0;i<120;i++){

pieces.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*6+4,
d:Math.random()*100,
color:"hsl("+Math.random()*360+",80%,70%)",
tilt:Math.random()*10-10

});

}

function drawConfetti(){

ctx.clearRect(0,0,canvas.width,canvas.height);

pieces.forEach(p=>{

ctx.beginPath();
ctx.fillStyle=p.color;
ctx.fillRect(p.x,p.y,p.r,p.r);

});

updateConfetti();

}

function updateConfetti(){

pieces.forEach(p=>{

p.y += Math.cos(p.d)+2;
p.x += Math.sin(p.d);

if(p.y>canvas.height){

p.y=-10;
p.x=Math.random()*canvas.width;

}

});

}

setInterval(drawConfetti,30);
